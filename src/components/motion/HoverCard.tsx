"use client";

import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { useFinePointer } from "@/components/motion/useFinePointer";
import { useMotionPreference } from "@/components/motion/useMotionPreference";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
}

/** A stable element preserves Reveal through hydration and lifts the entire visual box. */
export function HoverCard({ children, className = "" }: HoverCardProps) {
  const preference = useMotionPreference();
  const finePointer = useFinePointer();
  const enabled = finePointer && preference === false;

  return (
    <m.div
      className={`card-beam flex w-full flex-col overflow-hidden rounded-lg border border-rule p-7 md:p-10 ${className}`}
      whileHover={enabled ? { y: -3 } : undefined}
      transition={enabled ? { type: "spring", stiffness: 300, damping: 24 } : { duration: 0 }}
    >
      {children}
    </m.div>
  );
}
