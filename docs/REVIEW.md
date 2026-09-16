# Internal review findings (coordinator-collected)

Findings from the internal Claude reviewers on the committed code. Severity uses the same scale as qa/REPORT.md. Fix in severity order; if a finding contradicts docs/BRIEF.md, say so instead of applying it.

## From the review of commit c85d240 (foundation)

| ID | Severity | Where | What is wrong | Suggested fix |
| --- | --- | --- | --- | --- |
| R1 | major | src/components/ui/SectionLabel.tsx (default tone) | Kiln (#B5502F) section index at 13px mono on Paper (#F5F2EC) measures 4.53:1, only 0.03 above the AA floor for small text; BRIEF section 8 says small text must not be Kiln on Paper. T3 reports it switched indices to Ink; verify every SectionLabel and the hero panel index render in Ink (or in Kiln only at a size/weight that clears 4.5:1 with margin) and remove any default that silently falls back to Kiln. | Make Ink the default index colour; Kiln only by explicit opt-in where contrast is proven. |
| R2 | minor | src/components/site/MobileMenu.tsx (link and WhatsApp onClick handlers) | Links close the sheet with `setOpen(false)` instead of `close()`, so focus return depends on browser anchor behaviour rather than the component. Escape and the toggle use `close()`. | Route every close path through `close()` so focus returns to the toggle consistently. |

Verified OK by the same review (no action needed): next/font Newsreader `opsz` axis, `viewport` and `openGraph` fields, `app/icon.svg` convention, Tailwind v4 `@theme static` / `@theme inline` usage and the `--text-h1--line-height` companion convention, `hover:` variant already gated by `(hover: hover)`, palette and type scale byte-for-byte per BRIEF, copy verbatim per BRIEF section 5, placeholders per section 6, .gitignore coverage.

## From the review of commit 10b979d (sections)

The reviewer confirmed R1 is already fixed in this commit (SectionLabel indices are Ink/Paper only). Keep it that way.

| ID | Severity | Where | What is wrong | Suggested fix |
| --- | --- | --- | --- | --- |
| R3 | minor | src/components/ui/Icons.tsx:13 and src/components/sections/CTA.tsx:27 | `ArrowRight` bakes `w-7` into its base classes; the CTA passes `className="w-5"`, producing `h-3 w-7 w-5`. In the compiled CSS `.w-7` comes after `.w-5`, so the override is a no-op and the CTA arrow renders at 28px instead of 20px. | Drop the default width from the base string (size via props or the caller) or use a non-conflicting class. |
| R4 | minor | src/components/sections/ValueProps.tsx:29 and src/components/sections/Industries.tsx:19 | Both `<ul>` lists omit `role="list"`; Tailwind preflight sets `list-style: none`, which makes Safari/VoiceOver drop list semantics. HowItWorks already uses `<ol role="list">`. | Add `role="list"` to both lists. |
| R5 | note | src/app/globals.css (`.reveal` rules) | The hidden state is gated by `@media (prefers-reduced-motion: no-preference) and (scripting: enabled)`. Correct fail-safe direction (unsupported feature means content stays visible), but browsers without `scripting` support silently never play the reveal. | No change required; `scripting` is supported in current Chrome, Edge, Firefox and Safari. Mention in the PR as a known graceful degradation. |

Verified OK by the same review (no action needed): IBM_Plex_Sans_Arabic options against the installed font data; server/client boundaries (`use client` only on Reveal and MobileMenu); Reveal hydration safety and observer cleanup; reduced-motion honoured in both JS and CSS; one h1, every section `aria-labelledby` resolves; all external links have rel/target and the new-tab hint; every visible string traces to site.ts; no banned words or fabricated metrics; Tailwind v4 utilities used correctly; no Node-only APIs in client code.

## Coordinator decisions for T5 (binding; read qa/REPORT.md for the evidence)

| ID | Decision | Instruction |
| --- | --- | --- |
| QA01 | skip | Placeholder contacts are owner-supplied by design. Do not invent or change them. |
| QA02 | fix | Give the mobile sheet real modal semantics (role="dialog", aria-modal="true", labelled, close control inside) and make the covered page inert while it is open (React 19 supports the `inert` attribute on main and footer, or use the native dialog element). Keep the verified Tab trap, Escape and focus return. Route every close path through close() (this also resolves R2). |
| QA03 | fix | The LCP element is the hero paragraph and it is hidden behind the on-load opacity reveal. Do not opacity-hide the LCP text: paint the paragraph and CTAs immediately, keep at most a short transform-plus-opacity reveal on the eyebrow and H1 per the animate skill, and confirm fonts for the hero are preloaded. Re-measure with Lighthouse mobile preset (run `npx --yes lighthouse@12 http://localhost:3000 --preset=perf --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --chrome-flags="--headless=new" --output=json --output-path=<file>` from a temp folder OUTSIDE the worktree against `npm run start`); report LCP before and after; target under 2.5 s, and if you cannot reach it explain what remains. |
| QA04 | skip with reason | Keep next/font's default `display: swap` with metric-adjusted fallbacks; blocking fonts would worsen QA03. Verify Newsreader, Geist and Geist Mono have preload enabled (default for declared subsets). Document as a known trade-off. |
| QA05 | fix | Include the margin in the SVG width calculation or centre a max-width drawing without the extra left margin. |
| QA06 | fix | Preserve the chat panel bottom inset (padding on the wrapper or a formatting context). |
| QA07 | fix by removal | Remove the Privacy link from the footer content until a policy exists; leave a comment in site.ts explaining where to add it back. |
| QA08 | skip with reason | The 19 px hero lead at md and above is a deliberate hierarchy exception to the 17 px body scale; keep it and note it in the report. |
| QA09 | fix | Move the visible "Menu" and "Close" labels into the nav content object in site.ts. |
| R1 | verify | Confirm no small text renders Kiln on Paper or Paper-2. |
| R3 | fix | Remove the baked-in width from ArrowRight or use a non-conflicting class so the CTA arrow renders at 20 px. |
| R4 | fix | Add role="list" to the ValueProps and Industries lists. |
| R5 | no change | Known graceful degradation; mention in the PR. |
