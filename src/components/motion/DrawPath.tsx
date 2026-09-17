"use client";

import { useScroll } from "motion/react";
import * as m from "motion/react-m";
import { useCallback, useRef, type ReactNode } from "react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";

/** The server section stays outside this client boundary; only its datum tracks scroll. */
export function DrawPath({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const attachSection = useCallback((element: HTMLDivElement | null) => {
    sectionRef.current = element?.closest("section") ?? null;
  }, []);
  const preference = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 80%", "end 90%"] });
  const scale = preference === false ? scrollYProgress : 1;

  return (
    <div ref={attachSection} className="relative mt-16 ml-1 lg:ml-0 lg:grid lg:grid-rows-[auto_5.5rem_auto]">
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[44px] left-0 hidden h-px w-full origin-left bg-rule lg:row-start-2 lg:block"
        style={{ scaleX: scale }}
      />
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-px origin-top bg-rule lg:hidden"
        style={{ scaleY: scale }}
      />
      {children}
    </div>
  );
}
