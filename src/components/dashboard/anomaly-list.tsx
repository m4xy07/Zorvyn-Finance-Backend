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
      <h3 className="text-sm font-semibold text-[var(--text)]">Anomaly Watch</h3>

      <div className="mt-3 space-y-2">
        {anomalies.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No unusual expenses detected recently.</p>
        ) : (
          anomalies.map((item) => (
            <div key={item.id} className="rounded-xl border border-[var(--danger)] bg-[var(--danger-soft)] p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text)]">{item.category}</p>
                <p className="text-xs text-[var(--danger)]">+{item.deviationPct.toFixed(0)}%</p>
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">{formatDate(item.date)}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {formatCurrency(item.amount)} vs expected {formatCurrency(item.expected)}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
