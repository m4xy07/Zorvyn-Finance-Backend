import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/rate-limit";
import { createSessionToken, setAuthCookie } from "@/lib/auth";
import { handleApiError, parseJsonBody, errorResponse } from "@/lib/http";
import { loginSchema } from "@/lib/validators";
import { loginUser } from "@/services/auth.service";

function getClientIdentifier(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getClientIdentifier(request);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return errorResponse(
        `Too many login attempts. Try again in ${rateLimit.retryAfter}s.`,
        429,
      );
    }

    const payload = loginSchema.parse(await parseJsonBody(request));
    const sessionUser = await loginUser(payload.email, payload.password);
    const token = await createSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      data: sessionUser,
      message: "Logged in successfully",
    });

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

