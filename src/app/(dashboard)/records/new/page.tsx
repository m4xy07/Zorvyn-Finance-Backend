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
        <p className="eyebrow">Create</p>
        <h2 className="page-title">New Record</h2>
        <p className="page-subtitle">Add a new income or expense transaction.</p>
      </div>
      <RecordForm mode="create" />
    </div>
  );
}
