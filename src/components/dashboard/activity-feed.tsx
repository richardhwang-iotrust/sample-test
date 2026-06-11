import type { ActivityItem } from "@/data/mock-dashboard";
import { cn } from "@/lib/utils";

const toneStyles = {
  default: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  accent: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
} as const;

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">Recent activity</p>
      <h2 className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">Signals and updates</h2>
      <div className="mt-5 space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", toneStyles[activity.tone])}>
                {activity.time}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
