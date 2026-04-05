import { Types } from "mongoose";

import { AppError } from "@/lib/errors";
import { connectToDatabase } from "@/lib/db";
import { FinancialRecordDocument, FinancialRecordModel } from "@/models/FinancialRecord";

type RecordType = "income" | "expense";
type SortField = "date" | "amount" | "createdAt" | "category";
type SortOrder = "asc" | "desc";

interface ListRecordsInput {
  page: number;
  limit: number;
  type?: RecordType;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  sortBy: SortField;
  sortOrder: SortOrder;
}

interface CreateRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes?: string;
}

interface UpdateRecordInput {
  amount?: number;
  type?: RecordType;
  category?: string;
  date?: Date;
  notes?: string;
}

function sanitizeRecord(record: FinancialRecordDocument) {
  return {
    id: String(record._id),
    amount: record.amount,
    type: record.type,
    category: record.category,
    date: record.date,
    notes: record.notes,
    createdBy: record.createdBy,
    updatedBy: record.updatedBy,
    softDeleted: record.softDeleted,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function buildRecordQuery(input: ListRecordsInput): Record<string, unknown> {
  const query: Record<string, unknown> = {
    softDeleted: false,
  };

  if (input.type) {
    query.type = input.type;
  }

  if (input.category) {
    query.category = { $regex: input.category, $options: "i" };
  }

  if (input.dateFrom || input.dateTo) {
    const dateQuery: Record<string, Date> = {};

    if (input.dateFrom) {
      dateQuery.$gte = input.dateFrom;
    }

    if (input.dateTo) {
      dateQuery.$lte = input.dateTo;
    }

    query.date = dateQuery;
  }

  if (input.search) {
    query.$or = [
      { category: { $regex: input.search, $options: "i" } },
      { notes: { $regex: input.search, $options: "i" } },
    ];
  }

  return query;
}

export async function createRecord(input: CreateRecordInput, actorId: string) {
  await connectToDatabase();

  const created = await FinancialRecordModel.create({
    ...input,
    notes: input.notes || "",
    createdBy: new Types.ObjectId(actorId),
  });

  return sanitizeRecord(created);
}

export async function listRecords(input: ListRecordsInput) {
  await connectToDatabase();

  const query = buildRecordQuery(input);
  const skip = (input.page - 1) * input.limit;
  const direction = input.sortOrder === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    FinancialRecordModel.find(query)
      .sort({ [input.sortBy]: direction, _id: -1 })
      .skip(skip)
      .limit(input.limit)
      .populate("createdBy", "name email role")
      .populate("updatedBy", "name email role"),
    FinancialRecordModel.countDocuments(query),
  ]);

  return {
    items: items.map(sanitizeRecord),
    page: input.page,
    limit: input.limit,
    total,
    totalPages: Math.ceil(total / input.limit) || 1,
  };
}

export async function getRecordById(recordId: string) {
  await connectToDatabase();

  const record = await FinancialRecordModel.findOne({
    _id: recordId,
    softDeleted: false,
  })
    .populate("createdBy", "name email role")
    .populate("updatedBy", "name email role");

  if (!record) {
    throw new AppError(404, "Record not found");
  }

  return sanitizeRecord(record);
}

export async function updateRecord(recordId: string, input: UpdateRecordInput, actorId: string) {
  await connectToDatabase();

  const record = await FinancialRecordModel.findOne({
    _id: recordId,
    softDeleted: false,
  });

  if (!record) {
    throw new AppError(404, "Record not found");
  }

  if (typeof input.amount === "number") {
    record.amount = input.amount;
  }

  if (input.type) {
    record.type = input.type;
  }

  if (input.category) {
    record.category = input.category;
  }

  if (input.date) {
    record.date = input.date;
  }

  if (typeof input.notes === "string") {
    record.notes = input.notes;
  }

  record.updatedBy = new Types.ObjectId(actorId);

  await record.save();
  return sanitizeRecord(record);
}

export async function softDeleteRecord(recordId: string, actorId: string) {
  await connectToDatabase();

  const record = await FinancialRecordModel.findOne({
    _id: recordId,
    softDeleted: false,
  });

  if (!record) {
    throw new AppError(404, "Record not found");
  }

  record.softDeleted = true;
  record.updatedBy = new Types.ObjectId(actorId);

  await record.save();

  return { id: String(record._id), softDeleted: true };
}

export async function listRecordsForExport(input: Omit<ListRecordsInput, "page" | "limit" | "sortBy" | "sortOrder">) {
  await connectToDatabase();

  const query = buildRecordQuery({
    ...input,
    page: 1,
    limit: 100000,
    sortBy: "date",
    sortOrder: "desc",
  });

  const items = await FinancialRecordModel.find(query)
    .sort({ date: -1, _id: -1 })
    .populate("createdBy", "name email");

  return items.map((item) => ({
    id: String(item._id),
    date: item.date.toISOString(),
    type: item.type,
    category: item.category,
    amount: item.amount,
    notes: item.notes,
    createdBy: item.createdBy,
    createdAt: item.createdAt.toISOString(),
  }));
}

