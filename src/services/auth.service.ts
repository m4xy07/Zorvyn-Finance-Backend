import { verifyPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { UserModel } from "@/models/User";

export async function loginUser(email: string, password: string) {
  await connectToDatabase();

  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const validPassword = await verifyPassword(password, user.passwordHash);

  if (!validPassword) {
    throw new AppError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new AppError(403, "Your account is inactive. Contact an administrator.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function getMe(userId: string) {
  await connectToDatabase();

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(401, "Session is no longer valid");
  }

  if (user.status !== "active") {
    throw new AppError(403, "Your account is inactive. Contact an administrator.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

