export interface BusyInterval { start: string; end: string }

export interface CreateEventInput {
  startIso: string;
  endIso: string;
  name: string;
  email: string;
  note?: string;
  requestId: string;
}

export interface CreatedEvent {
  eventId: string;
  meetUrl: string | null;
  htmlLink: string | null;
}

export interface CalendarProvider {
  getBusy(fromIso: string, toIso: string): Promise<BusyInterval[]>;
  createEvent(input: CreateEventInput): Promise<CreatedEvent>;
}

export class ProviderNotConfiguredError extends Error {
  constructor() {
    super("Calendar provider is not configured");
    this.name = "ProviderNotConfiguredError";
  }
}
