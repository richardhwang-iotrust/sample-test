import type { RevenuePoint } from "@/data/mock-dashboard";

export function RevenueChart({
  series,
  sourceLabel,
}: {
  series: RevenuePoint[];
  sourceLabel?: string;
}) {
  const max = Math.max(...series.map((item) => Math.max(item.revenue, item.pipeline)));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenue vs pipeline</p>
          <h2 className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">Growth trajectory</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-600" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-indigo-200 dark:bg-indigo-800" />
            Pipeline
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            {sourceLabel ?? "Data source"}
          </span>
        </div>
      </div>
      <div className="mt-8 grid h-64 grid-cols-7 items-end gap-3">
        {series.map((item) => (
          <div key={item.month} className="flex h-full flex-col justify-end gap-2">
            <div className="flex h-full items-end gap-1">
              <div
                className="w-1/2 rounded-t bg-indigo-600"
                style={{ height: `${(item.revenue / max) * 100}%` }}
              />
              <div
                className="w-1/2 rounded-t bg-indigo-200 dark:bg-indigo-800"
                style={{ height: `${(item.pipeline / max) * 100}%` }}
              />
            </div>
            <div className="text-center text-xs text-gray-400 dark:text-gray-500">{item.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
