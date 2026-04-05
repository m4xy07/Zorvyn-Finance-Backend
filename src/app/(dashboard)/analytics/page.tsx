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
        <h2 className="text-xl font-semibold text-slate-100">Analytics</h2>
        <p className="text-sm text-slate-400">
          Deeper trend and category insights for analyst and admin roles.
        </p>
      </div>
      <AnalyticsPanel />
    </div>
  );
}

