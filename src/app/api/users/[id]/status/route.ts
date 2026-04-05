import { NextRequest } from "next/server";

import { handleApiError, parseJsonBody, successResponse } from "@/lib/http";
import { requireAuth, requireRole } from "@/lib/permissions";
import { objectIdSchema, updateUserStatusSchema } from "@/lib/validators";
import { updateUserStatus } from "@/services/user.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const { id } = await params;
    const userId = objectIdSchema.parse(id);
    const payload = updateUserStatusSchema.parse(await parseJsonBody(request));

    const user = await updateUserStatus(userId, payload.status, context.session.id);

    return successResponse(user, 200, "User status updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

