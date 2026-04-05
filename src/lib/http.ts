import { ZodError } from "zod";
import { NextResponse } from "next/server";

import { AppError } from "@/lib/errors";

export function successResponse<T>(data: T, status = 200, message?: string): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message ? { message } : {}),
    },
    { status },
  );
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: unknown,
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors ? { errors } : {}),
    },
    { status },
  );
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode, error.details);
  }

  if (error instanceof ZodError) {
    return errorResponse("Validation failed", 400, error.flatten());
  }

  console.error("Unhandled API error", error);
  return errorResponse("Something went wrong", 500);
}

export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new AppError(400, "Invalid JSON payload");
  }
}

