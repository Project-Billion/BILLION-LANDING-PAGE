export function createRateLimiter(opts: { limit: number; windowMs: number }): { check(key: string, now?: number): boolean } {
  if (!Number.isInteger(opts.limit) || opts.limit < 1 || !Number.isFinite(opts.windowMs) || opts.windowMs <= 0) throw new Error("Invalid rate limit configuration");
  const entries = new Map<string, { count: number; expiresAt: number }>();
  return {
    check(key, now = Date.now()) {
      if (!Number.isFinite(now)) return false;
      for (const [entryKey, entry] of entries) {
        if (now >= entry.expiresAt) entries.delete(entryKey);
      }
      const entry = entries.get(key);
      if (!entry) {
        entries.set(key, { count: 1, expiresAt: now + opts.windowMs });
        return true;
      }
      if (entry.count >= opts.limit) return false;
      entry.count++;
      return true;
    },
  };
}
