/**
 * Pure star-field maths for the hyperspace canvas (design spec section 11).
 * No DOM, no canvas context, no randomness beyond a seeded PRNG — kept this way
 * so every function here can be read (or unit-tested) without a browser.
 */

/** A single star travelling toward the viewer along the z axis. */
export interface Star {
  x: number;
  y: number;
  z: number;
  /** Last frame's projected position, so a streak can be drawn from it. */
  prevX: number;
  prevY: number;
}

/** One point of the static idle field. */
export interface IdlePoint {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

/** A star's streak for the current frame, already scaled to canvas pixels. */
export interface ProjectedStreak {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  alpha: number;
  lineWidth: number;
  /** True on the longest (closest, fastest) streaks, which get the warm tint. */
  warm: boolean;
}

export const IDLE_STAR_COUNT = 120;
export const MAX_ACTIVE_STARS = 400;
export const MAX_DPR = 2;
/** Ramp-up to full speed, on mount, once the hero is in view. */
export const ACTIVATE_MS = 300;
/** How long the field holds at full speed before easing back down. */
export const HOLD_MS = 2500;
/** Ease back down to idle. */
export const DEACTIVATE_MS = 1200;

/** Stars spawn between these two z depths (1 = far plane) and respawn once past NEAR_Z. */
const FAR_Z = 1;
const NEAR_Z = 0.02;
/** Projected coordinates are normalised to roughly [-1, 1]; anything further out has left the canvas. */
const PROJECTION_BOUND = 1.4;

/** Mulberry32: a small, fast, deterministic PRNG so seeded fields never change between renders. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic sparse starfield for the idle state, in canvas-pixel coordinates. */
export function createIdleField(
  width: number,
  height: number,
  count: number = IDLE_STAR_COUNT,
  seed = 42,
): IdlePoint[] {
  const random = mulberry32(seed);
  const points: IdlePoint[] = [];
  for (let i = 0; i < count; i += 1) {
    points.push({
      x: random() * width,
      y: random() * height,
      radius: 0.5 + random() * 0.7,
      alpha: 0.25 + random() * 0.35,
    });
  }
  return points;
}

/** (Re)spawns `star` at a random far depth in place, priming `prev` to its own starting projection. */
function respawnStar(star: Star, random: () => number): void {
  const x = (random() - 0.5) * 2;
  const y = (random() - 0.5) * 2;
  const z = FAR_Z * (0.6 + random() * 0.4);
  star.x = x;
  star.y = y;
  star.z = z;
  star.prevX = x / z;
  star.prevY = y / z;
}

/** A fresh star at a random far depth. Only used to populate the initial pool. */
function spawnStar(random: () => number): Star {
  const star: Star = { x: 0, y: 0, z: 0, prevX: 0, prevY: 0 };
  respawnStar(star, random);
  return star;
}

/** A pool of `count` active stars, seeded so the sequence is reproducible. */
export function createStarField(count: number, seed = 7): Star[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, () => spawnStar(random));
}

/**
 * Advances one star by `zDelta` (already scaled for elapsed time and current speed) and
 * writes its streak for this frame, in canvas pixels, into the caller-provided `out`
 * (returned for convenience). Mutates `star` in place — respawning it at a far depth once
 * it passes the near plane or drifts off-canvas. `out` is reusable scratch: the caller may
 * pass the same object on every call, for every star, without incurring an allocation.
 */
export function stepStar(
  star: Star,
  zDelta: number,
  halfWidth: number,
  halfHeight: number,
  random: () => number,
  out: ProjectedStreak,
): ProjectedStreak {
  const fromX = star.prevX * halfWidth + halfWidth;
  const fromY = star.prevY * halfHeight + halfHeight;

  star.z -= zDelta;
  const offCanvas =
    Math.abs(star.prevX) > PROJECTION_BOUND || Math.abs(star.prevY) > PROJECTION_BOUND;

  if (star.z <= NEAR_Z || offCanvas) {
    respawnStar(star, random);
    const x = star.prevX * halfWidth + halfWidth;
    const y = star.prevY * halfHeight + halfHeight;
    out.x0 = x;
    out.y0 = y;
    out.x1 = x;
    out.y1 = y;
    out.alpha = 0;
    out.lineWidth = 0.6;
    out.warm = false;
    return out;
  }

  const projX = star.x / star.z;
  const projY = star.y / star.z;
  const closeness = 1 - Math.min(star.z / FAR_Z, 1);

  star.prevX = projX;
  star.prevY = projY;

  out.x0 = fromX;
  out.y0 = fromY;
  out.x1 = projX * halfWidth + halfWidth;
  out.y1 = projY * halfHeight + halfHeight;
  out.alpha = Math.min(0.15 + closeness * 0.85, 1);
  out.lineWidth = 0.6 + closeness * 2.2;
  out.warm = closeness > 0.75;
  return out;
}

/** Ease-out cubic: fast start, slow finish. Used for both the speed ramp-up and ramp-down. */
export function easeOutCubic(t: number): number {
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 - (1 - clamped) ** 3;
}

/**
 * Intensity (0..1, which the caller multiplies by a top speed) at `elapsedMs` into a
 * transition that eases from `from` to `to` over `durationMs`. Starting from the
 * live value on every trigger keeps direction changes (e.g. the pointer re-entering
 * mid fade-out) continuous instead of snapping.
 */
export function transitionIntensity(from: number, to: number, elapsedMs: number, durationMs: number): number {
  const t = durationMs <= 0 ? 1 : elapsedMs / durationMs;
  return from + (to - from) * easeOutCubic(t);
}
