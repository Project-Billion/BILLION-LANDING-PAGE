/*
 * Hairline technical drawings (BRIEF section 4: imagery is line drawings, not photos).
 * Purely decorative, so aria-hidden. Strokes stay 1.25px at any size via
 * vector-effect: non-scaling-stroke on every shape.
 */

const svgBase = "h-auto w-full fill-none stroke-current [&_*]:[vector-effect:non-scaling-stroke]";

interface DrawingProps {
  className?: string;
}

/** Client to edge, API and queue, branching to a model and database above a latency bracket. */
export function SystemSchematic({ className = "" }: DrawingProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 960 180" strokeWidth="1.25" className={`${svgBase} ${className}`}>
      {/* Client device and inner screen. */}
      <rect x="24" y="42" width="92" height="88" rx="8" />
      <rect x="38" y="56" width="64" height="52" rx="2" />
      <path d="M62 118h16M116 86h116m-6-6 6 6-6 6" />

      {/* Edge node, then API. */}
      <rect x="232" y="68" width="36" height="36" />
      <path d="M268 86h116m-6-6 6 6-6 6" />
      <rect x="384" y="52" width="112" height="68" rx="2" />
      <text x="440" y="91" textAnchor="middle" className="fill-current stroke-none font-mono text-[14px]">API</text>
      <path d="M496 86h100m-6-6 6 6-6 6" />

      {/* Queue: three stacked bars. */}
      <path d="M596 70h64M596 86h64M596 102h64" />

      {/* Fork with open arrowheads at both endpoints. */}
      <path d="M660 86h72M732 86V42h84m-6-6 6 6-6 6M732 86v42h84m-6-6 6 6-6 6" />

      {/* Model with a five-point signal waveform. */}
      <circle cx="850" cy="42" r="34" />
      <polyline points="826,42 838,30 850,54 862,30 874,42" />

      {/* Database cylinder: top ellipse, side walls and lower arc. */}
      <ellipse cx="850" cy="110" rx="34" ry="10" />
      <path d="M816 110v32M884 110v32M816 142a34 10 0 0 0 68 0" />

      {/* Unlabelled latency bracket across the API-to-model span. */}
      <path d="M384 164v8M384 168h500M884 164v8" />
    </svg>
  );
}

/** Three sources merging into one answer: ERP, PLCs and logs into a single view. */
export function DataFlow({ className = "" }: DrawingProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 482 130" strokeWidth="1.25" className={`${svgBase} ${className}`}>
      <rect x="1" y="1" width="104" height="32" />
      <rect x="189" y="1" width="104" height="32" />
      <rect x="377" y="1" width="104" height="32" />
      <path d="M53 33V58H429V33M241 33V92M235 86l6 6 6-6" />
      <rect x="177" y="93" width="128" height="36" />
    </svg>
  );
}

/** A short signal path: start, one checkpoint, finish. */
export function CircuitPath({ className = "" }: DrawingProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 84" strokeWidth="1.25" className={`${svgBase} ${className}`}>
      <circle cx="6" cy="46" r="5" />
      <path d="M11 46H88V10H118M132 10H152V73" />
      <rect x="118" y="3" width="14" height="14" />
      <circle cx="152" cy="78" r="5" />
    </svg>
  );
}
