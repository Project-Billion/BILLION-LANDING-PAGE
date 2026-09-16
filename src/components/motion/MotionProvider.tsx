"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

function subscribeMotionPreference(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Motion's hook captures the initial preference; also observe changes while the page is open. */
export function useMotionPreference() {
  return useSyncExternalStore(
    subscribeMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => null,
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
