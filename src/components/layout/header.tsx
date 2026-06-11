import { ThemeToggle } from "./theme-toggle";
import { UserNav } from "./user-nav";

type HeaderProps = {
  title: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
  canSignOut: boolean;
};

export function Header({ title, description, user, canSignOut }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Dashboard</p>
        <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <ThemeToggle />
        <UserNav name={user.name} email={user.email} canSignOut={canSignOut} />
      </div>
    </header>
  );
}
