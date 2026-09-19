import { createHash } from "node:crypto";
import { bookingRules } from "@/content/booking";
import type { BusyInterval, CalendarProvider } from "./provider";

type GoogleEnvironment = { clientId: string; clientSecret: string; refreshToken: string; calendarId: string };
type Token = { accessToken: string; expiresAt: number };

// Providers for the same credentials share tokens and an in-flight refresh.
const tokens = new Map<string, Token>();
const refreshing = new Map<string, Promise<Token>>();

type GoogleStep = "token" | "freebusy" | "insert";

/**
 * Thrown for a non-2xx Google response. The message is only the status. Of the body, only Google's
 * short error code (e.g. "invalid_client") is kept, and only when it looks like one.
 */
export class GoogleHttpError extends Error {
  constructor(readonly status: number, readonly step: GoogleStep, readonly code?: string) {
    super(String(status));
    this.name = "GoogleHttpError";
  }
}

// OAuth endpoints answer {"error": "code"}; the Calendar API answers {"error": {"status": "CODE"}}.
async function googleErrorCode(response: Response): Promise<string | undefined> {
  try {
    const data = await response.json();
    const raw = typeof data?.error === "string" ? data.error : data?.error?.status;
    return typeof raw === "string" && /^[A-Za-z_]{1,40}$/.test(raw) ? raw : undefined;
  } catch {
    return undefined;
  }
}

// Only ever hand a Google Meet address to the visitor, whatever the API returned.
function safeMeetUrl(...candidates: unknown[]): string | null {
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    try {
      const url = new URL(candidate);
      if (url.protocol === "https:" && url.host === "meet.google.com") return url.href;
    } catch {
      // Not a URL; try the next candidate.
    }
  }
  return null;
}

async function checkedFetch(step: GoogleStep, url: string, init: RequestInit): Promise<Response> {
  const response = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new GoogleHttpError(response.status, step, await googleErrorCode(response));
  return response;
}

async function accessToken(env: GoogleEnvironment): Promise<string> {
  // Hash the credentials so the raw secrets are never held as map keys.
  const key = createHash("sha256").update(JSON.stringify([env.clientId, env.clientSecret, env.refreshToken])).digest("hex");
  const cached = tokens.get(key);
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.accessToken;
  let pending = refreshing.get(key);
  if (!pending) {
    pending = (async () => {
      const response = await checkedFetch("token", "https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token", client_id: env.clientId,
          client_secret: env.clientSecret, refresh_token: env.refreshToken,
        }).toString(),
      });
      const data = await response.json();
      if (typeof data.access_token !== "string" || !data.access_token || typeof data.expires_in !== "number" || data.expires_in <= 0) {
        throw new Error("Invalid calendar response");
      }
      const token = { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
      tokens.set(key, token);
      return token;
    })();
    refreshing.set(key, pending);
  }
  try {
    return (await pending).accessToken;
  } finally {
    if (refreshing.get(key) === pending) refreshing.delete(key);
  }
}

export function createGoogleProvider(env: GoogleEnvironment): CalendarProvider {
  async function post(step: "freebusy" | "insert", url: string, body: unknown) {
    const token = await accessToken(env);
    const response = await checkedFetch(step, url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  return {
    async getBusy(fromIso, toIso) {
      const data = await post("freebusy", "https://www.googleapis.com/calendar/v3/freeBusy", {
        timeMin: fromIso, timeMax: toIso,
        timeZone: bookingRules.timeZone, items: [{ id: env.calendarId }],
      });
      const calendar = data.calendars?.[env.calendarId];
      // Google can report per-calendar errors in a successful HTTP response.
      if (!calendar || calendar.errors?.length || !Array.isArray(calendar.busy)) throw new Error("Invalid calendar response");
      const busy: BusyInterval[] = calendar.busy.map((interval: BusyInterval) => {
        if (typeof interval.start !== "string" || typeof interval.end !== "string" ||
            !Number.isFinite(Date.parse(interval.start)) || !Number.isFinite(Date.parse(interval.end)) ||
            Date.parse(interval.start) >= Date.parse(interval.end)) throw new Error("Invalid calendar response");
        return { start: interval.start, end: interval.end };
      });
      return busy;
    },
    async createEvent(input) {
      const data = await post("insert", `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(env.calendarId)}/events?conferenceDataVersion=1&sendUpdates=all`, {
        summary: `Billion discovery call: ${input.name.replace(/[\r\n]/g, "")}`,
        description: (input.note ?? "").replace(/\r\n?/g, "\n"),
        start: { dateTime: input.startIso, timeZone: bookingRules.timeZone },
        end: { dateTime: input.endIso, timeZone: bookingRules.timeZone },
        attendees: [{ email: input.email.replace(/[\r\n]/g, "") }],
        conferenceData: { createRequest: { requestId: input.requestId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
      });
      if (typeof data.id !== "string" || !data.id) throw new Error("Invalid calendar response");
      const video = data.conferenceData?.entryPoints?.find((entry: { entryPointType?: string; uri?: string }) => entry.entryPointType === "video");
      return { eventId: data.id, meetUrl: safeMeetUrl(video?.uri, data.hangoutLink), htmlLink: data.htmlLink ?? null };
    },
  };
}
