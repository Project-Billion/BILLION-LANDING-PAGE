import { afterEach, beforeEach, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  for (const name of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN", "GOOGLE_CALENDAR_ID"]) vi.stubEnv(name, "");
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

it("memoizes the development mock", async () => {
  vi.stubEnv("NODE_ENV", "development");
  const { getCalendarProvider } = await import("./index");
  expect(getCalendarProvider()).toBe(getCalendarProvider());
});

it.each(["production", "test"])("never falls back to mock in %s", async mode => {
  vi.stubEnv("NODE_ENV", mode);
  vi.stubEnv("GOOGLE_CLIENT_ID", "partial-credentials");
  const { getCalendarProvider, ProviderNotConfiguredError } = await import("./index");
  expect(() => getCalendarProvider()).toThrow(ProviderNotConfiguredError);
});

it("uses Google when configured and defaults to the primary calendar", async () => {
  vi.stubEnv("NODE_ENV", "development");
  vi.stubEnv("GOOGLE_CLIENT_ID", "client");
  vi.stubEnv("GOOGLE_CLIENT_SECRET", "secret");
  vi.stubEnv("GOOGLE_REFRESH_TOKEN", "refresh");
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ access_token: "token", expires_in: 3600 })).mockResolvedValueOnce(Response.json({ calendars: { primary: { busy: [] } } }));
  vi.stubGlobal("fetch", fetchMock);
  const { getCalendarProvider } = await import("./index");
  expect(getCalendarProvider()).toBe(getCalendarProvider());
  await getCalendarProvider().getBusy("2026-09-01T00:00:00Z", "2026-10-01T00:00:00Z");
  expect(JSON.parse(fetchMock.mock.calls[1][1]?.body as string).items).toEqual([{ id: "primary" }]);
});
