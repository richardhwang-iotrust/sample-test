import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SalesTable } from "@/components/dashboard/sales-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardContent, getDashboardSourceLabel } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const content = await getDashboardContent();
  const sourceLabel = await getDashboardSourceLabel();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <RevenueChart series={content.revenueSeries} sourceLabel={sourceLabel} />
        <QuickActions />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_1.2fr]">
        <ActivityFeed activities={content.recentActivities} />
        <SalesTable rows={content.projectTable} />
      </section>
    </div>
  );
}
