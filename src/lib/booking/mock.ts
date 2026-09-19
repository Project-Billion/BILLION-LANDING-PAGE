import type { BusyInterval, CalendarProvider, CreatedEvent } from "./provider";

export function createMockProvider(): CalendarProvider {
  const created: BusyInterval[] = [];
  const requests = new Map<string, CreatedEvent>();
  return {
    async getBusy(fromIso, toIso) {
      const from = Date.parse(fromIso);
      const to = Date.parse(toIso);
      const month = new Date(from);
      month.setUTCDate(1);
      month.setUTCHours(0, 0, 0, 0);
      const fake: BusyInterval[] = [];
      // Fixed dates within each month keep overlapping queries consistent.
      for (; month.getTime() < to; month.setUTCMonth(month.getUTCMonth() + 1)) {
        for (const offset of [1, 2]) {
          fake.push({
            start: new Date(month.getTime() + offset * 86_400_000 + 10 * 3_600_000).toISOString(),
            end: new Date(month.getTime() + offset * 86_400_000 + 11 * 3_600_000).toISOString(),
          });
        }
      }
      return [...fake, ...created].filter(interval => Date.parse(interval.start) < to && Date.parse(interval.end) > from).map(interval => ({ ...interval }));
    },
    async createEvent(input) {
      const existing = requests.get(input.requestId);
      if (existing) return { ...existing };
      created.push({ start: input.startIso, end: input.endIso });
      const event = { eventId: `mock-${input.requestId}`, meetUrl: "https://meet.google.com/mock-mock-mock", htmlLink: null };
      requests.set(input.requestId, event);
      return { ...event };
    },
  };
}
