import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  tone?: "income" | "expense" | "neutral";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  income: "text-[var(--accent)]",
  expense: "text-[var(--danger)]",
  neutral: "text-[var(--info)]",
};

export function StatCard({ label, value, tone = "neutral" }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="eyebrow">{label}</p>
      <p className={`mt-3 text-2xl font-semibold tracking-tight ${toneStyles[tone]}`}>
        {formatCurrency(value)}
      </p>
    </Card>
  );
}
