import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AppRecord } from "@/types";

interface RecentActivityFeedProps {
  records: AppRecord[];
}

export function RecentActivityFeed({ records }: RecentActivityFeedProps) {
  return (
    <Card className="h-[390px]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">Recent Activity</h3>
        <Badge variant="neutral">This Week</Badge>
      </div>

      <div className="space-y-2">
        {records.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No recent records.</p>
        ) : (
          records.slice(0, 7).map((record) => (
            <div
              key={record.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{record.category}</p>
                  <p className="mt-0.5 text-xs text-[var(--muted)]">{formatDate(record.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[var(--text)]">{formatCurrency(record.amount)}</p>
                  <Badge variant={record.type === "income" ? "success" : "danger"} className="mt-1">
                    {record.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
