import { NextRequest } from "next/server";

import { handleApiError, successResponse } from "@/lib/http";
import { requireAuth } from "@/lib/permissions";
import { getMe } from "@/services/auth.service";

export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth(request);
    const me = await getMe(context.session.id);

    return successResponse(me);
  } catch (error) {
    return handleApiError(error);
  }
}

