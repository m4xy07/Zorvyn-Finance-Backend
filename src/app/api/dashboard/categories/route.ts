import { NextRequest } from "next/server";

import { getCategoryBreakdown } from "@/services/dashboard.service";
import { handleApiError, successResponse } from "@/lib/http";
import { requireAuth } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const categories = await getCategoryBreakdown();
    return successResponse(categories);
  } catch (error) {
    return handleApiError(error);
  }
}

