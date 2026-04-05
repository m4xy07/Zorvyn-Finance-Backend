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
        <h3 className="text-sm font-semibold text-[#1f241b]">Recent Activity</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e6e9df] text-left text-xs uppercase tracking-[0.12em] text-[#727969]">
              <th className="py-2">Date</th>
              <th className="py-2">Category</th>
              <th className="py-2">Type</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-[#747d6d]">
                  No recent records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-[#eef1e8] text-[#293022]">
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
