"use client";

import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";

export function HeroWatermark() {
  const ref = useRef<HTMLDivElement>(null);
  const preference = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <m.div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 top-[2.5rem] -z-10 select-none will-change-transform"
      style={preference === false ? { y } : undefined}
    >
      <svg aria-hidden="true" viewBox="0 0 1000 220" className="h-auto w-full text-ink/10">
        <text
          x="0"
          y="200"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="var(--font-display), serif"
          fontSize="260"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        >
          BILLION
        </text>
      </svg>
    </m.div>
  );
}
