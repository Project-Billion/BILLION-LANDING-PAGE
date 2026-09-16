/*
 * Line-primitive glyphs at the BRIEF's 1.25px stroke. Decorative only: every use sits
 * next to a text label, so they are aria-hidden.
 */

interface IconProps {
  className?: string;
}

/** Long horizontal arrow used on primary actions. */
export function ArrowRight({ className = "" }: IconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="1.25" className={`h-3 w-7 ${className}`}>
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
