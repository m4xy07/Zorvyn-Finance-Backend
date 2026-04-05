import { NextRequest } from "next/server";

import { handleApiError, parseJsonBody, successResponse } from "@/lib/http";
import { requireAuth, requireRole } from "@/lib/permissions";
import { objectIdSchema, updateRecordSchema } from "@/lib/validators";
import { getRecordById, softDeleteRecord, updateRecord } from "@/services/record.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth(request);

    const { id } = await params;
    const recordId = objectIdSchema.parse(id);

    const record = await getRecordById(recordId);
    return successResponse(record);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const { id } = await params;
    const recordId = objectIdSchema.parse(id);

    const payload = updateRecordSchema.parse(await parseJsonBody(request));
    const record = await updateRecord(recordId, payload, context.session.id);

    return successResponse(record, 200, "Record updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const context = await requireAuth(request);
    requireRole(context, ["admin"]);

    const { id } = await params;
    const recordId = objectIdSchema.parse(id);

    const deleted = await softDeleteRecord(recordId, context.session.id);

    return successResponse(deleted, 200, "Record deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

