# Claude Code 하네스 기본 설정

VS Code에서 Claude Code를 사용할 때 필요한 **하네스(규칙·스킬·에이전트·훅) 기본 설정**을 모아둔 템플릿 레포입니다.
이 설정을 새 프로젝트에 복사하면, 팀원들과 일관된 작업 방식을 유지하고 큰 기능 요청은 서브에이전트 체인으로 자동 분업할 수 있습니다.

---

## 📑 목차

- [📁 프로젝트 구조](#-프로젝트-구조)
- [🔌 플러그인 의존성](#-플러그인-의존성)
- [🎯 포함된 설정](#-포함된-설정)
- [🤖 큰 기능 요청 시 자동 워크플로우](#-큰-기능-요청-시-자동-워크플로우)
- [🚀 이 설정을 다른 프로젝트에 적용하기](#-이-설정을-다른-프로젝트에-적용하기)
- [🔄 템플릿으로 시작하고 업데이트 받아오기](#-템플릿으로-시작하고-업데이트-받아오기)
- [📋 사용 예시](#-사용-예시)
- [🔧 각 파일 상세 설명](#-각-파일-상세-설명)
- [✨ 이점](#-이점)
- [📝 참고](#-참고)

---

## 📁 프로젝트 구조

```
.claude/
├── rules/                  # 자동 로드되는 작업 규칙
│   ├── communication.md        # 비개발자 사용자와의 소통 방식
│   ├── git.md                  # 브랜치·커밋·머지·PR 규칙
│   └── security.md             # 비밀값 취급, 인증 방식 선택, 커밋 전 점검
├── skills/                 # 슬래시 커맨드(Skills)
│   ├── start/                  # 세션 시작 준비 (`/start`)
│   ├── brainstorming/          # 3관점 발산형 브레인스토밍 (`/brainstorming`)
│   ├── doc-edit/               # 기존 구조 유지하며 마크다운 편집
│   ├── canvas-design/          # 포스터·정적 비주얼 디자인
│   ├── frontend-design/        # 프론트엔드 UI/페이지 디자인
│   └── supabase-postgres-best-practices/  # Postgres 스키마·쿼리 최적화
├── agents/                 # 서브에이전트 정의
│   ├── planner.md              # 기획서·PRD·유저스토리 작성
│   ├── designer.md             # 와이어프레임·컴포넌트 배치·비주얼 컨셉
│   ├── frontend.md             # React/Next.js/HTML/CSS 구현
│   ├── backend.md              # DB 스키마·RLS·API·인증 흐름
│   ├── code-architect.md       # 기능 아키텍처 설계
│   └── idea-researcher.md      # 브레인스토밍 아이디어 심층 분석
├── hooks/                  # Claude Code 이벤트 훅
│   ├── guard.sh                # Bash 실행 전 위험 명령 차단
│   ├── security_reminder_hook.py  # Edit/Write 전 비밀값 노출 사전 점검
│   ├── post_edit_check.py      # Edit/Write 후 후속 점검
│   └── stop_review.py          # 세션 종료 시 회고 안내
├── settings.json           # hook 등록 + 에이전트 팀 모드 등 환경 변수
└── settings.local.json     # 로컬 전용 설정(기기별 오버라이드)

CLAUDE.md                   # 프로젝트 작업 규칙(메인 Claude가 항상 읽음)
ppt/                        # 발표 자료(.key/.pptx/.pdf)
```

---

## 🔌 플러그인 의존성

이 레포는 두 개의 Claude Code 플러그인에 의존합니다. 레포를 clone 한 직후 Claude Code 안에서 한 번씩 설치해야 합니다 (유저 홈 캐시에 저장되므로 clone 만으로는 따라오지 않습니다).

```
/plugin install harness-session@harness-local
/plugin install session-wrap@team-attention-plugins
```

| 플러그인 | 제공 기능 |
|---|---|
| `harness-session` | `/scaffold`, `/specify`, `/qa`, `/check-harness`, `/agent-orchestrate`, `/deep-interview` 등 하네스 운용 스킬 |
| `session-wrap`    | `/wrap` — 세션 마무리 시 회고·자동화 후보·문서 업데이트 제안 |

---

## 🎯 포함된 설정

### 1. **작업 규칙** (`rules/`)

매 작업마다 자동으로 로드되는 규칙입니다.

| 파일 | 핵심 내용 |
|---|---|
| `communication.md` | 비개발자 친화 어휘, 영향 범위 사전 안내, 에러 안내 방식, UI 변경 시 로컬 서버 띄우기 |
| `git.md` | 브랜치 prefix(`{이메일앞부분}-기능명`), 커밋 메시지 형식, main 보호, PR 템플릿, squash 머지 |
| `security.md` | 비밀값(.env/토큰/키) 취급 기준, 인증 방식 권장 계층(SSH·gh·fine-grained PAT·GitHub App), Classic PAT 금지 |

### 2. **슬래시 커맨드 (Skills)** (`skills/`)

- `/start` — 세션 시작 준비. 사용자 이름, 현재 브랜치, 최신 main 반영 여부, 미완료 작업을 자동 점검합니다.
- `/brainstorming` — 빠른 해결 / 근본 해결 / 새로운 시각 3관점으로 아이디어를 발산하고, 선택된 안은 `idea-researcher` 에이전트로 심층 분석합니다.
- `/doc-edit` — 헤딩 트리·TOC·톤을 유지하며 마크다운을 편집합니다.
- 디자인/구현 보조 — `canvas-design`, `frontend-design`, `supabase-postgres-best-practices` 는 각각 포스터·웹UI·Postgres 작업 시 자동으로 참고됩니다.

### 3. **서브에이전트** (`agents/`)

큰 기능 요청은 영역별 전문 에이전트가 분담합니다. 자세한 호출 순서는 [큰 기능 요청 시 자동 워크플로우](#-큰-기능-요청-시-자동-워크플로우) 참고.

| 에이전트 | 역할 |
|---|---|
| `planner` | 기획서/PRD/유저스토리/화면 흐름 |
| `designer` | 와이어프레임·컴포넌트 배치·비주얼 컨셉 |
| `frontend` | React/Next.js/HTML/CSS 실제 구현 |
| `backend` | DB 스키마·RLS·API·인증 흐름 (Supabase 우선) |
| `code-architect` | 기존 코드베이스 패턴 분석 후 구현 청사진 제공 |
| `idea-researcher` | 선택된 아이디어를 웹 리서치로 심층 분석 |

### 4. **이벤트 훅** (`hooks/`)

| 훅 | 시점 | 동작 |
|---|---|---|
| `guard.sh` | Bash 실행 전 | main 직접 push, `--no-verify`, `Co-Authored-By` 커밋 메시지, `.env` 류 staging, 토큰 패턴(`ghp_`, `sk-ant-`, `AKIA…` 등) 자동 차단 |
| `security_reminder_hook.py` | Edit/Write 전 | 비밀값이 코드에 박히는 패턴을 사전에 경고 |
| `post_edit_check.py` | Edit/Write 후 | 편집 직후 후속 점검 |
| `stop_review.py` | 세션 종료(Stop) 시 | 회고/문서 업데이트 안내 |

---

## 🤖 큰 기능 요청 시 자동 워크플로우

"대시보드 만들어줘", "채용 관리 기능 추가해줘" 같이 **기획·디자인·프론트·백 여러 영역에 걸친 요청**이 들어오면, 메인 Claude가 아래 순서로 서브에이전트를 자동 호출합니다.

| 순서 | 에이전트 | 산출물 |
|---|---|---|
| 1 | `planner` | 기획서 (`docs/plans/*.md`) |
| 2 | `designer` | 디자인 명세 (`docs/design/*.md`) |
| 3 | `frontend` | UI 코드 |
| 4 | `backend` | DB 스키마·API |

각 단계의 산출물은 다음 에이전트에 전달되고, 모든 단계가 끝나면 결과를 종합해 사용자에게 보고합니다. 필요 시 공식 skill(`canvas-design`, `frontend-design`, `supabase-postgres-best-practices`)이나 `harness-session` 플러그인의 `/specify`·`/deep-interview`를 자동 참고합니다.

**단일 영역 요청**(예: "이 버튼 색만 바꿔줘", "이 SQL 고쳐줘", "README만 수정")은 이 워크플로우를 건너뛰고 해당 영역만 바로 처리합니다.

> 에이전트 팀 모드는 `settings.json` 의 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 환경 변수로 활성화됩니다.

---

## 🚀 이 설정을 다른 프로젝트에 적용하기

### 1단계 — 하네스 폴더 복사

```bash
# 새 프로젝트 루트에서
cp -r /path/to/dashboard-boilerplate/.claude .
cp /path/to/dashboard-boilerplate/CLAUDE.md .
```

### 2단계 — 플러그인 설치

Claude Code 안에서 한 번씩 실행합니다.

```
/plugin install harness-session@harness-local
/plugin install session-wrap@team-attention-plugins
```

### 3단계 — hook 실행 권한 부여

`guard.sh` 등 셸 훅이 실제로 동작하려면 실행 권한이 필요합니다.

```bash
chmod +x .claude/hooks/guard.sh
```

### 4단계 — 프로젝트에 맞게 커스터마이징 (선택)

| 파일 | 보통 이런 걸 바꿈 |
|---|---|
| `CLAUDE.md` | 프로젝트 한 줄 소개, 배포 환경, 팀 시크릿 관리 도구 |
| `rules/communication.md` | 팀 어휘·소통 톤 |
| `rules/git.md` | 머지 전략·PR 템플릿 |
| `rules/security.md` | 회사가 쓰는 시크릿 관리 도구 |
| `agents/*.md` | 팀이 자주 쓰는 도메인·스택을 명시 |
| `hooks/guard.sh` | 추가로 차단하고 싶은 명령 |

### 5단계 — Claude Code에 인식시키기

VS Code에서 프로젝트를 열면 `.claude/` 가 자동으로 로드됩니다.

- `rules/` — 모든 작업에 자동 적용
- `skills/` — `/명령어` 로 호출 (예: `/start`, `/brainstorming`)
- `agents/` — 큰 요청 시 메인 Claude가 자동으로 호출
- `hooks/` — `settings.json` 에 등록되어 자동 실행

세션을 시작할 때 `/start` 를 입력합니다.

---

## 🔄 템플릿으로 시작하고 업데이트 받아오기

이 레포는 **GitHub Template repository** 로 지정되어 있습니다. 다른 팀은 이 설정을 출발점으로 자기 프로젝트를 만들고, 이 레포가 업데이트될 때마다 원하는 시점에 그 업데이트를 당겨와 반영할 수 있습니다.

### 1단계 — 템플릿으로 새 저장소 만들기 (최초 1회)

1. 이 레포 페이지 상단의 **"Use this template"** → **"Create a new repository"** 클릭
2. 본인 조직과 저장소 이름을 지정하고 생성
3. 생성된 저장소를 로컬로 clone

```bash
git clone https://github.com/{내조직}/{내프로젝트}.git
cd {내프로젝트}
```

### 2단계 — 원본 레포를 "upstream"으로 등록 (최초 1회)

```bash
git remote add upstream https://github.com/iotrust-ax/dashboard-boilerplate.git

git remote -v
# origin    https://github.com/{내조직}/{내프로젝트}.git   (내 저장소)
# upstream  https://github.com/iotrust-ax/dashboard-boilerplate.git  (원본)
```

### 3단계 — 평소 작업

본인 작업은 평소처럼 `origin` 으로 push합니다. upstream 은 건드리지 않습니다.

### 4단계 — 원본 업데이트 받아오기 (원할 때만)

```bash
git fetch upstream
git merge upstream/main
# 또는: git rebase upstream/main
```

충돌이 나면 본인 코드와 원본 업데이트 중 어느 쪽을 살릴지 직접 선택합니다.

### 주의사항

- 업데이트는 **자동이 아닙니다.** 원하는 시점에 위 4단계를 수동으로 실행해야 반영됩니다.
- `.claude/` 폴더 충돌 시에는 가능하면 원본 쪽을 따르는 걸 권장합니다.
- 원본 레포에 **직접 커밋할 필요는 없습니다.** 본인 저장소(`origin`)만 관리하면 됩니다.

---

## 📋 사용 예시

### 새 작업 시작

```bash
# 1. VS Code에서 프로젝트 열기
code /path/to/project

# 2. Claude Code 열기 (Cmd+Shift+A / Ctrl+Shift+A)

# 3. 채팅창에 /start 입력
```

### 작업 흐름 (CLAUDE.md 와 동일)

1. **기능 구현** — 코드 작업 완료
2. **로컬 확인** — 개발 서버 실행 후 사용자에게 확인 요청
   - "로컬에서 확인해보세요. 괜찮으면 말씀해 주시면 저장할게요."
3. **커밋 & 푸시** — 사용자가 "괜찮아", "OK", "좋아" 등 확인 응답을 한 후에만 실행
4. **배포(머지)** — 배포가 있는 프로젝트라면 사용자가 명시적으로 요청할 때만 실행 (트리거: "배포해줘", "메인에 반영해줘", "PR 해줘")

### 작업 중 자동 안전장치

- ✅ Bash 명령은 `guard.sh` 가 사전 점검 — main 직접 push, `--no-verify`, `Co-Authored-By` 메시지, `.env` 커밋, 토큰 패턴 노출 차단
- ✅ Edit/Write 는 `security_reminder_hook.py` 가 비밀값 박히기를 사전 경고
- ✅ 세션 종료 시 `stop_review.py` 가 회고 안내

---

## 🔧 각 파일 상세 설명

| 영역 | 파일 | 목적 | 주 수정 대상 |
|---|---|---|---|
| 규칙 | `rules/communication.md` | 팀과 Claude의 소통 방식 | 비개발자 팀, 팀 리드 |
| 규칙 | `rules/git.md` | git 작업 표준화 | 모든 개발자 |
| 규칙 | `rules/security.md` | 비밀값·인증 방식 기준 | 보안 담당자 |
| 스킬 | `skills/start/` | 세션 시작 자동화 | 개발자 환경 담당자 |
| 스킬 | `skills/brainstorming/` | 발산형 아이디어 회의 | 기획·PM |
| 에이전트 | `agents/planner.md` ~ `backend.md` | 영역별 분업 | 각 영역 리드 |
| 훅 | `hooks/guard.sh` | 위험 명령 차단 | 보안/DevOps |
| 훅 | `hooks/security_reminder_hook.py` | 비밀값 사전 점검 | 보안 담당자 |
| 설정 | `.claude/settings.json` | hook 등록·환경 변수 | 환경 담당자 |
| 설정 | `CLAUDE.md` | 프로젝트 단위 메인 규칙 | 프로젝트 리드 |

---

## ✨ 이점

- 📖 **일관된 작업 방식** — 모든 팀원이 같은 규칙·소통 톤·git 흐름을 따름
- 🛡️ **다층 안전장치** — Bash 차단 + 편집 전 경고 + 세션 종료 회고가 함께 동작
- 🤖 **에이전트 자동 분업** — 큰 요청은 planner → designer → frontend → backend 체인으로 분담
- 🚀 **빠른 온보딩** — 새 팀원도 같은 설정으로 바로 시작 가능

---

## 📝 참고

- 각 파일의 상세 내용은 `.claude/` 폴더를 직접 열어 확인하세요.
- 프로젝트 단위 규칙은 `CLAUDE.md` 에서 시작하는 게 가장 빠릅니다.
- 발표 자료(`ppt/`)는 이 하네스를 사내 공유한 자료입니다.
