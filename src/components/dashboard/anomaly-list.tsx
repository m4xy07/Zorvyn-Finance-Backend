import { Card } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Anomaly {
  id: string;
  date: string;
  category: string;
  amount: number;
  expected: number;
  deviationPct: number;
}

interface AnomalyListProps {
  anomalies: Anomaly[];
}

export function AnomalyList({ anomalies }: AnomalyListProps) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-[#1f241b]">Anomaly Watch</h3>

      <div className="space-y-2">
        {anomalies.length === 0 ? (
          <p className="text-sm text-[#717969]">No unusual expenses detected recently.</p>
        ) : (
          anomalies.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#f0d0d0] bg-[#fff6f6] p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#272d21]">{item.category}</p>
                <p className="text-xs text-[#af4343]">+{item.deviationPct.toFixed(0)}%</p>
              </div>
              <p className="mt-1 text-xs text-[#727a69]">{formatDate(item.date)}</p>
              <p className="mt-1 text-xs text-[#525a4b]">
                {formatCurrency(item.amount)} vs expected {formatCurrency(item.expected)}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
