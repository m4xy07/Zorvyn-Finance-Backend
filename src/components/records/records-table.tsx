"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AppRecord, UserRole } from "@/types";

interface RecordsTableProps {
  records: AppRecord[];
  role: UserRole;
  onDelete: (recordId: string) => void;
}

export function RecordsTable({ records, role, onDelete }: RecordsTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<AppRecord | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setLoadingDelete(true);

    try {
      const response = await fetch(`/api/records/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Failed to delete record");
      }

      toast.success("Record deleted");
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete record");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="data-table w-full min-w-[760px] text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[var(--muted)]">
                  No records found for the current filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="text-[var(--text)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--surface-muted),transparent_55%)]"
                >
                  <td className="px-4 py-3">{formatDate(record.date)}</td>
                  <td className="px-4 py-3">{record.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant={record.type === "income" ? "success" : "danger"}>
                      {record.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(record.amount)}</td>
                  <td className="max-w-[260px] truncate px-4 py-3 text-[var(--muted)]">{record.notes || "-"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <Link href={`/records/${record.id}`}>
                        <Button variant="ghost" className="h-8 px-3 text-xs">
                          View
                        </Button>
                      </Link>
                      {role === "admin" ? (
                        <>
                          <Link href={`/records/${record.id}/edit`}>
                            <Button variant="secondary" className="h-8 px-3 text-xs">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            className="h-8 px-3 text-xs"
                            onClick={() => setDeleteTarget(record)}
                          >
                            Delete
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete record"
        description="This will soft delete the record and remove it from default views. Continue?"
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={loadingDelete}
      />
    </>
  );
}
