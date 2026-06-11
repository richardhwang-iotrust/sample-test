type StatCardProps = {
  title: string;
  value: string;
  delta: string;
  detail: string;
};

export function StatCard({ title, value, delta, detail }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{title}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {delta}
        </span>
      </div>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{detail}</p>
    </div>
  );
}
