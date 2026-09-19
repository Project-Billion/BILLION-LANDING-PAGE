/**
 * Pure date helpers for the booking scheduler. Everything is built on Intl (no date library)
 * so it stays correct across daylight saving changes. A "day key" is a calendar date
 * "YYYY-MM-DD" and a "month key" is "YYYY-MM"; neither carries a timezone by itself.
 */

const LOCALE = "en-GB";

const pad = (value: number): string => String(value).padStart(2, "0");

const formatterCache = new Map<string, Intl.DateTimeFormat>();

/** Intl formatters are slow to construct, and slot grouping formats hundreds of instants. */
function formatter(key: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  let cached = formatterCache.get(key);
  if (!cached) {
    cached = new Intl.DateTimeFormat(LOCALE, options);
    formatterCache.set(key, cached);
  }
  return cached;
}

function parts(format: Intl.DateTimeFormat, instant: Date): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of format.formatToParts(instant)) result[part.type] = part.value;
  return result;
}

/** Builds "2026-09" from a full year and a zero-based month. */
export function monthKey(year: number, month0: number): string {
  return `${year}-${pad(month0 + 1)}`;
}

/** Splits "2026-09" into a full year and a zero-based month. */
export function parseMonthKey(key: string): { year: number; month0: number } {
  const [year = 0, month = 1] = key.split("-").map(Number);
  return { year, month0: month - 1 };
}

/** Moves a month key by whole months, e.g. ("2026-12", 1) -> "2027-01". */
export function shiftMonth(key: string, delta: number): string {
  const { year, month0 } = parseMonthKey(key);
  const index = year * 12 + month0 + delta;
  return monthKey(Math.floor(index / 12), ((index % 12) + 12) % 12);
}

/** The calendar day an instant falls on in the given timezone, as "YYYY-MM-DD". */
export function dayKeyInZone(instant: Date | string, timeZone: string): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  const p = parts(formatter(`day|${timeZone}`, { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }), date);
  return `${p.year}-${p.month}-${p.day}`;
}

/** The month an instant falls in for the given timezone, as "YYYY-MM". */
export function monthKeyInZone(instant: Date | string, timeZone: string): string {
  return dayKeyInZone(instant, timeZone).slice(0, 7);
}

/**
 * Groups slot instants (UTC ISO strings) by the calendar day they land on in the visitor's
 * timezone. Days come out in chronological order and so do the slots inside each day.
 */
export function groupSlotsByLocalDay(slots: readonly string[], timeZone: string): Map<string, string[]> {
  const sorted = [...slots].sort((a, b) => Date.parse(a) - Date.parse(b));
  const groups = new Map<string, string[]>();
  for (const slot of sorted) {
    const day = dayKeyInZone(slot, timeZone);
    const bucket = groups.get(day);
    if (bucket) {
      if (bucket[bucket.length - 1] !== slot) bucket.push(slot);
    } else {
      groups.set(day, [slot]);
    }
  }
  return groups;
}

/** 24-hour "HH:mm" for an instant in the given timezone. */
export function formatTime(instant: Date | string, timeZone: string): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  const p = parts(formatter(`time|${timeZone}`, { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }), date);
  return `${p.hour}:${p.minute}`;
}

/** Offset label such as "GMT+3" or "GMT+5:30" for the timezone at a given instant. */
export function formatOffset(instant: Date | string, timeZone: string): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  return parts(formatter(`offset|${timeZone}`, { timeZone, timeZoneName: "shortOffset" }), date).timeZoneName ?? "";
}

/** Readable city part of an IANA zone: "Africa/Cairo" -> "Cairo", "America/Argentina/Buenos_Aires" -> "Buenos Aires". */
export function zoneCity(timeZone: string): string {
  return (timeZone.split("/").pop() ?? timeZone).replaceAll("_", " ");
}

function dayKeyToNoonUtc(dayKey: string): Date {
  const [year = 0, month = 1, day = 1] = dayKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

const utcDayFormat = formatter("utc-day", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });

function formatDay(dayKey: string, style: "long" | "short"): string {
  const p = parts(utcDayFormat, dayKeyToNoonUtc(dayKey));
  // Abbreviate ourselves: engines disagree on "Sep" vs "Sept" for en-GB.
  const [weekday, month] = style === "long" ? [p.weekday, p.month] : [p.weekday?.slice(0, 3), p.month?.slice(0, 3)];
  return `${weekday} ${p.day} ${month}`;
}

/** "Monday 21 September" for a day key. */
export function formatLongDate(dayKey: string): string {
  return formatDay(dayKey, "long");
}

/** "Mon 21 Sep" for a day key. */
export function formatShortDate(dayKey: string): string {
  return formatDay(dayKey, "short");
}

/** "September 2026" for a month key. */
export function formatMonthTitle(key: string): string {
  const { year, month0 } = parseMonthKey(key);
  const p = parts(formatter("utc-month", { timeZone: "UTC", month: "long", year: "numeric" }), new Date(Date.UTC(year, month0, 1, 12)));
  return `${p.month} ${p.year}`;
}

/**
 * Cells for a month grid, Sunday first: `null` pads the leading and trailing blanks so the
 * result always has a whole number of weeks; every other cell is a day key.
 */
export function calendarCells(key: string): (string | null)[] {
  const { year, month0 } = parseMonthKey(key);
  const leading = new Date(Date.UTC(year, month0, 1)).getUTCDay();
  const dayCount = new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= dayCount; day += 1) cells.push(`${key}-${pad(day)}`);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
