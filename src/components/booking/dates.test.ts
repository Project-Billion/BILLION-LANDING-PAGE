import { describe, expect, it } from "vitest";
import {
  calendarCells,
  dayKeyInZone,
  formatLongDate,
  formatMonthTitle,
  formatOffset,
  formatShortDate,
  formatTime,
  groupSlotsByLocalDay,
  monthKey,
  shiftMonth,
  zoneCity,
} from "./dates";

describe("monthKey and shiftMonth", () => {
  it("pads the month and rolls over years in both directions", () => {
    expect(monthKey(2026, 8)).toBe("2026-09");
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2027-01", -1)).toBe("2026-12");
    expect(shiftMonth("2026-09", 0)).toBe("2026-09");
  });
});

describe("formatTime", () => {
  it("formats 24 hour time in the chosen timezone", () => {
    expect(formatTime("2026-09-21T08:00:00.000Z", "Africa/Cairo")).toBe("11:00");
    expect(formatTime("2026-09-21T08:00:00.000Z", "UTC")).toBe("08:00");
  });

  it("never renders midnight as 24:00", () => {
    expect(formatTime("2026-09-20T21:00:00.000Z", "Africa/Cairo")).toBe("00:00");
  });

  it("follows the daylight saving offset in effect on that date (Auckland, 27 Sep 2026)", () => {
    expect(formatTime("2026-09-26T10:00:00.000Z", "Pacific/Auckland")).toBe("22:00");
    expect(formatTime("2026-09-27T10:00:00.000Z", "Pacific/Auckland")).toBe("23:00");
  });
});

describe("formatOffset and zoneCity", () => {
  it("reports the offset at the given instant", () => {
    expect(formatOffset("2026-09-21T08:00:00.000Z", "Africa/Cairo")).toBe("GMT+3");
    expect(formatOffset("2026-09-21T08:00:00.000Z", "Asia/Kolkata")).toBe("GMT+5:30");
  });

  it("turns a zone id into a readable city", () => {
    expect(zoneCity("Africa/Cairo")).toBe("Cairo");
    expect(zoneCity("America/Argentina/Buenos_Aires")).toBe("Buenos Aires");
    expect(zoneCity("UTC")).toBe("UTC");
  });
});

describe("date labels", () => {
  it("formats long and short dates from a day key", () => {
    expect(formatLongDate("2026-09-21")).toBe("Monday 21 September");
    expect(formatShortDate("2026-09-21")).toBe("Mon 21 Sep");
    expect(formatMonthTitle("2026-09")).toBe("September 2026");
  });
});

describe("dayKeyInZone", () => {
  it("returns a different day than UTC when the offset crosses midnight", () => {
    expect(dayKeyInZone("2026-09-20T14:30:00.000Z", "UTC")).toBe("2026-09-20");
    expect(dayKeyInZone("2026-09-20T14:30:00.000Z", "Pacific/Auckland")).toBe("2026-09-21");
    expect(dayKeyInZone("2026-09-21T02:00:00.000Z", "America/Los_Angeles")).toBe("2026-09-20");
  });
});

describe("groupSlotsByLocalDay", () => {
  it("groups by the Cairo day and orders slots in time", () => {
    const groups = groupSlotsByLocalDay(
      ["2026-09-21T09:00:00.000Z", "2026-09-20T07:00:00.000Z", "2026-09-21T07:00:00.000Z"],
      "Africa/Cairo",
    );
    expect([...groups.keys()]).toEqual(["2026-09-20", "2026-09-21"]);
    expect(groups.get("2026-09-21")).toEqual(["2026-09-21T07:00:00.000Z", "2026-09-21T09:00:00.000Z"]);
  });

  it("moves the last Cairo slot of a day into the next local day for an Auckland visitor", () => {
    // 17:30 in Cairo on Sun 20 Sep is 14:30 UTC, which is 02:30 on Mon 21 Sep in Auckland (UTC+12).
    const lastCairoSlot = "2026-09-20T14:30:00.000Z";
    const inCairo = groupSlotsByLocalDay([lastCairoSlot], "Africa/Cairo");
    const inAuckland = groupSlotsByLocalDay([lastCairoSlot], "Pacific/Auckland");
    expect([...inCairo.keys()]).toEqual(["2026-09-20"]);
    expect([...inAuckland.keys()]).toEqual(["2026-09-21"]);
  });

  it("splits a month that crosses a daylight saving change on the correct local day", () => {
    // Auckland moves from UTC+12 to UTC+13 at 02:00 on 27 Sep 2026 (14:00 UTC on the 26th).
    const groups = groupSlotsByLocalDay(
      [
        "2026-09-26T11:30:00.000Z", // 23:30 on the 26th
        "2026-09-26T13:30:00.000Z", // 01:30 on the 27th, still UTC+12
        "2026-09-26T14:00:00.000Z", // 03:00 on the 27th, now UTC+13
        "2026-09-27T10:00:00.000Z", // 23:00 on the 27th
        "2026-09-27T11:30:00.000Z", // 00:30 on the 28th
      ],
      "Pacific/Auckland",
    );
    expect(groups.get("2026-09-26")).toEqual(["2026-09-26T11:30:00.000Z"]);
    expect(groups.get("2026-09-27")).toEqual([
      "2026-09-26T13:30:00.000Z",
      "2026-09-26T14:00:00.000Z",
      "2026-09-27T10:00:00.000Z",
    ]);
    expect(groups.get("2026-09-28")).toEqual(["2026-09-27T11:30:00.000Z"]);
  });

  it("keeps both 01:30 slots on the fall-back day in New York", () => {
    const groups = groupSlotsByLocalDay(["2026-11-01T05:30:00.000Z", "2026-11-01T06:30:00.000Z"], "America/New_York");
    expect(groups.get("2026-11-01")).toHaveLength(2);
    expect(formatTime("2026-11-01T05:30:00.000Z", "America/New_York")).toBe("01:30");
    expect(formatTime("2026-11-01T06:30:00.000Z", "America/New_York")).toBe("01:30");
  });

  it("drops duplicate instants and handles an empty list", () => {
    const slot = "2026-09-21T07:00:00.000Z";
    expect(groupSlotsByLocalDay([slot, slot], "UTC").get("2026-09-21")).toEqual([slot]);
    expect(groupSlotsByLocalDay([], "UTC").size).toBe(0);
  });
});

describe("calendarCells", () => {
  it("starts on Sunday and pads to whole weeks (September 2026 starts on a Tuesday)", () => {
    const cells = calendarCells("2026-09");
    expect(cells).toHaveLength(35);
    expect(cells.slice(0, 3)).toEqual([null, null, "2026-09-01"]);
    expect(cells[31]).toBe("2026-09-30");
    expect(cells.slice(32)).toEqual([null, null, null]);
    expect(cells.filter(Boolean)).toHaveLength(30);
  });

  it("handles a month that starts on Sunday and a leap February", () => {
    expect(calendarCells("2026-02")[0]).toBe("2026-02-01");
    expect(calendarCells("2028-02").filter(Boolean)).toHaveLength(29);
    expect(calendarCells("2028-02").length % 7).toBe(0);
  });
});
