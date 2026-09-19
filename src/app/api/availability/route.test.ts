import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getBusy: vi.fn(), getCalendarProvider: vi.fn() }));
vi.mock("@/lib/booking", async importOriginal => ({ ...(await importOriginal<typeof import("@/lib/booking")>()), getCalendarProvider: mocks.getCalendarProvider }));

const get = async (query: string, ip = "9.9.9.9") => {
  const { GET } = await import("./route");
  return GET(new Request(`http://localhost/api/availability?${query}`, { headers: { "x-real-ip": ip } }));
};

beforeEach(() => {
  vi.resetModules();
  mocks.getBusy.mockReset().mockResolvedValue([]);
  mocks.getCalendarProvider.mockReset().mockReturnValue({ getBusy: mocks.getBusy });
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-19T00:00:00Z"));
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe("GET /api/availability", () => {
  it("returns slots for the month, queries busy once, and disables caching", async () => {
    const response = await get("month=2026-09&duration=30");
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    const { slots } = await response.json();
    expect(slots).toContain("2026-09-21T07:00:00.000Z");
    expect(slots.every((slot: string) => slot.startsWith("2026-09"))).toBe(true);
    expect(mocks.getBusy).toHaveBeenCalledTimes(1);
    expect(mocks.getBusy).toHaveBeenCalledWith("2026-09-01T00:00:00.000Z", "2026-10-01T00:00:00.000Z");
  });

  it.each([
    ["a month entirely in the past", "2026-08"],
    ["a month beyond the booking horizon", "2026-12"],
  ])("short-circuits %s without calling the provider", async (_label, month) => {
    const response = await get(`month=${month}&duration=30`);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ slots: [] });
    expect(mocks.getCalendarProvider).not.toHaveBeenCalled();
    expect(mocks.getBusy).not.toHaveBeenCalled();
  });

  it("still queries the provider for the last month inside the horizon slack", async () => {
    await get("month=2026-11&duration=30");
    expect(mocks.getBusy).toHaveBeenCalledTimes(1);
  });

  it("excludes slots that conflict with busy time", async () => {
    mocks.getBusy.mockResolvedValue([{ start: "2026-09-21T07:00:00Z", end: "2026-09-21T07:30:00Z" }]);
    const { slots } = await (await get("month=2026-09&duration=30")).json();
    expect(slots).not.toContain("2026-09-21T07:00:00.000Z");
  });

  it.each(["", "month=2026-13&duration=30", "month=2026-09", "month=2026-09&duration=45", "month=2026-09&duration=abc", "month=nope&duration=30"])(
    "rejects malformed input %j with 400 and no provider call", async query => {
      const response = await get(query);
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "validation" });
      expect(response.headers.get("Cache-Control")).toBe("no-store");
      expect(mocks.getBusy).not.toHaveBeenCalled();
    });

  it("returns 429 after 60 requests per minute for one IP only", async () => {
    for (let i = 0; i < 60; i++) expect((await get("month=2026-09&duration=30")).status).toBe(200);
    const limited = await get("month=2026-09&duration=30");
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: "rateLimited" });
    expect(limited.headers.get("Cache-Control")).toBe("no-store");
    expect((await get("month=2026-09&duration=30", "8.8.8.8")).status).toBe(200);
  });

  it("maps a missing configuration to 503", async () => {
    const { ProviderNotConfiguredError } = await import("@/lib/booking");
    mocks.getCalendarProvider.mockImplementation(() => { throw new ProviderNotConfiguredError(); });
    const response = await get("month=2026-09&duration=30");
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "notConfigured" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("maps provider failures to a generic 502 without leaking details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.getBusy.mockRejectedValue(new Error("secret provider detail"));
    const response = await get("month=2026-09&duration=30");
    expect(response.status).toBe(502);
    expect(await response.text()).toBe(JSON.stringify({ error: "generic" }));
  });
});
