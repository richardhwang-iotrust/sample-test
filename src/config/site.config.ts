export const siteConfig = {
  name: "IoTrust Console",
  logo: "IoTrust",
  description:
    "팀의 주요 지표, 매출 현황, 프로젝트 상태를 한 화면에서 확인하고 직접 편집할 수 있습니다.",
  heroTitle: "우리 팀 현황을 한눈에 파악하는 대시보드입니다.",
  welcomeTitle: "팀 운영 현황을 한눈에 확인하세요",
  welcomeDescription:
    "왼쪽 메뉴의 Edit Data에서 화면 내용을 직접 수정할 수 있습니다. 저장하면 바로 반영됩니다.",
  supportEmail: "hello@iotrust.kr",
  footer: "Built for fast launches on Vercel.",
  nav: [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/analytics", label: "Analytics" },
    { href: "/dashboard/activity", label: "Activity" },
    { href: "/dashboard/edit", label: "Edit Data" },
  ],
} as const;
