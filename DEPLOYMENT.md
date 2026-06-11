# Deployment

## Current Deployment Model

이 저장소의 배포 방식은 `GitHub Actions -> Vercel Production`이다.

- 애플리케이션 빌드: `npm run build -- --webpack`
- 운영 실행 환경: `Vercel`
- 자동 배포 트리거: `main` 브랜치 push
- 배포 실행 주체: GitHub Actions

즉, 로컬에서 서버를 직접 띄우는 방식이나 Docker 배포가 아니라, `main` 반영 시 GitHub Actions가 `vercel --prod --yes`를 실행해 운영 배포를 수행한다.

## Deployment Flow

1. 변경사항을 `main` 브랜치에 push한다.
2. [`.github/workflows/deploy.yml`](/Users/pc-22-023/Desktop/dashboard-boilerplate/.github/workflows/deploy.yml) 워크플로우가 실행된다.
3. GitHub Actions가 의존성을 설치하고 `npm run build -- --webpack`으로 사전 빌드를 검증한다.
4. 이어서 `npx vercel --prod --yes`로 Vercel 운영 배포를 실행한다.
5. Vercel이 Next.js 애플리케이션을 호스팅한다.

## Related Files

### GitHub Actions

파일: [`.github/workflows/deploy.yml`](/Users/pc-22-023/Desktop/dashboard-boilerplate/.github/workflows/deploy.yml)

- 트리거: `push` on `main`
- 수동 실행: `workflow_dispatch`
- 빌드 검증: `npm run build -- --webpack`
- 배포 명령: `npx vercel --prod --yes`

### Vercel Settings

파일: [`vercel.json`](/Users/pc-22-023/Desktop/dashboard-boilerplate/vercel.json)

- 프레임워크: `nextjs`
- 정적 대시보드 보일러플레이트 기준의 최소 설정만 포함

## Required GitHub Actions Secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Recommended GitHub Actions Variables

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `AUTH_URL`
- `ALLOWED_EMAIL_DOMAIN`

## Runtime Environment Variables

Vercel 런타임에도 아래 값이 필요하다.

- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `AUTH_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_DRIVE_DASHBOARD_FILE_ID`
- `ALLOWED_EMAIL_DOMAIN`

이 값들은 [`.env.example`](/Users/pc-22-023/Desktop/dashboard-boilerplate/.env.example)를 기준으로 관리하면 된다.

## Google Auth Notes

- `AUTH_URL`은 실제 운영 도메인과 정확히 일치해야 한다.
- Google Cloud Console Redirect URI에도 같은 운영 도메인의 callback을 등록해야 한다.
- 예시:
  `https://your-project.vercel.app/api/auth/callback/google`

## Scope Of This Static Version

현재 브랜치는 DB 없는 버전이며, 대시보드 데이터는 Google Drive JSON 파일이나 기본 샘플 데이터로 동작한다.

- Google Drive JSON 기반 대시보드
- Auth.js 기반 Google 로그인 구조
- `/dashboard` 보호 라우팅
- Vercel 배포 가능 구조

아직 포함하지 않는 항목:

- Redis/DB 연동
- Cron 작업
- 외부 업무 도구 연동
- 관리자 CRUD

## Summary

현재 배포 방식은 `main push -> GitHub Actions -> Vercel Production`이며, 이 정적 보일러플레이트는 그 배포 흐름에 맞게 문서와 워크플로우가 정리되어 있다.
