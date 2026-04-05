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
      <h3 className="text-sm font-semibold text-[#1f241b]">Trend Overview</h3>
      <p className="mt-1 text-xs text-[#6f7768]">Income, expense, and net movement over time</p>

      <div className="mt-4 h-[84%]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(124,133,114,0.2)" strokeDasharray="4 4" />
            <XAxis dataKey="label" tick={{ fill: "#7a8172", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#7a8172", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #dde1d6",
                borderRadius: 14,
                color: "#1e2418",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="income" stroke="#158a55" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="expense" stroke="#bf4747" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="net" stroke="#2a60ac" strokeWidth={2.6} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
