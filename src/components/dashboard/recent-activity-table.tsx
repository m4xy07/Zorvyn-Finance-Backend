import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AppRecord } from "@/types";

interface RecentActivityTableProps {
  records: AppRecord[];
}

export function RecentActivityTable({ records }: RecentActivityTableProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">Recent Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">Date</th>
              <th className="py-2">Category</th>
              <th className="py-2">Type</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[var(--muted)]">
                  No recent records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="text-[var(--text)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--surface-muted),transparent_55%)]"
                >
                  <td className="py-3">{formatDate(record.date)}</td>
                  <td className="py-3">{record.category}</td>
                  <td className="py-3">
                    <Badge variant={record.type === "income" ? "success" : "danger"}>
                      {record.type}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-medium">{formatCurrency(record.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
