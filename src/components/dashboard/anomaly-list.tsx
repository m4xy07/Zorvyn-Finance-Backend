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
      <h3 className="mb-3 text-sm font-semibold text-slate-100">Anomaly Watch</h3>

      <div className="space-y-2">
        {anomalies.length === 0 ? (
          <p className="text-sm text-slate-400">No unusual expenses detected recently.</p>
        ) : (
          anomalies.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-200">{item.category}</p>
                <p className="text-xs text-rose-300">+{item.deviationPct.toFixed(0)}%</p>
              </div>
              <p className="mt-1 text-xs text-slate-400">{formatDate(item.date)}</p>
              <p className="mt-1 text-xs text-slate-300">
                {formatCurrency(item.amount)} vs expected {formatCurrency(item.expected)}
              </p>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
