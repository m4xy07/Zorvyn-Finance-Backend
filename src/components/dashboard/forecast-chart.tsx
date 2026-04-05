"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card } from "@/components/ui/card";

interface ForecastPoint {
  label: string;
  projectedBalance: number;
}

interface ForecastChartProps {
  averageMonthlyNet: number;
  confidence: "high" | "medium" | "low";
  data: ForecastPoint[];
}

function confidenceTone(confidence: ForecastChartProps["confidence"]): string {
  if (confidence === "high") {
    return "text-emerald-300";
  }

  if (confidence === "medium") {
    return "text-sky-300";
  }

  return "text-amber-300";
}

export function ForecastChart({ averageMonthlyNet, confidence, data }: ForecastChartProps) {
  return (
    <Card className="h-[240px]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">3-Month Forecast</h3>
        <p className={`text-xs ${confidenceTone(confidence)}`}>{confidence} confidence</p>
      </div>

      <p className="mb-2 text-xs text-slate-400">
        Avg monthly net: {averageMonthlyNet >= 0 ? "+" : ""}
        {averageMonthlyNet.toFixed(0)}
      </p>

      <ResponsiveContainer width="100%" height="74%">
        <AreaChart data={data}>
          <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="projectedBalance"
            stroke="#818cf8"
            fill="rgba(129,140,248,0.25)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
