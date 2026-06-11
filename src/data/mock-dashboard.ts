export type Stat = {
  title: string;
  value: string;
  delta: string;
  detail: string;
};

export type RevenuePoint = {
  month: string;
  revenue: number;
  pipeline: number;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "default" | "success" | "accent";
};

export type TeamRow = {
  name: string;
  owner: string;
  stage: string;
  health: string;
  mrr: string;
};

export type DashboardContent = {
  stats: Stat[];
  revenueSeries: RevenuePoint[];
  recentActivities: ActivityItem[];
  projectTable: TeamRow[];
};

export const defaultDashboardContent: DashboardContent = {
  stats: [
    { title: "Monthly Revenue", value: "$84.2k", delta: "+18.4%", detail: "지난달 대비 성장" },
    { title: "Active Users", value: "12,480", delta: "+6.9%", detail: "최근 30일 기준" },
    { title: "Conversion Rate", value: "5.62%", delta: "+0.8pt", detail: "무료 체험 전환" },
    { title: "Churn Risk", value: "2.1%", delta: "-0.5pt", detail: "관찰 계정 비율" },
  ],
  revenueSeries: [
    { month: "Jan", revenue: 30, pipeline: 18 },
    { month: "Feb", revenue: 40, pipeline: 24 },
    { month: "Mar", revenue: 48, pipeline: 28 },
    { month: "Apr", revenue: 57, pipeline: 33 },
    { month: "May", revenue: 63, pipeline: 38 },
    { month: "Jun", revenue: 71, pipeline: 44 },
    { month: "Jul", revenue: 84, pipeline: 51 },
  ],
  recentActivities: [
    {
      id: "act-1",
      title: "Enterprise renewal confirmed",
      description: "Atlas Mobility가 연간 계약을 12개월 추가 연장했습니다.",
      time: "10 minutes ago",
      tone: "success",
    },
    {
      id: "act-2",
      title: "Design review completed",
      description: "새 리포팅 홈 UI가 QA로 이동했습니다.",
      time: "42 minutes ago",
      tone: "accent",
    },
    {
      id: "act-3",
      title: "Onboarding dip detected",
      description: "신규 사용자 첫 세션 완료율이 3% 하락했습니다.",
      time: "2 hours ago",
      tone: "default",
    },
    {
      id: "act-4",
      title: "Finance sync queued",
      description: "월말 리포트 생성이 예약되었습니다.",
      time: "Today, 07:30",
      tone: "default",
    },
  ],
  projectTable: [
    { name: "Mercury CRM", owner: "Ava Kim", stage: "Shipping", health: "Healthy", mrr: "$18.4k" },
    { name: "Beacon AI", owner: "Mina Park", stage: "Pilot", health: "Watch", mrr: "$11.7k" },
    { name: "Field Ops", owner: "Noah Lee", stage: "Expansion", health: "Healthy", mrr: "$24.1k" },
    { name: "Studio Cloud", owner: "Jaden Choi", stage: "Renewal", health: "At Risk", mrr: "$9.8k" },
  ],
};
