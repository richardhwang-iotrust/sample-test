import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardContent, getDashboardSourceLabel } from "@/lib/dashboard-data";

export default async function AnalyticsPage() {
  const content = await getDashboardContent();
  const sourceLabel = await getDashboardSourceLabel();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>
      <RevenueChart series={content.revenueSeries} sourceLabel={sourceLabel} />
    </div>
  );
}
