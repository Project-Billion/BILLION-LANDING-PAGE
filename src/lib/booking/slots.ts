import { bookingRules, type Duration } from "@/content/booking";
import type { BusyInterval } from "./provider";

const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;
const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: bookingRules.timeZone,
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

function wallTime(timestamp: number): number {
  const parts = Object.fromEntries(formatter.formatToParts(timestamp).map(p => [p.type, p.value]));
  const wall = new Date(0);
  wall.setUTCFullYear(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
  wall.setUTCHours(Number(parts.hour), Number(parts.minute), Number(parts.second), 0);
  return wall.getTime();
}

// Resolve a Cairo wall clock to an instant using the timezone database in Intl.
function wallToUtc(wall: number): number | null {
  let guess = wall;
  for (let i = 0; i < 4; i++) {
    const difference = wall - wallTime(guess);
    if (difference === 0) return guess;
    guess += difference;
  }
  return null; // A nonexistent wall time at a forward clock transition.
}

function clockMinutes(clock: string): number {
  const [hour, minute] = clock.split(":").map(Number);
  return hour * 60 + minute;
}

export function isSlotFree(startIso: string, durationMin: Duration, busy: readonly BusyInterval[], now: Date): boolean {
  const start = Date.parse(startIso);
  const current = now.getTime();
  if (!Number.isFinite(start) || !Number.isFinite(current) || !bookingRules.durations.includes(durationMin)) return false;
  if (start < current + bookingRules.minNoticeHours * 60 * MINUTE || start > current + bookingRules.maxDaysAhead * DAY) return false;
  const local = new Date(wallTime(start));
  const minute = local.getUTCHours() * 60 + local.getUTCMinutes();
  const workStart = clockMinutes(bookingRules.workStart);
  if (!(bookingRules.workDays as readonly number[]).includes(local.getUTCDay()) ||
      minute < workStart || minute + durationMin > clockMinutes(bookingRules.workEnd) ||
      (minute - workStart) % bookingRules.slotStepMin !== 0 || start % MINUTE !== 0) return false;
  const bufferedStart = start - bookingRules.bufferMin * MINUTE;
  const bufferedEnd = start + (durationMin + bookingRules.bufferMin) * MINUTE;
  return busy.every(interval => {
    const from = Date.parse(interval.start);
    const to = Date.parse(interval.end);
    // Fail closed if availability data is malformed.
    return Number.isFinite(from) && Number.isFinite(to) && from < to && (bufferedEnd <= from || bufferedStart >= to);
  });
}

/** Includes starts in [fromIso, toIso), clipped to the notice and booking horizon. */
export function computeSlots(args: { fromIso: string; toIso: string; durationMin: Duration; busy: readonly BusyInterval[]; now: Date }): string[] {
  const { durationMin, busy, now } = args;
  const from = Math.max(Date.parse(args.fromIso), now.getTime() + bookingRules.minNoticeHours * 60 * MINUTE);
  const to = Math.min(Date.parse(args.toIso), now.getTime() + bookingRules.maxDaysAhead * DAY + 1);
  if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to || !bookingRules.durations.includes(durationMin)) return [];
  const slots: string[] = [];
  const firstDay = Math.floor(wallTime(from) / DAY) * DAY;
  const lastDay = Math.floor(wallTime(to - 1) / DAY) * DAY;
  for (let day = firstDay; day <= lastDay; day += DAY) {
    if (!(bookingRules.workDays as readonly number[]).includes(new Date(day).getUTCDay())) continue;
    for (let minute = clockMinutes(bookingRules.workStart); minute + durationMin <= clockMinutes(bookingRules.workEnd); minute += bookingRules.slotStepMin) {
      const start = wallToUtc(day + minute * MINUTE);
      if (start === null || start < from || start >= to) continue;
      const iso = new Date(start).toISOString();
      if (isSlotFree(iso, durationMin, busy, now)) slots.push(iso);
    }
  }
  return slots.sort();
}

/** UTC month bounds, with an exclusive end, for availability queries. */
export function monthRange(month: string): { fromIso: string; toIso: string } | null {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return null;
  const from = new Date(`${month}-01T00:00:00.000Z`);
  const to = new Date(from);
  to.setUTCMonth(to.getUTCMonth() + 1);
  return { fromIso: from.toISOString(), toIso: to.toISOString() };
}
