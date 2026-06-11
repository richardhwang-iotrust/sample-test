import Link from "next/link";
import { BarChart3, CircleGauge, Sparkles, Pencil } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

const icons = [CircleGauge, BarChart3, Sparkles, Pencil];

export function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">{siteConfig.logo}</p>
        <h2 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">{siteConfig.name}</h2>
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{siteConfig.footer}</p>
      </div>
      <nav className="mt-8 space-y-1">
        {siteConfig.nav.map((item, index) => {
          const Icon = icons[index] ?? CircleGauge;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium",
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Redis mode</p>
        <p className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">Upstash Redis 연결</p>
        <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
          Edit Data 메뉴에서 데이터를 편집하면 Redis에 즉시 저장되고 대시보드에 반영됩니다.
        </p>
      </div>
    </aside>
  );
}
