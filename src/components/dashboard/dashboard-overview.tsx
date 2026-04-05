"use client";

import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { AnomalyList } from "@/components/dashboard/anomaly-list";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { ForecastChart } from "@/components/dashboard/forecast-chart";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";
import { InsightFeed } from "@/components/dashboard/insight-feed";
import { RecentActivityTable } from "@/components/dashboard/recent-activity-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api-client";
import { DashboardSummary, UserRole } from "@/types";

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

interface DashboardOverviewProps {
  role: UserRole;
}

export function DashboardOverview({ role }: DashboardOverviewProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [categories, setCategories] = useState<CategoryDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"monthly" | "weekly">("monthly");

  const loadData = async () => {
    setLoading(true);

    try {
      const [summaryData, trendData, categoryData] = await Promise.all([
        apiFetch<DashboardSummary>("/api/dashboard/summary"),
        apiFetch<TrendPoint[]>(`/api/dashboard/trends?period=${period}`),
        apiFetch<CategoryDatum[]>("/api/dashboard/categories"),
      ]);

      setSummary(summaryData);
      setTrends(trendData);
      setCategories(categoryData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const canExport = role === "admin" || role === "analyst";

  const topCategories = useMemo(() => summary?.topCategories ?? [], [summary]);

  const handleExport = async () => {
    try {
      const response = await fetch("/api/analytics/export", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.message || "Export failed");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `finance-records-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success("CSV exported");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    }
  };

  if (loading && !summary) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <p className="text-sm text-[#af4343]">Dashboard data could not be loaded.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow">Performance</p>
        <h2 className="page-title">Financial Command Center</h2>
        <p className="page-subtitle">Live operational health, trends, and spending signals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Income" value={summary.totals.income} tone="income" />
        <StatCard label="Total Expenses" value={summary.totals.expense} tone="expense" />
        <StatCard label="Net Balance" value={summary.totals.netBalance} tone="neutral" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <HealthScoreCard
          score={summary.healthScore.score}
          grade={summary.healthScore.grade}
          savingsRate={summary.healthScore.savingsRate}
          burnRate={summary.healthScore.burnRate}
        />
        <ForecastChart
          averageMonthlyNet={summary.forecast.averageMonthlyNet}
          confidence={summary.forecast.confidence}
          data={summary.forecast.projectedBalances}
        />
        <InsightFeed insights={summary.insights} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-[0_1px_2px_rgba(17,24,39,0.05)]">
            <div className="inline-flex gap-2">
              <Button
                variant={period === "monthly" ? "primary" : "secondary"}
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={period === "weekly" ? "primary" : "secondary"}
                onClick={() => setPeriod("weekly")}
              >
                Weekly
              </Button>
            </div>

            {canExport ? (
              <Button variant="secondary" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            ) : null}
          </div>

          <TrendChart data={trends} />
          <RecentActivityTable records={summary.recentActivity} />
        </div>

        <div className="space-y-4">
          <CategoryChart data={categories.slice(0, 8)} />

          <Card>
            <h3 className="mb-3 text-sm font-semibold text-[#1f241b]">Top Categories</h3>
            <div className="space-y-2.5">
              {topCategories.length === 0 ? (
                <p className="text-sm text-[#747d6d]">No categories yet.</p>
              ) : (
                topCategories.map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-sm">
                    <span className="text-[#4f5748]">{item.category}</span>
                    <span className="font-medium text-[#2a60ac]">${item.volume.toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <AnomalyList anomalies={summary.anomalies} />
        </div>
      </div>
    </div>
  );
}
