/**
 * Minimal numeric tween, driven by `requestAnimationFrame`, used in place of
 * Motion's standalone `animate`. The standalone `animate` pulls a separate
 * animation-engine chunk into the bundle; the count-up effects in this codebase
 * only ever tween a single number, so that engine is unnecessary weight.
 *
 * Eases with ease-out quart (`1 - (1 - t) ** 4`), which tracks the site's
 * `--ease-out` curve closely enough for a one-shot count-up.
 */

/** Options for {@link tweenNumber}. */
export interface TweenNumberOptions {
  /** Starting value. */
  from: number;
  /** Ending value, read once per frame; the last `onUpdate` call always receives its
   *  current result. Pass a function when the target can move while the tween runs. */
  to: number | (() => number);
  /** Duration of the tween, in milliseconds. */
  durationMs: number;
  /** Called on every animation frame with the current eased value. */
  onUpdate: (value: number) => void;
  /** Called once, immediately after the final `onUpdate` call. */
  onComplete?: () => void;
}

/** Handle returned by {@link tweenNumber} to cancel an in-flight tween. */
export interface TweenControls {
  /** Cancels the tween. No further `onUpdate` or `onComplete` calls follow. */
  stop: () => void;
}

function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4;
}

/**
 * Tweens a number from `from` to `to` over `durationMs` milliseconds.
 *
 * Server-safe: when called during SSR (`typeof window === "undefined"`) it
 * does nothing and returns a no-op `stop`, since `requestAnimationFrame` does
 * not exist there.
 */
export function tweenNumber(opts: TweenNumberOptions): TweenControls {
  if (typeof window === "undefined") {
    return { stop: () => {} };
  }

  const { from, to, durationMs, onUpdate, onComplete } = opts;
  const readTarget = typeof to === "function" ? to : () => to;
  let frame: number | null = null;
  let stopped = false;
  const startTime = performance.now();

  const tick = (now: number) => {
    if (stopped) return;

    const elapsed = now - startTime;
    const t = durationMs <= 0 ? 1 : Math.min(elapsed / durationMs, 1);
    const target = readTarget();

    if (t >= 1) {
      frame = null;
      onUpdate(target);
      onComplete?.();
      return;
    }

    onUpdate(from + (target - from) * easeOutQuart(t));
    // `onUpdate` can synchronously trigger `stop()` (e.g. an unmount cleanup run inline);
    // don't schedule another frame once that has happened.
    if (stopped) return;
    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);

  return {
    stop: () => {
      stopped = true;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    },
  };
}
