"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { bookingRules, type Duration } from "@/content/booking";
import { ApiError, fetchAvailability, type ApiErrorCode } from "./booking-api";
import { monthKeyInZone, shiftMonth } from "./dates";

const DAY_MS = 24 * 60 * 60 * 1000;

interface Options {
  /** The visitor-local month on screen ("YYYY-MM"), or null until the timezone is known. */
  visibleMonth: string | null;
  duration: Duration;
  /** Epoch ms captured when the page mounted. */
  now: number;
}

interface Availability {
  /** Every cached slot (UTC ISO strings) around the visible month, ready to group by local day. */
  slots: string[];
  /** True until the month that matches the visible one has arrived. */
  loading: boolean;
  error: ApiErrorCode | null;
  retry: () => void;
  /** Drops everything cached and fetches again (after a slot was taken). */
  refresh: () => void;
}

/**
 * The API answers per UTC month, while the calendar shows a visitor-local month, and the two
 * differ by up to a day at the edges. So for a visible month we fetch the previous, current and
 * next UTC month and let the caller group them by local day. Results are cached by month and
 * duration; only the matching month blocks the skeleton and can raise an error.
 */
export function useAvailability({ visibleMonth, duration, now }: Options): Availability {
  const [cache, setCache] = useState<ReadonlyMap<string, readonly string[]>>(() => new Map());
  const [failure, setFailure] = useState<{ key: string; code: ApiErrorCode } | null>(null);
  const [attempt, setAttempt] = useState(0);
  const cacheRef = useRef(cache);

  useEffect(() => {
    cacheRef.current = cache;
  }, [cache]);

  const firstMonth = monthKeyInZone(new Date(now), "UTC");
  const lastMonth = monthKeyInZone(new Date(now + (bookingRules.maxDaysAhead + 1) * DAY_MS), "UTC");
  const months = visibleMonth
    ? [shiftMonth(visibleMonth, -1), visibleMonth, shiftMonth(visibleMonth, 1)].filter((m) => m >= firstMonth && m <= lastMonth)
    : [];
  const requiredKey = visibleMonth && months.includes(visibleMonth) ? `${visibleMonth}|${duration}` : null;
  const monthsSignature = months.join(",");

  useEffect(() => {
    if (!monthsSignature) return;
    const controller = new AbortController();
    const required = requiredKey?.split("|")[0];
    for (const month of monthsSignature.split(",")) {
      const key = `${month}|${duration}`;
      if (cacheRef.current.has(key)) continue;
      fetchAvailability(month, duration, controller.signal).then(
        (slots) => setCache((previous) => new Map(previous).set(key, slots)),
        (error: unknown) => {
          if (controller.signal.aborted || month !== required) return;
          setFailure({ key, code: error instanceof ApiError ? error.code : "generic" });
        },
      );
    }
    return () => controller.abort();
  }, [monthsSignature, requiredKey, duration, attempt]);

  // A cached result for the required month wins over an older failure, so a good refetch clears the error.
  const error = requiredKey !== null && !cache.has(requiredKey) && failure?.key === requiredKey ? failure.code : null;
  const slots = useMemo(
    () => (monthsSignature ? monthsSignature.split(",") : []).flatMap((month) => cache.get(`${month}|${duration}`) ?? []),
    [cache, monthsSignature, duration],
  );
  const loading = requiredKey !== null && !cache.has(requiredKey) && error === null;

  return {
    slots,
    loading,
    error,
    retry: () => {
      setFailure(null);
      setAttempt((value) => value + 1);
    },
    refresh: () => {
      setFailure(null);
      setCache(new Map());
      setAttempt((value) => value + 1);
    },
  };
}
