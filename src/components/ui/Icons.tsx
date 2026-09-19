/*
 * Line-primitive glyphs at the BRIEF's 1.25px stroke. Decorative only: every use sits
 * next to a text label, so they are aria-hidden.
 */

interface IconProps {
  className?: string;
}

/** Long horizontal arrow used on primary actions. Width defaults to 28px; pass a w-* class to override. */
export function ArrowRight({ className = "w-7" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.25" className={`h-3 ${className}`}>
      <path d="M0 6h27M22 1l5 5-5 5" />
    </svg>
  );
}

/** Diagonal arrow marking external destinations. */
export function ArrowUpRight({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.25" className={`size-3 ${className}`}>
      <path d="M3 9 9 3M4 3h5v5" />
    </svg>
  );
}

/** Left chevron for "previous" controls. */
export function ChevronLeft({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={`size-4 ${className}`}>
      <path d="M10 3 5 8l5 5" />
    </svg>
  );
}

/** Right chevron for "next" controls. */
export function ChevronRight({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={`size-4 ${className}`}>
      <path d="m6 3 5 5-5 5" />
    </svg>
  );
}

/** Small video-camera glyph used beside the Google Meet note. */
export function Video({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={`size-4 ${className}`}>
      <rect x="1.5" y="4" width="9" height="8" rx="1.5" />
      <path d="m10.5 7 4-2v6l-4-2" />
    </svg>
  );
}

/** Check mark for the confirmation state. */
export function Check({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" className={`size-4 ${className}`}>
      <path d="m3 8.5 3.5 3.5L13 4.5" />
    </svg>
  );
}
