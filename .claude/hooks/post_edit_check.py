#!/usr/bin/env python3
"""
PostToolUse hook: runs after file edits.
- *.json              → JSON 유효성
- skills-lock.json    → 필수 필드 / 해시 형식 / 매칭 디렉토리 존재 검증
- *.md                → frontmatter / 내부 앵커 / 테이블 정렬 검증
모든 경고는 stdout 으로 출력하고 exit 0 (블로킹하지 않음).
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path


SHA256_HEX = re.compile(r"^[0-9a-f]{64}$")
TABLE_SEP = re.compile(r"^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$")
HEADING = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
ANCHOR_LINK = re.compile(r"\[[^\]]+\]\(#([^)]+)\)")


def project_dir() -> Path:
    return Path(os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd()))


def check_skills_lock(file_path: str) -> list[str]:
    issues: list[str] = []
    try:
        data = json.loads(Path(file_path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return issues  # JSON 오류는 위에서 이미 보고됨

    skills = data.get("skills", {})
    if not isinstance(skills, dict):
        return ["'skills' 가 객체여야 합니다."]

    root = project_dir()
    for name, entry in skills.items():
        if not isinstance(entry, dict):
            issues.append(f"'{name}': 객체가 아님")
            continue
        for field in ("source", "sourceType", "computedHash"):
            if not entry.get(field):
                issues.append(f"'{name}': 필수 필드 '{field}' 누락 또는 비어있음")
        h = entry.get("computedHash", "")
        if h and not SHA256_HEX.match(h):
            issues.append(f"'{name}': computedHash 가 SHA256 hex(64자) 형식이 아님")
        candidates = [root / ".agents/skills" / name, root / ".claude/skills" / name]
        if not any(p.is_dir() for p in candidates):
            issues.append(f"'{name}': 매칭 디렉토리 없음 (.agents/skills/{name} 또는 .claude/skills/{name})")
    return issues


def parse_frontmatter(text: str) -> tuple[dict | None, str]:
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---", 4)
    if end == -1:
        return None, text
    block = text[4:end]
    body = text[end + 4 :].lstrip("\n")
    fm: dict[str, str] = {}
    for line in block.splitlines():
        if ":" in line and not line.startswith(" "):
            k, _, v = line.partition(":")
            fm[k.strip()] = v.strip()
    return fm, body


def slugify(heading: str) -> str:
    s = heading.strip().lower()
    s = re.sub(r"[^\w\s\-]", "", s, flags=re.UNICODE)
    s = re.sub(r"\s+", "-", s)
    return s


def check_markdown(file_path: str) -> list[str]:
    issues: list[str] = []
    try:
        text = Path(file_path).read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return issues

    needs_frontmatter = any(
        seg in file_path for seg in ("/.claude/skills/", "/.claude/agents/", "/.agents/skills/")
    )
    fm, body = parse_frontmatter(text)
    if needs_frontmatter:
        if fm is None:
            issues.append("frontmatter(--- 블록) 누락. skills/agents 는 name·description 필수.")
        else:
            for f in ("name", "description"):
                if not fm.get(f):
                    issues.append(f"frontmatter '{f}' 누락 또는 비어있음")

    # 내부 앵커
    headings_text = body if fm else text
    in_code = False
    valid_anchors: set[str] = set()
    for line in headings_text.splitlines():
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        m = HEADING.match(line)
        if m:
            valid_anchors.add(slugify(m.group(2)))

    for m in ANCHOR_LINK.finditer(headings_text):
        anchor = m.group(1)
        if anchor not in valid_anchors:
            issues.append(f"내부 앵커 '#{anchor}' 가 어떤 헤딩에도 매치되지 않음")

    # 테이블 행별 | 개수
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if "|" in line and i + 1 < len(lines) and TABLE_SEP.match(lines[i + 1]):
            base_count = line.count("|")
            j = i
            bad: list[str] = []
            while j < len(lines) and "|" in lines[j]:
                if j != i + 1 and lines[j].count("|") != base_count:
                    bad.append(f"L{j + 1}({lines[j].count('|')})")
                j += 1
            if bad:
                issues.append(
                    f"테이블 (L{i + 1} 시작) '|' 개수 불일치: 헤더={base_count}, 어긋난 행={', '.join(bad)}"
                )
            i = j
        else:
            i += 1

    return issues


def main() -> None:
    try:
        data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        sys.exit(0)

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path or not os.path.exists(file_path):
        sys.exit(0)

    name = os.path.basename(file_path)

    if file_path.endswith(".json"):
        try:
            with open(file_path, encoding="utf-8") as f:
                json.load(f)
        except json.JSONDecodeError as e:
            print(f"❌ JSON 형식 오류: {name}\n{e}\n→ 파일을 다시 확인하고 수정해 주세요.")
            sys.exit(0)
        if name == "skills-lock.json":
            issues = check_skills_lock(file_path)
            if issues:
                print("⚠ skills-lock.json 무결성 경고:\n" + "\n".join(f"- {x}" for x in issues))
    elif file_path.endswith(".md"):
        issues = check_markdown(file_path)
        if issues:
            print(f"⚠ {name} 검증 경고:\n" + "\n".join(f"- {x}" for x in issues))

    sys.exit(0)


if __name__ == "__main__":
    main()
