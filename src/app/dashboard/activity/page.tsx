import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SalesTable } from "@/components/dashboard/sales-table";
import { getDashboardContent } from "@/lib/dashboard-data";

export default async function ActivityPage() {
  const content = await getDashboardContent();

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <ActivityFeed activities={content.recentActivities} />
      <SalesTable rows={content.projectTable} />
    </div>
  );
}
