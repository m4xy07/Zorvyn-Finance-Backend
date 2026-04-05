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
    return "text-[#117a4c]";
  }

  if (confidence === "medium") {
    return "text-[#2a60ac]";
  }

  return "text-[#a46410]";
}

export function ForecastChart({ averageMonthlyNet, confidence, data }: ForecastChartProps) {
  return (
    <Card className="h-[240px]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1f241b]">3-Month Forecast</h3>
        <p className={`text-xs capitalize ${confidenceTone(confidence)}`}>{confidence} confidence</p>
      </div>

      <p className="mb-2 text-xs text-[#727a69]">
        Avg monthly net: {averageMonthlyNet >= 0 ? "+" : ""}
        {averageMonthlyNet.toFixed(0)}
      </p>

      <ResponsiveContainer width="100%" height="74%">
        <AreaChart data={data}>
          <XAxis dataKey="label" tick={{ fill: "#78806f", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#78806f", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #dde1d6",
              borderRadius: 14,
              color: "#1e2418",
            }}
          />
          <Area
            type="monotone"
            dataKey="projectedBalance"
            stroke="#2a60ac"
            fill="rgba(42,96,172,0.15)"
            strokeWidth={2.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
