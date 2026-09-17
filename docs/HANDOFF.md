# Billion landing page — handoff

## Session 2026-09-16/17 — software-house pivot and dark system

**Status.** The owner merged PR #3 (the software-house pivot up to the performance band) to `main` on 2026-09-17 and added the real WhatsApp, email and LinkedIn in a follow-up commit; production shows that state. Branch `feat/dark-visual-system` continues from it and holds the section motion, the dark visual system, the hyperspace effect and the measured audit rows. A PR is opened from this branch for owner approval of the preview.

**Commits on `feat/dark-visual-system` (oldest first).**
- `ff12769` feat(motion): card lift and hover ring, drawn schematic, scroll timeline, magnetic CTA
- `b110b87` docs: rewrite the brief and readme for the software-house positioning
- `fa20edf` merge of `origin/main` (the owner's real contact details)
- `289745c` docs(spec): add the dark single-background visual system and the hyperspace effect (spec sections 10 and 11)
- `7218b33` feat(design): move to the dark single-background system with Outfit
- `8d41276` feat(sections): typographic solutions list, floating vitals card, dark proof and CTA
- `fcc2055` feat(hero): hyperspace starfield behind the word Billion
- `b37f1a7` feat(performance): publish measured audit rows and fix the wordmark contrast flag
- docs and QA commits follow.

**Decisions taken and why.**
- Visual direction: first "evolve the editorial look", then, after the owner pointed at micro1.ai, one near-black background with Outfit, a full-viewport gradient hero holding only the motto, and a ghost wordmark in the footer (spec section 10).
- Orb: the `thinking-orbs` package only offers a light or dark theme, so the full stop is monochrome light dots on dark.
- `border-beam` was dropped: 27 kB gzip and a stylesheet injected per hover. The CSS ring that replaced it went away with the dark system; the cards became a typographic list.
- Audit rows: Accessibility 100, Best practices 100, SEO 100 and 189 kB compressed JavaScript are published from this build because they are deterministic. Performance and Largest Contentful Paint are not published from this workstation (76 to 84 under load, 3.8 s simulated mobile); they are measured on the live site with PageSpeed Insights after release.
- The owner merges after approving the preview.

**What is custom and why.**
- `src/components/motion/tween.ts`: a 40-line requestAnimationFrame number tween replaces `motion`'s standalone `animate`, which pulled a separate engine chunk; used by the vitals count-up and the audit counters.
- `src/components/perf/vitals-store.ts` and `VitalValue.tsx`: web-vitals with `reportAllChanges`, capability detection ("not measured by this browser"), a 10 s fallback ("not measured on this visit") that never overwrites a real reading, a debounced polite live region, and rounding that never looks better than the rating.
- Schematic and timeline: clip-path wipes per stage and a scaled hairline instead of stroke-dash draws, because `pathLength` on basic shapes and `vector-effect` behave differently across engines.
- `src/components/hero/Hyperspace.tsx` and `hyperspace-field.ts`: canvas starfield, devicePixelRatio capped at 2, at most 400 stars, requestAnimationFrame only while active or settling, paused off-screen, static under reduced motion, pointer and touch triggers only (the word is not focusable).
- `src/components/motion/useMotionPreference.ts`: the single SSR-stable source of the motion preference; motion's `useReducedMotion` is not used anywhere because mixing the two caused hydration mismatches.

**Tooling notes.**
- Orca pastes the task into Codex before its model has loaded, so the submit keystroke is lost, the dispatch is marked "stalled" and the worker's `ask` is rejected; one Enter in the terminal fixes it, and the worker's questions then arrive as escalations.
- Codex ran out of its ChatGPT window twice mid-task (hero motion, section-motion fixes); Sonnet agents verified and finished from the partial state.
- Claude Code's auto-mode classifier blocked `orca orchestration worker-start --agent codex`; the owner approved the allow rule `Bash(orca orchestration worker-start:*)` in `.claude/settings.local.json` (kept out of git via `.git/info/exclude`).
- Reviews: one code review per task, plus a second adversarial review for the client-side vitals and the section motion; the second reviews found the real defects.

**Owner actions before launch.**
1. Approve the preview of `feat/dark-visual-system`, then merge.
2. After the production deploy, run PageSpeed Insights on the production URL and add two rows to `performance.audits` in `src/content/site.ts`: Lighthouse mobile Performance and Largest Contentful Paint (median of three runs), then commit.
3. Decide whether to delete the six stale `worktree-agent-*` branches and the old Orca worktree for `feat/landing-page`.

**Follow-ups.**
- Safari and Firefox have not been tested; QA covered Chrome and Edge only.
- JavaScript shipped is 189 kB compressed, most of it the Next.js and React runtime plus `motion`; trimming further would mean replacing the remaining `m.*` usage.
- If a link is ever added to the word "Billion", wire the hyperspace focus trigger (the listeners exist; the element is not focusable today).

**Next session start here.**
1. If the PR is merged: verify `main` in a clean checkout (`npm ci && npm run lint && npx tsc --noEmit && npm run build`), open the live site at 390 and 1440, then do owner action 2.
2. If the PR is not merged: read the review comments, create a fix task in the same worktree, one commit per task.

---

## Status (Previous session, 2026-09-16)

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
