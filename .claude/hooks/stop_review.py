#!/usr/bin/env python3
"""
Stop hook: Claude가 응답을 마치기 전에 실행.
- 커밋되지 않은 변경 파일이 있으면 Claude에게 알려서 사용자에게 저장 여부를 확인하게 함
"""

import json
import subprocess
import sys


def main():
    try:
        data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        sys.exit(0)

    # stop hook이 이미 활성화된 경우 무한 루프 방지
    if data.get("stop_hook_active"):
        sys.exit(0)

    try:
        result = subprocess.run(
            ["git", "status", "--short"],
            capture_output=True, text=True, timeout=5
        )
    except Exception:
        sys.exit(0)

    if result.returncode != 0 or not result.stdout.strip():
        sys.exit(0)

    changed = result.stdout.strip()
    print(
        f"📋 커밋되지 않은 변경 파일이 있습니다:\n{changed}\n\n"
        "→ 사용자에게 변경된 내용을 짧게 요약하고, 저장(커밋)할지 여부를 확인해 주세요."
    )

    sys.exit(0)


if __name__ == "__main__":
    main()
