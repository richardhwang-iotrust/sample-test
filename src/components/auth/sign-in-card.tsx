"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, Lock, MailWarning } from "lucide-react";

type SignInCardProps = {
  callbackUrl: string;
  isAuthConfigured: boolean;
  error?: string;
  allowedDomain?: string;
};

const errorMap: Record<string, string> = {
  AccessDenied: "허용되지 않은 이메일 도메인입니다. 회사 계정으로 다시 시도해 주세요.",
  Configuration: "로그인 설정이 완료되지 않았습니다. 담당자에게 문의하세요.",
  OAuthAccountNotLinked: "다른 방식으로 가입된 계정입니다. 담당자에게 문의하세요.",
};

export function SignInCard({
  callbackUrl,
  isAuthConfigured,
  error,
  allowedDomain,
}: SignInCardProps) {
  const message = error
    ? errorMap[error] ?? "로그인 중 문제가 발생했습니다. 담당자에게 문의하세요."
    : null;

  return (
    <div className="glass-panel w-full max-w-md rounded-[2rem] border border-white/30 p-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-[var(--muted)] dark:bg-white/5">
        <Lock className="h-3.5 w-3.5 text-[var(--accent)]" />
        보안 접속
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold">로그인</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        아래 버튼을 눌러 회사 Google 계정으로 로그인하세요.
      </p>

      {message && (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-900 dark:text-amber-100">
          {message}
        </div>
      )}

      {isAuthConfigured ? (
        <button
          type="button"
          onClick={() => signIn("google", { redirectTo: callbackUrl })}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] hover:-translate-y-0.5"
        >
          Google 계정으로 로그인
          <ArrowRight className="h-4 w-4" />
        </button>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-white/60 p-4 text-sm leading-6 text-[var(--muted)] dark:bg-white/5">
            <div className="flex items-start gap-3">
              <MailWarning className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
              <div>
                <p className="font-semibold text-[var(--foreground)]">로그인 설정 준비 중입니다</p>
                <p className="mt-1">
                  현재는 로그인 없이 데모 화면만 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white/60 px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 dark:bg-white/5"
          >
            데모 화면 바로 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <div className="mt-6 text-xs leading-6 text-[var(--muted)]">
        {allowedDomain
          ? `@${allowedDomain} 계정만 로그인할 수 있습니다.`
          : "모든 Google 계정으로 로그인할 수 있습니다."}
      </div>
    </div>
  );
}
