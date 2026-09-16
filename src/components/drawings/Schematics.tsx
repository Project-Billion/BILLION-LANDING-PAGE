/*
 * Hairline technical drawings (BRIEF section 4: imagery is line drawings, not photos).
 * Purely decorative, so aria-hidden. Strokes stay 1.25px at any size via
 * vector-effect: non-scaling-stroke on every shape.
 */

const svgBase = "h-auto w-full fill-none stroke-current [&_*]:[vector-effect:non-scaling-stroke]";

interface DrawingProps {
  className?: string;
}

/** Evenly spaced conveyor rollers between two x positions. */
function Rollers({ from, to, y }: { from: number; to: number; y: number }) {
  const count = Math.floor((to - from) / 14);
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <circle key={i} cx={from + 7 + i * 14} cy={y} r="2" />
      ))}
    </>
  );
}

/** Production line: filler, conveyor, inspection cabinet, pick arm, packer, outfeed chute. */
export function ProductionLine({ className = "" }: DrawingProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 960 180" strokeWidth="1.25" className={`${svgBase} ${className}`}>
      <path d="M0 172H960" />

      {/* Station 1: filler with control screen */}
      <rect x="20" y="72" width="70" height="100" />
      <rect x="34" y="122" width="38" height="50" />
      <path d="M46 72V52M40 52h12" />
      <rect x="90" y="52" width="60" height="120" />
      <rect x="104" y="68" width="30" height="22" />
      <circle cx="111" cy="98" r="2.5" />
      <circle cx="119" cy="98" r="2.5" />
      <circle cx="127" cy="98" r="2.5" />

      {/* Conveyor 1 */}
      <path d="M150 104H300M150 116H300M172 116V172M280 116V172" />
      <Rollers from={150} to={300} y={110} />
      <rect x="186" y="84" width="38" height="20" />
      <rect x="244" y="88" width="30" height="16" />

      {/* Station 2: inspection cabinet with exhaust */}
      <rect x="300" y="62" width="82" height="110" />
      <rect x="314" y="82" width="54" height="30" />
      <rect x="382" y="74" width="24" height="98" />
      <path d="M334 62V22h16v40M328 22h28" />

      {/* Conveyor 2 with pick arm */}
      <path d="M406 104H700M406 116H700M444 116V172M572 116V172M680 116V172" />
      <Rollers from={406} to={700} y={110} />
      <rect x="456" y="86" width="34" height="18" />
      <rect x="628" y="86" width="34" height="18" />
      <rect x="552" y="90" width="26" height="14" />
      <path d="M565 90 544 54 596 34 616 56M610 56l-6 12M622 56l6 12" />
      <circle cx="544" cy="54" r="5" />
      <circle cx="596" cy="34" r="5" />
      <circle cx="616" cy="56" r="3" />

      {/* Station 3: packer and outfeed chute */}
      <rect x="700" y="82" width="84" height="90" />
      <rect x="714" y="96" width="26" height="32" />
      <path d="M762 100v24" />
      <path d="M784 138 872 158M784 150 864 168M860 166V172" />
      <Rollers from={792} to={862} y={152} />
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
