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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Record Detail</h2>
          <p className="text-sm text-slate-400">View transaction details and metadata.</p>
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
          <p className="text-sm text-slate-300">Type</p>
          <Badge variant={record.type === "income" ? "success" : "danger"}>{record.type}</Badge>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <p className="text-sm text-slate-300">Category</p>
          <p className="font-medium text-slate-100">{record.category}</p>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <p className="text-sm text-slate-300">Amount</p>
          <p className="font-semibold text-indigo-200">{formatCurrency(record.amount)}</p>
        </div>
        <div className="flex items-center justify-between border-t border-slate-800 pt-3">
          <p className="text-sm text-slate-300">Date</p>
          <p className="text-slate-100">{formatDate(record.date)}</p>
        </div>
        <div className="border-t border-slate-800 pt-3">
          <p className="mb-2 text-sm text-slate-300">Notes</p>
          <p className="rounded-xl bg-slate-950/60 p-3 text-sm text-slate-200">{record.notes || "-"}</p>
        </div>
      </Card>
    </div>
  );
}

