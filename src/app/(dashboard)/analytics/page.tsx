import { redirect } from "next/navigation";

import { AnalyticsPanel } from "@/components/dashboard/analytics-panel";
import { requirePageSession } from "@/lib/server-auth";

export default async function AnalyticsPage() {
  const user = await requirePageSession();

  if (user.role === "viewer") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Insights</p>
        <h2 className="page-title">Analytics</h2>
        <p className="page-subtitle">Deeper trend and category insights for analyst and admin roles.</p>
      </div>
      <AnalyticsPanel />
    </div>
  );
}
