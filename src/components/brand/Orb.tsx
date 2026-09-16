"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ThinkingOrb as OrbComponent } from "thinking-orbs";
import { useMotionPreference } from "@/components/motion/MotionProvider";

const ThinkingOrb = dynamic(
  () => import("thinking-orbs").then(
    (m: { default?: typeof OrbComponent; ThinkingOrb: typeof OrbComponent }) => m.default ?? m.ThinkingOrb,
  ),
  { ssr: false },
);

/** Decorative full stop: its reserved line box survives loading, resizing and motion preferences. */
export function Orb({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const preference = useMotionPreference() ?? reducedMotion;
  const [inView, setInView] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [size, setSize] = useState(40);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width > 0) setSize(width);
    });
    resize?.observe(element);

    const visibility = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setHasEntered(true);
    }, { threshold: 0 });
    visibility?.observe(element);

    // The package sets the canvas dimensions and draws synchronously in its effect.
    // Wait for that mutation before replacing the disc, including a cached import.
    const painted = new MutationObserver(() => {
      const canvas = element.querySelector("canvas");
      setReady(Boolean(canvas?.hasAttribute("width") && canvas.hasAttribute("height")));
    });
    painted.observe(element, { childList: true, subtree: true, attributes: true, attributeFilter: ["width", "height"] });

    return () => {
      resize?.disconnect();
      visibility?.disconnect();
      painted.disconnect();
    };
  }, []);

  const showOrb = hasEntered && preference === false;

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`relative inline-grid size-[0.42em] place-items-center align-baseline ${className}`}
    >
      <span className={`absolute inset-0 rounded-full bg-kiln ${showOrb && ready ? "invisible" : ""}`} />
      {showOrb && (
        <ThinkingOrb
          state="breathing"
          theme="light"
          size={size <= 32 ? 20 : 64}
          paused={!inView}
          className="absolute inset-0"
          style={{ width: size, height: size, visibility: ready ? "visible" : "hidden" }}
        />
      )}
    </span>
  );
}
