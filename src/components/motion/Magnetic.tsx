"use client";

import { useSpring, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, type PointerEvent, type ReactElement } from "react";
import { useFinePointer } from "@/components/motion/useFinePointer";
import { useMotionPreference } from "@/components/motion/useMotionPreference";

const clamp = (value: number) => Math.max(-6, Math.min(6, value));

/** A stationary hit area keeps spring movement from changing the measured centre. */
export function Magnetic({ children }: { children: ReactElement }) {
  const preference = useMotionPreference();
  const finePointer = useFinePointer();
  const enabled = finePointer && preference === false;
  const springX = useSpring(0, { stiffness: 200, damping: 18 });
  const springY = useSpring(0, { stiffness: 200, damping: 18 });
  // Clamp the spring output too, so its overshoot never exceeds the 6px limit.
  const x = useTransform(springX, clamp);
  const y = useTransform(springY, clamp);

  useEffect(() => {
    if (!enabled) {
      springX.jump(0);
      springY.jump(0);
    }
    return () => {
      springX.stop();
      springY.stop();
    };
  }, [enabled, springX, springY]);

  function move(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType === "touch" || event.pointerType === "pen") return;
    const box = event.currentTarget.getBoundingClientRect();
    springX.set(clamp((event.clientX - box.left - box.width / 2) * 0.06));
    springY.set(clamp((event.clientY - box.top - box.height / 2) * 0.06));
  }

  function reset() {
    springX.set(0);
    springY.set(0);
  }

  return (
    <span
      className="inline-block w-full sm:w-auto"
      onPointerMove={enabled ? move : undefined}
      onPointerLeave={enabled ? reset : undefined}
      onPointerCancel={enabled ? reset : undefined}
    >
      <m.span className="inline-block w-full" style={enabled ? { x, y } : { x: 0, y: 0 }}>
        {children}
      </m.span>
    </span>
  );
}
