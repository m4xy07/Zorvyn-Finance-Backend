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

const COLORS = ["#818cf8", "#22d3ee", "#34d399", "#f59e0b", "#f97316", "#fb7185"];

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="h-[380px]">
      <h3 className="mb-4 text-sm font-semibold text-slate-200">Category Distribution</h3>
      <ResponsiveContainer width="100%" height="92%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={112}
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
              backgroundColor: "#0f172a",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

