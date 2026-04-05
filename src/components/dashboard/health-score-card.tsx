import { Card } from "@/components/ui/card";

interface HealthScoreCardProps {
  score: number;
  grade: string;
  savingsRate: number;
  burnRate: number;
}

function scoreTone(score: number): string {
  if (score >= 85) {
    return "text-[var(--accent)]";
  }

  if (score >= 70) {
    return "text-[var(--info)]";
  }

  if (score >= 55) {
    return "text-[var(--warning)]";
  }

  return "text-[var(--danger)]";
}

export function HealthScoreCard({ score, grade, savingsRate, burnRate }: HealthScoreCardProps) {
  const width = `${Math.min(Math.max(score, 0), 100)}%`;

  return (
    <Card>
      <p className="eyebrow">Financial Health</p>
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-3xl font-bold ${scoreTone(score)}`}>{score}</p>
        <p className="rounded-lg border border-[var(--border)] bg-[var(--success-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
          Grade {grade}
        </p>
      </div>

      <div className="mt-3 h-2 rounded-full bg-[var(--surface-muted)]">
        <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          <p className="text-[var(--muted)]">Savings rate</p>
          <p className="mt-1 font-semibold text-[var(--text)]">{(savingsRate * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-2.5">
          <p className="text-[var(--muted)]">Burn ratio</p>
          <p className="mt-1 font-semibold text-[var(--text)]">{burnRate.toFixed(2)}x</p>
        </div>
      </div>
    </Card>
  );
}
