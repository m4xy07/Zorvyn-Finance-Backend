import { redirect } from "next/navigation";

import { UsersPageClient } from "@/components/users/users-page-client";
import { requirePageSession } from "@/lib/server-auth";

export default async function UsersPage() {
  const user = await requirePageSession();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  return <UsersPageClient />;
}

