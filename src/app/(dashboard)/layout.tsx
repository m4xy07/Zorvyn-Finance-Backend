import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requirePageSession } from "@/lib/server-auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requirePageSession();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}

