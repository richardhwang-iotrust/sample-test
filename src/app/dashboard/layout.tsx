import { redirect } from "next/navigation";
import { auth, isAuthConfigured } from "@/auth";
import { Header } from "@/components/layout/header";
import { SidebarShell } from "@/components/layout/sidebar-shell";
import { siteConfig } from "@/config/site.config";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const session = isAuthConfigured ? await auth() : null;

  if (isAuthConfigured && !session) {
    redirect("/login");
  }

  const user = {
    name: session?.user?.name ?? "Demo Operator",
    email: session?.user?.email ?? siteConfig.supportEmail,
  };

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <SidebarShell />
        </div>
        <section className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-700 dark:bg-gray-800">
          <Header
            title={siteConfig.welcomeTitle}
            description={siteConfig.welcomeDescription}
            user={user}
            canSignOut={Boolean(session)}
          />
          {children}
        </section>
      </div>
    </main>
  );
}
