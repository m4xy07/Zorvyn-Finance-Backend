import { NextRequest } from "next/server";

import { UserDocument, UserModel } from "@/models/User";
import { getSessionFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { SessionUser, UserRole } from "@/types";

export interface AuthContext {
  session: SessionUser;
  user: UserDocument;
}

export async function requireAuth(request: NextRequest): Promise<AuthContext> {
  const session = await getSessionFromRequest(request);

  if (!session) {
    throw new AppError(401, "Unauthenticated");
  }

  await connectToDatabase();
  const user = await UserModel.findById(session.id);

  if (!user) {
    throw new AppError(401, "Session is no longer valid");
  }

  if (user.status !== "active") {
    throw new AppError(403, "Inactive users cannot access this resource");
  }

  return {
    session: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    },
    user,
  };
}

export function requireRole(context: AuthContext, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(context.session.role)) {
    throw new AppError(403, "Forbidden");
  }
}

export function requireActiveUser(context: AuthContext): void {
  if (context.session.status !== "active") {
    throw new AppError(403, "Inactive users cannot access this resource");
  }
}

