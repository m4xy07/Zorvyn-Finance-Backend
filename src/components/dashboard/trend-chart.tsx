"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";

interface TrendPoint {
  label: string;
  income: number;
  expense: number;
  net: number;
}

interface TrendChartProps {
  data: TrendPoint[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card className="h-[380px]">
      <h3 className="mb-4 text-sm font-semibold text-slate-200">Trend Overview</h3>
      <ResponsiveContainer width="100%" height="92%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.18)" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: 12,
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="net" stroke="#818cf8" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

