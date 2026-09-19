import { createGoogleProvider } from "./google";
import { createMockProvider } from "./mock";
import { ProviderNotConfiguredError, type CalendarProvider } from "./provider";

export type { BusyInterval, CreateEventInput, CreatedEvent, CalendarProvider } from "./provider";
export { ProviderNotConfiguredError } from "./provider";

/** Trims whitespace and line breaks and strips one pair of wrapping quotes, as often pasted by mistake. */
export function cleanEnv(value: string | undefined): string | undefined {
  let result = (value ?? "").trim();
  const first = result[0];
  if (result.length >= 2 && (first === '"' || first === "'") && result.endsWith(first)) result = result.slice(1, -1).trim();
  return result || undefined;
}

let provider: CalendarProvider | undefined;

export function getCalendarProvider(): CalendarProvider {
  if (provider) return provider;
  const clientId = cleanEnv(process.env.GOOGLE_CLIENT_ID);
  const clientSecret = cleanEnv(process.env.GOOGLE_CLIENT_SECRET);
  const refreshToken = cleanEnv(process.env.GOOGLE_REFRESH_TOKEN);
  if (clientId && clientSecret && refreshToken) {
    provider = createGoogleProvider({ clientId, clientSecret, refreshToken, calendarId: cleanEnv(process.env.GOOGLE_CALENDAR_ID) ?? "primary" });
  } else if (process.env.NODE_ENV === "development") {
    provider = createMockProvider();
  } else {
    throw new ProviderNotConfiguredError();
  }
  return provider;
}
