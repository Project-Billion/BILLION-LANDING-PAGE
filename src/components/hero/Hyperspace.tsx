"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/components/motion/useMotionPreference";
import {
  ACTIVATE_MS, DEACTIVATE_MS, HOLD_MS, MAX_ACTIVE_STARS, MAX_DPR, SETTLE_FAST_MS,
  createIdleField, createStarField, flashIntensity, mulberry32, settleIntensity,
  stepStar, transitionIntensity,
  type IdlePoint, type ProjectedStreak, type Star,
} from "@/components/hero/hyperspace-field";

/** z units consumed per second at full intensity — a tuned visual constant, not a physical unit. */
const MAX_SPEED_PER_SECOND = 2.2;
/** Motion blur: painted over the previous frame instead of clearing it, so streaks trail off. */
const TRAIL_FADE_ALPHA = 0.28;
const TRAIL_FADE = `rgba(18, 18, 18, ${TRAIL_FADE_ALPHA})`;
const STREAK_RGB = "255, 255, 255";
const WARM_STREAK_RGB = "224, 128, 90";
/** Centre-flash gradient: white at 35% alpha in the centre, transparent by 45% of the
 * shorter viewport dimension. Alpha is animated by scaling `ctx.globalAlpha`, not by
 * rebuilding the gradient, so it only needs recomputing on resize. */
const FLASH_CENTRE_ALPHA = 0.35;
const FLASH_RADIUS_FRACTION = 0.45;

type HyperspaceState = "travel" | "arrive" | "idle";

/**
 * Hyperspace starfield behind the hero motto (design spec section 11): runs once, on page
 * load, as soon as the hero is in view — ramps to light speed, holds, then eases back to the
 * static idle field. Total run is about 4 s (`ACTIVATE_MS` + `HOLD_MS` + `DEACTIVATE_MS`).
 * Static under reduced motion; if the hero leaves view mid-run it stops and does not resume
 * (runs at most once per page load); cleans up on unmount.
 */
export function Hyperspace() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const stars: Star[] = createStarField(MAX_ACTIVE_STARS);
    const random = mulberry32(1337);
    /** Reused every frame, for every star, so stepStar never allocates. */
    const streak: ProjectedStreak = { x0: 0, y0: 0, x1: 0, y1: 0, alpha: 0, lineWidth: 0, warm: false };

    let width = 0, height = 0;
    let idleField: IdlePoint[] = [];
    let flashGradient: CanvasGradient | null = null;
    let inView = true;
    let introPlayed = false;
    let settling = false;
    let intensity = 0;
    let transitionFrom = 0, transitionTo = 0, transitionStart = 0;
    let transitionDuration = ACTIVATE_MS;
    let rafId: number | null = null;
    let lastFrame = 0;
    let holdTimer: number | null = null;

    const drawIdle = () => {
      ctx.clearRect(0, 0, width, height);
      for (const point of idleField) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${point.alpha})`;
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      idleField = createIdleField(width, height);
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * FLASH_RADIUS_FRACTION;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${FLASH_CENTRE_ALPHA})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      flashGradient = gradient;
      if (rafId === null) drawIdle();
    };

    const ensureRunning = () => {
      if (rafId === null && inView) {
        lastFrame = 0;
        rafId = requestAnimationFrame(frame);
      }
    };

    const section = canvas.closest("section");

    /** Mirrors intro phase onto the section so CSS can dim/enlarge the world around the
     * canvas (design spec section 11). No-op with no ancestor `section` (shouldn't happen
     * in this layout, but the canvas must never throw for it). */
    const setHyperspaceState = (state: HyperspaceState) => {
      if (section) section.dataset.hyperspace = state;
    };

    const frame = (now: number) => {
      if (!inView) {
        rafId = null;
        return;
      }

      const dtMs = lastFrame ? Math.min(now - lastFrame, 100) : 16;
      lastFrame = now;
      const elapsed = now - transitionStart;

      intensity = settling
        ? settleIntensity(transitionFrom, elapsed, transitionDuration)
        : transitionIntensity(transitionFrom, transitionTo, elapsed, transitionDuration);

      if (settling && elapsed < SETTLE_FAST_MS) {
        // During the sharp first stretch of the settle phase, skip the translucent
        // trail-fade (which blurs frame over frame) and clear fully instead, so the
        // streaks' own deceleration — already contracting toward points as zDelta
        // shrinks — reads crisply, and the arriving world underneath isn't masked by
        // the opaque black the trail-fade would otherwise have built up by now.
        ctx.clearRect(0, 0, width, height);
      } else if (settling) {
        // Soft tail: dissolve any residual streak pixels back to transparent instead of
        // repainting translucent black, which would just re-accumulate to opaque and hide
        // the hero-bg-layer/grain fade-up (design spec section 11) for the rest of settle.
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_FADE_ALPHA})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      } else {
        ctx.fillStyle = TRAIL_FADE;
        ctx.fillRect(0, 0, width, height);
      }

      const zDelta = MAX_SPEED_PER_SECOND * intensity * (dtMs / 1000);
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      for (const star of stars) {
        stepStar(star, zDelta, halfWidth, halfHeight, random, streak);
        ctx.strokeStyle = `rgba(${streak.warm ? WARM_STREAK_RGB : STREAK_RGB}, ${streak.alpha})`;
        ctx.lineWidth = streak.lineWidth;
        ctx.beginPath();
        ctx.moveTo(streak.x0, streak.y0);
        ctx.lineTo(streak.x1, streak.y1);
        ctx.stroke();
      }

      if (settling && flashGradient) {
        const flash = flashIntensity(elapsed);
        if (flash > 0) {
          ctx.save();
          ctx.globalAlpha = flash;
          ctx.fillStyle = flashGradient;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }
      }

      const settled = transitionTo === 0 && now - transitionStart >= transitionDuration;
      if (settled) {
        rafId = null;
        settling = false;
        drawIdle();
        setHyperspaceState("idle");
        return;
      }
      rafId = requestAnimationFrame(frame);
    };

    const beginTransition = (to: number, durationMs: number) => {
      transitionFrom = intensity;
      transitionTo = to;
      transitionStart = performance.now();
      transitionDuration = durationMs;
      ensureRunning();
    };

    const clearHoldTimer = () => {
      if (holdTimer === null) return;
      window.clearTimeout(holdTimer);
      holdTimer = null;
    };

    /** Ramp to full speed, hold, then ease back to idle. Runs at most once per mount. */
    const runIntro = () => {
      if (introPlayed || reducedMotion !== false) return;
      introPlayed = true;
      settling = false;
      setHyperspaceState("travel");
      beginTransition(1, ACTIVATE_MS);
      holdTimer = window.setTimeout(() => {
        holdTimer = null;
        settling = true;
        setHyperspaceState("arrive");
        beginTransition(0, DEACTIVATE_MS);
      }, ACTIVATE_MS + HOLD_MS);
    };

    resize();
    drawIdle();

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) {
        clearHoldTimer();
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        settling = false;
        intensity = 0;
        transitionFrom = 0;
        transitionTo = 0;
        setHyperspaceState("idle");
        drawIdle();
        return;
      }
      drawIdle();
      runIntro();
    }, { threshold: 0 });
    if (section) intersectionObserver.observe(section);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearHoldTimer();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      setHyperspaceState("idle");
    };
  }, [reducedMotion]);

  return <canvas aria-hidden="true" ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
