"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { SessionUser } from "@/types";

interface MobileNavProps {
  user: SessionUser;
}

export function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 lg:hidden">
      {dashboardNavItems
        .filter((item) => !item.adminOnly || user.role === "admin")
        .map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg border px-3 py-2 text-center text-xs font-medium",
                active
                  ? "border-[color:color-mix(in_srgb,var(--accent),black_30%)] bg-[var(--accent-soft)] text-[color:color-mix(in_srgb,var(--accent),white_16%)]"
                  : "border-transparent bg-[var(--surface)] text-[var(--muted)]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}
