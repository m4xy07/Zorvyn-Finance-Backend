import { redirect } from "next/navigation";

import { RecordForm } from "@/components/records/record-form";
import { requirePageSession } from "@/lib/server-auth";

export default async function NewRecordPage() {
  const user = await requirePageSession();

  if (user.role !== "admin") {
    redirect("/records");
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">Create Record</h2>
        <p className="text-sm text-slate-400">Add a new income or expense transaction.</p>
      </div>
      <RecordForm mode="create" />
    </div>
  );
}

