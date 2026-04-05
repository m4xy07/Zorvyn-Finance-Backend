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
    return "text-[var(--accent)]";
  }

  if (confidence === "medium") {
    return "text-[var(--info)]";
  }

  return "text-[var(--warning)]";
}

export function ForecastChart({ averageMonthlyNet, confidence, data }: ForecastChartProps) {
  return (
    <Card className="h-[250px]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">3-Month Forecast</h3>
        <p className={`text-xs capitalize ${confidenceTone(confidence)}`}>{confidence} confidence</p>
      </div>

      <p className="mb-2 text-xs text-[var(--muted)]">
        Avg monthly net: {averageMonthlyNet >= 0 ? "+" : ""}
        {averageMonthlyNet.toFixed(0)}
      </p>

      <ResponsiveContainer width="100%" height="74%">
        <AreaChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: 12,
              color: "var(--text)",
            }}
          />
          <Area
            type="monotone"
            dataKey="projectedBalance"
            stroke="var(--chart-net)"
            fill="color-mix(in_srgb,var(--chart-net),transparent 82%)"
            strokeWidth={2.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
