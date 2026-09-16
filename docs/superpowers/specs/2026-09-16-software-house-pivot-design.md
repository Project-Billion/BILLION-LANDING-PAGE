# Billion landing page: software-house pivot — design spec

Date: 2026-09-16. Branch: `feat/software-house-pivot`. Base: `main` @ 313396c.
Status: awaiting owner review. Once approved, this file is the contract for every
worker task on this feature. Where it conflicts with `docs/BRIEF.md`, this file
wins; `docs/BRIEF.md` is updated as part of the feature.

## 1. Why

Billion is not an industrial-software vendor. It is a software house whose
standing point is performance optimized to the maximum, and whose promise is
that it has a solution for anything it faces. Motto: **Think bigger. Think
Billion.** The current page sells factory software to Egyptian plant managers;
every section, drawing and metric is factory-specific. The page also needs to
be more interesting to look at without giving up the numbers it already
earned (axe 0 violations, Lighthouse 100/100/100 for accessibility, best
practices and SEO, mobile LCP median 2.4 s).

## 2. Decisions taken with the owner (2026-09-16)

- Visual direction: **evolve** the existing editorial system (paper, ink, single
  warm accent, hairline rules, Newsreader + Geist). No dark-tech redesign.
- Identity: **keep Cairo and Arabic-first** as differentiators.
- Vercel: CLI installed; owner logs in; preview deploys come from the GitHub
  integration; verification runs against the preview URL.
- Merge: coordinator merges after the owner approves the preview.
- Industrial work stays as **one** of six solution areas, not the whole page.

## 3. What stays the same

Palette, type, layout grid, section numbering, floating nav, the mobile sheet
menu, the `Reveal` scroll-reveal component, the Proof section's Valor Labs
story and Arabic chat still, WhatsApp + email CTAs, no photography, no fake
numbers, no infinite-loop animation (hover-only loops are allowed), full
`prefers-reduced-motion` and no-JS fallbacks. The `--color-kiln` token name is
internal and not user-visible; it is kept to avoid churn.

## 4. Page structure (new)

| # | id | Section | Change |
|---|---|---|---|
| 01 | — | Hero | New copy, thinking orb, drawn underline, new panel |
| 02 | `what-we-build` | What we build | **New**: six solution cards; replaces ValueProps (02) and Industries (03) |
| 03 | `performance` | Performance, measured | **New**: dark band with live Core Web Vitals and our audit numbers |
| 04 | `how-we-work` | How we work | Copy generalized; timeline line draws on scroll |
| 05 | `proof` | Proof | Pull line rewritten; otherwise unchanged |
| 06 | `contact` | CTA | New copy; magnetic buttons |
| 07 | — | Footer | Tagline |

Nav links: What we build · Performance · How we work · Proof. WhatsApp button stays.

## 5. Copy (final unless the owner edits this file)

Voice rules from `docs/BRIEF.md` section 2 still apply (plain English, specifics,
banned words list, no invented statistics or client names).

### brand
- name: `Billion`
- title (document title): `Billion — Software house. Think bigger.`

### hero
- eyebrow: `Software house · Cairo, Egypt`
- title: the motto, first thing on the page, two stacked lines, no punctuation:
  line 1 `Think Bigger`, line 2 `Think Billion`. Modelled as `title: { line1, line2 }`.
  The word `Billion` is set in Kiln. The thinking orb is the full stop after it
  (see section 6). Owner instruction 2026-09-16: "write Think Bigger Think Billion
  in the first of the page with cool style".
- sub: `Billion is a software house with one obsession: performance, pushed to the maximum. AI products, platforms, data systems, operations software. Bring us any problem; we build the solution and we make it fast.`
- primaryCta: `Talk to an engineer` (WhatsApp)
- secondaryCta: `See what we build` → `#what-we-build`
- trustLine: `Engineers in Cairo. Arabic-first when it matters, English everywhere else. Sister company: Valor Labs.`
- panel: index `01`, title `What we optimize first`, items: `load time`, `response latency`, `cost per request`, `failure rate`, `time to ship`

### whatWeBuild (section 02, label `What we build`)
1. `AI products and agents` — `Assistants, agents and retrieval systems that non-technical people actually use, in Arabic or English, on the phones they already own.`
2. `Platforms and products` — `Web and mobile products, APIs and back offices, built to ship in weeks and to run for years.`
3. `Performance engineering` — `Bring us something slow. We profile it, find the real bottleneck, and make it fast: pages, APIs, databases, pipelines, models.`
4. `Data and automation` — `Pipelines, integrations and reporting that connect what you already run, from ERPs to spreadsheets, and remove the manual work in between.`
5. `Industrial and operations software` — `Production tracking, maintenance and quality systems that survive the factory floor. Where Billion started, and still a specialty.`
6. `The problem nobody else wants` — `If it is hard, unusual, or half-finished by someone else, that is the work we like. Bring it.`
- closing: `Different problems, same discipline: measure first, build small, make it fast, then scale.`

### performance (section 03, label `Performance`, dark band)
- title: `Optimized to the max. Starting with this page.`
- body: `We hold ourselves to the numbers you are looking at. These are this page's Core Web Vitals, measured in your browser right now, next to the targets we build every project against.`
- live metrics (measured client-side with `web-vitals`): LCP (target ≤ 2.5 s), CLS (≤ 0.1), INP (≤ 200 ms). States: `measuring…`, value + `good` / `needs work` / `poor` per Google thresholds, and for INP before any interaction: `tap or scroll to measure`.
- audits (static, from our own Lighthouse run of THIS build, filled in by the QA task; never invented): Lighthouse mobile Accessibility, Best practices, SEO, Performance; median LCP; total JavaScript shipped (kB gzip). Rendered as a mono ledger with the browser and date.
- principles ledger:
  1. `Profile first` — `No guessing. We find the real bottleneck before we touch code.`
  2. `Budgets, not hopes` — `Every project gets performance budgets: load time, latency, cost. The build fails when they are missed.`
  3. `Fast on real devices` — `We test on ordinary phones and slow networks, not on our own laptops.`

### howItWorks (section 04, label `How we work`)
1. `Understand the problem` — `Half a day with the people who live with it. We map where time, money or trust leaks before we propose anything.`
2. `Pick one number` — `One outcome, one metric, one baseline. A first release scoped to prove value, not to impress.`
3. `Build it with your team` — `We ship in weeks, deploy where you run, and stay through the first real usage. Arabic or English, your choice.`
4. `Scale what worked` — `Grow it with the same people and the same numbers. You own the code, the system and the data.`

### proof (section 05) — only `pullLine` changes
- pullLine: `What it proves: AI that non-technical people actually use, in their own language, on ordinary phones, in the field. The same discipline goes into everything we build.`

### cta (section 06)
- title: `Bring us the hardest thing on your plate.`
- body: `Tell us what is slow, stuck or not built yet. We will look at it with you and say honestly whether it is worth building, how fast it can be, and what it would cost.`
- whatsappLabel `WhatsApp us`, emailLabel `Email us`, responseNote `Replies within one working day. Cairo time.` (unchanged)

### footer
- tagline: `Think bigger. Think Billion.`; location `Cairo, Egypt` (unchanged)

## 6. Visual and motion additions

Library: `motion` (motion.dev, MIT, v13) via `LazyMotion` + `domAnimation` and
`m.*` components so the runtime stays about 15 kB gzip. No `domMax`, no layout
animations, no gesture handlers beyond hover.

| Where | What | How | Fallback |
|---|---|---|---|
| Hero | H1 "Think Bigger / Think Billion" | Newsreader 400, `clamp(3.25rem, 10vw, 8.5rem)`, tracking -0.03em, leading 0.95, two `block` spans. **Painted at full opacity on first paint, never an opacity animation** (LCP element; QA03 lesson). Entrance is transform-only: each word rises from `translateY(0.25em)` to 0 over 700 ms with `--ease-out`, 70 ms stagger, so LCP is unaffected | Words shown in place |
| Hero | Living full stop | The thinking orb (`thinking-orbs` npm, MIT, canvas) is rendered inline as the period after `Billion`, a 0.42em box on the baseline, ink + kiln colours, `next/dynamic` with `ssr:false`, paused when off-screen | A static Kiln disc of the same size is server-rendered and stays for reduced motion and no-JS |
| Hero | Depth layer | Hairline outlined `BILLION` watermark (SVG text, stroke = rule colour, no fill) spanning the hero behind the H1, drifting about 6% upward with scroll via `useScroll` (transform-only) | Static; hidden under reduced motion |
| 02 cards | Rise-in stagger on first view; hover lift + border beam | `m.div` `whileInView` once, spring; `border-beam` npm (MIT) rendered only while hovered | Static cards |
| 03 band | Number counters | `motion` `animate()` on a motion value, once when in view | Final value rendered |
| 03 band | Live vitals | `web-vitals` v6 `onLCP/onCLS/onINP` in a client component | Server renders the targets only; `measuring…` is the no-JS text |
| 04 timeline | Line draws with scroll | SVG `pathLength` bound to `useScroll` progress of the section | Full line |
| 04 / 02 | New hairline drawing `SystemSchematic` (client → edge → API → queue → model / database, with an unlabelled latency bracket) replaces `ProductionLine`; draws itself once in view via `pathLength` | Full drawing |
| 06 CTA | Magnetic buttons | Pointer-follow with spring, only when `(pointer: fine)` and motion allowed, at most 6 px travel | Plain buttons |

Hard rules: nothing animates the LCP element; no infinite loops except
hover-only; every effect checks `useReducedMotion()`; total new JavaScript
at most 40 kB gzip across all routes (report `next build` sizes before and after);
mobile LCP at most 2.5 s median on the production build; axe 0 violations;
Lighthouse mobile at least 90 performance and 100 / 100 / 100 for the other three.

## 7. Files

New: `src/components/sections/WhatWeBuild.tsx`, `src/components/sections/Performance.tsx`,
`src/components/perf/LiveVitals.tsx`, `src/components/motion/MotionProvider.tsx`,
`src/components/motion/Counter.tsx`, `src/components/motion/DrawPath.tsx`,
`src/components/motion/Magnetic.tsx`, `src/components/brand/Orb.tsx`.

Changed: `src/content/site.ts` (new exports `whatWeBuild`, `performance`; `industries`
and `valueProps` removed; `Industry` type replaced by `Solution`), `src/app/layout.tsx`
(metadata, MotionProvider), `src/app/page.tsx` (order), `Hero.tsx`, `HowItWorks.tsx`,
`Proof.tsx`, `CTA.tsx`, `Footer.tsx`, `Nav.tsx`/`MobileMenu.tsx` (labels only via
site.ts), `src/components/drawings/Schematics.tsx`, `src/app/globals.css`,
`package.json` (+ `motion`, `thinking-orbs`, `border-beam`, `web-vitals`).

Deleted: `src/components/sections/ValueProps.tsx`, `src/components/sections/Industries.tsx`.

Docs: `docs/BRIEF.md` sections 1, 2, 5 rewritten to this positioning; `README.md`
positioning line; `docs/HANDOFF.md` new section; `qa/REPORT.md` new QA appended.

## 8. Delivery plan (Orca, supervised)

One Run, one worktree, one heavy worker at a time. Codex writes; Sonnet
reviews; the coordinator commits one commit per task.

1. T1 Content and structure (codex): site.ts, metadata, page order, WhatWeBuild
   (static), section copy wiring, SystemSchematic, delete old sections. No new deps.
2. T2 Motion foundation and hero (codex): deps, MotionProvider, Orb, underline,
   reduced-motion plumbing, bundle report.
3. T3 Performance band (codex): LiveVitals, Counter, section UI, `performance` data.
4. T4 Section motion (codex): card stagger + beam, timeline draw, schematic draw, magnetic CTA.
5. T5 Gates and audit (pi): lint, tsc, build, Lighthouse mobile three runs, axe; write real
   numbers into `performance.audits`.
6. T6 Browser QA (codex): Chrome + Edge at 390 / 768 / 1280, reduced-motion pass,
   keyboard pass; fix task if needed.
7. Docs (Haiku docs-writer): BRIEF, README, HANDOFF, QA report.
8. PR → preview URL → Vercel verification → owner approval → squash-merge.

## 9. Out of scope

Real contact details (still owner-supplied placeholders, QA01), Arabic locale,
privacy page, dark-mode theme, analytics, forms or any backend.
