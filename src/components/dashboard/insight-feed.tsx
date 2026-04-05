import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";

interface Insight {
  title: string;
  value: string;
  tone: "positive" | "neutral" | "warning";
}

interface InsightFeedProps {
  insights: Insight[];
}

function toneIcon(tone: Insight["tone"]) {
  if (tone === "positive") {
    return TrendingUp;
  }

  if (tone === "warning") {
    return AlertTriangle;
  }

  return Sparkles;
}

function toneText(tone: Insight["tone"]): string {
  if (tone === "positive") {
    return "text-[#117a4c]";
  }

  if (tone === "warning") {
    return "text-[#a46410]";
  }

  return "text-[#2a60ac]";
}

export function InsightFeed({ insights }: InsightFeedProps) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-[#1f241b]">Smart Insights</h3>
      <div className="space-y-2">
        {insights.length === 0 ? (
          <p className="text-sm text-[#717969]">No insights available yet.</p>
        ) : (
          insights.map((insight) => {
            const Icon = toneIcon(insight.tone);

            return (
              <div key={insight.title} className="rounded-xl border border-[#e4e8dd] bg-[#f8f9f5] p-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${toneText(insight.tone)}`} />
                  <p className="text-xs text-[#727a69]">{insight.title}</p>
                </div>
                <p className={`mt-1 text-sm font-medium ${toneText(insight.tone)}`}>{insight.value}</p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
