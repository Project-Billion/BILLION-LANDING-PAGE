"use client";

import { useEffect, useState } from "react";

/** Id of the 1px sentinel Hero renders at (hero height − nav height) from the top of the page. */
const SENTINEL_ID = "hero-nav-sentinel";

/**
 * True once the hero has scrolled past the nav, so Nav can swap its transparent bar for the
 * floating pill. Backed by an IntersectionObserver on a sentinel placed inside Hero.tsx (no
 * scroll listeners); defaults to `false` for SSR and the first client render, matching the
 * top-of-page state and avoiding a hydration mismatch (same pattern as Reveal.tsx).
 */
export function useFloatingNav(): boolean {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById(SENTINEL_ID);
    if (!sentinel || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setFloating(!entry.isIntersecting);
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return floating;
}
