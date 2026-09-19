import { afterEach, describe, expect, it, vi } from "vitest";
import { createRateLimiter } from "./rate-limit";

afterEach(() => vi.useRealTimers());

describe("rate limiter", () => {
  it("allows the limit, denies excess requests, and isolates keys", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("a", 1)).toBe(true);
    expect(limiter.check("a", 2)).toBe(false);
    expect(limiter.check("b", 2)).toBe(true);
  });
  it("expires at the exact boundary without extending the window on denials", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("a", 999)).toBe(false);
    expect(limiter.check("b", 1000)).toBe(true);
    expect(limiter.check("a", 1000)).toBe(true);
    expect(limiter.check("a", 1001)).toBe(false);
  });
  it("uses the clock when now is omitted", () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("a")).toBe(false);
    vi.setSystemTime(1000);
    expect(limiter.check("a")).toBe(true);
  });
  it("rejects invalid configuration and time", () => {
    expect(() => createRateLimiter({ limit: 0, windowMs: 1000 })).toThrow();
    expect(() => createRateLimiter({ limit: 1, windowMs: -1 })).toThrow();
    expect(createRateLimiter({ limit: 1, windowMs: 1000 }).check("a", NaN)).toBe(false);
  });
});
