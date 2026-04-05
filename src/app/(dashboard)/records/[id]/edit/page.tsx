import { notFound, redirect } from "next/navigation";

import { RecordForm } from "@/components/records/record-form";
import { AppError } from "@/lib/errors";
import { requirePageSession } from "@/lib/server-auth";
import { getRecordById } from "@/services/record.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRecordPage({ params }: PageProps) {
  const user = await requirePageSession();
  if (user.role !== "admin") {
    redirect("/records");
  }

  const { id } = await params;
  const record = await getRecordById(id).catch((error: unknown) => {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }

    throw error;
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Edit</p>
        <h2 className="page-title">Edit Record</h2>
        <p className="page-subtitle">Update transaction details.</p>
      </div>

      <RecordForm
        mode="edit"
        recordId={record.id}
        initialValues={{
          amount: String(record.amount),
          type: record.type,
          category: record.category,
          date: new Date(record.date).toISOString().slice(0, 10),
          notes: record.notes,
        }}
      />
    </div>
  );
}
