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
    <div className="min-h-screen p-2 sm:p-4 lg:p-5">
      <div className="app-shell mx-auto max-w-[1550px] overflow-hidden rounded-[30px]">
        <div className="flex min-h-[calc(100vh-1rem)]">
          <AppSidebar user={user} />

          <div className="flex min-h-screen flex-1 flex-col p-3 sm:p-5 lg:p-6">
            <TopBar user={user} />
            <MobileNav user={user} />

            <motion.main
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mt-4 flex-1 rounded-2xl border border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface),black_8%)] p-4 sm:p-5"
            >
              {children}
            </motion.main>
          </div>
        </div>
      </div>
    </div>
  );
}
