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

const COLORS = ["#2a60ac", "#1a8e5a", "#d67830", "#5574a6", "#8a60ca", "#cc5145"];

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="h-[380px]">
      <h3 className="text-sm font-semibold text-[#1f241b]">Category Distribution</h3>
      <p className="mt-1 text-xs text-[#6f7768]">Spending and earning mix across categories</p>

      <div className="mt-4 h-[84%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={66}
              outerRadius={116}
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
                backgroundColor: "#ffffff",
                border: "1px solid #dde1d6",
                borderRadius: 14,
                color: "#1e2418",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
