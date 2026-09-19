import { bookingCopy, type Duration } from "@/content/booking";

/** Error codes the booking API answers with (`{ error: code }`), plus the network fallback. */
export type ApiErrorCode = "slotTaken" | "validation" | "notConfigured" | "generic" | "rateLimited";

const KNOWN_CODES: readonly ApiErrorCode[] = ["slotTaken", "validation", "notConfigured", "generic", "rateLimited"];

const STATUS_CODES: Record<number, ApiErrorCode> = {
  400: "validation",
  409: "slotTaken",
  429: "rateLimited",
  503: "notConfigured",
};

export class ApiError extends Error {
  constructor(readonly code: ApiErrorCode) {
    super(code);
    this.name = "ApiError";
  }
}

/** Visitor-facing sentence for an error code, from the single copy file. */
export function messageFor(code: ApiErrorCode): string {
  return bookingCopy.errors[code];
}

async function errorFrom(response: Response): Promise<ApiError> {
  let code: ApiErrorCode = STATUS_CODES[response.status] ?? "generic";
  try {
    const body: unknown = await response.json();
    const reported = typeof body === "object" && body !== null ? (body as { error?: unknown }).error : undefined;
    const known = KNOWN_CODES.find((candidate) => candidate === reported);
    if (known) code = known;
  } catch {
    // Body was not JSON; the status alone decides.
  }
  return new ApiError(code);
}

async function request(input: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("generic");
  }
}

/** Free slot starts (UTC ISO strings) for one UTC month. */
export async function fetchAvailability(month: string, duration: Duration, signal: AbortSignal): Promise<string[]> {
  const response = await request(`/api/availability?month=${month}&duration=${duration}`, { signal });
  if (!response.ok) throw await errorFrom(response);
  const body: unknown = await response.json().catch(() => null);
  const slots = typeof body === "object" && body !== null ? (body as { slots?: unknown }).slots : undefined;
  if (!Array.isArray(slots) || !slots.every((slot) => typeof slot === "string")) throw new ApiError("generic");
  return slots;
}

export interface BookingPayload {
  start: string;
  duration: Duration;
  name: string;
  email: string;
  note: string;
  timezone: string;
  website: string;
}

/** Creates the booking. Resolves with the Meet link when the server returned one. */
export async function submitBooking(payload: BookingPayload): Promise<{ meetUrl: string | null }> {
  const response = await request("/api/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw await errorFrom(response);
  const body: unknown = await response.json().catch(() => null);
  const meetUrl = typeof body === "object" && body !== null ? (body as { meetUrl?: unknown }).meetUrl : undefined;
  return { meetUrl: typeof meetUrl === "string" && meetUrl.startsWith("https://") ? meetUrl : null };
}
