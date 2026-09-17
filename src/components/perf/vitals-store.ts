"use client";

import { onCLS, onINP, onLCP, type Metric } from "web-vitals";

export type VitalKey = "LCP" | "CLS" | "INP";
export type VitalRating = "good" | "needs-improvement" | "poor";

/** Sentinel for a metric this browser's PerformanceObserver cannot ever report. */
export type UnsupportedVital = { unsupported: true };

/** Sentinel for a metric the browser supports but didn't report within the timeout
 *  (e.g. LCP/CLS never fire because the page loaded or stayed in a background tab). */
export type NotMeasuredVital = { notMeasured: true };

export type VitalReading =
  | { value: number; rating: VitalRating }
  | UnsupportedVital
  | NotMeasuredVital
  | null;

/** Snapshot handed to `useSyncExternalStore`; every key starts `null` until web-vitals reports it. */
export type VitalsSnapshot = Readonly<Record<VitalKey, VitalReading>>;

/** Reference-stable so `useSyncExternalStore`'s server snapshot never appears to change. */
const SERVER_SNAPSHOT: VitalsSnapshot = { LCP: null, CLS: null, INP: null };

const UNSUPPORTED: UnsupportedVital = { unsupported: true };
const NOT_MEASURED: NotMeasuredVital = { notMeasured: true };

/** How long a metric that the browser DOES support is allowed to sit unreported before we give up waiting. */
const REPORT_TIMEOUT_MS = 10_000;

let snapshot: VitalsSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
let started = false;

/** Pending timeout handles for LCP/CLS, keyed by metric; cleared the moment that metric reports. */
const timeoutHandles = new Map<VitalKey, number>();

export function isUnsupportedVital(reading: VitalReading): reading is UnsupportedVital {
  return reading !== null && "unsupported" in reading;
}

export function isNotMeasuredVital(reading: VitalReading): reading is NotMeasuredVital {
  return reading !== null && "notMeasured" in reading;
}

/** True once web-vitals has reported an actual value for this metric (not `null`, not a sentinel). */
export function isSettledVital(reading: VitalReading): reading is { value: number; rating: VitalRating } {
  return reading !== null && !isUnsupportedVital(reading) && !isNotMeasuredVital(reading);
}

function isTrackedVital(name: Metric["name"]): name is VitalKey {
  return name === "LCP" || name === "CLS" || name === "INP";
}

function report(metric: Metric): void {
  if (!isTrackedVital(metric.name)) return;
  // The capability check is the only thing allowed to mark a metric unsupported; a real
  // reading must never override that (and, since unsupported keys never get an onLCP/onCLS/
  // onINP listener registered, this should be unreachable — kept as a guard).
  if (isUnsupportedVital(snapshot[metric.name])) return;

  const pending = timeoutHandles.get(metric.name);
  if (pending !== undefined) {
    window.clearTimeout(pending);
    timeoutHandles.delete(metric.name);
  }

  // A real reading is welcome to replace `notMeasured` (a late LCP on slow 3G, reported
  // after the timeout already fired, is still useful) as well as `null`.
  snapshot = { ...snapshot, [metric.name]: { value: metric.value, rating: metric.rating } };
  listeners.forEach((listener) => listener());
}

function markUnsupported(keys: readonly VitalKey[]): void {
  if (keys.length === 0) return;
  snapshot = { ...snapshot, ...Object.fromEntries(keys.map((key) => [key, UNSUPPORTED])) };
  listeners.forEach((listener) => listener());
}

/** Marks keys `notMeasured`, but only if they're still waiting — never overwrites a real value. */
function markNotMeasured(keys: readonly VitalKey[]): void {
  const stillWaiting = keys.filter((key) => snapshot[key] === null);
  if (stillWaiting.length === 0) return;
  snapshot = { ...snapshot, ...Object.fromEntries(stillWaiting.map((key) => [key, NOT_MEASURED])) };
  listeners.forEach((listener) => listener());
}

/** True once the entries this metric relies on are guaranteed to exist in this browser. */
function supportsEntryType(type: string): boolean {
  return (
    typeof PerformanceObserver !== "undefined" &&
    PerformanceObserver.supportedEntryTypes?.includes(type) === true
  );
}

/** INP additionally needs the `interactionId` field Safari and Firefox don't populate. */
function supportsINP(): boolean {
  return (
    supportsEntryType("event") &&
    typeof PerformanceEventTiming !== "undefined" &&
    "interactionId" in PerformanceEventTiming.prototype
  );
}

/** Starts the web-vitals observers once, on the first subscriber, browser only. */
function start(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  const capable: Readonly<Record<VitalKey, boolean>> = {
    LCP: supportsEntryType("largest-contentful-paint"),
    CLS: supportsEntryType("layout-shift"),
    INP: supportsINP(),
  };

  markUnsupported((Object.keys(capable) as VitalKey[]).filter((key) => !capable[key]));

  if (capable.LCP) onLCP(report, { reportAllChanges: true });
  if (capable.CLS) onCLS(report, { reportAllChanges: true });
  if (capable.INP) onINP(report, { reportAllChanges: true });

  // INP legitimately waits for the visitor's first interaction; only LCP/CLS get a timeout.
  // A per-metric handle so a metric that reports late (e.g. the tab was backgrounded, so
  // web-vitals held LCP/FCP back) can cancel its own timeout instead of racing it.
  (["LCP", "CLS"] as const).forEach((key) => {
    if (!capable[key]) return;
    const handle: number = window.setTimeout(() => {
      timeoutHandles.delete(key);
      markNotMeasured([key]);
    }, REPORT_TIMEOUT_MS);
    timeoutHandles.set(key, handle);
  });
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  start();
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): VitalsSnapshot {
  return snapshot;
}

export function getServerSnapshot(): VitalsSnapshot {
  return SERVER_SNAPSHOT;
}
