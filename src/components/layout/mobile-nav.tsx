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
    <nav className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
      {dashboardNavItems
        .filter((item) => !item.adminOnly || user.role === "admin")
        .map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl border px-3 py-2 text-center text-xs font-medium",
                active
                  ? "border-[#c7d8ef] bg-[#e9f0fb] text-[#285ea9]"
                  : "border-[var(--border)] bg-white text-[#545d4c]",
              )}
            >
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}
