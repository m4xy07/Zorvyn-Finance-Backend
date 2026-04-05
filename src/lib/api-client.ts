"use client";

import { ApiErrorResponse, ApiSuccessResponse } from "@/types";

export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  const payload = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;

  if (!response.ok || !payload.success) {
    const message =
      "message" in payload && payload.message ? payload.message : "Something went wrong";

    throw new Error(message);
  }

  return payload.data;
}

