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

exit 0
