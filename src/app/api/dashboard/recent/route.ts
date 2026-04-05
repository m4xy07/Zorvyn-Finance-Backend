import { NextRequest } from "next/server";

import { getRecentRecords } from "@/services/dashboard.service";
import { handleApiError, successResponse } from "@/lib/http";
import { requireAuth } from "@/lib/permissions";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : undefined;

    const recent = await getRecentRecords({ limit });
    return successResponse(recent);
  } catch (error) {
    return handleApiError(error);
  }
}

