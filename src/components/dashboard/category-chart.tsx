"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card } from "@/components/ui/card";

interface CategoryDatum {
  category: string;
  income: number;
  expense: number;
  totalVolume: number;
}

interface CategoryChartProps {
  data: CategoryDatum[];
}

const COLORS = [
  "var(--chart-income)",
  "var(--chart-net)",
  "var(--warning)",
  "var(--accent-strong)",
  "color-mix(in_srgb,var(--chart-net),var(--accent) 30%)",
  "var(--chart-expense)",
];

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="h-[300px]">
      <h3 className="text-sm font-semibold text-[var(--text)]">Category Split</h3>
      <p className="mt-1 text-xs text-[var(--muted)]">Volume distribution</p>

      <div className="mt-3 h-[82%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={100}
              dataKey="totalVolume"
              nameKey="category"
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: 12,
                color: "var(--text)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
