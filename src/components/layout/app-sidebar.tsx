"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { dashboardNavItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types";

interface AppSidebarProps {
  user: SessionUser;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[276px] shrink-0 border-r border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface),black_18%)] p-5 lg:block">
      <div className="sticky top-5 flex h-[calc(100vh-42px)] flex-col">
        <div className="mb-7 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Zorvyn</p>
              <p className="mt-1 text-base font-semibold text-[var(--text)]">Finance Ops</p>
            </div>
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-[var(--muted)]">
              {user.role}
            </span>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">Signed in as {user.name}</p>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-2 px-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--muted)]">
              General
            </p>
            <nav className="space-y-1.5">
              {dashboardNavItems
                .filter((item) => item.href === "/dashboard" || item.href === "/records")
                .map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition",
                        active
                          ? "border-[color:color-mix(in_srgb,var(--accent),black_26%)] bg-[var(--accent-soft)] text-[color:color-mix(in_srgb,var(--accent),white_16%)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent),black_30%)]"
                          : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
          </div>

          <div>
            <p className="mb-2 px-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--muted)]">
              Insights
            </p>
            <nav className="space-y-1.5">
              {dashboardNavItems
                .filter((item) => item.href === "/analytics")
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
                          ? "border-[color:color-mix(in_srgb,var(--accent),black_26%)] bg-[var(--accent-soft)] text-[color:color-mix(in_srgb,var(--accent),white_16%)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent),black_30%)]"
                          : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
          </div>

          {user.role === "admin" ? (
            <div>
              <p className="mb-2 px-2 text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--muted)]">
                Admin
              </p>
              <nav className="space-y-1.5">
                {dashboardNavItems
                  .filter((item) => item.href === "/users")
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
                            ? "border-[color:color-mix(in_srgb,var(--accent),black_26%)] bg-[var(--accent-soft)] text-[color:color-mix(in_srgb,var(--accent),white_16%)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent),black_30%)]"
                            : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
              </nav>
            </div>
          ) : null}
        </div>

        <div className="mt-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Appearance</p>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
