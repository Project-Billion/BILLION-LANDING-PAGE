"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import { tweenNumber } from "./tween";

interface CounterProps {
  /** Final value to display; also the server and reduced-motion render. */
  to: number;
  /** Decimal places to keep, matching the source copy (e.g. "38.2" needs 1). */
  decimals?: number;
}

/**
 * Counts up from 0 to `to` once, the first time it scrolls into view.
 * Server render and reduced motion both show the final number immediately, never zero.
 * A row already in view when the observer first fires (nothing to scroll to) also keeps
 * the final value as-is; only a later, scroll-triggered entry counts up.
 */
export function Counter({ to, decimals = 0 }: CounterProps) {
  const [display, setDisplay] = useState(to);
  const preference = useMotionPreference();
  const ref = useRef<HTMLSpanElement>(null);
  const hasRunRef = useRef(false);
  const controlsRef = useRef<ReturnType<typeof tweenNumber> | null>(null);

  // Read at intersection time, not at effect-setup time: the observer below is created once
  // and may fire well after `preference` or `to` last changed.
  const preferenceRef = useRef(preference);
  const toRef = useRef(to);
  useEffect(() => {
    preferenceRef.current = preference;
    toRef.current = to;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleEnter = () => {
      if (hasRunRef.current || preferenceRef.current !== false) return;
      hasRunRef.current = true;
      setDisplay(0);
      controlsRef.current = tweenNumber({ from: 0, to: toRef.current, durationMs: 800, onUpdate: setDisplay });
    };

    if (!("IntersectionObserver" in window)) {
      handleEnter();
      return;
    }

    // The very first callback fires immediately with the element's current visibility. If
    // it's already intersecting then, the row was in view before any scroll happened (e.g.
    // above the fold) — there's nothing to count up to, so keep the final value and only
    // treat a later, scroll-triggered entry as the count-up trigger.
    let isFirstCallback = true;

    const observer = new IntersectionObserver((entries) => {
      const intersecting = entries.some((entry) => entry.isIntersecting);
      const wasFirstCallback = isFirstCallback;
      isFirstCallback = false;

      if (!intersecting) return;

      if (wasFirstCallback) {
        hasRunRef.current = true;
      } else {
        handleEnter();
      }
      observer.disconnect();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Stop an in-flight tween on unmount rather than let it keep calling setState on a
  // component that's gone.
  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
    </span>
  );
}
