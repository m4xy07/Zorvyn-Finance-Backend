import { RecordsPageClient } from "@/components/records/records-page-client";
import { requirePageSession } from "@/lib/server-auth";

export default async function RecordsPage() {
  const user = await requirePageSession();

  return <RecordsPageClient role={user.role} />;
}

