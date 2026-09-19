import { describe, expect, it } from "vitest";
import { parseBookingRequest } from "./validate";

const valid = { start: "2026-09-21T10:00:00+03:00", duration: 30, name: "Alex", email: "alex@example.com", note: "A project", timezone: "Africa/Cairo" };
const invalid = { ok: false, error: "validation" };

describe("booking request validation", () => {
  it("normalizes the instant and accepts an absent note and empty honeypot", () => {
    expect(parseBookingRequest({ ...valid, note: undefined, website: "" })).toEqual({ ok: true, value: { ...valid, start: "2026-09-21T07:00:00.000Z", note: "" } });
  });
  it.each([15, 30, 60])("accepts duration %i", duration => expect(parseBookingRequest({ ...valid, duration }).ok).toBe(true));
  it.each([null, [], "", 1, true, undefined])("rejects non-object body %s", body => expect(parseBookingRequest(body)).toEqual(invalid));
  it.each([
    { name: "" }, { name: " \r\n " }, { name: "x".repeat(101) }, { name: 5 },
    { email: "not-email" }, { email: "a@b" }, { email: "a b@example.com" }, { email: "a@@b.com" }, { email: 5 },
    { email: `${"x".repeat(243)}@example.com` },
    { note: "x".repeat(1001) }, { note: null }, { note: 4 },
    { duration: 0 }, { duration: 45 }, { duration: "30" },
    { timezone: "not/a-zone" }, { timezone: "" }, { timezone: null }, { timezone: "+02:00" },
    { start: "2026-09-21" }, { start: "2026-09-21T10:00:00" }, { start: "tomorrow" },
    { start: "2026-02-30T10:00:00Z" }, { start: "2026-09-21T24:00:00Z" }, { start: null },
  ])("rejects invalid fields %j", patch => expect(parseBookingRequest({ ...valid, ...patch })).toEqual(invalid));
  it("accepts length boundaries", () => {
    expect(parseBookingRequest({ ...valid, name: "x".repeat(100), email: `${"x".repeat(242)}@example.com`, note: "x".repeat(1000) }).ok).toBe(true);
    expect(parseBookingRequest({ ...valid, name: " x " }).ok).toBe(true);
  });
  it.each(["https://spam.test", " ", null, false, 1])("rejects a filled honeypot %s", website => {
    expect(parseBookingRequest({ ...valid, website })).toEqual({ ok: false, error: "honeypot" });
  });
  it("strips CRLF from name/email and normalizes note line endings", () => {
    const result = parseBookingRequest({ ...valid, name: " Al\r\nex ", email: " alex@\r\nexample.com ", note: "First\r\nSecond\rThird\nFourth" });
    expect(result).toEqual({ ok: true, value: { ...valid, start: "2026-09-21T07:00:00.000Z", note: "First\nSecond\nThird\nFourth" } });
  });
  it("accepts UTC and another valid IANA zone", () => {
    expect(parseBookingRequest({ ...valid, timezone: "UTC" }).ok).toBe(true);
    expect(parseBookingRequest({ ...valid, timezone: "America/New_York" }).ok).toBe(true);
  });
});
