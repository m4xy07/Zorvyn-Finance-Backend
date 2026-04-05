"use client";

import { useRouter } from "next/navigation";
import { Bell, CalendarClock, LogOut, Search } from "lucide-react";
import { toast } from "sonner";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SessionUser } from "@/types";

interface TopBarProps {
  user: SessionUser;
}

export function TopBar({ user }: TopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to log out");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Logout failed");
    }
  };

  return (
    <header className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[200px]">
          <p className="eyebrow">Dashboards / Default</p>
          <h1 className="mt-1 text-base font-semibold text-[var(--text)]">Finance Command Center</h1>
        </div>

        <div className="relative min-w-[250px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <Input className="h-10 rounded-full pl-9" placeholder="Search records, categories, users" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs text-[var(--muted)] xl:inline-flex">
            <CalendarClock className="h-3.5 w-3.5" />
            Last 30 days
          </span>
          <ThemeToggle />
          <Button variant="ghost" className="h-9 w-9 px-0">
            <Bell className="h-4 w-4" />
          </Button>
          <Badge variant="info" className="capitalize">
            {user.role}
          </Badge>
          <Button variant="secondary" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
