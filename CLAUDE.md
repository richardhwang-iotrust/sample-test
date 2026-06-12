# 프로젝트 작업 규칙

> **이 프로젝트는?**
> Claude Code 하네스 적용 보일러플레이트입니다. `CLAUDE.md` · `.claude/` · `docs/` · `.dev/` · `src/` 분리부터 6요소(rules · hooks · skills · agents · CLAUDE.md · plugin)까지 — 팀이 바로 가져다 쓸 수 있도록 기본 세팅과 예시를 담아 둡니다.
>
> <!-- 배포 환경 (해당하는 경우에만 기입) -->
> <!-- **배포 환경** -->
> <!-- - 로컬 개발: 개발 서버 주소 (예: `http://localhost:PORT`) -->
> <!-- - 실제 서비스: 배포 방식 및 브랜치 전략 기입 (예: Vercel, main 브랜치 자동 배포) -->

## 플러그인 의존성

이 레포는 아래 플러그인에 의존한다. 레포를 clone 한 직후, Claude Code 안에서 한 번씩 설치해야 한다 (유저 홈 캐시에 저장되므로 clone 만으로는 따라오지 않는다).

```
/plugin install harness-session@harness-local
/plugin install session-wrap@team-attention-plugins
```

- `harness-session` — `/scaffold`, `/specify`, `/qa`, `/check-harness`, `/agent-orchestrate` 등 하네스 운용 스킬 모음
- `session-wrap` — `/wrap` 으로 세션 회고·개선점 자동 추출

## 세션 시작 시

새 대화가 시작되면 반드시 `/start` 명령을 실행한다.

---

## 작업 흐름 (순서 엄수)

기능 구현 후 아래 순서를 반드시 지킨다:

1. **기능 구현** — 코드 작업 완료
2. **로컬 확인** — 개발 서버 실행 후 사용자에게 확인 요청
   - "로컬에서 확인해보세요. 괜찮으면 말씀해 주시면 저장할게요."
3. **커밋 & 푸시** — 사용자가 "괜찮아", "OK", "좋아" 등 확인 응답을 한 후에만 실행
<!-- 4. **배포(머지)** — 배포가 있는 프로젝트라면 아래 주석을 해제하고 사용 -->
<!-- - 사용자가 명시적으로 요청할 때만 실행 -->
<!-- - 트리거 예시: "배포해줘", "메인에 반영해줘", "올려줘", "PR 해줘" -->
<!-- - 트리거 없으면 커밋/푸시까지만 하고 머지하지 않는다 -->

## 큰 기능 요청 시 자동 워크플로우

"대시보드 만들어줘", "채용 관리 기능 추가해줘" 같이 **기획·디자인·프론트·백 여러 영역에 걸친 큰 요청**이 들어오면, 메인 Claude는 아래 순서로 서브에이전트를 자동 호출한다:

| 순서 | 에이전트 | 산출물 |
|---|---|---|
| 1 | `planner` | 기획서 (`docs/plans/*.md`) |
| 2 | `designer` | 디자인 명세 (`docs/design/*.md`) |
| 3 | `frontend` | UI 코드 |
| 4 | `backend` | DB 스키마·API |

각 단계의 산출물을 다음 에이전트에게 전달하고, 모든 단계가 끝나면 결과를 종합해 사용자에게 보고한다. 각 에이전트는 필요 시 공식 skill(`canvas-design`, `frontend-design`, `supabase-postgres-best-practices`) 또는 `harness-session` 플러그인의 `/specify`·`/deep-interview`를 자동 참고한다.

**단일 영역 요청**(예: "이 버튼 색만 바꿔줘", "이 SQL 고쳐줘", "README만 수정")은 이 워크플로우를 건너뛰고 해당 영역만 바로 처리한다.

---

## 세부 규칙 참조

상세 규칙은 아래 파일에 있으며 자동으로 로드된다:
- `.claude/rules/git.md` — 브랜치 전략, 커밋 형식, 머지 절차, PR 템플릿, 1Password 안내
- `.claude/rules/communication.md` — 소통 방식, 에러 안내, 작업 범위 합의
- `.claude/rules/security.md` — 비밀값(토큰·API 키·비밀번호) 취급, 인증 방식 선택, 커밋 전 점검