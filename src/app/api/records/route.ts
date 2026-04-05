import { NextRequest } from "next/server";

import { handleApiError, parseJsonBody, successResponse } from "@/lib/http";
import { requireAuth, requireRole } from "@/lib/permissions";
import { createRecordSchema, recordsQuerySchema } from "@/lib/validators";
import { createRecord, listRecords } from "@/services/record.service";

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);

    const query = recordsQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams.entries()),
    );

    const records = await listRecords(query);

    return successResponse(records);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const payload = createRecordSchema.parse(await parseJsonBody(request));
    const record = await createRecord(payload, context.session.id);

    return successResponse(record, 201, "Record created successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

