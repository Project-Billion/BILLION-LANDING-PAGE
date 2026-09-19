/**
 * Client key for rate limiting, taken only from headers the platform controls.
 *
 * The LEFTMOST x-forwarded-for entry is whatever the client sent, so an attacker can rotate it to
 * get a fresh rate-limit bucket per request. Each proxy appends the address it saw, so the
 * RIGHTMOST entry is the one added by our own edge. x-vercel-forwarded-for is set by Vercel and
 * cannot be supplied by clients, so it wins when present, but only when running on Vercel
 * (process.env.VERCEL); anywhere else a client could send it, so it is ignored.
 */
export function clientIp(request: Request): string {
  if (process.env.VERCEL) {
    const vercel = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
    if (vercel) return vercel;
  }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim();
  if (forwarded) return forwarded;
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
