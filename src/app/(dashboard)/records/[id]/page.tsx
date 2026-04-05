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
          <p className="text-sm text-[#5c6456]">Type</p>
          <Badge variant={record.type === "income" ? "success" : "danger"}>{record.type}</Badge>
        </div>
        <div className="flex items-center justify-between border-t border-[#ecefe7] pt-3">
          <p className="text-sm text-[#5c6456]">Category</p>
          <p className="font-medium text-[#20261a]">{record.category}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[#ecefe7] pt-3">
          <p className="text-sm text-[#5c6456]">Amount</p>
          <p className="font-semibold text-[#2a60ac]">{formatCurrency(record.amount)}</p>
        </div>
        <div className="flex items-center justify-between border-t border-[#ecefe7] pt-3">
          <p className="text-sm text-[#5c6456]">Date</p>
          <p className="text-[#20261a]">{formatDate(record.date)}</p>
        </div>
        <div className="border-t border-[#ecefe7] pt-3">
          <p className="mb-2 text-sm text-[#5c6456]">Notes</p>
          <p className="rounded-xl border border-[#ecefe7] bg-[#f7f8f4] p-3 text-sm text-[#2f3728]">
            {record.notes || "-"}
          </p>
        </div>
      </Card>
    </div>
  );
}
