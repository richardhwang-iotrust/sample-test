import Link from "next/link";
import { Files, Settings2, Sparkles } from "lucide-react";

const actions = [
  {
    href: "/dashboard/analytics",
    title: "Check analytics",
    body: "차트와 성장 흐름을 한 번에 확인합니다.",
    icon: Sparkles,
  },
  {
    href: "/dashboard/activity",
    title: "Review activity",
    body: "최근 운영 로그와 이벤트를 빠르게 점검합니다.",
    icon: Files,
  },
  {
    href: "/login",
    title: "Connect setup",
    body: "Google 로그인과 Google Drive 파일 ID를 연결합니다.",
    icon: Settings2,
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">Quick actions</p>
      <h2 className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">Move faster</h2>
      <div className="mt-5 space-y-2">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="block rounded-lg border border-gray-100 bg-gray-50 p-4 hover:border-indigo-100 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-900 dark:hover:bg-indigo-950"
          >
            <div className="flex items-center gap-3">
              <action.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{action.title}</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{action.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
