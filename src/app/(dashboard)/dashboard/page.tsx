import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { requirePageSession } from "@/lib/server-auth";

export default async function DashboardPage() {
  const user = await requirePageSession();

  return <DashboardOverview role={user.role} />;
}

