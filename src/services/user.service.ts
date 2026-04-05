import { AppError } from "@/lib/errors";
import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { UserDocument, UserModel } from "@/models/User";

interface ListUsersInput {
  page: number;
  limit: number;
  search?: string;
  role?: "viewer" | "analyst" | "admin";
  status?: "active" | "inactive";
}

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: "viewer" | "analyst" | "admin";
  status: "active" | "inactive";
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  role?: "viewer" | "analyst" | "admin";
  status?: "active" | "inactive";
}

function sanitizeUser(user: UserDocument) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function createUser(input: CreateUserInput) {
  await connectToDatabase();

  const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError(409, "Email already in use");
  }

  const passwordHash = await hashPassword(input.password);

  const created = await UserModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: input.role,
    status: input.status,
  });

  return sanitizeUser(created);
}

export async function listUsers(input: ListUsersInput) {
  await connectToDatabase();

  const query: Record<string, unknown> = {};

  if (input.search) {
    query.$or = [
      { name: { $regex: input.search, $options: "i" } },
      { email: { $regex: input.search, $options: "i" } },
    ];
  }

  if (input.role) {
    query.role = input.role;
  }

  if (input.status) {
    query.status = input.status;
  }

  const skip = (input.page - 1) * input.limit;

  const [users, total] = await Promise.all([
    UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(input.limit),
    UserModel.countDocuments(query),
  ]);

  return {
    items: users.map(sanitizeUser),
    page: input.page,
    limit: input.limit,
    total,
    totalPages: Math.ceil(total / input.limit) || 1,
  };
}

export async function getUserById(userId: string) {
  await connectToDatabase();
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return sanitizeUser(user);
}

export async function updateUser(userId: string, input: UpdateUserInput, actorId: string) {
  await connectToDatabase();

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (input.email && input.email.toLowerCase() !== user.email) {
    const duplicate = await UserModel.findOne({ email: input.email.toLowerCase() });
    if (duplicate && String(duplicate._id) !== userId) {
      throw new AppError(409, "Email already in use");
    }

    user.email = input.email.toLowerCase();
  }

  if (input.name) {
    user.name = input.name;
  }

  if (input.role) {
    user.role = input.role;
  }

  if (input.status) {
    if (input.status === "inactive" && String(user._id) === actorId) {
      throw new AppError(400, "You cannot deactivate your own account");
    }

    user.status = input.status;
  }

  if (input.password) {
    user.passwordHash = await hashPassword(input.password);
  }

  await user.save();
  return sanitizeUser(user);
}

export async function updateUserStatus(userId: string, status: "active" | "inactive", actorId: string) {
  await connectToDatabase();

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (String(user._id) === actorId && status === "inactive") {
    throw new AppError(400, "You cannot deactivate your own account");
  }

  user.status = status;
  await user.save();

  return sanitizeUser(user);
}

export async function deactivateUser(userId: string, actorId: string) {
  return updateUserStatus(userId, "inactive", actorId);
}

