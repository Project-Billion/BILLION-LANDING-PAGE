import { describe, expect, it } from "vitest";
import { computeSlots, isSlotFree, monthRange } from "./slots";
import type { Duration } from "@/content/booking";

const now = new Date("2026-01-01T00:00:00Z");
const day = (date: string, durationMin: Duration = 30) => computeSlots({
  fromIso: `${date}T00:00:00Z`, toIso: `${date}T23:59:59Z`, durationMin, busy: [], now,
});

describe("slot rules", () => {
  it("excludes Friday and Saturday but includes Sunday through Thursday", () => {
    expect(day("2026-01-02")).toEqual([]);
    expect(day("2026-01-03")).toEqual([]);
    for (const date of ["04", "05", "06", "07", "08"]) expect(day(`2026-01-${date}`)).toHaveLength(16);
  });

  it.each([15, 30, 60] as const)("keeps %i minute calls inside 10:00-18:00 Cairo", duration => {
    const slots = day("2026-01-04", duration);
    expect(slots[0]).toBe("2026-01-04T08:00:00.000Z");
    expect(slots.at(-1)).toBe(duration === 60 ? "2026-01-04T15:00:00.000Z" : "2026-01-04T15:30:00.000Z");
    expect(slots).toHaveLength(duration === 60 ? 15 : 16);
    expect(slots).toEqual([...new Set(slots)].sort());
    for (const slot of slots) expect(isSlotFree(slot, duration, [], now)).toBe(true);
  });

  it("rejects starts outside hours, off the grid, and containing seconds or milliseconds", () => {
    for (const time of ["07:30:00", "16:00:00", "08:15:00", "08:00:01", "08:00:00.001"]) {
      expect(isSlotFree(`2026-01-04T${time}Z`, 30, [], now)).toBe(false);
    }
    expect(isSlotFree("2026-01-04T15:30:00Z", 60, [], now)).toBe(false);
    expect(isSlotFree("2026-01-04T15:00:00Z", 60, [], now)).toBe(true);
  });

  it("requires a 15-minute buffer on both sides with touching boundaries allowed", () => {
    const busy = [{ start: "2026-01-04T09:00:00Z", end: "2026-01-04T10:00:00Z" }];
    expect(isSlotFree("2026-01-04T08:00:00Z", 30, busy, now)).toBe(true);
    expect(isSlotFree("2026-01-04T08:30:00Z", 15, busy, now)).toBe(true);
    expect(isSlotFree("2026-01-04T08:30:00Z", 30, busy, now)).toBe(false);
    expect(isSlotFree("2026-01-04T09:00:00Z", 30, busy, now)).toBe(false);
    expect(isSlotFree("2026-01-04T10:00:00Z", 30, busy, now)).toBe(false);
    expect(isSlotFree("2026-01-04T10:30:00Z", 30, busy, now)).toBe(true);
    expect(isSlotFree("2026-01-04T10:00:00Z", 30, [{ start: busy[0].start, end: "2026-01-04T09:45:00Z" }], now)).toBe(true);
    const slots = computeSlots({ fromIso: "2026-01-04T00:00:00Z", toIso: "2026-01-05T00:00:00Z", durationMin: 30, busy, now });
    expect(slots).not.toContain("2026-01-04T08:30:00.000Z");
    expect(slots).not.toContain("2026-01-04T10:00:00.000Z");
  });

  it("allows exactly 24 hours notice and rejects one millisecond less", () => {
    const start = "2026-01-04T08:00:00Z";
    expect(isSlotFree(start, 30, [], new Date("2026-01-03T08:00:00Z"))).toBe(true);
    expect(isSlotFree(start, 30, [], new Date("2026-01-03T08:00:00.001Z"))).toBe(false);
  });

  it("includes the exact 30-day horizon and excludes later starts", () => {
    const current = new Date("2026-01-05T08:00:00Z");
    expect(isSlotFree("2026-02-04T08:00:00Z", 30, [], current)).toBe(true);
    expect(isSlotFree("2026-02-04T08:30:00Z", 30, [], current)).toBe(false);
    expect(computeSlots({ fromIso: "2026-02-04T00:00:00Z", toIso: "2026-02-05T00:00:00Z", durationMin: 30, busy: [], now: current })).toEqual(["2026-02-04T08:00:00.000Z"]);
  });

  it("uses an inclusive range start and exclusive range end", () => {
    expect(computeSlots({ fromIso: "2026-01-04T08:30:00Z", toIso: "2026-01-04T09:00:00Z", durationMin: 30, busy: [], now })).toEqual(["2026-01-04T08:30:00.000Z"]);
  });

  it("maps Cairo 10:00 to 08:00Z before the April 24, 2026 DST switch and 07:00Z after", () => {
    // IANA Egypt rule: April last Friday 00:00; https://data.iana.org/time-zones/tzdb-2026a/africa
    const slots = computeSlots({ fromIso: "2026-04-23T00:00:00Z", toIso: "2026-04-27T00:00:00Z", durationMin: 30, busy: [], now: new Date("2026-04-20T00:00:00Z") });
    expect(slots.filter(slot => slot.startsWith("2026-04-23"))[0]).toBe("2026-04-23T08:00:00.000Z");
    expect(slots.filter(slot => slot.startsWith("2026-04-26"))[0]).toBe("2026-04-26T07:00:00.000Z");
    expect(slots.some(slot => slot.startsWith("2026-04-24") || slot.startsWith("2026-04-25"))).toBe(false);
  });

  it("maps Cairo 10:00 across the October 30, 2026 return to standard time", () => {
    const slots = computeSlots({ fromIso: "2026-10-29T00:00:00Z", toIso: "2026-11-02T00:00:00Z", durationMin: 60, busy: [], now: new Date("2026-10-26T00:00:00Z") });
    expect(slots.filter(slot => slot.startsWith("2026-10-29"))[0]).toBe("2026-10-29T07:00:00.000Z");
    expect(slots.filter(slot => slot.startsWith("2026-11-01"))[0]).toBe("2026-11-01T08:00:00.000Z");
  });

  it("fails closed for invalid arguments and malformed busy data", () => {
    expect(isSlotFree("bad", 30, [], now)).toBe(false);
    expect(isSlotFree("2026-01-04T08:00:00Z", 45 as Duration, [], now)).toBe(false);
    expect(isSlotFree("2026-01-04T08:00:00Z", 30, [{ start: "bad", end: "bad" }], now)).toBe(false);
    expect(computeSlots({ fromIso: "bad", toIso: "bad", durationMin: 30, busy: [], now })).toEqual([]);
    expect(computeSlots({ fromIso: "2026-01-04T00:00:00Z", toIso: "2026-01-03T00:00:00Z", durationMin: 30, busy: [], now })).toEqual([]);
  });
});

describe("monthRange", () => {
  it.each(["", "2026-1", "2026-00", "2026-13", "26-01", "2026-01-01", " 2026-01"])("rejects malformed month %s", month => expect(monthRange(month)).toBeNull());
  it("handles leap months and year rollover", () => {
    expect(monthRange("2028-02")).toEqual({ fromIso: "2028-02-01T00:00:00.000Z", toIso: "2028-03-01T00:00:00.000Z" });
    expect(monthRange("2026-12")).toEqual({ fromIso: "2026-12-01T00:00:00.000Z", toIso: "2027-01-01T00:00:00.000Z" });
  });
});
