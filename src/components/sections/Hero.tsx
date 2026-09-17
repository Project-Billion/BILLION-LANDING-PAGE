import type { CSSProperties } from "react";
import { Orb } from "@/components/brand/Orb";
import { Hyperspace } from "@/components/hero/Hyperspace";
import { Container } from "@/components/ui/Container";
import { hero } from "@/content/site";

/** 8% opacity film grain over the dusk gradient (design spec section 10). */
const HERO_GRAIN_URL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Two-line motto, painted at full opacity (it is the page's LCP element); only the
 * individual words translate in. The orb is the full stop after "Billion".
 */
function HeroTitle() {
  const firstLine = hero.title.line1.split(" ");
  const secondLine = hero.title.line2.split(" ");
  return (
    <h1 id="hero-title" className="text-h1 text-center text-fg">
      <span className="block">
        {firstLine.map((word, index) => (
          <span key={`${word}-${index}`}>
            {index > 0 ? " " : null}
            <span className="hero-word inline-block" style={{ "--i": index } as CSSProperties}>
              {word}
            </span>
          </span>
        ))}
      </span>{" "}
      <span className="block">
        {secondLine.map((word, index) => {
          const isLast = index === secondLine.length - 1;
          return (
            <span key={`${word}-${index}`}>
              {index > 0 ? " " : null}
              <span
                id={isLast ? "hero-billion" : undefined}
                className={`hero-word inline-block${isLast ? " cursor-default" : ""}`}
                style={{ "--i": firstLine.length + index } as CSSProperties}
              >
                {word}
              </span>
              {isLast ? <Orb /> : null}
            </span>
          );
        })}
      </span>
    </h1>
  );
}

/**
 * 01 Hero: full-viewport dusk gradient behind the motto alone. The system schematic and
 * the "what we optimize first" panel moved to WhatWeBuild; the hyperspace canvas (design
 * spec section 11) sits in #hyperspace-slot, behind the text, above the gradient/grain.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(180deg, #232a37 0%, #4f4f55 55%, #3a2e29 85%, var(--color-bg) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url("${HERO_GRAIN_URL}")`,
          backgroundSize: "200px",
          opacity: 0.08,
          mixBlendMode: "overlay",
        }}
      />
      {/* Hyperspace starfield (design spec section 11): idle until the pointer, focus or a
          touch tap reaches the word "Billion" (#hero-billion, below). */}
      <div id="hyperspace-slot" aria-hidden="true" className="absolute inset-0 -z-10">
        <Hyperspace triggerId="hero-billion" />
      </div>

      <Container>
        <HeroTitle />
      </Container>

      {/* Sentinel for Nav's floating-pill state: sits at (hero height − nav height) from the top. */}
      <div
        id="hero-nav-sentinel"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-(--nav-height) h-px"
      />
    </section>
  );
}
