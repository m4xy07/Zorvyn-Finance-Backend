import { z } from "zod";

import { DEMO_CATEGORIES, RECORD_TYPES, USER_ROLES, USER_STATUSES } from "@/constants";

export const objectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid identifier");

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(USER_ROLES),
  status: z.enum(USER_STATUSES).default("active"),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).max(128).optional(),
    role: z.enum(USER_ROLES).optional(),
    status: z.enum(USER_STATUSES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const updateUserStatusSchema = z.object({
  status: z.enum(USER_STATUSES),
});

export const createRecordSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(RECORD_TYPES),
  category: z.string().trim().min(2).max(60),
  date: z.coerce.date(),
  notes: z.string().trim().max(500).optional().default(""),
});

export const updateRecordSchema = z
  .object({
    amount: z.number().positive("Amount must be greater than 0").optional(),
    type: z.enum(RECORD_TYPES).optional(),
    category: z.string().trim().min(2).max(60).optional(),
    date: z.coerce.date().optional(),
    notes: z.string().trim().max(500).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const recordsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(RECORD_TYPES).optional(),
  category: z.string().trim().min(1).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  search: z.string().trim().max(100).optional(),
  sortBy: z.enum(["date", "amount", "createdAt", "category"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const trendQuerySchema = z.object({
  period: z.enum(["monthly", "weekly"]).default("monthly"),
});

export const listUserQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100).optional(),
  role: z.enum(USER_ROLES).optional(),
  status: z.enum(USER_STATUSES).optional(),
});

export const exportQuerySchema = z.object({
  type: z.enum(RECORD_TYPES).optional(),
  category: z.string().trim().min(1).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export const suggestedCategories = DEMO_CATEGORIES;

