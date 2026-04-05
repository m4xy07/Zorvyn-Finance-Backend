import { NextRequest } from "next/server";

import { getDashboardSummary } from "@/services/dashboard.service";
import { handleApiError, successResponse } from "@/lib/http";
import { requireAuth } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const summary = await getDashboardSummary();
    return successResponse(summary);
  } catch (error) {
    return handleApiError(error);
  }
}

