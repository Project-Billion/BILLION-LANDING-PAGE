import { bookingRules, type Duration } from "@/content/booking";
import { getCalendarProvider, ProviderNotConfiguredError } from "@/lib/booking";
import { GoogleHttpError } from "@/lib/booking/google";
import { clientIp } from "@/lib/booking/client-ip";
import { createRateLimiter } from "@/lib/booking/rate-limit";
import { computeSlots, monthRange } from "@/lib/booking/slots";

const DAY = 24 * 60 * 60_000;
const limiter = createRateLimiter({ limit: 60, windowMs: 60_000 });

function respond(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

// The client also requests the adjacent months because a visitor's local months differ from UTC months.
export async function GET(request: Request): Promise<Response> {
  if (!limiter.check(clientIp(request))) return respond({ error: "rateLimited" }, 429);
  const params = new URL(request.url).searchParams;
  const range = monthRange(params.get("month") ?? "");
  const duration = Number(params.get("duration"));
  if (!range || !(bookingRules.durations as readonly number[]).includes(duration)) return respond({ error: "validation" }, 400);
  // A month wholly in the past, or past the booking horizon (plus a month of slack for timezone edges), has no slots.
  const now = Date.now();
  if (Date.parse(range.toIso) <= now || Date.parse(range.fromIso) > now + (bookingRules.maxDaysAhead + 31) * DAY) return respond({ slots: [] });
  try {
    const busy = await getCalendarProvider().getBusy(range.fromIso, range.toIso);
    return respond({ slots: computeSlots({ ...range, durationMin: duration as Duration, busy, now: new Date(now) }) });
  } catch (error) {
    if (error instanceof ProviderNotConfiguredError) return respond({ error: "notConfigured" }, 503);
    const status = (error as { status?: unknown } | null)?.status;
    const google = error instanceof GoogleHttpError ? { step: error.step, ...(error.code ? { code: error.code } : {}) } : {};
    console.error("availability lookup failed", { requestId: crypto.randomUUID(), ...(typeof status === "number" ? { status } : {}), ...google });
    return respond({ error: "generic" }, 502);
  }
}
