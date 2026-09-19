import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const env = { clientId: "client", clientSecret: "secret", refreshToken: "refresh", calendarId: "owner@example.com" };
const input = { startIso: "2026-09-21T07:00:00Z", endIso: "2026-09-21T07:30:00Z", name: "Alex", email: "alex@example.com", note: "Discuss the project", requestId: "request-123" };
const from = "2026-09-01T00:00:00Z";
const to = "2026-10-01T00:00:00Z";
const token = () => Response.json({ access_token: "access", expires_in: 3600 });
const freeBusy = () => Response.json({ calendars: { [env.calendarId]: { busy: [{ start: input.startIso, end: input.endIso }] } } });
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.resetModules();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-19T00:00:00Z"));
});
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

describe("Google Calendar provider", () => {
  it("exchanges a refresh token and shapes a freeBusy request", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(freeBusy());
    expect(await createGoogleProvider(env).getBusy(from, to)).toEqual([{ start: input.startIso, end: input.endIso }]);
    const [tokenUrl, tokenInit] = fetchMock.mock.calls[0];
    expect(tokenUrl).toBe("https://oauth2.googleapis.com/token");
    expect(tokenInit).toMatchObject({ method: "POST", cache: "no-store", headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    expect(Object.fromEntries(new URLSearchParams(tokenInit?.body as string))).toEqual({ grant_type: "refresh_token", client_id: "client", client_secret: "secret", refresh_token: "refresh" });
    const [busyUrl, busyInit] = fetchMock.mock.calls[1];
    expect(busyUrl).toBe("https://www.googleapis.com/calendar/v3/freeBusy");
    expect(busyInit).toMatchObject({ method: "POST", cache: "no-store", headers: { Authorization: "Bearer access", "Content-Type": "application/json" } });
    expect(JSON.parse(busyInit?.body as string)).toEqual({ timeMin: from, timeMax: to, timeZone: "Africa/Cairo", items: [{ id: env.calendarId }] });
  });

  it("creates an event with a Meet conference and sends the invitation", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(Response.json({ id: "event-1", htmlLink: "https://calendar.google.com/event-1", hangoutLink: "https://meet.google.com/fallback", conferenceData: { entryPoints: [{ entryPointType: "phone", uri: "tel:123" }, { entryPointType: "video", uri: "https://meet.google.com/video" }] } }));
    expect(await createGoogleProvider(env).createEvent(input)).toEqual({ eventId: "event-1", meetUrl: "https://meet.google.com/video", htmlLink: "https://calendar.google.com/event-1" });
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe("https://www.googleapis.com/calendar/v3/calendars/owner%40example.com/events?conferenceDataVersion=1&sendUpdates=all");
    expect(JSON.parse(init?.body as string)).toEqual({
      summary: "Billion discovery call: Alex", description: input.note,
      start: { dateTime: input.startIso, timeZone: "Africa/Cairo" },
      end: { dateTime: input.endIso, timeZone: "Africa/Cairo" },
      attendees: [{ email: input.email }],
      conferenceData: { createRequest: { requestId: input.requestId, conferenceSolutionKey: { type: "hangoutsMeet" } } },
    });
  });

  it.each([
    [{ id: "event", hangoutLink: "https://meet.google.com/fallback" }, "https://meet.google.com/fallback"],
    [{ id: "event" }, null],
  ])("handles absent conference entry points", async (response, expected) => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(Response.json(response));
    expect(await createGoogleProvider(env).createEvent({ ...input, note: undefined })).toEqual({ eventId: "event", meetUrl: expected, htmlLink: null });
  });

  it.each([
    ["a non-Meet host", { id: "event", hangoutLink: "https://evil.example/meet.google.com" }],
    ["a look-alike host", { id: "event", hangoutLink: "https://meet.google.com.evil.example/x" }],
    ["a non-https scheme", { id: "event", hangoutLink: "javascript:alert(1)" }],
    ["an unparsable value", { id: "event", hangoutLink: "not a url" }],
  ])("returns a null meetUrl for %s", async (_label, response) => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(Response.json(response));
    expect((await createGoogleProvider(env).createEvent(input)).meetUrl).toBeNull();
  });

  it("falls back to hangoutLink when the video entry point is not a Meet address", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(Response.json({
      id: "event", hangoutLink: "https://meet.google.com/ok", conferenceData: { entryPoints: [{ entryPointType: "video", uri: "https://evil.example/x" }] },
    }));
    expect((await createGoogleProvider(env).createEvent(input)).meetUrl).toBe("https://meet.google.com/ok");
  });

  it("carries the HTTP status on the thrown error", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(new Response("private details", { status: 403 }));
    await expect(createGoogleProvider(env).createEvent(input)).rejects.toMatchObject({ message: "403", status: 403 });
  });

  it("shares cached tokens between providers and refreshes exactly 60 seconds before expiry", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockImplementation(async url => url === "https://oauth2.googleapis.com/token" ? token() : freeBusy());
    const provider = createGoogleProvider(env);
    await provider.getBusy(from, to);
    vi.advanceTimersByTime(3_539_000);
    await createGoogleProvider(env).getBusy(from, to);
    expect(fetchMock.mock.calls.filter(([url]) => url === "https://oauth2.googleapis.com/token")).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    await provider.getBusy(from, to);
    expect(fetchMock.mock.calls.filter(([url]) => url === "https://oauth2.googleapis.com/token")).toHaveLength(2);
  });

  it("coalesces concurrent token requests and isolates different credentials", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockImplementation(async url => url === "https://oauth2.googleapis.com/token" ? token() : freeBusy());
    const provider = createGoogleProvider(env);
    await Promise.all([provider.getBusy(from, to), provider.getBusy(from, to)]);
    expect(fetchMock.mock.calls.filter(([url]) => url === "https://oauth2.googleapis.com/token")).toHaveLength(1);
    await createGoogleProvider({ ...env, refreshToken: "another" }).getBusy(from, to);
    expect(fetchMock.mock.calls.filter(([url]) => url === "https://oauth2.googleapis.com/token")).toHaveLength(2);
  });

  it.each([400, 401, 403, 429, 500])("exposes only HTTP status %i for failed token exchange", async status => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(new Response("sensitive upstream error", { status }));
    await expect(createGoogleProvider(env).getBusy(from, to)).rejects.toMatchObject({ message: String(status), status });
  });

  it("exposes only the HTTP status for failed Calendar calls", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(new Response("private details", { status: 403 }));
    await expect(createGoogleProvider(env).createEvent(input)).rejects.toMatchObject({ message: "403", status: 403 });
  });

  it("keeps only Google's short error code for a failed token exchange", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(Response.json({ error: "invalid_client", error_description: "secret text" }, { status: 401 }));
    const error = await createGoogleProvider(env).getBusy(from, to).catch((e: Error) => e);
    expect(error).toMatchObject({ name: "GoogleHttpError", status: 401, step: "token", code: "invalid_client", message: "401" });
    expect(JSON.stringify(error)).not.toContain("secret text");
    expect(String((error as Error).stack)).not.toContain("secret text");
  });

  it.each([
    ["a non-JSON body", () => new Response("<html>oops</html>", { status: 401 })],
    ["an unexpected code", () => Response.json({ error: "bad code!\nwith text" }, { status: 401 })],
    ["a too-long code", () => Response.json({ error: "a".repeat(41) }, { status: 401 })],
    ["a non-string code", () => Response.json({ error: { status: 5 } }, { status: 401 })],
  ])("gives no code for %s", async (_label, makeResponse) => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(makeResponse());
    const error = await createGoogleProvider(env).getBusy(from, to).catch((e: Error) => e);
    expect(error).toMatchObject({ status: 401, step: "token", message: "401" });
    expect((error as { code?: string }).code).toBeUndefined();
  });

  it("reads the Calendar API error status and names the freebusy step", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(Response.json({ error: { status: "PERMISSION_DENIED", message: "x" } }, { status: 403 }));
    const error = await createGoogleProvider(env).getBusy(from, to).catch((e: Error) => e);
    expect(error).toMatchObject({ status: 403, step: "freebusy", code: "PERMISSION_DENIED", message: "403" });
  });

  it("names the insert step when creating an event fails", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(Response.json({ error: { status: "NOT_FOUND" } }, { status: 404 }));
    await expect(createGoogleProvider(env).createEvent(input)).rejects.toMatchObject({ status: 404, step: "insert", code: "NOT_FOUND" });
  });

  it("retries token exchange after a failed refresh", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(new Response("failed", { status: 500 })).mockResolvedValueOnce(token()).mockResolvedValueOnce(freeBusy());
    const provider = createGoogleProvider(env);
    await expect(provider.getBusy(from, to)).rejects.toThrow("500");
    await expect(provider.getBusy(from, to)).resolves.toHaveLength(1);
  });

  it.each([
    {},
    { calendars: { [env.calendarId]: { errors: [{ reason: "forbidden" }], busy: [] } } },
    { calendars: { [env.calendarId]: { busy: [{ start: "invalid", end: "invalid" }] } } },
  ])("fails closed for missing, errored, or malformed availability", async data => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token()).mockResolvedValueOnce(Response.json(data));
    await expect(createGoogleProvider(env).getBusy(from, to)).rejects.toThrow("Invalid calendar response");
  });
});

describe("Google Calendar provider timeouts", () => {
  it("passes an abort signal to every outbound request", async () => {
    const { createGoogleProvider } = await import("./google");
    fetchMock.mockResolvedValueOnce(token())
      .mockResolvedValueOnce(freeBusy())
      .mockResolvedValueOnce(Response.json({ id: "event-1" }));
    const provider = createGoogleProvider(env);
    await provider.getBusy(from, to);
    await provider.createEvent(input);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    for (const [, init] of fetchMock.mock.calls) expect(init?.signal).toBeInstanceOf(AbortSignal);
  });
});
