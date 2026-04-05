import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppError } from "@/lib/errors";
import { requirePageSession } from "@/lib/server-auth";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getRecordById } from "@/services/record.service";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecordDetailPage({ params }: PageProps) {
  const user = await requirePageSession();
  const { id } = await params;
  const record = await getRecordById(id).catch((error: unknown) => {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }

    throw error;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Record</p>
          <h2 className="page-title">Record Detail</h2>
          <p className="page-subtitle">View transaction details and metadata.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/records">
            <Button variant="secondary">Back</Button>
          </Link>
          {user.role === "admin" ? (
            <Link href={`/records/${id}/edit`}>
              <Button>Edit</Button>
            </Link>
          ) : null}
        </div>
      </div>

      <Card className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--muted)]">Type</p>
          <Badge variant={record.type === "income" ? "success" : "danger"}>{record.type}</Badge>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          <p className="text-sm text-[var(--muted)]">Category</p>
          <p className="font-medium text-[var(--text)]">{record.category}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          <p className="text-sm text-[var(--muted)]">Amount</p>
          <p className="font-semibold text-[var(--info)]">{formatCurrency(record.amount)}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-3">
          <p className="text-sm text-[var(--muted)]">Date</p>
          <p className="text-[var(--text)]">{formatDate(record.date)}</p>
        </div>
        <div className="border-t border-[var(--border)] pt-3">
          <p className="mb-2 text-sm text-[var(--muted)]">Notes</p>
          <p className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-sm text-[var(--text)]">
            {record.notes || "-"}
          </p>
        </div>
      </Card>
    </div>
  );
}
