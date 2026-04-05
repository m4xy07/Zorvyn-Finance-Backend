import { redirect } from "next/navigation";

import { getSessionFromCookieStore } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { UserModel } from "@/models/User";

export async function requirePageSession() {
  const session = await getSessionFromCookieStore();

  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();

  const user = await UserModel.findById(session.id);
  if (!user || user.status !== "active") {
    redirect("/login");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function redirectIfAuthenticated() {
  const session = await getSessionFromCookieStore();

  if (!session) {
    return;
  }

  await connectToDatabase();
  const user = await UserModel.findById(session.id);

  if (user && user.status === "active") {
    redirect("/dashboard");
  }
}

