import { expect, it } from "vitest";
import { createMockProvider } from "./mock";

it("returns deterministic busy blocks and persists created events in memory", async () => {
  const provider = createMockProvider();
  const from = "2026-09-01T00:00:00Z";
  const to = "2026-10-01T00:00:00Z";
  const initial = await provider.getBusy(from, to);
  expect(initial).toHaveLength(2);
  expect(await createMockProvider().getBusy(from, to)).toEqual(initial);
  expect(await provider.getBusy("2026-09-02T09:45:00Z", "2026-09-02T11:15:00Z")).toEqual([initial[0]]);
  const input = { startIso: "2026-09-21T08:00:00Z", endIso: "2026-09-21T08:30:00Z", name: "Alex", email: "alex@example.com", requestId: "unique" };
  const event = await provider.createEvent(input);
  expect(event.meetUrl).toBe("https://meet.google.com/mock-mock-mock");
  expect(await provider.createEvent(input)).toEqual(event);
  expect(await provider.getBusy(from, to)).toEqual([...initial, { start: input.startIso, end: input.endIso }]);
  expect(await provider.getBusy("2026-10-01T00:00:00Z", "2026-11-01T00:00:00Z")).not.toContainEqual({ start: input.startIso, end: input.endIso });
});
