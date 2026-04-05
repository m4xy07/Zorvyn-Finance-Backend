import { Card } from "@/components/ui/card";

interface HealthScoreCardProps {
  score: number;
  grade: string;
  savingsRate: number;
  burnRate: number;
}

function scoreTone(score: number): string {
  if (score >= 85) {
    return "text-emerald-300";
  }

  if (score >= 70) {
    return "text-sky-300";
  }

  if (score >= 55) {
    return "text-amber-300";
  }

  return "text-rose-300";
}

export function HealthScoreCard({ score, grade, savingsRate, burnRate }: HealthScoreCardProps) {
  const width = `${Math.min(Math.max(score, 0), 100)}%`;

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Financial Health</p>
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-3xl font-bold ${scoreTone(score)}`}>{score}</p>
        <p className="rounded-lg bg-indigo-500/20 px-2 py-1 text-xs font-semibold text-indigo-200">
          Grade {grade}
        </p>
      </div>

      <div className="mt-3 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-indigo-400" style={{ width }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-slate-950/50 p-2">
          <p className="text-slate-400">Savings rate</p>
          <p className="mt-1 font-semibold text-slate-100">{(savingsRate * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-lg bg-slate-950/50 p-2">
          <p className="text-slate-400">Burn ratio</p>
          <p className="mt-1 font-semibold text-slate-100">{burnRate.toFixed(2)}x</p>
        </div>
      </div>
    </Card>
  );
}
