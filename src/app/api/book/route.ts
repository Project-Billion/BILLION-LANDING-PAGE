import { getCalendarProvider, ProviderNotConfiguredError } from "@/lib/booking";
import { clientIp } from "@/lib/booking/client-ip";
import { createRateLimiter } from "@/lib/booking/rate-limit";
import { computeSlots, isSlotFree } from "@/lib/booking/slots";
import { parseBookingRequest } from "@/lib/booking/validate";

const HOUR = 60 * 60_000;
const MAX_BODY_CHARS = 8192;
const GLOBAL_KEY = "global";
// Both limits live in this serverless instance only, so they are best effort.
const limiter = createRateLimiter({ limit: 5, windowMs: HOUR });
const globalLimiter = createRateLimiter({ limit: 30, windowMs: HOUR });
const DAY = 24 * 60 * 60_000;
// Starts currently being booked by this instance; stops two concurrent requests taking one slot.
const inFlight = new Set<string>();

function respond(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  // x-forwarded-host is only trustworthy behind Vercel's edge; elsewhere a client could set it.
  const hosts = [request.headers.get("host") ?? new URL(request.url).host];
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (process.env.VERCEL && forwardedHost) hosts.push(forwardedHost);
  return hosts.includes(originHost);
}

/** Logs the failing step, a random id and the upstream status only; never any visitor input. */
function logFailure(operation: string, error: unknown): void {
  const status = (error as { status?: unknown } | null)?.status;
  console.error("booking failed", { operation, requestId: crypto.randomUUID(), ...(typeof status === "number" ? { status } : {}) });
}

export async function POST(request: Request): Promise<Response> {
  if (!sameOrigin(request)) return respond({ error: "generic" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return respond({ error: "validation" }, 400);

  const ip = clientIp(request);
  if (!limiter.check(ip)) return respond({ error: "rateLimited" }, 429);

  const length = Number(request.headers.get("content-length"));
  if (!request.headers.get("content-length") || !(length <= MAX_BODY_CHARS)) return respond({ error: "validation" }, 400);
  const text = await request.text();
  if (text.length > MAX_BODY_CHARS) return respond({ error: "validation" }, 400);
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return respond({ error: "validation" }, 400);
  }

  const parsed = parseBookingRequest(body);
  if (!parsed.ok) {
    if (parsed.error !== "honeypot") return respond({ error: "validation" }, 400);
    // Silently dropped, and it must not use up the visitor's allowance.
    limiter.refund(ip);
    return respond({ ok: true });
  }

  const { start, duration, name, email, note } = parsed.value;
  if (inFlight.has(start)) return respond({ error: "slotTaken" }, 409);
  inFlight.add(start);
  const startMs = Date.parse(start);
  const endIso = new Date(startMs + duration * 60_000).toISOString();
  let operation = "provider";
  try {
    const provider = getCalendarProvider();
    operation = "getBusy";
    const busy = await provider.getBusy(new Date(startMs - DAY).toISOString(), new Date(startMs + DAY).toISOString());
    const now = new Date();
    const offered = computeSlots({ fromIso: new Date(startMs - DAY).toISOString(), toIso: new Date(startMs + DAY).toISOString(), durationMin: duration, busy, now });
    if (!isSlotFree(start, duration, busy, now) || !offered.includes(start)) return respond({ error: "slotTaken" }, 409);
    // The global budget is charged only for a real attempt: everything above (validation, honeypot, slot check) is free.
    if (!globalLimiter.check(GLOBAL_KEY)) {
      limiter.refund(ip);
      return respond({ error: "rateLimited" }, 429);
    }
    operation = "createEvent";
    const event = await provider.createEvent({ startIso: start, endIso, name, email, note, requestId: crypto.randomUUID() });
    return respond({ ok: true, start, end: endIso, durationMin: duration, meetUrl: event.meetUrl });
  } catch (error) {
    if (error instanceof ProviderNotConfiguredError) return respond({ error: "notConfigured" }, 503);
    logFailure(operation, error);
    return respond({ error: "generic" }, 502);
  } finally {
    inFlight.delete(start);
  }
}
