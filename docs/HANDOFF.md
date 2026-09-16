# Billion landing page — handoff

## Status

- Branch `feat/landing-page` on `Project-Billion/BILLION-LANDING-PAGE`. PR #1 (merged by the owner at 16:48 UTC, contains the build up to the six sections) and PR #2 https://github.com/Project-Billion/BILLION-LANDING-PAGE/pull/2 (QA report, fixes, handoff; open).
- Deliverable: a deployable Next.js 16 (App Router, TypeScript) + Tailwind CSS 4 single-page marketing site at `/`, statically prerendered, no environment variables, Vercel-ready.
- Gates at HEAD: `npm run lint` 0 errors / 0 warnings, `npx tsc --noEmit` clean, `npm run build` succeeds. Browser QA in Chrome 152 and Edge 153 (see `qa/REPORT.md`): axe-core 0 violations, Lighthouse mobile 100/100/100 for accessibility, best practices and SEO; performance 92 to 96 after the LCP fix (LCP about 2.5 s median on the throttled mobile preset).

## What was built

- `src/content/site.ts` holds every visible string and the `siteConfig` placeholder object. Nothing is hard-coded in components.
- `src/app/globals.css` holds the design tokens (paper/ink/kiln palette, type scale, radius, motion durations and easings) as Tailwind v4 `@theme` values.
- Fonts via `next/font/google`: Newsreader (display, optical size axis), Geist (body/UI), Geist Mono (metadata), IBM Plex Sans Arabic (the Arabic chat still only, not preloaded).
- Sections in `src/components/sections/`: Hero, ValueProps (asymmetric bento), Industries (typographic ledger), HowItWorks (timeline), Proof (dark section with an Arabic chat still and the valor-labs.com link), CTA. Nav with an accessible mobile sheet and Footer in `src/components/site/`. Reveal-once scroll motion in `src/components/motion/Reveal.tsx`. Inline SVG line drawings in `src/components/drawings/Schematics.tsx`.
- Design contract: `docs/BRIEF.md`. Reference mockups and build notes: `design/reference/`. Reviews and decisions: `docs/REVIEW.md`. Browser QA: `qa/REPORT.md`.

## Decisions taken (and why)

- English only for v1; all copy lives in one file so an Arabic locale can be added without restructuring.
- Primary call to action is WhatsApp plus email links. No form backend, no secrets, works on any host.
- Fresh identity: warm paper canvas, ink type, a single rust "Kiln" accent, editorial serif for display. Chosen to read as an engineering report rather than a SaaS template, and to sit as the more restrained parent of Valor's Arabic-first brand.
- No photography. Imagery is type, colour fields, hairline technical drawings and an in-code UI still. Avoids stock-photo cheapness and licensing.
- Motion is deliberately minimal: one short on-load reveal for the hero eyebrow, headline and lower panel; reveal-once on scroll elsewhere; nothing loops; everything off under `prefers-reduced-motion`. The hero lead paragraph and CTAs paint immediately because they are the LCP element.
- Kept by decision after QA (see `docs/REVIEW.md`): placeholder contacts stay until the owner supplies real ones (QA01); `font-display: swap` with metric-matched fallbacks rather than blocking fonts (QA04); the 19 px hero lead is a hierarchy exception to the 17 px body scale (QA08); the scroll reveal's `(scripting: enabled)` media gate degrades gracefully in browsers without it (R5).
- Section indices render in Ink, not the mockups' Kiln, because Kiln on Paper is 4.53:1 at 13 px, too close to the AA floor.
- The footer Privacy link was removed until a policy exists; `site.ts` has a comment showing where to restore it.

## Owner actions before launch

1. Replace `siteConfig` in `src/content/site.ts`: `contact.whatsappE164`, `contact.email`, `social.linkedin`.
2. Optionally add `proof.quote` (a real quote from Valor's team); it renders only when non-null.
3. Add a privacy policy page or link, then restore the footer link.
4. Deploy on Vercel (import the repo; defaults work; no env vars) and attach the domain.
5. Test on a real phone (iOS Safari and Android Chrome): safe areas, the mobile sheet, tap targets. Emulation was used for QA; hardware was not.

## Follow-ups worth doing

- Arabic locale with right-to-left layout (copy is centralised; fonts would need an Arabic display face).
- Open Graph image (`opengraph-image` route) once the wordmark is final.
- Field performance monitoring on Vercel; the LCP figure here is a synthetic mobile preset.
- Real case-study numbers only if Valor agrees to publish them; the page intentionally has none.

## Local-only artifacts (not in git)

- `qa/screenshots/` in the feature worktree: 94 QA screenshots from Chrome and Edge, plus re-verification captures.
- Lighthouse JSON outputs in the fix worker's scratchpad folder under `D:\Temp\User\claude\`.
- Two ad-hoc Playwright scripts and a findings.json written by a subagent of the fix worker were moved out of the repo to the coordinator scratchpad (`foreign-qa/`), and the `@playwright/test` dev dependency it added was reverted. They are not needed.
- Skill discovery junctions created so the named skills could be invoked by name: `~/.claude/skills/{high-end-visual-design,minimalist-ui,design-taste-frontend,animate,mobile-native}` and `~/.codex/skills/imagegen-frontend-web`, each pointing into `~/.claude/.agents/skills/`. Remove them if unwanted.

## Orchestration record

Orca run `run_be22d5313808`, one feature worktree at `C:\Users\abo-k\orca\workspaces\Billion-landing-page\feat-landing-page`.

| Task | Agent | Outcome |
| --- | --- | --- |
| T1 reference mockups (imagegen-frontend-web) | Codex | succeeded, 7 images + NOTES.md |
| T2 scaffold and design foundation | Claude Opus | succeeded |
| T3 six sections, motion, drawings | Claude Opus (same terminal) | succeeded |
| T4 browser QA Chrome + Edge, read-only review | Codex | first attempt stalled at prompt acceptance (`agent_prompt_stalled`, memory pressure), replacement with `--retry-of` succeeded |
| T5 fixes for QA and review findings | Claude Opus | succeeded; LCP 4.5 s to about 2.5 s |
| T6 re-verification of the fixes | Codex | see `qa/REPORT.md`, section "Re-verification after fixes" |

Internal Claude reviewers (Sonnet) reviewed each commit; their findings are in `docs/REVIEW.md`. Cross-provider rule held: Claude wrote the code, Codex and Claude reviewed it.

## Next session start here

1. If the PR is merged: remove the feature worktree in Orca, confirm `orca orchestration task-list` shows every task completed, then verify `main` in a clean checkout: `npm ci && npm run lint && npx tsc --noEmit && npm run build`, and open the site once at 390 and 1280.
2. If the PR is not merged: read the PR review comments, create a fix task in the same worktree, and keep one commit per task.
3. Then work through "Owner actions before launch" above.
