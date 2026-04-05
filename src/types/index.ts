export type UserRole = "viewer" | "analyst" | "admin";
export type UserStatus = "active" | "inactive";
export type RecordType = "income" | "expense";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AppRecord {
  id: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes: string;
  createdBy: unknown;
  updatedBy?: unknown;
  softDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totals: {
    income: number;
    expense: number;
    netBalance: number;
  };
  healthScore: {
    score: number;
    grade: "A" | "B" | "C" | "D";
    savingsRate: number;
    burnRate: number;
    expenseChangePct: number;
    topExpenseCategoryShare: number;
  };
  insights: Array<{
    title: string;
    value: string;
    tone: "positive" | "neutral" | "warning";
  }>;
  forecast: {
    averageMonthlyNet: number;
    confidence: "high" | "medium" | "low";
    projectedBalances: Array<{
      label: string;
      projectedBalance: number;
    }>;
  };
  anomalies: Array<{
    id: string;
    date: string;
    category: string;
    amount: number;
    expected: number;
    deviationPct: number;
    notes: string;
  }>;
  categoryTotals: Array<{
    category: string;
    income: number;
    expense: number;
    net: number;
  }>;
  topCategories: Array<{
    category: string;
    volume: number;
    count: number;
  }>;
  recentActivity: AppRecord[];
}

