import { createGoogleProvider } from "./google";
import { createMockProvider } from "./mock";
import { ProviderNotConfiguredError, type CalendarProvider } from "./provider";

export type { BusyInterval, CreateEventInput, CreatedEvent, CalendarProvider } from "./provider";
export { ProviderNotConfiguredError } from "./provider";

let provider: CalendarProvider | undefined;

export function getCalendarProvider(): CalendarProvider {
  if (provider) return provider;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (clientId && clientSecret && refreshToken) {
    provider = createGoogleProvider({ clientId, clientSecret, refreshToken, calendarId: process.env.GOOGLE_CALENDAR_ID || "primary" });
  } else if (process.env.NODE_ENV === "development") {
    provider = createMockProvider();
  } else {
    throw new ProviderNotConfiguredError();
  }
  return provider;
}
