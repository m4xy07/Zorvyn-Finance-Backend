import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  tone?: "income" | "expense" | "neutral";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  income: "text-emerald-300",
  expense: "text-rose-300",
  neutral: "text-indigo-200",
};

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${toneStyles[tone]}`}>{formatCurrency(value)}</p>
    </Card>
  );
}

