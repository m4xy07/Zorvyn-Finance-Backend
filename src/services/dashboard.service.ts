import { addMonths, format } from "date-fns";
import { PipelineStage } from "mongoose";

import { connectToDatabase } from "@/lib/db";
import { FinancialRecordModel } from "@/models/FinancialRecord";

interface TrendInput {
  period: "monthly" | "weekly";
}

interface RecentInput {
  limit?: number;
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length <= 1) {
    return 0;
  }

  const mean = average(values);
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export async function getDashboardSummary() {
  await connectToDatabase();

  const last30Days = daysAgo(30);
  const previous30Days = daysAgo(60);
  const last45Days = daysAgo(45);
  const baselineStart = daysAgo(225);
  const sixMonthStart = daysAgo(185);

  const [
    totalsByType,
    categoryTotals,
    recentRecords,
    topCategories,
    current30Totals,
    previous30Expense,
    topExpenseCategory30,
    anomalyBaseline,
    recentExpenseRecords,
    monthlyNetSeries,
  ] = await Promise.all([
    FinancialRecordModel.aggregate<{
      _id: "income" | "expense";
      total: number;
    }>([
      { $match: { softDeleted: false } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    FinancialRecordModel.aggregate<{
      category: string;
      income: number;
      expense: number;
      net: number;
    }>([
      { $match: { softDeleted: false } },
      {
        $group: {
          _id: "$category",
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] },
        },
      },
      { $sort: { net: -1 } },
    ]),
    FinancialRecordModel.find({ softDeleted: false })
      .sort({ date: -1, createdAt: -1 })
      .limit(8)
      .populate("createdBy", "name role"),
    FinancialRecordModel.aggregate<{
      category: string;
      volume: number;
      count: number;
    }>([
      { $match: { softDeleted: false } },
      {
        $group: {
          _id: "$category",
          volume: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          volume: 1,
          count: 1,
        },
      },
      { $sort: { volume: -1 } },
      { $limit: 6 },
    ]),
    FinancialRecordModel.aggregate<{
      _id: "income" | "expense";
      total: number;
    }>([
      {
        $match: {
          softDeleted: false,
          date: { $gte: last30Days },
        },
      },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]),
    FinancialRecordModel.aggregate<{
      total: number;
    }>([
      {
        $match: {
          softDeleted: false,
          type: "expense",
          date: { $gte: previous30Days, $lt: last30Days },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
      { $project: { _id: 0, total: 1 } },
    ]),
    FinancialRecordModel.aggregate<{
      category: string;
      total: number;
    }>([
      {
        $match: {
          softDeleted: false,
          type: "expense",
          date: { $gte: last30Days },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]),
    FinancialRecordModel.aggregate<{
      category: string;
      avgAmount: number;
      stdDev: number;
      sampleCount: number;
    }>([
      {
        $match: {
          softDeleted: false,
          type: "expense",
          date: { $gte: baselineStart, $lt: last45Days },
        },
      },
      {
        $group: {
          _id: "$category",
          avgAmount: { $avg: "$amount" },
          stdDev: { $stdDevPop: "$amount" },
          sampleCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          avgAmount: 1,
          stdDev: 1,
          sampleCount: 1,
        },
      },
    ]),
    FinancialRecordModel.find({
      softDeleted: false,
      type: "expense",
      date: { $gte: last45Days },
    })
      .sort({ date: -1, createdAt: -1 })
      .limit(150),
    FinancialRecordModel.aggregate<{
      year: number;
      month: number;
      income: number;
      expense: number;
      net: number;
    }>([
      {
        $match: {
          softDeleted: false,
          date: { $gte: sixMonthStart },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          income: 1,
          expense: 1,
          net: { $subtract: ["$income", "$expense"] },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]),
  ]);

  const income = totalsByType.find((item) => item._id === "income")?.total ?? 0;
  const expense = totalsByType.find((item) => item._id === "expense")?.total ?? 0;
  const netBalance = income - expense;

  const current30Income = current30Totals.find((item) => item._id === "income")?.total ?? 0;
  const current30Expense = current30Totals.find((item) => item._id === "expense")?.total ?? 0;
  const previousExpense = previous30Expense[0]?.total ?? 0;

  const savingsRate =
    current30Income > 0 ? (current30Income - current30Expense) / current30Income : 0;
  const burnRate = current30Income > 0 ? current30Expense / current30Income : current30Expense > 0 ? 1 : 0;
  const expenseChangePct =
    previousExpense > 0
      ? ((current30Expense - previousExpense) / previousExpense) * 100
      : current30Expense > 0
        ? 100
        : 0;

  const topExpenseCategory = topExpenseCategory30[0];
  const topExpenseCategoryShare =
    current30Expense > 0 && topExpenseCategory ? topExpenseCategory.total / current30Expense : 0;

  const savingsPoints = clamp(((savingsRate + 0.15) / 0.55) * 55, 0, 55);
  const burnPoints = clamp((1 - Math.min(burnRate, 1.5) / 1.5) * 20, 0, 20);
  const concentrationPoints = clamp((1 - topExpenseCategoryShare) * 15, 0, 15);
  const trendPoints = expenseChangePct <= 0 ? 10 : clamp(10 - expenseChangePct / 5, 0, 10);
  const score = Math.round(savingsPoints + burnPoints + concentrationPoints + trendPoints);

  const grade = score >= 85 ? "A" : score >= 70 ? "B" : score >= 55 ? "C" : "D";

  const monthlyNets = monthlyNetSeries.map((entry) => entry.net);
  const averageMonthlyNet = average(monthlyNets);
  const volatility = stdDev(monthlyNets);
  const volatilityRatio = Math.abs(averageMonthlyNet) > 1 ? volatility / Math.abs(averageMonthlyNet) : 1.1;

  const confidence = volatilityRatio < 0.35 ? "high" : volatilityRatio < 0.8 ? "medium" : "low";

  const forecast = Array.from({ length: 3 }).map((_, index) => {
    const monthDate = addMonths(new Date(), index + 1);

    return {
      label: format(monthDate, "MMM yyyy"),
      projectedBalance: netBalance + averageMonthlyNet * (index + 1),
    };
  });

  const baselineMap = new Map(
    anomalyBaseline.map((entry) => [
      entry.category,
      {
        avgAmount: entry.avgAmount,
        stdDev: entry.stdDev || 0,
        sampleCount: entry.sampleCount,
      },
    ]),
  );

  const anomalies = recentExpenseRecords
    .map((record) => {
      const baseline = baselineMap.get(record.category);

      if (!baseline || baseline.sampleCount < 3 || baseline.avgAmount <= 0) {
        return null;
      }

      const threshold = baseline.avgAmount + Math.max(baseline.stdDev * 1.8, baseline.avgAmount * 0.45);
      if (record.amount <= threshold || record.amount <= baseline.avgAmount * 1.2) {
        return null;
      }

      const deviationPct = ((record.amount - baseline.avgAmount) / baseline.avgAmount) * 100;

      return {
        id: String(record._id),
        date: record.date.toISOString(),
        category: record.category,
        amount: record.amount,
        expected: baseline.avgAmount,
        deviationPct,
        notes: record.notes,
      };
    })
    .filter((entry) => Boolean(entry))
    .sort((a, b) => (b?.deviationPct ?? 0) - (a?.deviationPct ?? 0))
    .slice(0, 5) as Array<{
    id: string;
    date: string;
    category: string;
    amount: number;
    expected: number;
    deviationPct: number;
    notes: string;
  }>;

  const insights = [
    {
      title: "30-day savings rate",
      value: `${(savingsRate * 100).toFixed(1)}%`,
      tone: savingsRate >= 0.2 ? "positive" : savingsRate >= 0.05 ? "neutral" : "warning",
    },
    {
      title: "Expense momentum",
      value: `${expenseChangePct >= 0 ? "+" : ""}${expenseChangePct.toFixed(1)}% vs previous 30d`,
      tone: expenseChangePct <= 0 ? "positive" : expenseChangePct <= 10 ? "neutral" : "warning",
    },
    {
      title: "Top expense concentration",
      value: `${(topExpenseCategoryShare * 100).toFixed(1)}% in ${topExpenseCategory?.category || "n/a"}`,
      tone: topExpenseCategoryShare <= 0.28 ? "positive" : topExpenseCategoryShare <= 0.42 ? "neutral" : "warning",
    },
    {
      title: "Forecasted monthly net",
      value: `${averageMonthlyNet >= 0 ? "+" : ""}${averageMonthlyNet.toFixed(0)} (${confidence} confidence)`,
      tone: averageMonthlyNet >= 0 ? "positive" : "warning",
    },
  ];

  return {
    totals: {
      income,
      expense,
      netBalance,
    },
    healthScore: {
      score,
      grade,
      savingsRate,
      burnRate,
      expenseChangePct,
      topExpenseCategoryShare,
    },
    insights,
    forecast: {
      averageMonthlyNet,
      confidence,
      projectedBalances: forecast,
    },
    anomalies,
    categoryTotals,
    topCategories,
    recentActivity: recentRecords,
  };
}

export async function getDashboardTrends(input: TrendInput) {
  await connectToDatabase();

  const groupId: Record<"monthly" | "weekly", Record<string, unknown>> = {
    monthly: {
      year: { $year: "$date" },
      month: { $month: "$date" },
    },
    weekly: {
      year: { $isoWeekYear: "$date" },
      week: { $isoWeek: "$date" },
    },
  };

  const projectLabel: Record<"monthly" | "weekly", PipelineStage.Project["$project"]> = {
    monthly: {
      _id: 0,
      label: {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          {
            $cond: [
              { $lt: ["$_id.month", 10] },
              { $concat: ["0", { $toString: "$_id.month" }] },
              { $toString: "$_id.month" },
            ],
          },
        ],
      },
      income: 1,
      expense: 1,
      net: { $subtract: ["$income", "$expense"] },
      sortYear: "$_id.year",
      sortValue: "$_id.month",
    },
    weekly: {
      _id: 0,
      label: {
        $concat: [
          { $toString: "$_id.year" },
          "-W",
          {
            $cond: [
              { $lt: ["$_id.week", 10] },
              { $concat: ["0", { $toString: "$_id.week" }] },
              { $toString: "$_id.week" },
            ],
          },
        ],
      },
      income: 1,
      expense: 1,
      net: { $subtract: ["$income", "$expense"] },
      sortYear: "$_id.year",
      sortValue: "$_id.week",
    },
  };

  const trends = await FinancialRecordModel.aggregate<{
    label: string;
    income: number;
    expense: number;
    net: number;
    sortYear: number;
    sortValue: number;
  }>([
    { $match: { softDeleted: false } },
    {
      $group: {
        _id: groupId[input.period],
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: projectLabel[input.period],
    },
    {
      $sort: {
        sortYear: 1,
        sortValue: 1,
      },
    },
  ]);

  return trends.map((item) => ({
    label: item.label,
    income: item.income,
    expense: item.expense,
    net: item.net,
  }));
}

export async function getCategoryBreakdown() {
  await connectToDatabase();

  return FinancialRecordModel.aggregate<{
    category: string;
    income: number;
    expense: number;
    totalVolume: number;
  }>([
    { $match: { softDeleted: false } },
    {
      $group: {
        _id: "$category",
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        income: 1,
        expense: 1,
        totalVolume: { $add: ["$income", "$expense"] },
      },
    },
    { $sort: { totalVolume: -1 } },
  ]);
}

export async function getRecentRecords(input: RecentInput = {}) {
  await connectToDatabase();

  const limit = Math.min(Math.max(input.limit || 10, 1), 50);

  return FinancialRecordModel.find({ softDeleted: false })
    .sort({ date: -1, createdAt: -1 })
    .limit(limit)
    .populate("createdBy", "name role");
}

export async function buildRecordsCsv(input: {
  type?: "income" | "expense";
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) {
  await connectToDatabase();

  const query: Record<string, unknown> = { softDeleted: false };

  if (input.type) {
    query.type = input.type;
  }

  if (input.category) {
    query.category = { $regex: input.category, $options: "i" };
  }

  if (input.dateFrom || input.dateTo) {
    query.date = {} as Record<string, Date>;

    if (input.dateFrom) {
      (query.date as Record<string, Date>).$gte = input.dateFrom;
    }

    if (input.dateTo) {
      (query.date as Record<string, Date>).$lte = input.dateTo;
    }
  }

  const records = await FinancialRecordModel.find(query)
    .sort({ date: -1, createdAt: -1 })
    .populate("createdBy", "name email role");

  const header = [
    "id",
    "date",
    "type",
    "category",
    "amount",
    "notes",
    "createdByName",
    "createdByEmail",
    "createdByRole",
  ];

  const rows = records.map((record) => {
    const createdBy = record.createdBy as unknown as {
      name?: string;
      email?: string;
      role?: string;
    };

    const values = [
      record.id,
      record.date.toISOString(),
      record.type,
      record.category,
      record.amount.toString(),
      (record.notes || "").replaceAll('"', '""'),
      createdBy?.name || "",
      createdBy?.email || "",
      createdBy?.role || "",
    ];

    return values
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",");
  });

  return [header.join(","), ...rows].join("\n");
}
