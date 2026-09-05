import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function error(
  message: string,
  status = 400,
  details?: unknown
) {
  const body: Record<string, unknown> = { success: false, error: message };
  if (details !== undefined) body.details = details;
  return NextResponse.json(body, { status });
}

/**
 * User-friendly wrapper for route handlers.
 * Never leaks internal errors to the client.
 */
export function handleApiError(err: unknown) {
  console.error("[API] Internal error:", err);
  return error("Something went wrong. Please try again.", 500);
}