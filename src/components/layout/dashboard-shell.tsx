"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TopBar } from "@/components/layout/top-bar";
import { SessionUser } from "@/types";

interface DashboardShellProps {
  user: SessionUser;
  children: ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="relative flex min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_top_right,rgba(79,70,229,0.12),transparent_40%),#030712] text-slate-100">
      <AppSidebar user={user} />

      <div className="flex min-h-screen flex-1 flex-col p-4 sm:p-6">
        <TopBar user={user} />
        <MobileNav user={user} />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-4 flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

