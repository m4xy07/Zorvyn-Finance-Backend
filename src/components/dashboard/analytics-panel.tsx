"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { CategoryChart } from "@/components/dashboard/category-chart";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api-client";

interface TrendPoint {
  label: string;
  income: number;
  expense: number;
  net: number;
}

interface CategoryDatum {
  category: string;
  income: number;
  expense: number;
  totalVolume: number;
}

export function AnalyticsPanel() {
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [categories, setCategories] = useState<CategoryDatum[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [trendData, categoryData] = await Promise.all([
          apiFetch<TrendPoint[]>(`/api/dashboard/trends?period=${period}`),
          apiFetch<CategoryDatum[]>("/api/dashboard/categories"),
        ]);

        setTrends(trendData);
        setCategories(categoryData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [period]);

  const handleExport = async () => {
    try {
      const response = await fetch("/api/analytics/export", {
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || "Export failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-export-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Exported successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
        <div className="inline-flex gap-2">
          <Button variant={period === "monthly" ? "primary" : "secondary"} onClick={() => setPeriod("monthly")}>
            Monthly Trends
          </Button>
          <Button variant={period === "weekly" ? "primary" : "secondary"} onClick={() => setPeriod("weekly")}>
            Weekly Trends
          </Button>
        </div>

        <Button variant="secondary" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TrendChart data={trends} />
        <CategoryChart data={categories} />
      </div>

      <Card>
        <h3 className="mb-4 text-sm font-semibold text-[#1f241b]">Category Performance</h3>
        <div className="space-y-2 text-sm">
          {categories.length === 0 ? (
            <p className="text-[#727a69]">No category analytics available.</p>
          ) : (
            categories.map((item) => (
              <div key={item.category} className="flex items-center justify-between border-b border-[#ecefe7] py-2">
                <span className="text-[#4e5648]">{item.category}</span>
                <span className="font-medium text-[#2a60ac]">${item.totalVolume.toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
