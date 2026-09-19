import { describe, expect, it } from "vitest";
import { parseBookingRequest } from "./validate";

const valid = { start: "2026-09-21T10:00:00+03:00", duration: 30, name: "Alex", email: "alex@example.com", note: "A project", timezone: "Africa/Cairo", website: "" };
const out = { start: "2026-09-21T07:00:00.000Z", duration: 30, name: "Alex", email: "alex@example.com", timezone: "Africa/Cairo" };
const invalid = { ok: false, error: "validation" };

describe("booking request validation", () => {
  it("normalizes the instant and accepts an absent note and the empty honeypot", () => {
    expect(parseBookingRequest({ ...valid, note: undefined })).toEqual({ ok: true, value: { ...out, note: "" } });
  });
  it.each([15, 30, 60])("accepts duration %i", duration => expect(parseBookingRequest({ ...valid, duration }).ok).toBe(true));
  it.each([null, [], "", 1, true, undefined])("rejects non-object body %s", body => expect(parseBookingRequest(body)).toEqual(invalid));
  it.each([
    { name: "" }, { name: " \r\n " }, { name: "x".repeat(101) }, { name: 5 },
    { email: "not-email" }, { email: "a@b" }, { email: "a b@example.com" }, { email: "a@@b.com" }, { email: 5 },
    { email: `${"x".repeat(243)}@example.com` },
    { note: "x".repeat(1001) }, { note: null }, { note: 4 },
    { duration: 0 }, { duration: 45 }, { duration: "30" },
    { timezone: "not/a-zone" }, { timezone: "" }, { timezone: null }, { timezone: "+02:00" }, { timezone: `Europe/${"x".repeat(60)}` },
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
    expect(result).toEqual({ ok: true, value: { ...out, note: "First\nSecond\nThird\nFourth" } });
  });
  it("requires the honeypot key to exist and be an empty string", () => {
    const withoutKey = Object.fromEntries(Object.entries(valid).filter(([key]) => key !== "website"));
    expect(withoutKey).not.toHaveProperty("website");
    expect(parseBookingRequest(withoutKey)).toEqual({ ok: false, error: "honeypot" });
  });
  it("strips control, bidi and zero-width characters from name, email and note but keeps note newlines", () => {
    const result = parseBookingRequest({
      ...valid, name: "A\u200Bl\u202Eex\t\u0000", email: "\uFEFFalex@exa\u2066mple.com\u200F", note: "Line one\u0007\u200B\r\nLine\u202A two\u0085",
    });
    expect(result).toEqual({ ok: true, value: { ...out, note: "Line one\nLine two" } });
  });
  it("counts name length after stripping hidden characters", () => {
    expect(parseBookingRequest({ ...valid, name: "\u200B\u200C\u0000" })).toEqual(invalid);
  });
  it("accepts UTC and another valid IANA zone", () => {
    expect(parseBookingRequest({ ...valid, timezone: "UTC" }).ok).toBe(true);
    expect(parseBookingRequest({ ...valid, timezone: "America/New_York" }).ok).toBe(true);
  });
});
