# quick-start-projects

빠르게 시작할 수 있는 프로젝트 모음입니다. 아래 브랜치 중 목적에 맞는 것을 선택해 사용하세요.

---

## 브랜치 목록

### `dashboard-boilerplate`

키 값만 채우면 바로 실행되는 대시보드 보일러플레이트입니다.

- 샘플 데이터가 기본으로 포함되어 있어 설치 후 즉시 화면 확인 가능
- Upstash Redis와 Google 로그인을 연결하면 실제 데이터 편집 가능
- Vercel 배포 + GitHub Actions 자동 배포 설정 포함
- 비개발자도 따라할 수 있는 세팅 가이드 포함 (README 참고)

### `claude-harness-setup`

VS Code에서 Claude Code를 팀 프로젝트에 적용할 때 필요한 기본 설정 모음입니다.

- 소통 방식, Git 규칙 등 Claude 작업 규칙 (`rules/`)
- 세션 시작 준비 명령 (`commands/start.md`)
- 위험한 명령을 사전에 차단하는 보안 훅 (`hooks/guard.sh`)
- 다른 프로젝트에 복사해서 바로 사용 가능
