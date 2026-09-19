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

describe("rate limiter memory bounds", () => {
  it("sweeps expired entries and frees room for new keys", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("b", 1)).toBe(true);
    expect(limiter.check("c", 1000)).toBe(true);
    expect(limiter.check("c", 1001)).toBe(false);
  });
  it("evicts the oldest entry instead of denying a new key when the map is full of live keys", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("b", 1)).toBe(true);
    expect(limiter.check("c", 2)).toBe(true);
    // "a" was evicted, so it starts a fresh window; "b" and "c" are still tracked.
    expect(limiter.check("c", 3)).toBe(false);
    expect(limiter.check("a", 4)).toBe(true);
    expect(limiter.check("a", 5)).toBe(false);
  });
  it("still serves existing keys when the map is full", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, maxKeys: 1 });
    expect(limiter.check("a", 0)).toBe(true);
    expect(limiter.check("a", 1)).toBe(true);
    expect(limiter.check("a", 2)).toBe(false);
  });
});

describe("rate limiter refund", () => {
  it("gives one use back and ignores unknown keys", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check("a", 0)).toBe(true);
    limiter.refund("a");
    limiter.refund("unknown");
    expect(limiter.check("a", 1)).toBe(true);
    expect(limiter.check("a", 2)).toBe(false);
  });
});
