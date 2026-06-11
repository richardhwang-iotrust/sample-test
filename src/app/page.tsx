import Link from "next/link";
import { ArrowRight, PencilLine, RefreshCcw, LogIn } from "lucide-react";
import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/auth";
import { siteConfig } from "@/config/site.config";

export default async function Home() {
  if (!isAuthConfigured) {
    redirect("/dashboard");
  }

  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-12 sm:px-8 lg:px-10">
      <div className="glass-panel overflow-hidden rounded-[2rem] border border-white/30">
        <div className="grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-14 lg:py-14">

          {/* 왼쪽: 소개 */}
          <section className="flex flex-col justify-between gap-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-4 py-2 text-sm text-[var(--muted)]">
                내부 팀 전용 대시보드
              </div>
              <div className="space-y-4">
                <p className="font-display text-sm uppercase tracking-[0.3em] text-[var(--muted)]">
                  {siteConfig.logo}
                </p>
                <h1 className="max-w-2xl font-display text-5xl leading-tight font-semibold sm:text-6xl">
                  {siteConfig.heroTitle}
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                  {siteConfig.description}
                </p>
              </div>

              {/* CTA 버튼 */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] hover:-translate-y-0.5"
                >
                  로그인하고 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/50 px-6 py-3 text-sm font-semibold hover:-translate-y-0.5 dark:bg-white/5"
                >
                  데모 먼저 보기
                </Link>
              </div>

              {/* 기능 카드 */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: LogIn,
                    title: "Google 로그인",
                    body: "회사 Google 계정으로 바로 접속할 수 있습니다.",
                  },
                  {
                    icon: PencilLine,
                    title: "데이터 직접 편집",
                    body: "대시보드 안에서 숫자와 내용을 바로 수정할 수 있습니다.",
                  },
                  {
                    icon: RefreshCcw,
                    title: "저장 즉시 반영",
                    body: "저장 버튼을 누르면 수정 내용이 화면에 바로 반영됩니다.",
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-[var(--border)] bg-white/55 p-5 dark:bg-white/5"
                  >
                    <Icon className="mb-3 h-5 w-5 text-[var(--accent)]" />
                    <p className="font-display text-base font-medium">{title}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 오른쪽: 사용 안내 */}
          <section className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-amber-400/25 via-transparent to-sky-400/20 blur-3xl" />
            <div className="rounded-[2rem] border border-white/40 bg-[var(--card-strong)] p-6 shadow-2xl shadow-slate-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--muted)]">처음 사용하시나요?</p>
                  <p className="mt-1 font-display text-2xl font-semibold">이렇게 시작하세요</p>
                </div>
              </div>

              <ol className="mt-6 space-y-4">
                {[
                  {
                    step: "1",
                    title: "로그인",
                    desc: "회사 Google 계정으로 로그인합니다.",
                  },
                  {
                    step: "2",
                    title: "데이터 입력",
                    desc: "왼쪽 메뉴에서 Edit Data를 눌러 내용을 입력합니다.",
                  },
                  {
                    step: "3",
                    title: "저장",
                    desc: "저장 버튼을 누르면 대시보드에 즉시 반영됩니다.",
                  },
                ].map(({ step, title, desc }) => (
                  <li
                    key={step}
                    className="flex items-start gap-4 rounded-3xl border border-[var(--border)] bg-white/60 p-4 dark:bg-slate-950/40"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-xs font-bold text-[var(--background)]">
                      {step}
                    </span>
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 rounded-[1.75rem] bg-slate-950 p-5 text-white">
                <p className="text-sm text-slate-400">로그인 전에 먼저 확인하고 싶다면</p>
                <Link
                  href="/dashboard"
                  className="mt-3 inline-flex items-center gap-2 text-base font-semibold hover:underline"
                >
                  데모 화면 바로 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-2 text-sm text-slate-400">
                  로그인 없이도 샘플 데이터로 채워진 대시보드를 먼저 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
