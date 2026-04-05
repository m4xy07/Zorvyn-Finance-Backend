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
    <div className="relative flex min-h-screen bg-transparent text-[var(--text)]">
      <AppSidebar user={user} />

      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-1 flex-col p-4 sm:p-6">
        <TopBar user={user} />
        <MobileNav user={user} />

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="mt-4 flex-1"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
