"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Position in a group; each step adds --stagger-step (50ms) of delay. */
  index?: number;
  className?: string;
}

/**
 * Reveals its children once when they scroll into view: opacity plus a 12px rise,
 * --duration-reveal (600ms) on --ease-out. The hidden state only exists in CSS under
 * `prefers-reduced-motion: no-preference` and `scripting: enabled`, so reduced-motion
 * users and no-JS visitors see content immediately. Sets a data attribute instead of
 * React state, so revealing never re-renders the tree.
 */
export function Reveal({ children, index = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const show = () => {
      element.dataset.visible = "true";
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-index": index } as CSSProperties}>
      {children}
    </div>
  );
}
