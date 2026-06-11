import type { TeamRow } from "@/data/mock-dashboard";

export function SalesTable({ rows }: { rows: TeamRow[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio snapshot</p>
      <h2 className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">Projects and revenue</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Project</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Owner</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Stage</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Health</th>
              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">MRR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-gray-100 dark:border-gray-700">
                <td className="py-3 font-medium text-gray-900 dark:text-gray-100">{row.name}</td>
                <td className="py-3 text-gray-500 dark:text-gray-400">{row.owner}</td>
                <td className="py-3 text-gray-700 dark:text-gray-300">{row.stage}</td>
                <td className="py-3 text-gray-700 dark:text-gray-300">{row.health}</td>
                <td className="py-3 text-right font-semibold text-gray-900 dark:text-gray-100">{row.mrr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
