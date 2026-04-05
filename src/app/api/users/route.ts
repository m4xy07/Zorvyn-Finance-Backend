import { NextRequest } from "next/server";

import { handleApiError, parseJsonBody, successResponse } from "@/lib/http";
import { requireAuth, requireRole } from "@/lib/permissions";
import { createUserSchema, listUserQuerySchema } from "@/lib/validators";
import { createUser, listUsers } from "@/services/user.service";

export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const query = listUserQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    const users = await listUsers(query);
    return successResponse(users);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const payload = createUserSchema.parse(await parseJsonBody(request));
    const user = await createUser(payload);

    return successResponse(user, 201, "User created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

