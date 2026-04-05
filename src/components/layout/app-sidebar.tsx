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
    <aside className="hidden w-[254px] shrink-0 border-r border-[#dde2d6] bg-[#eef1e8]/82 p-5 lg:block">
      <div className="sticky top-5">
        <div className="mb-8 rounded-2xl border border-[#d9ded1] bg-white p-4 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
          <p className="eyebrow">Zorvyn Finance</p>
          <p className="mt-2 text-sm font-semibold text-[#1c2218]">{user.name}</p>
          <p className="mt-0.5 text-xs text-[#6a725f]">{user.role}</p>
        </div>

        <nav className="space-y-1.5">
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
                    "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition",
                    active
                      ? "border-[#c7d8ef] bg-[#e9f0fb] text-[#254f88]"
                      : "border-transparent text-[#4f5748] hover:border-[#d9ded1] hover:bg-white/70",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </div>
    </aside>
  );
}
