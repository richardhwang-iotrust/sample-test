# Next.js Dashboard Boilerplate Implementation Plan

## 1. 목표

비개발자도 아래 두 가지만 수정하면 바로 배포 가능한 Next.js 기반 대시보드 보일러플레이트를 만든다.

1. `.env` 또는 Vercel Environment Variables
2. 간단한 설정 파일(`site.config.ts` 같은 텍스트 기반 설정)

초기 버전은 **DB 없는 정적 버전**으로 만들고, 로그인 후 보이는 데이터는 **가짜 데이터(mock data)** 로 구성한다.

## 2. 요구사항 해석

### 반드시 만족해야 하는 항목

1. 코딩을 모르는 사용자도 사용할 수 있어야 한다.
2. Google 로그인 기능이 있어야 한다.
3. 예쁜 프리미엄 느낌의 대시보드 UI가 있어야 한다.
4. 다크모드를 지원해야 한다.
5. Vercel 배포용 `.env.example` 파일이 반드시 있어야 한다.
6. `.env.example`에는 어떤 값을 넣는지 주석으로 자세히 설명해야 한다.
7. DB 없이 먼저 동작해야 한다.

### 구현 방향

- 인증은 **Auth.js(구 NextAuth.js)** 의 Google Provider를 사용한다.
- 사용자 데이터 저장은 하지 않고 **세션 기반 로그인**만 사용한다.
- 대시보드 데이터는 로컬 상수 / JSON / TypeScript mock 파일로 관리한다.
- UI는 프리미엄 템플릿 느낌을 주되, 유지보수가 쉬운 컴포넌트 중심 구조로 만든다.

## 3. 제안 스택

- Framework: `Next.js` (App Router)
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- UI primitives: `shadcn/ui` 또는 이에 준하는 재사용 가능한 UI 컴포넌트 구조
- Theme: `next-themes`
- Auth: `Auth.js / NextAuth`
- Icons: `lucide-react`
- Charts/visuals: `recharts` 또는 정적 카드/차트 조합
- Deployment target: `Vercel`

## 4. 제품 형태

### 초기 제공 화면

1. 랜딩/로그인 화면
2. 로그인 후 대시보드 홈
3. 매출/사용자/전환율 등의 KPI 카드
4. 차트 섹션
5. 최근 활동 / 알림 / 테이블 섹션
6. 프로필 드롭다운
7. 라이트 모드 / 다크 모드 토글

### 핵심 사용자 경험

- 첫 화면에서 바로 Google 로그인 가능
- 로그인 후 즉시 데모 대시보드 진입
- 복잡한 관리자 기능 대신 “보기 좋은 기본형” 제공
- 배포 후 바로 데모/템플릿으로 활용 가능

## 5. 비개발자 친화 설계 원칙

### 설정 방식

코드 수정이 아니라 아래 파일만 바꾸면 되도록 설계한다.

- `.env.local`
- `site.config.ts`
- 필요 시 `mock-data.ts`

### 설정 파일에 들어갈 항목 예시

- 서비스 이름
- 로고 텍스트
- 기본 설명 문구
- 사이드바 메뉴 노출 여부
- 기본 테마 설정
- 대시보드 카드 제목

### 비개발자 관점에서 중요한 점

- 설치 후 바로 실행되는 기본값 제공
- 값이 비어 있으면 에러 메시지가 친절하게 보이도록 처리
- README에 “복사-붙여넣기 순서” 중심으로 작성
- Google 로그인 미설정 시에도 개발 단계에서는 안내 화면 또는 데모 모드 선택 가능하게 설계 검토

## 6. 인증 전략

### 6-1. 기준 아키텍처

로그인은 아래 흐름을 기준으로 구현한다.

`/dashboard 접근 -> 세션 없으면 /login 이동 -> Google 로그인 -> 성공 시 /dashboard 복귀`

핵심 구성은 아래 네 가지다.

- `Auth.js v5` 사용
- `Google Provider`만 사용
- `middleware`로 `/dashboard/:path*` 보호
- 전용 로그인 페이지는 `/login`

### 6-2. 상세 정책

- 로그인 방식은 Google OAuth만 허용
- `@회사도메인` 이메일만 로그인 허용할 수 있는 구조로 구현
- `/dashboard`와 `/dashboard/*`는 로그인 필수
- 로그인 성공 후 기본 이동 경로는 `/dashboard`
- 필요 시 세션에 `role` 값을 추가할 수 있게 확장 포인트 제공
- DB 없이 JWT 세션 전략으로 먼저 구성

### 6-3. 구현 방식

- `src/auth.ts`에서 `NextAuth()` 설정
- `callbacks.signIn`에서 회사 도메인 검사
- `callbacks.session`에서 `session.user.id` 및 `session.user.role` 확장 가능하게 구성
- `pages.signIn`과 `pages.error`는 모두 `/login`으로 설정
- `src/app/api/auth/[...nextauth]/route.ts`에서 handler 연결
- `src/middleware.ts`에서 `/dashboard/:path*` 차단
- `src/app/login/page.tsx`에서 `signIn('google', { redirectTo: '/dashboard' })` 사용
- `src/app/providers.tsx`에서 `SessionProvider` 연결

### 6-4. 이유

- DB 없이도 원하는 로그인 흐름을 구현할 수 있음
- App Router + Vercel 조합에 자연스럽게 맞음
- 다른 프로젝트에도 거의 동일 구조로 재사용 가능함
- 로그인 경로와 보호 경로가 분명해서 비개발자에게도 설명이 쉬움

### 6-5. 주의사항

Google OAuth를 쓰려면 아래 값이 필요하다.

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET`
- `AUTH_URL`

Google Console 설정이 익숙하지 않은 사용자를 위해 README와 `.env.example`에 아래 내용을 설명한다.

- Authorized JavaScript origins
- Authorized redirect URIs
- 로컬 개발 URL
- Vercel 배포 URL 예시
- 허용된 회사 계정만 로그인되는 방식

## 7. 라우팅 구조 제안

```txt
src/
  auth.ts
  middleware.ts
  app/
    layout.tsx
    providers.tsx
    login/
      page.tsx
    dashboard/
      page.tsx
      analytics/
        page.tsx
      activity/
        page.tsx
    api/
      auth/
        [...nextauth]/
          route.ts
```

메인 인증 기준 경로는 아래처럼 맞춘다.

- 로그인 페이지: `/login`
- 보호 페이지: `/dashboard`, `/dashboard/*`
- 인증 API: `/api/auth/*`

## 8. 컴포넌트 구조 제안

```txt
components/
  layout/
    sidebar.tsx
    header.tsx
    user-nav.tsx
    theme-toggle.tsx
  dashboard/
    stat-card.tsx
    revenue-chart.tsx
    activity-feed.tsx
    sales-table.tsx
    quick-actions.tsx
  auth/
    sign-in-card.tsx
  ui/
    ...shared ui primitives
lib/
  utils.ts
config/
  site.config.ts
data/
  mock-dashboard.ts
```

인증 핵심 파일은 `lib/`가 아니라 `src/auth.ts`에 둔다.

## 9. UI/디자인 방향

### 목표 분위기

- 스타트업 SaaS 관리자 화면 느낌
- 과하지 않지만 “프리미엄” 인상이 나는 스타일
- 다크모드에서 특히 보기 좋게 설계

### 디자인 원칙

- 카드 중심 레이아웃
- 넉넉한 여백
- 고급스러운 배경 그라데이션 또는 패턴
- 라운드 코너와 얕은 그림자
- 차분한 중성 색상 + 포인트 컬러 1개
- 라이트/다크 모두 대비가 충분해야 함

### 포함하면 좋은 요소

- 환영 배너
- KPI 카드 4개
- 라인 차트 1개
- 바 차트 또는 원형 차트 1개
- 최근 활동 리스트
- 팀 또는 프로젝트 테이블

## 10. 정적 데이터 전략

DB가 없으므로 아래 방식으로 진행한다.

- `data/mock-dashboard.ts`에 KPI/차트/활동 데이터 정의
- 페이지는 해당 mock 데이터를 import 해서 렌더링
- 향후 DB 연동 시 교체하기 쉬운 구조로 함수 단위 분리

예시:

- `getDashboardStats()`
- `getRevenueSeries()`
- `getRecentActivities()`

초기에는 실제 fetch 없이 정적 함수 반환으로 구성한다.

## 11. `.env.example` 설계 계획

`.env.example`는 단순 키 나열이 아니라 **주석 중심 안내 문서**처럼 작성한다.

### 포함할 키

```env
# App display name used in metadata and UI labels.
NEXT_PUBLIC_APP_NAME="Premium Dashboard"

# Public base URL of your deployed site.
# Local development usually uses http://localhost:3000
# On Vercel, set this to your production domain, for example:
# https://your-project.vercel.app
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Auth.js base URL.
# In production, set this to the exact deployed domain.
# Example:
# https://competitor-reviews.vercel.app
AUTH_URL="http://localhost:3000"

# Auth.js secret used to sign and encrypt session tokens.
# Generate a long random string.
# Example command:
# openssl rand -base64 32
AUTH_SECRET=""

# Google OAuth Client ID from Google Cloud Console.
# Create OAuth credentials and copy the Client ID here.
GOOGLE_CLIENT_ID=""

# Google OAuth Client Secret from Google Cloud Console.
# Copy the generated client secret here.
GOOGLE_CLIENT_SECRET=""

# Restrict login to your company email domain.
# Example:
# yourcompany.com
# Then only emails ending with @yourcompany.com are allowed.
ALLOWED_EMAIL_DOMAIN=""
```

### 주석에 꼭 넣을 설명

- 각 값이 어디서 발급되는지
- 로컬 개발용 값과 배포용 값이 어떻게 다른지
- Vercel Dashboard에서 어느 메뉴에 입력하는지
- Google Redirect URI 예시
- `AUTH_URL`은 배포 URL과 정확히 일치해야 한다는 점
- 회사 도메인 제한을 위한 `ALLOWED_EMAIL_DOMAIN` 사용 방식

## 12. README 작성 계획

README는 “개발자 문서”보다 “사용 안내서”처럼 작성한다.

### 포함 항목

1. 이 프로젝트가 무엇인지
2. 바로 시작하는 3단계
3. `.env.local` 만드는 방법
4. Google 로그인 설정 방법
5. 로컬 실행 방법
6. Vercel 배포 방법
7. 자주 발생하는 오류와 해결 방법
8. `/dashboard -> /login -> Google -> /dashboard` 인증 흐름 설명

### 특히 중요

- 스크린샷 또는 GIF가 있으면 좋음
- “복잡한 설명”보다 “클릭 경로” 중심 문장 사용
- 로그인 실패 시 `/login?error=AccessDenied` 같은 케이스도 안내

## 13. 사용자가 실제로 수정할 파일

비개발자 사용자는 가능하면 아래 파일만 수정하면 되도록 만든다.

### 13-1. 꼭 수정하는 파일

#### `.env.local` 또는 Vercel Environment Variables

사용자가 가장 먼저 수정할 영역이다.

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET`
- `AUTH_URL`
- `ALLOWED_EMAIL_DOMAIN`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`

이 파일에서는 아래만 바꾸면 된다.

- Google 로그인 연결 정보
- 배포 도메인
- 허용할 회사 이메일 도메인
- 서비스 이름

#### `config/site.config.ts`

브랜드와 문구를 바꾸는 용도다.

- 서비스 이름
- 로고 텍스트
- 헤더 문구
- 환영 메시지
- 메뉴 이름
- 푸터 문구
- 기본 연락처 정보

#### `data/mock-dashboard.ts`

DB 없는 정적 버전에서는 화면에 보일 내용을 여기서 바꾼다.

- KPI 카드 숫자
- 차트 데이터
- 최근 활동 목록
- 테이블 데이터
- 공지/알림/배너 문구

### 13-2. 선택적으로 수정하는 파일

아래 파일은 꼭 건드릴 필요는 없지만, 디자인 커스터마이징이 필요하면 수정할 수 있다.

- `app/globals.css` 또는 테마 토큰 파일
- `components/dashboard/*`
- `components/layout/*`

여기서는 아래 정도만 바꾸는 것을 권장한다.

- 색상
- 간격
- 카드 제목
- 아이콘
- 배너 문구

### 13-3. 사용자가 수정하지 않는 파일

아래 파일은 인증과 라우팅 핵심 로직이므로 비개발자가 직접 수정하지 않도록 한다.

- `src/auth.ts`
- `src/middleware.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/providers.tsx`
- `src/app/layout.tsx`

이 파일들은 아래 기능을 담당한다.

- Google 로그인 처리
- `/dashboard` 보호
- 로그인 실패/성공 리다이렉트
- 세션 연결
- 앱 루트 설정

### 13-4. README에 넣을 사용자 안내 문구

README에는 아래처럼 아주 명확하게 적는 것이 좋다.

1. 먼저 `.env.local`을 채운다.
2. Google Cloud Console에 Redirect URI를 등록한다.
3. `config/site.config.ts`에서 서비스 이름과 문구를 수정한다.
4. `data/mock-dashboard.ts`에서 화면에 보일 예시 데이터를 수정한다.
5. 그 외 인증 파일은 수정하지 않는다.

## 14. 인증 파일별 구현 계획

### `src/auth.ts`

- `NextAuth` 설정의 단일 진입점
- Google Provider 등록
- `pages.signIn = '/login'`
- `pages.error = '/login'`
- `callbacks.signIn`에서 `ALLOWED_EMAIL_DOMAIN` 검사
- `callbacks.session`에서 `session.user.id` 설정
- 필요 시 `session.user.role` 추가 가능하게 타입 확장 준비

### `src/middleware.ts`

- `auth()` 기반으로 세션 확인
- `/dashboard/:path*` matcher 설정
- 비로그인 시 `/login`으로 리다이렉트

### `src/app/login/page.tsx`

- Google 로그인 버튼 제공
- `signIn('google', { redirectTo: '/dashboard' })` 사용
- `error=AccessDenied`면 회사 계정 안내 문구 표시
- 기타 오류도 같은 페이지에서 표시

### `src/app/providers.tsx`

- `SessionProvider` 연결
- 이후 테마 provider와 함께 루트에서 조합 가능하게 구성

### `src/app/layout.tsx`

- `Providers` 연결
- 메타데이터 / 폰트 / 테마 루트 설정

### `src/app/dashboard/page.tsx`

- 서버 컴포넌트에서 `auth()`로 세션 재확인
- 세션 없으면 `redirect('/login')`
- 로그인 사용자 이름/이메일 기반 환영 UI 노출

## 15. 구현 단계

### Phase 1. 프로젝트 초기 세팅

- Next.js + TypeScript + Tailwind 초기화
- App Router 기반 구조 설정
- 기본 폴더 구조 정리
- 공통 레이아웃 / 폰트 / 메타데이터 설정

### Phase 2. 인증 세팅

- Auth.js 설치 및 설정
- Google Provider 연동
- `/login` 페이지 연결
- `middleware`로 `/dashboard/*` 보호
- 회사 도메인 제한 callback 연결
- 로그인/로그아웃 흐름 연결
- 세션 확장 구조 준비

### Phase 3. 대시보드 UI 구축

- 사이드바/헤더/카드/차트 영역 구현
- mock data 연결
- 모바일/태블릿 반응형 대응
- 라이트/다크 모드 적용

### Phase 4. 비개발자 설정 경험 개선

- `site.config.ts` 작성
- `.env.example` 상세 주석 작성
- 잘못된 환경변수 감지 시 안내 UI 또는 메시지 제공
- Google Console에 넣을 redirect URI를 문서로 명확히 제공

### Phase 5. 문서화 및 배포 준비

- README 작성
- Vercel 배포 가이드 작성
- 환경변수 체크리스트 정리

## 16. 파일별 산출물 계획

- `src/auth.ts` : Auth.js 설정
- `src/middleware.ts` : `/dashboard/*` 접근 보호
- `src/app/` : 라우트 및 페이지
- `components/` : UI 및 레이아웃 컴포넌트
- `config/site.config.ts` : 비개발자용 서비스 설정
- `data/mock-dashboard.ts` : 정적 데모 데이터
- `.env.example` : 배포용 환경변수 예시
- `README.md` : 사용 안내 문서

## 17. 완료 기준(Definition of Done)

아래 항목을 만족하면 1차 완료로 본다.

1. `npm install && npm run dev` 후 바로 실행된다.
2. `.env.local`에 값만 넣으면 Google 로그인이 동작한다.
3. 로그인 후 예쁜 대시보드 화면이 나온다.
4. 다크모드 전환이 된다.
5. DB 없이 모든 페이지가 동작한다.
6. `.env.example`만 보고도 어떤 값을 넣어야 하는지 이해할 수 있다.
7. README만 보고 Vercel 배포가 가능하다.
8. 로그인하지 않은 사용자가 `/dashboard` 접근 시 `/login`으로 이동한다.
9. 허용되지 않은 이메일 도메인은 로그인 차단된다.
10. 로그인 성공 시 `/dashboard`로 복귀한다.

## 18. 이후 확장 포인트

정적 버전 이후에는 아래 순서로 확장하기 좋다.

1. Supabase / Firebase / Prisma + DB 연결
2. 사용자별 데이터 저장
3. 관리자 설정 페이지 추가
4. 결제/구독 기능 추가
5. CMS 또는 노코드 데이터 입력 연동

## 19. 권장 구현 우선순위

1. 프로젝트 골격 생성
2. Auth.js + Google 로그인 연결
3. `/login` 페이지와 `middleware` 보호 구현
4. 보호된 대시보드 레이아웃 구현
5. 프리미엄 UI와 다크모드 완성
6. mock data 정리
7. `.env.example` 상세화
8. README / 배포 가이드 정리

## 20. 이번 작업의 범위 정리

이번 단계에서는 실제 DB, 결제, 어드민 CRUD, 실시간 데이터는 제외한다.

대신 아래에 집중한다.

- “바로 배포 가능한 첫인상 좋은 템플릿”
- “비개발자가 수정 가능한 설정 구조”
- “Google 로그인 포함”
- “회사 도메인 제한 가능한 인증 구조”
- “Vercel 친화적인 환경변수 문서화”

## 21. 실행 메모

실제 구현을 시작할 때는 아래 순서로 진행하는 것이 가장 안전하다.

1. Next.js 프로젝트 초기화
2. Tailwind / 테마 / UI 기반 설치
3. Auth.js Google 로그인 연결
4. `/login`, `middleware`, `/api/auth/[...nextauth]` 구성
5. 대시보드 페이지와 mock data 구현
6. `.env.example`와 README 정리
7. 로컬 실행 및 Vercel 배포 검증
