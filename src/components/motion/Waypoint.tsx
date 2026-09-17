"use client";

import { useSyncExternalStore } from "react";
import { Reveal } from "@/components/motion/Reveal";

function subscribeDesktop(onChange: () => void) {
  const query = window.matchMedia("(min-width: 64rem)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** No hidden Reveal or observer on mobile; the desktop datum row stays 88px tall. */
export function Waypoint({ index, textAbove }: { index: string; textAbove: boolean }) {
  const desktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia("(min-width: 64rem)").matches,
    () => false,
  );
  if (!desktop) return null;

  return (
    <Reveal index={Number(index) - 1} className="relative h-22 row-start-2">
      <div aria-hidden="true">
        <span className="absolute top-[40px] left-4 size-2 bg-kiln" />
        <span className={`absolute left-5 w-px bg-graphite/60 ${textAbove ? "top-[20px] h-5" : "top-[48px] h-5"}`} />
        <span
          className={`absolute left-5 -translate-x-1/2 font-mono text-meta leading-none text-ink ${textAbove ? "top-[4px]" : "top-[72px]"}`}
        >
          {index}
        </span>
      </div>
    </Reveal>
  );
}
