"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { tweenNumber } from "@/components/motion/tween";
import { performance as performanceContent } from "@/content/site";
import {
  getServerSnapshot,
  getSnapshot,
  isNotMeasuredVital,
  isSettledVital,
  isUnsupportedVital,
  subscribe,
  type VitalKey,
  type VitalRating,
} from "./vitals-store";

const RATING_WORD: Record<VitalRating, string> = {
  good: performanceContent.vitalStates.good,
  "needs-improvement": performanceContent.vitalStates.needsWork,
  poor: performanceContent.vitalStates.poor,
};

const RATING_ATTR: Record<VitalRating, "good" | "needs-work" | "poor"> = {
  good: "good",
  "needs-improvement": "needs-work",
  poor: "poor",
};

/**
 * Longest settled readout the layout needs to protect against ("2.45 s · needs work",
 * 19 characters) plus headroom for the `text-meta` letter-spacing, so the box that holds
 * it never has to grow when a placeholder is replaced by a real value. Awaiting/unsupported
 * placeholders may render wider than this floor; that transition follows user input (INP)
 * or happens well before layout has settled, so it does not count against CLS.
 */
const READOUT_MIN_WIDTH = "min-w-[22ch]";

/** How long the visually-hidden announcement waits for the metric to go quiet before it updates. */
const ANNOUNCE_DEBOUNCE_MS = 1_000;

/**
 * Rounding never flatters a rating: LCP rounds up to the next 10 ms then shows two-decimal
 * seconds, CLS rounds up to the next thousandth, INP rounds up to the next whole millisecond.
 * Same rule for the visible text and the screen-reader text.
 */
function formatMetric(metric: VitalKey, value: number): string {
  if (metric === "LCP") return `${(Math.ceil(value / 10) / 100).toFixed(2)} s`;
  if (metric === "CLS") return (Math.ceil(value * 1000) / 1000).toFixed(3);
  return `${Math.ceil(value)} ms`;
}

function metricUnitForSpeech(metric: VitalKey, value: number): string {
  if (metric === "LCP") return `${(Math.ceil(value / 10) / 100).toFixed(2)} seconds`;
  if (metric === "CLS") return (Math.ceil(value * 1000) / 1000).toFixed(3);
  return `${Math.ceil(value)} milliseconds`;
}

function vitalLabel(metric: VitalKey): string {
  return performanceContent.vitals.find((vital) => vital.key === metric)?.label ?? metric;
}

/**
 * Live reading for one Core Web Vital, backed by the `web-vitals` external store.
 * Server and first client render both print the waiting text so hydration cannot mismatch;
 * the number counts up once, the first time a reading arrives, unless motion is reduced.
 *
 * Only the visually-hidden sentence is exposed to assistive tech (the digits and rating word
 * are `aria-hidden`), inside a `role="status"` live region so it announces settled values —
 * never an in-flight tween frame — plus the awaiting/unsupported/not-measured states. That
 * sentence is debounced: `reportAllChanges` re-fires on every LCP candidate and every layout
 * shift, and re-announcing on each one would be noisy, so it only updates once the metric has
 * been quiet for a second.
 */
export function VitalValue({ metric }: { metric: VitalKey }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reading = snapshot[metric];
  const preference = useMotionPreference();
  const hasSettledReading = isSettledVital(reading);

  const waitingText = isUnsupportedVital(reading)
    ? performanceContent.vitalStates.unsupported
    : isNotMeasuredVital(reading)
      ? performanceContent.vitalStates.notMeasured
      : metric === "INP"
        ? performanceContent.vitalStates.awaitingInput
        : performanceContent.vitalStates.measuring;

  const ratingWord = hasSettledReading ? RATING_WORD[reading.rating] : null;

  const announcementText = hasSettledReading
    ? `${vitalLabel(metric)}: ${metricUnitForSpeech(metric, reading.value)}, ${ratingWord}`
    : `${vitalLabel(metric)}: ${waitingText}`;

  // Seeded with the value computed above so server render and first client render match
  // exactly; only updates thereafter, once `announcementText` has been stable for 1 s.
  const [announcement, setAnnouncement] = useState(announcementText);
  useEffect(() => {
    const timer = window.setTimeout(() => setAnnouncement(announcementText), ANNOUNCE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [announcementText]);

  // Only holds a value while the one-time count-up tween is running; null otherwise, so this
  // component renders the store's own reading directly and never needs to mirror it into state.
  const [tweenValue, setTweenValue] = useState<number | null>(null);
  const hasCountedRef = useRef(false);
  // Guards against starting a second, concurrent tween — separate from `hasCountedRef`, which
  // is only set once the tween actually completes (see the effect below).
  const inFlightRef = useRef(false);
  const targetRef = useRef(0);

  // Keep the latest settled value available to the count-up effect without making that effect
  // depend on the `reading` object itself (see below) — a plain ref write, not setState.
  useEffect(() => {
    if (isSettledVital(reading)) targetRef.current = reading.value;
  }, [reading]);

  useEffect(() => {
    // Keyed on whether a reading exists, not on the reading object: web-vitals reports the
    // same metric repeatedly (`reportAllChanges`), and re-running this effect on every one of
    // those reports would stop the in-flight tween mid-frame and leave the display frozen at
    // whatever partial value it had reached. Once started, the tween is left alone to finish.
    if (!hasSettledReading || hasCountedRef.current || inFlightRef.current || preference !== false) return;
    inFlightRef.current = true;

    const controls = tweenNumber({
      from: 0,
      // Read every tick rather than once: `reportAllChanges` can move the target (a later LCP
      // candidate, a CLS bump) while this tween is still running.
      to: () => targetRef.current,
      durationMs: 600,
      onUpdate: setTweenValue,
      onComplete: () => {
        // Only mark "already counted" once the tween actually finishes — not when it starts —
        // so React strict-mode's mount/cleanup/remount in `next dev` (which stops the first,
        // never-completed tween) doesn't leave the count-up permanently disabled.
        hasCountedRef.current = true;
        inFlightRef.current = false;
        setTweenValue(null);
      },
    });
    return () => {
      controls.stop();
      inFlightRef.current = false;
      // Never leave the display pinned to a partial tween frame.
      setTweenValue(null);
    };
  }, [hasSettledReading, preference]);

  const wrapperClassName = `inline-block ${READOUT_MIN_WIDTH} tabular-nums`;

  if (!hasSettledReading) {
    return (
      <span role="status" aria-live="polite" className={wrapperClassName}>
        <span aria-hidden="true">{waitingText}</span>
        <span className="sr-only">{announcement}</span>
      </span>
    );
  }

  const shownValue = tweenValue ?? reading.value;
  const ratingClassName =
    reading.rating === "good" ? "text-fg" : "text-fg underline decoration-kiln decoration-2 underline-offset-4";

  return (
    <span role="status" aria-live="polite" className={wrapperClassName}>
      <span className="whitespace-nowrap">
        <span aria-hidden="true">{formatMetric(metric, shownValue)}</span>
        <span aria-hidden="true"> &middot; </span>
        <span aria-hidden="true" data-rating={RATING_ATTR[reading.rating]} className={ratingClassName}>
          {ratingWord}
        </span>
      </span>
      <span className="sr-only">{announcement}</span>
    </span>
  );
}
