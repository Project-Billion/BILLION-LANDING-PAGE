const MAX_KEYS = 10_000;

export function createRateLimiter(opts: { limit: number; windowMs: number; maxKeys?: number }): {
  check(key: string, now?: number): boolean;
  /** Gives back one use of the key's allowance, e.g. for a request that turned out to be a honeypot hit. */
  refund(key: string): void;
} {
  if (!Number.isInteger(opts.limit) || opts.limit < 1 || !Number.isFinite(opts.windowMs) || opts.windowMs <= 0) throw new Error("Invalid rate limit configuration");
  const maxKeys = opts.maxKeys ?? MAX_KEYS;
  // A Map iterates in insertion order, so the first key is always the oldest window.
  const entries = new Map<string, { count: number; expiresAt: number }>();
  let lastSweep = -Infinity;
  return {
    check(key, now = Date.now()) {
      if (!Number.isFinite(now)) return false;
      // Sweep expired entries at most once per window so a check stays cheap.
      if (now - lastSweep >= opts.windowMs) {
        lastSweep = now;
        for (const [entryKey, entry] of entries) {
          if (now >= entry.expiresAt) entries.delete(entryKey);
        }
      }
      const entry = entries.get(key);
      if (!entry || now >= entry.expiresAt) {
        // Delete first so a restarted window moves to the newest position.
        entries.delete(key);
        // When full, evict the oldest entry rather than lock out new visitors.
        if (entries.size >= maxKeys) entries.delete(entries.keys().next().value as string);
        entries.set(key, { count: 1, expiresAt: now + opts.windowMs });
        return true;
      }
      if (entry.count >= opts.limit) return false;
      entry.count++;
      return true;
    },
    refund(key) {
      const entry = entries.get(key);
      if (entry && entry.count > 0) entry.count--;
    },
  };
}
