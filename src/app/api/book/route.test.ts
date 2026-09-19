import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getBusy: vi.fn(), createEvent: vi.fn(), getCalendarProvider: vi.fn() }));
vi.mock("@/lib/booking", async importOriginal => ({ ...(await importOriginal<typeof import("@/lib/booking")>()), getCalendarProvider: mocks.getCalendarProvider }));

const valid = { start: "2026-09-21T07:00:00.000Z", duration: 30, name: "Alex", email: "alex@example.com", note: "Hello", timezone: "Europe/London", website: "" };
const send = async (body: unknown, headers: Record<string, string> = {}, ip = "9.9.9.9") => {
  const { POST } = await import("./route");
  const text = typeof body === "string" ? body : JSON.stringify(body);
  return POST(new Request("http://localhost/api/book", {
    method: "POST", body: text,
    headers: { host: "localhost", origin: "http://localhost", "content-type": "application/json", "content-length": String(Buffer.byteLength(text)), "x-real-ip": ip, ...headers },
  }));
};
const post = (body: unknown, ip = "9.9.9.9") => send(body, {}, ip);

beforeEach(() => {
  vi.resetModules();
  mocks.getBusy.mockReset().mockResolvedValue([]);
  mocks.createEvent.mockReset().mockResolvedValue({ eventId: "e1", meetUrl: "https://meet.google.com/abc", htmlLink: null });
  mocks.getCalendarProvider.mockReset().mockReturnValue({ getBusy: mocks.getBusy, createEvent: mocks.createEvent });
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-19T00:00:00Z"));
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("POST /api/book", () => {
  it("books a free slot and returns only the confirmation fields", async () => {
    const response = await post(valid);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ ok: true, start: valid.start, end: "2026-09-21T07:30:00.000Z", durationMin: 30, meetUrl: "https://meet.google.com/abc" });
    expect(mocks.getBusy).toHaveBeenCalledWith("2026-09-20T07:00:00.000Z", "2026-09-22T07:00:00.000Z");
    expect(mocks.createEvent).toHaveBeenCalledWith({
      startIso: valid.start, endIso: "2026-09-21T07:30:00.000Z", name: "Alex", email: "alex@example.com", note: "Hello",
      requestId: expect.stringMatching(/^[0-9a-f-]{36}$/),
    });
  });

  it("returns a null meetUrl when the provider has none", async () => {
    mocks.createEvent.mockResolvedValue({ eventId: "e1", meetUrl: null, htmlLink: null });
    expect((await (await post(valid)).json()).meetUrl).toBeNull();
  });

  it.each([
    ["non-JSON body", "not json"],
    ["array body", []],
    ["bad email", { ...valid, email: "nope" }],
    ["bad duration", { ...valid, duration: 45 }],
    ["missing name", { ...valid, name: "" }],
    ["bad start", { ...valid, start: "tomorrow" }],
    ["bad timezone", { ...valid, timezone: "Nowhere/Land" }],
  ])("rejects %s with 400", async (_label, body) => {
    const response = await post(body);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "validation" });
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(mocks.createEvent).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions without touching the provider", async () => {
    const response = await post({ ...valid, website: "http://spam.example" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(mocks.getCalendarProvider).not.toHaveBeenCalled();
    expect(mocks.getBusy).not.toHaveBeenCalled();
    expect(mocks.createEvent).not.toHaveBeenCalled();
  });

  it("silently drops a submission with no honeypot key without consuming the rate limit", async () => {
    const withoutKey = Object.fromEntries(Object.entries(valid).filter(([key]) => key !== "website"));
    for (let i = 0; i < 8; i++) {
      const response = await post(withoutKey);
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
    }
    expect(mocks.createEvent).not.toHaveBeenCalled();
    for (let i = 0; i < 5; i++) expect((await post(valid)).status).toBe(200);
    expect((await post(valid)).status).toBe(429);
  });

  it("returns 409 when the slot conflicts with busy time", async () => {
    mocks.getBusy.mockResolvedValue([{ start: "2026-09-21T07:00:00Z", end: "2026-09-21T07:30:00Z" }]);
    const response = await post(valid);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "slotTaken" });
    expect(mocks.createEvent).not.toHaveBeenCalled();
  });

  it.each([
    ["outside working hours", "2026-09-21T02:00:00.000Z"],
    ["on a weekend", "2026-09-25T07:00:00.000Z"],
    ["inside the minimum notice", "2026-09-19T07:00:00.000Z"],
    ["off the slot grid", "2026-09-21T07:10:00.000Z"],
  ])("returns 409 for a slot %s", async (_label, start) => {
    const response = await post({ ...valid, start });
    expect(response.status).toBe(409);
    expect(mocks.createEvent).not.toHaveBeenCalled();
  });

  it("returns 429 after 5 bookings per hour for one IP only", async () => {
    for (let i = 0; i < 5; i++) expect((await post(valid)).status).toBe(200);
    const limited = await post(valid);
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: "rateLimited" });
    expect(limited.headers.get("Cache-Control")).toBe("no-store");
    expect((await post(valid, "8.8.8.8")).status).toBe(200);
  });

  it("applies a deployment-wide limit of 30 bookings per hour across IPs", async () => {
    for (let i = 0; i < 30; i++) expect((await post(valid, `10.0.0.${i}`)).status).toBe(200);
    const limited = await post(valid, "10.0.1.1");
    expect(limited.status).toBe(429);
    expect(await limited.json()).toEqual({ error: "rateLimited" });
  });

  it("charges the global limit only for real booking attempts", async () => {
    const busy = { start: "2026-09-21T07:00:00Z", end: "2026-09-21T07:30:00Z" };
    for (let i = 0; i < 40; i++) {
      expect((await post({ ...valid, email: "nope" }, `11.0.0.${i}`)).status).toBe(400);
      expect((await post({ ...valid, website: "spam" }, `12.0.0.${i}`)).status).toBe(200);
      mocks.getBusy.mockResolvedValueOnce([busy]);
      expect((await post(valid, `13.0.0.${i}`)).status).toBe(409);
    }
    expect(mocks.createEvent).not.toHaveBeenCalled();
    for (let i = 0; i < 30; i++) expect((await post(valid, `10.0.0.${i}`)).status).toBe(200);
    expect((await post(valid, "10.0.1.1")).status).toBe(429);
  });

  it("checks the rate limit before reading the body", async () => {
    for (let i = 0; i < 5; i++) await post(valid);
    expect((await post("not json")).status).toBe(429);
  });

  describe("request gatekeeping", () => {
    it.each([
      ["a missing Origin", { origin: "" }],
      ["a cross-site Origin", { origin: "https://evil.example" }],
      ["an unparsable Origin", { origin: "null" }],
      ["a look-alike Origin host", { origin: "http://localhost.evil.example" }],
    ])("rejects %s with 403", async (_label, headers) => {
      const response = await send(valid, headers);
      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({ error: "generic" });
      expect(mocks.createEvent).not.toHaveBeenCalled();
    });

    it("accepts an Origin that matches x-forwarded-host on Vercel", async () => {
      vi.stubEnv("VERCEL", "1");
      expect((await send(valid, { host: "internal:3000", origin: "https://billion.example", "x-forwarded-host": "billion.example" })).status).toBe(200);
    });

    it("ignores x-forwarded-host off Vercel", async () => {
      vi.stubEnv("VERCEL", "");
      const response = await send(valid, { host: "internal:3000", origin: "https://billion.example", "x-forwarded-host": "billion.example" });
      expect(response.status).toBe(403);
    });

    it.each([["a missing content type", { "content-type": "" }], ["a form content type", { "content-type": "text/plain" }]])("rejects %s with 400", async (_label, headers) => {
      const response = await send(valid, headers);
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "validation" });
    });

    it("accepts a content type with a charset", async () => {
      expect((await send(valid, { "content-type": "application/json; charset=utf-8" })).status).toBe(200);
    });

    it.each([
      ["a missing Content-Length", { "content-length": "" }],
      ["an oversized Content-Length", { "content-length": "8193" }],
      ["a non-numeric Content-Length", { "content-length": "many" }],
    ])("rejects %s with 400", async (_label, headers) => {
      const response = await send(valid, headers);
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "validation" });
      expect(mocks.createEvent).not.toHaveBeenCalled();
    });

    it("rejects a body longer than 8192 characters even when Content-Length understates it", async () => {
      const response = await send({ ...valid, note: "x".repeat(9000) }, { "content-length": "100" });
      expect(response.status).toBe(400);
      expect(mocks.getCalendarProvider).not.toHaveBeenCalled();
    });
  });

  describe("in-flight lock", () => {
    it("returns 409 for a concurrent request for the same start and releases the lock afterwards", async () => {
      let release!: () => void;
      mocks.getBusy.mockImplementationOnce(() => new Promise(resolve => { release = () => resolve([]); }));
      const first = post(valid);
      await vi.waitFor(() => expect(mocks.getBusy).toHaveBeenCalledTimes(1));
      const second = await post(valid, "8.8.8.8");
      expect(second.status).toBe(409);
      expect(await second.json()).toEqual({ error: "slotTaken" });
      release();
      expect((await first).status).toBe(200);
      expect((await post(valid, "7.7.7.7")).status).toBe(200);
    });

    it("releases the lock when the provider fails", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mocks.createEvent.mockRejectedValueOnce(new Error("boom"));
      expect((await post(valid)).status).toBe(502);
      expect((await post(valid, "8.8.8.8")).status).toBe(200);
    });
  });

  it("maps a missing configuration to 503", async () => {
    const { ProviderNotConfiguredError } = await import("@/lib/booking");
    mocks.getCalendarProvider.mockImplementation(() => { throw new ProviderNotConfiguredError(); });
    const response = await post(valid);
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "notConfigured" });
  });

  it.each(["getBusy", "createEvent"] as const)("maps a %s failure to a generic 502 without leaking details or input", async method => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mocks[method].mockRejectedValue(new Error("alex@example.com secret token"));
    const response = await post(valid);
    expect(response.status).toBe(502);
    expect(await response.text()).toBe(JSON.stringify({ error: "generic" }));
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("logs only the operation, a random request id and the upstream status", async () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.createEvent.mockRejectedValue(Object.assign(new Error("alex@example.com secret token"), { status: 403 }));
    await post(valid);
    expect(log).toHaveBeenCalledTimes(1);
    const [message, details] = log.mock.calls[0];
    expect(message).toBe("booking failed");
    expect(details).toEqual({ operation: "createEvent", requestId: expect.stringMatching(/^[0-9a-f-]{36}$/), status: 403 });
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/alex|secret|Hello/);
  });
});
