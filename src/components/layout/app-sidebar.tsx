"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types";

interface AppSidebarProps {
  user: SessionUser;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-indigo-400/15 bg-slate-950/80 p-5 lg:block">
      <div className="mb-8 rounded-2xl border border-indigo-400/20 bg-slate-900/80 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-indigo-300/70">Zorvyn Finance</p>
        <p className="mt-2 text-sm text-slate-200">{user.name}</p>
        <p className="text-xs text-slate-400">{user.role}</p>
      </div>

      <nav className="space-y-2">
        {dashboardNavItems
          .filter((item) => !item.adminOnly || user.role === "admin")
          .map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-indigo-500/20 text-indigo-100"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-100",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}

