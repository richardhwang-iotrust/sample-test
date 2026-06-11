#!/bin/bash
# Claude Code PreToolUse hook — Bash 명령 실행 전 금지 패턴 차단

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except:
    print('')
" 2>/dev/null || echo "")

# main 브랜치 직접 push 차단
if echo "$COMMAND" | grep -qE "git push.*(origin main|origin/main)"; then
  echo "❌ main 브랜치에 직접 push는 금지입니다. PR을 통해 반영해주세요." >&2
  exit 2
fi

# --no-verify 플래그 차단
if echo "$COMMAND" | grep -q "\-\-no-verify"; then
  echo "❌ --no-verify 플래그는 사용할 수 없습니다." >&2
  exit 2
fi

# Co-Authored-By 커밋 메시지 차단
if echo "$COMMAND" | grep -q "Co-Authored-By"; then
  echo "❌ 커밋 메시지에 Co-Authored-By는 추가하지 않습니다." >&2
  exit 2
fi

# 비밀값 리터럴이 명령어에 포함되면 차단 (토큰·API 키)
# 대상: GitHub (ghp_/github_pat_/gho_/ghu_/ghs_/ghr_), Anthropic (sk-ant-), Stripe (sk_live_/sk_test_), AWS (AKIA...)
if echo "$COMMAND" | grep -qE "(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gho_[A-Za-z0-9]{20,}|ghu_[A-Za-z0-9]{20,}|ghs_[A-Za-z0-9]{20,}|ghr_[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|sk_live_[A-Za-z0-9]{20,}|sk_test_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})"; then
  echo "❌ 명령어에 비밀값(토큰/API 키)으로 보이는 문자열이 포함돼 있어 차단합니다." >&2
  echo "   → 값을 직접 쓰지 말고 환경변수(\$TOKEN 등)나 .env 파일을 통해 간접 참조하세요." >&2
  echo "   → 만약 이 값이 대화창에 이미 노출됐다면 해당 서비스에서 즉시 revoke하세요." >&2
  exit 2
fi

# .env 파일을 평문으로 출력하려는 시도 차단 (.env.example/.env.sample/.env.template은 허용)
if echo "$COMMAND" | grep -qE "(^|[^A-Za-z0-9_/])(cat|less|more|head|tail|bat|xxd|od)[[:space:]]+[^|;&]*\.env([[:space:]]|$|\"|'|\.local|\.production|\.development|\.prod|\.dev|\.staging|\.test)"; then
  if ! echo "$COMMAND" | grep -qE "\.env\.(example|sample|template)"; then
    echo "❌ .env 파일을 평문으로 출력하려는 명령으로 보여 차단합니다." >&2
    echo "   → 비밀값이 로그·대화 기록에 그대로 남을 수 있습니다." >&2
    echo "   → 값이 궁금하면 사용자가 직접 터미널에서 열어 확인하도록 안내하세요." >&2
    exit 2
  fi
fi

# 커밋 직전 staged 파일·diff에서 비밀값 스캔
if echo "$COMMAND" | grep -qE "(^|[^A-Za-z0-9_])git[[:space:]]+commit([[:space:]]|$)"; then
  # 1) 실제 .env 파일이 staged에 있는지 (.env.example 등 템플릿은 허용)
  STAGED_FILES=$(git diff --cached --name-only 2>/dev/null)
  if [ -n "$STAGED_FILES" ]; then
    REAL_ENV=$(echo "$STAGED_FILES" | grep -E "(^|/)\.env(\.local|\.production|\.development|\.prod|\.dev|\.staging|\.test)?$" || true)
    if [ -n "$REAL_ENV" ]; then
      echo "❌ 실제 .env 파일이 커밋에 포함돼 있어 차단합니다:" >&2
      echo "$REAL_ENV" | sed 's/^/   - /' >&2
      echo "   → .gitignore에 .env 를 추가하고 'git rm --cached <파일>' 로 스테이징에서 빼세요." >&2
      echo "   → 파일이 이미 과거 커밋에 들어갔다면 해당 비밀값을 발급처에서 revoke하세요." >&2
      exit 2
    fi
    # 2) staged diff에 토큰 패턴이 새로 추가됐는지
    if git diff --cached --unified=0 2>/dev/null | grep -E "^\+[^+]" | grep -qE "(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gho_[A-Za-z0-9]{20,}|ghu_[A-Za-z0-9]{20,}|ghs_[A-Za-z0-9]{20,}|ghr_[A-Za-z0-9]{20,}|sk-ant-[A-Za-z0-9_-]{20,}|sk_live_[A-Za-z0-9]{20,}|sk_test_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})"; then
      echo "❌ 커밋하려는 변경사항에 비밀값(토큰/API 키) 패턴이 포함돼 있어 차단합니다." >&2
      echo "   → 해당 줄을 제거하거나 환경변수 참조로 바꾼 뒤 다시 시도하세요." >&2
      echo "   → 이미 로컬에 평문으로 쓴 값이라면 해당 토큰을 발급처에서 즉시 revoke하세요." >&2
      exit 2
    fi
  fi
fi

exit 0
