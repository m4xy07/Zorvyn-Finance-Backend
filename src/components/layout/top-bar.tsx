"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
      <div>
        <p className="eyebrow">Overview</p>
        <h1 className="mt-1 text-base font-semibold text-[#1d2218]">Finance Workspace</h1>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="info" className="capitalize">
          {user.role}
        </Badge>
        <Button variant="secondary" className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
