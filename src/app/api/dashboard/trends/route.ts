import { NextRequest } from "next/server";

import { getDashboardTrends } from "@/services/dashboard.service";
import { handleApiError, successResponse } from "@/lib/http";
import { requireAuth } from "@/lib/permissions";
import { trendQuerySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const query = trendQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    const trends = await getDashboardTrends(query);
    return successResponse(trends);
  } catch (error) {
    return handleApiError(error);
  }
}

