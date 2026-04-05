import { NextRequest, NextResponse } from "next/server";

import { buildRecordsCsv } from "@/services/dashboard.service";
import { handleApiError } from "@/lib/http";
import { requireAuth, requireRole } from "@/lib/permissions";
import { exportQuerySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin", "analyst"]);

    const query = exportQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    const csv = await buildRecordsCsv(query);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="finance-records-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

