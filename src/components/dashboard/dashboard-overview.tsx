"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Download } from "lucide-react";
import { toast } from "sonner";

import { AnomalyList } from "@/components/dashboard/anomaly-list";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { ForecastChart } from "@/components/dashboard/forecast-chart";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";
import { InsightFeed } from "@/components/dashboard/insight-feed";
import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { StatCard } from "@/components/dashboard/stat-card";
import { TopCategoriesCard } from "@/components/dashboard/top-categories-card";
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
        <p className="text-sm text-[var(--danger)]">Dashboard data could not be loaded.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Overview</p>
          <h2 className="page-title">Financial Performance</h2>
          <p className="page-subtitle">Snapshot of KPI, cashflow, and behavioral alerts.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--muted)]">
            <CalendarDays className="h-4 w-4" />
            Last 30 days
          </span>
          {canExport ? (
            <Button variant="secondary" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="USD Balance" value={summary.totals.income} tone="income" />
        <StatCard label="Expense Outflow" value={summary.totals.expense} tone="expense" />
        <StatCard label="Net Position" value={summary.totals.netBalance} tone="neutral" />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
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
          </div>

          <TrendChart data={trends} />
        </div>

        <div className="xl:col-span-4">
          <RecentActivityFeed records={summary.recentActivity} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <CategoryChart data={categories.slice(0, 8)} />
        </div>
        <div className="xl:col-span-4">
          <InsightFeed insights={summary.insights} />
        </div>
        <div className="xl:col-span-4">
          <AnomalyList anomalies={summary.anomalies} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <HealthScoreCard
            score={summary.healthScore.score}
            grade={summary.healthScore.grade}
            savingsRate={summary.healthScore.savingsRate}
            burnRate={summary.healthScore.burnRate}
          />
        </div>

        <div className="xl:col-span-4">
          <ForecastChart
            averageMonthlyNet={summary.forecast.averageMonthlyNet}
            confidence={summary.forecast.confidence}
            data={summary.forecast.projectedBalances}
          />
        </div>

        <div className="xl:col-span-4">
          <TopCategoriesCard categories={summary.topCategories} />
        </div>
      </div>
    </div>
  );
}
