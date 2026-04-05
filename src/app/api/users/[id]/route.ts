import { NextRequest } from "next/server";

import { handleApiError, parseJsonBody, successResponse } from "@/lib/http";
import { requireAuth, requireRole } from "@/lib/permissions";
import { objectIdSchema, updateUserSchema } from "@/lib/validators";
import { deactivateUser, getUserById, updateUser } from "@/services/user.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const { id } = await params;
    const userId = objectIdSchema.parse(id);

    const user = await getUserById(userId);
    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const { id } = await params;
    const userId = objectIdSchema.parse(id);
    const payload = updateUserSchema.parse(await parseJsonBody(request));

    const user = await updateUser(userId, payload, context.session.id);

    return successResponse(user, 200, "User updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const { id } = await params;
    const userId = objectIdSchema.parse(id);

    const user = await deactivateUser(userId, context.session.id);

    return successResponse(user, 200, "User deactivated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

