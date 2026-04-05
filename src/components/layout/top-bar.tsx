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
    <header className="flex items-center justify-between rounded-2xl border border-indigo-400/15 bg-slate-900/50 px-4 py-3">
      <div>
        <h1 className="text-base font-semibold text-slate-100">Finance Dashboard</h1>
        <p className="text-xs text-slate-400">Operational insights and financial records</p>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="info">{user.role}</Badge>
        <Button variant="secondary" className="gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

