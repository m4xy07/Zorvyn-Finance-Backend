import { PipelineStage } from "mongoose";

import { connectToDatabase } from "@/lib/db";
import { FinancialRecordModel } from "@/models/FinancialRecord";

interface TrendInput {
  period: "monthly" | "weekly";
}

interface RecentInput {
  limit?: number;
}

export async function getDashboardSummary() {
  await connectToDatabase();

  const [totalsByType, categoryTotals, recentRecords, topCategories] = await Promise.all([
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
  ]);

  const income = totalsByType.find((item) => item._id === "income")?.total ?? 0;
  const expense = totalsByType.find((item) => item._id === "expense")?.total ?? 0;

  return {
    totals: {
      income,
      expense,
      netBalance: income - expense,
    },
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

