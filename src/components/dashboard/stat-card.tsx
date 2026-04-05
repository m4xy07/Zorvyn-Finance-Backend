import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  tone?: "income" | "expense" | "neutral";
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  income: "text-[#117a4c]",
  expense: "text-[#b13f3f]",
  neutral: "text-[#264f89]",
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
