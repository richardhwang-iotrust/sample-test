"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type UserNavProps = {
  name: string;
  email: string;
  canSignOut: boolean;
};

export function UserNav({ name, email, canSignOut }: UserNavProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
        {name.slice(0, 1).toUpperCase()}
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
      </div>
      {canSignOut ? (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      ) : null}
    </div>
  );
}
