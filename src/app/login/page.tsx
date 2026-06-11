import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/auth";
import { SignInCard } from "@/components/auth/sign-in-card";
import { siteConfig } from "@/config/site.config";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (!isAuthConfigured) {
    redirect("/dashboard");
  }

  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12 sm:px-8 lg:px-10">
      <div className="grid w-full gap-8 lg:grid-cols-[0.95fr_1.05fr]">

        {/* 왼쪽: 안내 */}
        <section className="space-y-6">
          <p className="font-display text-sm uppercase tracking-[0.35em] text-[var(--muted)]">
            {siteConfig.logo}
          </p>
          <h1 className="max-w-xl font-display text-5xl leading-tight font-semibold">
            팀 대시보드에 오신 것을 환영합니다.
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--muted)]">
            회사 Google 계정으로 로그인하면 대시보드를 사용할 수 있습니다.
            처음이라면 로그인 없이 데모 화면을 먼저 확인해보세요.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["회사 계정 전용", "등록된 도메인의 Google 계정만 접속할 수 있습니다."],
              ["데모 먼저 확인", "로그인하지 않아도 샘플 화면을 미리 볼 수 있습니다."],
              ["편집 후 즉시 반영", "로그인하면 Edit Data 메뉴에서 내용을 바로 수정할 수 있습니다."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-[var(--border)] bg-white/50 p-5 dark:bg-white/5"
              >
                <p className="font-medium">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 오른쪽: 로그인 카드 */}
        <div className="flex items-center justify-center lg:justify-end">
          <SignInCard
            callbackUrl={params.callbackUrl ?? "/dashboard"}
            error={params.error}
            isAuthConfigured={isAuthConfigured}
            allowedDomain={process.env.ALLOWED_EMAIL_DOMAIN}
          />
        </div>

      </div>
    </main>
  );
}
