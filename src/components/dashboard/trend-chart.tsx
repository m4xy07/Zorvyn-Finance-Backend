"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
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
    <Card className="h-[390px]">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Cashflow</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">Trend across selected period</p>
        </div>
      </div>

      <div className="h-[82%]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(151,168,152,0.16)" strokeDasharray="4 4" />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <ReferenceLine y={0} stroke="rgba(143,157,144,0.4)" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: 12,
                color: "var(--text)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: "var(--muted)" }} />
            <Line type="monotone" dataKey="income" stroke="var(--chart-income)" strokeWidth={2.3} dot={false} />
            <Line type="monotone" dataKey="expense" stroke="var(--chart-expense)" strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="net" stroke="var(--chart-net)" strokeWidth={2.3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
