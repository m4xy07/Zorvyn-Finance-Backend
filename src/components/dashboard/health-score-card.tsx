import { Card } from "@/components/ui/card";

interface HealthScoreCardProps {
  score: number;
  grade: string;
  savingsRate: number;
  burnRate: number;
}

function scoreTone(score: number): string {
  if (score >= 85) {
    return "text-[#117a4c]";
  }

  if (score >= 70) {
    return "text-[#2a60ac]";
  }

  if (score >= 55) {
    return "text-[#b06812]";
  }

  return "text-[#b13f3f]";
}

export function HealthScoreCard({ score, grade, savingsRate, burnRate }: HealthScoreCardProps) {
  const width = `${Math.min(Math.max(score, 0), 100)}%`;

  return (
    <Card>
      <p className="eyebrow">Financial Health</p>
      <div className="mt-3 flex items-end justify-between">
        <p className={`text-3xl font-bold ${scoreTone(score)}`}>{score}</p>
        <p className="rounded-lg bg-[#eef3fc] px-2.5 py-1 text-xs font-semibold text-[#2a60ac]">
          Grade {grade}
        </p>
      </div>

      <div className="mt-3 h-2 rounded-full bg-[#ecefe6]">
        <div className="h-2 rounded-full bg-[#2a60ac]" style={{ width }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg bg-[#f7f8f4] p-2.5">
          <p className="text-[#727969]">Savings rate</p>
          <p className="mt-1 font-semibold text-[#1f2619]">{(savingsRate * 100).toFixed(1)}%</p>
        </div>
        <div className="rounded-lg bg-[#f7f8f4] p-2.5">
          <p className="text-[#727969]">Burn ratio</p>
          <p className="mt-1 font-semibold text-[#1f2619]">{burnRate.toFixed(2)}x</p>
        </div>
      </div>
    </Card>
  );
}
