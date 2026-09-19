import { bookingRules, type Duration } from "@/content/booking";

export type BookingRequest = { start: string; duration: Duration; name: string; email: string; note: string; timezone: string };

// Control characters, bidi overrides and zero-width characters can hide or reorder text in emails and invites.
const stripAll = (value: string) => value.replace(/[\p{Cc}​-‏‪-‮⁦-⁩﻿]/gu, "");
const stripKeepingNewlines = (value: string) => value.replace(/(?!\n)[\p{Cc}​-‏‪-‮⁦-⁩﻿]/gu, "");

function validInstant(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value);
  if (!match || !Number.isFinite(Date.parse(value))) return false;
  // Date.parse normalizes invalid dates such as February 30; reject them.
  const calendarDate = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
  return Number.isFinite(calendarDate.getTime()) && calendarDate.getUTCMonth() + 1 === Number(match[2]) && calendarDate.getUTCDate() === Number(match[3]);
}

export function parseBookingRequest(body: unknown): { ok: true; value: BookingRequest } | { ok: false; error: "validation" | "honeypot" } {
  const invalid = { ok: false, error: "validation" } as const;
  if (!body || typeof body !== "object" || Array.isArray(body)) return invalid;
  const data = body as Record<string, unknown>;
  // The form always sends website: "". A missing key means a script built the request by hand.
  if (data.website !== "") return { ok: false, error: "honeypot" };
  if (typeof data.name !== "string" || typeof data.email !== "string" || typeof data.start !== "string" ||
      typeof data.timezone !== "string" || typeof data.duration !== "number" ||
      !(bookingRules.durations as readonly number[]).includes(data.duration) ||
      (data.note !== undefined && typeof data.note !== "string")) return invalid;
  const name = stripAll(data.name).trim();
  const email = stripAll(data.email).trim();
  const note = stripKeepingNewlines(((data.note as string | undefined) ?? "").replace(/\r\n?/g, "\n"));
  if (name.length < 1 || name.length > 100 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      note.length > 1000 || !validInstant(data.start) || !data.timezone || data.timezone.length > 64 || /^[+-]/.test(data.timezone)) return invalid;
  try {
    new Intl.DateTimeFormat(undefined, { timeZone: data.timezone });
  } catch {
    return invalid;
  }
  return { ok: true, value: { start: new Date(data.start).toISOString(), duration: data.duration as Duration, name, email, note, timezone: data.timezone } };
}
