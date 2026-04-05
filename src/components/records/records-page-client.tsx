"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { RecordsFiltersBar, type RecordFilters } from "@/components/records/records-filters-bar";
import { RecordsTable } from "@/components/records/records-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api-client";
import { AppRecord, PaginatedResult, UserRole } from "@/types";

interface RecordsPageClientProps {
  role: UserRole;
}

const defaultFilters: RecordFilters = {
  search: "",
  type: "",
  category: "",
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortOrder: "desc",
};

export function RecordsPageClient({ role }: RecordsPageClientProps) {
  const [filters, setFilters] = useState<RecordFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<AppRecord> | null>(null);
  const [loading, setLoading] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    params.set("sortBy", filters.sortBy);
    params.set("sortOrder", filters.sortOrder);

    if (filters.search) params.set("search", filters.search);
    if (filters.type) params.set("type", filters.type);
    if (filters.category) params.set("category", filters.category);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);

    return params.toString();
  }, [filters, page]);

  const loadRecords = async () => {
    setLoading(true);

    try {
      const data = await apiFetch<PaginatedResult<AppRecord>>(`/api/records?${queryString}`);
      setResult(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const handleDeleteFromState = (recordId: string) => {
    if (!result) return;

    setResult({
      ...result,
      items: result.items.filter((item) => item.id !== recordId),
      total: Math.max(result.total - 1, 0),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Records</p>
          <h2 className="page-title">Financial Records</h2>
          <p className="page-subtitle">Filter, inspect, and manage transactions.</p>
        </div>
        {role === "admin" ? (
          <Link href="/records/new">
            <Button>Create Record</Button>
          </Link>
        ) : null}
      </div>

      <RecordsFiltersBar
        value={filters}
        onChange={(value) => {
          setPage(1);
          setFilters(value);
        }}
        onReset={() => {
          setPage(1);
          setFilters(defaultFilters);
        }}
      />

      {loading && !result ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <Spinner />
        </div>
      ) : result ? (
        <>
          <RecordsTable records={result.items} role={role} onDelete={handleDeleteFromState} />

          <Card className="flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="text-xs text-[var(--muted)]">
              Page {result.page} of {result.totalPages} - {result.total} records
            </p>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1 || loading}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= result.totalPages || loading}
              >
                Next
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <p className="text-sm text-[var(--danger)]">Unable to load records.</p>
        </Card>
      )}
    </div>
  );
}
