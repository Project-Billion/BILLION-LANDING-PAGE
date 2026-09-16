# Billion landing page QA

## Summary

**NO-SHIP for production:** replace the contact placeholders and fix the mobile sheet accessibility and slow mobile LCP before launch.

QA completed: **1 blocker, 2 major, 5 minor, 1 nit**. These counts include explicitly requested launch placeholders; they are not all deviations by the implementer. Source was not modified. Both installed browsers were exercised and photographed, not inferred from Chromium compatibility.

## Environment

| Item | Value |
| --- | --- |
| Date | 16 September 2026 |
| Worktree / branch | C:/Users/abo-k/orca/workspaces/Billion-landing-page/feat-landing-page / feat/landing-page |
| Audited HEAD | 10b979dc46e9cc040a6c040348f5254e9999273d |
| OS / Node / Next / React | Windows / Node 22.14.0 / Next 16.3.5 / React 19.2.8 |
| Chrome | Installed Google Chrome 152.0.7977.83 |
| Edge | Installed Microsoft Edge 153.0.4234.32; browser UA included Edg/153 |
| Browser control | Playwright using the actual chrome.exe and msedge.exe, headless; DevTools Protocol for fonts, accessibility tree, styles, and captures |
| Server | npm run build succeeded, including TypeScript and static generation; npm run start served http://localhost:3000 |
| Viewports | Each browser: 320, 390, 768, 1024, 1280, 1536 CSS pixels wide, 900 high, device scale 1; mobile-menu interaction at 390 x 844 |
| Additional emulation | Touch/coarse pointer, prefers-reduced-motion, cold font loading with a controlled 2–2.5 second WOFF2 delay |
| Tools | Existing Playwright and axe-core; Lighthouse 12.8.2 obtained through npm exec outside the worktree; no project dependency changes |
| Server shutdown | Stopped after QA; confirmed no listener on TCP port 3000 |

The read-only review covered every file under src/, next.config.ts, the brief, reference notes, and the installed Next documentation for fonts, server/client boundaries, and deployment. No deploy to Vercel was performed. The seven section screenshots at each width are full section crops; their heights exceed the viewport where content requires it. Captures used document-coordinate clips after actual scrolling triggered reveals, avoiding fixed-header artifacts from automatic element scrolling.

## Findings

| ID | Severity | Browser | Width | Where | What is wrong | Suggested fix |
| --- | --- | --- | --- | --- | --- | --- |
| QA01 | blocker | Chrome, Edge | all | src/content/site.ts:61 | All WhatsApp links use the configured placeholder +201000000000, and both email links use hello@billion.example. The central conversion routes are not launch-ready. LinkedIn also remains the brief's placeholder. These values faithfully implement the brief but require owner replacement before production. | Replace the values in siteConfig with verified owner destinations and smoke-test them; do not send test messages automatically. |
| QA02 | major | Chrome, Edge | 390, mobile sheet | src/components/site/MobileMenu.tsx:83 | Opening the full-screen, focus-trapped sheet leaves the covered main/footer in the accessibility tree. DevTools still exposes the hero heading, proof heading, Email us, footer contacts and Privacy while the sheet is open; no modal dialog semantics or inert background are present. Virtual-cursor users can reach content that sighted users cannot see. | Use an appropriately labelled modal dialog containing its close control, and make the covered page inert while open; keep the verified Tab trap, Escape and focus return. |
| QA03 | major | Chrome | Lighthouse mobile 412 | Hero; src/components/sections/Hero.tsx:39 | The clean final mobile audit scores 78 performance with LCP 5.7 s. The LCP element is the hero paragraph, with approximately 4.93 s attributed to render delay. The earlier completed audit also had slow LCP (4.1 s). | Profile the critical font/paint path and the above-fold reveal; avoid withholding the LCP text behind opacity animation, and retest on the same mobile preset. This report does not attribute the entire delay to the 600 ms animation. |
| QA04 | minor | Chrome, Edge | 1280 cold-font test | src/app/layout.tsx:8, :15, :20 | The no-fallback-flash requirement fails when local WOFF2 responses are delayed. At 850–900 ms, DevTools reports Times New Roman for the headline and Arial for body/metadata; they subsequently swap to Newsreader, Geist and Geist Mono. Ordinary settled captures use the correct fonts. | Explicitly choose and test a font-display policy for the required no-flash behavior, such as bounded font blocking for critical faces; retain a timeout/failure fallback and remeasure the LCP cost. |
| QA05 | minor | Chrome, Edge | 768 | src/components/sections/ValueProps.tsx:16 | The first cell's data-flow SVG has width:100% plus a 12% left margin. Its right edge is x503.23 while the cell ends at x498; the adjacent cell paints over the rightmost source box and eliminates the intended inner gutter. The page itself still has no horizontal scroll. | Include the margin in the SVG width calculation, or center a max-width drawing without the extra left margin. |
| QA06 | minor | Chrome, Edge | all; measured at 768 | src/components/sections/Proof.tsx:36 | The chat input sits flush with the panel bottom instead of retaining the reference's inset. Its 20 px bottom margin collapses outside the figure: input bottom and figure bottom are identical (5015.72 px at the measured viewport). | Put bottom padding on the chat wrapper, or establish a formatting context that prevents the last child's margin from collapsing. |
| QA07 | minor | Chrome, Edge | all | src/content/site.ts:229 | Privacy points to #privacy, but the document contains no such ID or policy. Clicking it changes the fragment without providing privacy content. The brief explicitly called this a placeholder. | Supply a real policy destination before publishing, or remove the actionable placeholder until content exists. |
| QA08 | minor | Chrome, Edge | 768–1536 | src/components/sections/Hero.tsx:39 | The hero paragraph becomes 19 px at md, while the brief and reference handoff pin prose to 17 px. The larger text changes wrapping and adds visual weight compared with the specified system. | Remove the md:text-[1.1875rem] override unless the design owner explicitly revises the pinned scale. |
| QA09 | nit | Chrome, Edge / source | mobile | src/components/site/MobileMenu.tsx:80 | Visible Menu and Close copy is hard-coded in the component rather than src/content/site.ts. Accessible labels already come from that file, so visible and accessible wording can drift during future edits. | Add the short visible labels to the nav content object and consume them here. |

## Browser verification

| Check | Chrome | Edge |
| --- | --- | --- |
| Horizontal scroll | documentElement.scrollWidth and body.scrollWidth equalled the viewport at all six widths; no right-edge overflowing visible element found | Same at all six widths |
| Navigation targets | What we do → #what-we-do; Industries → #industries; How we work → #how-we-work; Proof → #proof. Target tops settled at approximately 104 px, below the floating header | Same |
| Mobile opening/closing | Open, close button and Escape worked; initial focus moved to What we do; Close/Escape restored the Menu button | Same |
| Focus trap | Forward wrap: WhatsApp → Close → What we do. Reverse wrap: What we do → Close → WhatsApp | Same |
| Body scroll lock | Opened at scrollY 300; after a 600 px wheel gesture scrollY remained 300; overflow lock restored on close | Same |
| Menu anchor | Proof closed the sheet and landed at #proof; the next Tab reached Visit valor-labs.com | Same |
| Keyboard traversal | Skip link → brand → desktop nav → WhatsApp → hero CTAs → Proof link → closing CTAs → footer email/WhatsApp/Valor/LinkedIn/Privacy; visible 2 px focus outlines after scrolling settled | Same |
| Skip link | Enter focused main and set #main; mobile Tab then reached the hero CTA | Same |
| Hover gating | Fine pointer changed Kiln to rgb(158,67,39); touch/coarse emulation reported hover:false and retained rgb(181,80,47) | Same |
| Reduced motion | scroll-behavior:auto; 0 active animations; 0 invisible reveal/hero elements; transition duration 0.01 ms | Same |
| Console | No observed browser console errors/warnings or page errors during the recorded normal interaction checks | Same |
| Fonts, settled | DevTools rendered-font inspection: Newsreader 16pt, Geist, Geist Mono; custom locally served faces. QA04 covers the delayed-load exception | Same |
| Arabic Proof | lang=ar, dir=rtl, text-align:start (right in RTL); joined Arabic in IBM Plex Sans Arabic; Latin Valor isolated with lang=en/dir=ltr | Same |
| Image alternatives | No raster content images; all decorative inline SVGs are aria-hidden directly or through an ancestor; chat figure has a textual caption | Same |
| Automated accessibility | axe-core WCAG A/AA checks returned 0 violations at 1280; the open-sheet accessibility-tree defect is a manual finding | Same |

A rapid Tab sequence can outrun smooth scrolling and the scroll reveals; at normal settled traversal the controls and focus rings became visible. Automated accessibility scores do not establish modal accessibility, destination validity, or design fidelity. Touch emulation is not physical-phone coverage.

All five WhatsApp anchor instances (including desktop/mobile alternatives) resolve to https://wa.me/201000000000, correctly stripping the plus sign from siteConfig. Both email anchors resolve to mailto:hello@billion.example. Proof and footer Valor links both resolve to https://valor-labs.com. Hrefs and target/rel behavior were inspected without sending messages, email, or contacting a third party.

### Contrast spot checks

Computed colors were read through the DevTools CSS domain in both browsers, then converted to WCAG relative-luminance ratios; translucent Proof text was composited over Ink. These are text-color checks, not a claim to have inspected every anti-aliased pixel. The optional 3% grain is not included in the solid-color calculation.

| Pair | Ratio | Result for normal text |
| --- | --- | --- |
| Paper on Kiln, WhatsApp label | 4.53:1 | AA pass, close to threshold |
| Ink-2 on Paper, body | 13.15:1 | AA pass |
| Graphite on Paper | 5.11:1 | AA pass |
| Graphite on Paper-2 | 4.68:1 | AA pass |
| Paper at 70% on Ink, Proof eyebrow | 8.49:1 | AA pass |
| Paper at 85% on Ink, Proof body | 12.12:1 | AA pass |

## Fidelity versus mockups

Comparison uses all seven reference PNGs and NOTES.md, with the brief's production constraints taking priority over generated raster scale. Smaller production headline sizes, natural section heights and 1280 px maximum content width are documented handoff choices, not defects by themselves.

| Section | Concrete comparison |
| --- | --- |
| 01 Hero | Preserves the full-width two-line editorial heading, underline, CTAs, trust line and lower-left schematic/lower-right note at desktop. The lower rule is farther below the trust line than the handoff's 24 px: code uses 56 px at md. Wordmark is 30 px versus the note's 34 px. Paragraph is 19 px rather than the pinned 17 px (QA08). At 768 the schematic/note stack; at mobile the CTAs stack without clipping. |
| 02 Value props | Four cells, offset 8/4 and 5/7 divisions and alternating surfaces reproduce the asymmetric grid. At 1280 Measured payback fits on one line, unlike the raster's two-line title; the smaller specified production typography accounts for much of this difference. At 768 the drawing spills under the neighboring cell (QA05), and the narrow right paragraph becomes markedly taller. At 320/390 cells follow source order in one column. |
| 03 Industries | Reproduces the side caption, seven ruled rows, 47/53 title/body split and closing line. Automotive and metal components wraps when available width narrows; mobile stacks descriptions below headings as prescribed. At 1280 the caption remains on one line rather than the reference's two lines. Small indices use accessible dark text rather than the reference's Kiln. |
| 04 How we work | Four slots and one continuous datum are present from 1024, with steps 01/03 below and 02/04 above. The first index is below the datum, whereas the raster places 01 above it; NOTES describes indices on the text side, so the code follows the written handoff. At 768 and below it uses a vertical sequence. Waypoints remain small squares; index text is Ink rather than Kiln. |
| 05 Proof | Only inverted section; desktop chat-left/story-right and mobile narrative/chat/pull-line order match. Arabic is readable and RTL. Two dialogue lines differ from the reference: the build asks about yellow tomato leaves and a photo/fertilizing history, while NOTES uses a weather/location exchange. The brief did not prescribe dialogue, so this is a recorded copy deviation, not invented factual proof. The chat input lacks the bottom inset (QA06); the panel is consequently shorter than intended. |
| 06 CTA | Keeps the Paper-2 banner, rules, centered ask, paired desktop actions and stacked phone actions. At 1280 the heading is 51.2 px and substantially smaller than the raster; this follows the pinned H2 clamp and the handoff explicitly warns against copying the oversized raster. No extra illustration or metric was added. |
| 07 Footer | Preserves the three desktop groups, hairlines, section index and copyright in a compact band; mobile stacks in the required order. Production underlines are much lighter than the raster. The contact and privacy placeholders remain actionable (QA01, QA07). |

## Lighthouse

Final completed Chrome run: **12.8.2**, fetched **2026-09-16 17:01:23 UTC**. Mobile preset: 412 x 823, DPR 1.75, simulated 150 ms RTT / 1638.4 Kbps throughput and 4x CPU slowdown, fresh Lighthouse browser profile, localhost production build.

| Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- |
| **78** | **100** | **100** | **100** |

| Metric | Final result |
| --- | --- |
| First Contentful Paint | 1.6 s |
| Largest Contentful Paint | 5.7 s |
| Total Blocking Time | 110 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 1.7 s |

The final run had no warnings. An earlier completed run scored 76/100/100/100 with LCP 4.1 s and TBT 440 ms, but warned that origin-data clearing timed out. An intermediate retry failed with NO_FCP and is not represented as a completed score. The final independent completed run is the reported result. These are local synthetic measurements, not Vercel field data; QA03 remains because both completed runs had slow LCP.

## Code review findings

Defects only; IDs refer to the findings table and are not additional counts.

- **MobileMenu.tsx:83 (QA02):** a modal-sized, focus-trapped div does not isolate covered content from the accessibility tree. Keyboard trapping alone is insufficient.
- **layout.tsx:8 / :15 / :20 (QA04):** default swapping font behavior contradicts the requested no-fallback-flash behavior under delayed font responses.
- **ValueProps.tsx:16 (QA05):** w-full plus md:ml-[12%] overflows its content allocation at the tablet breakpoint and gets painted over by the next grid cell.
- **Proof.tsx:36 (QA06):** the final block's bottom margin collapses through its wrappers; use parent padding or a formatting context to preserve the panel inset.
- **Hero.tsx:39 (QA08):** the md font-size override contradicts the pinned body type scale.
- **MobileMenu.tsx:80 (QA09):** two visible UI strings bypass the central content file.

QA01 and QA07 are deliberate brief placeholders that block or impair production use, rather than unexpected implementation behavior. QA03 is a measured runtime issue; its exact bottleneck needs profiling, so no unsupported code-level root cause is asserted.

## Screenshot index

**94 PNGs**, all under the git-ignored qa/screenshots directory. Every row below contains seven independent section captures. The two 1280 full-page files include the complete page after scroll reveals became visible. Edge files were captured by the installed Microsoft Edge executable.

| Browser | Width | Sections |
| --- | --- | --- |
| chrome | 320 | [hero](screenshots/chrome-320-hero.png) · [value-props](screenshots/chrome-320-value-props.png) · [industries](screenshots/chrome-320-industries.png) · [how-it-works](screenshots/chrome-320-how-it-works.png) · [proof](screenshots/chrome-320-proof.png) · [cta](screenshots/chrome-320-cta.png) · [footer](screenshots/chrome-320-footer.png) |
| chrome | 390 | [hero](screenshots/chrome-390-hero.png) · [value-props](screenshots/chrome-390-value-props.png) · [industries](screenshots/chrome-390-industries.png) · [how-it-works](screenshots/chrome-390-how-it-works.png) · [proof](screenshots/chrome-390-proof.png) · [cta](screenshots/chrome-390-cta.png) · [footer](screenshots/chrome-390-footer.png) |
| chrome | 768 | [hero](screenshots/chrome-768-hero.png) · [value-props](screenshots/chrome-768-value-props.png) · [industries](screenshots/chrome-768-industries.png) · [how-it-works](screenshots/chrome-768-how-it-works.png) · [proof](screenshots/chrome-768-proof.png) · [cta](screenshots/chrome-768-cta.png) · [footer](screenshots/chrome-768-footer.png) |
| chrome | 1024 | [hero](screenshots/chrome-1024-hero.png) · [value-props](screenshots/chrome-1024-value-props.png) · [industries](screenshots/chrome-1024-industries.png) · [how-it-works](screenshots/chrome-1024-how-it-works.png) · [proof](screenshots/chrome-1024-proof.png) · [cta](screenshots/chrome-1024-cta.png) · [footer](screenshots/chrome-1024-footer.png) |
| chrome | 1280 | [hero](screenshots/chrome-1280-hero.png) · [value-props](screenshots/chrome-1280-value-props.png) · [industries](screenshots/chrome-1280-industries.png) · [how-it-works](screenshots/chrome-1280-how-it-works.png) · [proof](screenshots/chrome-1280-proof.png) · [cta](screenshots/chrome-1280-cta.png) · [footer](screenshots/chrome-1280-footer.png) |
| chrome | 1536 | [hero](screenshots/chrome-1536-hero.png) · [value-props](screenshots/chrome-1536-value-props.png) · [industries](screenshots/chrome-1536-industries.png) · [how-it-works](screenshots/chrome-1536-how-it-works.png) · [proof](screenshots/chrome-1536-proof.png) · [cta](screenshots/chrome-1536-cta.png) · [footer](screenshots/chrome-1536-footer.png) |
| edge | 320 | [hero](screenshots/edge-320-hero.png) · [value-props](screenshots/edge-320-value-props.png) · [industries](screenshots/edge-320-industries.png) · [how-it-works](screenshots/edge-320-how-it-works.png) · [proof](screenshots/edge-320-proof.png) · [cta](screenshots/edge-320-cta.png) · [footer](screenshots/edge-320-footer.png) |
| edge | 390 | [hero](screenshots/edge-390-hero.png) · [value-props](screenshots/edge-390-value-props.png) · [industries](screenshots/edge-390-industries.png) · [how-it-works](screenshots/edge-390-how-it-works.png) · [proof](screenshots/edge-390-proof.png) · [cta](screenshots/edge-390-cta.png) · [footer](screenshots/edge-390-footer.png) |
| edge | 768 | [hero](screenshots/edge-768-hero.png) · [value-props](screenshots/edge-768-value-props.png) · [industries](screenshots/edge-768-industries.png) · [how-it-works](screenshots/edge-768-how-it-works.png) · [proof](screenshots/edge-768-proof.png) · [cta](screenshots/edge-768-cta.png) · [footer](screenshots/edge-768-footer.png) |
| edge | 1024 | [hero](screenshots/edge-1024-hero.png) · [value-props](screenshots/edge-1024-value-props.png) · [industries](screenshots/edge-1024-industries.png) · [how-it-works](screenshots/edge-1024-how-it-works.png) · [proof](screenshots/edge-1024-proof.png) · [cta](screenshots/edge-1024-cta.png) · [footer](screenshots/edge-1024-footer.png) |
| edge | 1280 | [hero](screenshots/edge-1280-hero.png) · [value-props](screenshots/edge-1280-value-props.png) · [industries](screenshots/edge-1280-industries.png) · [how-it-works](screenshots/edge-1280-how-it-works.png) · [proof](screenshots/edge-1280-proof.png) · [cta](screenshots/edge-1280-cta.png) · [footer](screenshots/edge-1280-footer.png) |
| edge | 1536 | [hero](screenshots/edge-1536-hero.png) · [value-props](screenshots/edge-1536-value-props.png) · [industries](screenshots/edge-1536-industries.png) · [how-it-works](screenshots/edge-1536-how-it-works.png) · [proof](screenshots/edge-1536-proof.png) · [cta](screenshots/edge-1536-cta.png) · [footer](screenshots/edge-1536-footer.png) |

| Browser | Additional evidence |
| --- | --- |
| chrome | [Full page](screenshots/chrome-1280-full-page.png) · [Mobile menu](screenshots/chrome-390-menu-open.png) · [Reduced motion](screenshots/chrome-1280-reduced-motion.png) · [Delayed fonts](screenshots/chrome-1280-font-delayed.png) · [Loaded fonts](screenshots/chrome-1280-font-loaded.png) |
| edge | [Full page](screenshots/edge-1280-full-page.png) · [Mobile menu](screenshots/edge-390-menu-open.png) · [Reduced motion](screenshots/edge-1280-reduced-motion.png) · [Delayed fonts](screenshots/edge-1280-font-delayed.png) · [Loaded fonts](screenshots/edge-1280-font-loaded.png) |


## Re-verification after fixes

Re-verified on **16 September 2026**, against committed HEAD **59b23e7d2baeb97102734fd9e9aea08b4ea8a502** on feat/landing-page. This section supersedes the earlier results for the checks repeated here. The requested browser verification completed; the remaining qualifications are QA03's inconsistent sub-2.5-second LCP and the existing R2 claim about focus after hash navigation.

**Environment and scope:** npm run build passed compilation, TypeScript and static generation; npx next start -p 3100 served the production build at **http://localhost:3100**. Per the coordinator's follow-up, all browser and Lighthouse traffic used port 3100. The owner's separate next dev server on port 3000 was left running and untouched. Actual installed Google Chrome **152.0.7977.83** and Microsoft Edge **153.0.4234.32** were launched headlessly through the existing Playwright installation; the Edge user agent contained Edg/153. Tests and Lighthouse ran from **D:/Temp/User/billion-t6-ctx29eefe**, outside the worktree, using cached packages (Playwright 1.64.0-alpha-2026-09-14, axe-core 4.13.0, Lighthouse 12.8.2). No dependencies were added, no source files were changed, and neither foreign QA script was edited or run. An initial navigation preceded server readiness and one screenshot attempt used the wrong clip mode; both harness issues were corrected before the complete successful browser sweep.

### Verification table

All evidence names below are under qa/screenshots/. Screenshots establish visible results; the linked JSON evidence records accessibility-tree nodes, styles, focus, geometry and console observations that a screenshot alone cannot establish.

| ID | Verified or failed | Browser | Evidence screenshot name | Note |
| --- | --- | --- | --- | --- |
| QA02 — dialog and isolation | verified | Chrome, Edge | [t6-chrome-390-menu-open.png](screenshots/t6-chrome-390-menu-open.png); [t6-edge-390-menu-open.png](screenshots/t6-edge-390-menu-open.png) | At 390 x 844, role=dialog, accessible name Site menu, aria-modal=true, with Close inside the dialog. Main, footer and skip link each have inert=true and DevTools ignored reason inertElement; their headings, links and text are absent from the exposed AX tree while open. The exposed dialog includes its Close button, four navigation links and WhatsApp. |
| QA02 — keyboard and scroll | verified | Chrome, Edge | [t6-chrome-390-menu-closed.png](screenshots/t6-chrome-390-menu-closed.png); [t6-edge-390-menu-closed.png](screenshots/t6-edge-390-menu-closed.png) | Initial focus is What we do; reverse Tab wraps through Close to WhatsApp, and forward Tab wraps WhatsApp to Close to What we do. Escape and Close restore Open menu focus. A 600 px wheel gesture leaves scrollY=300 while open; Escape restores the original empty inline overflow and clears all three inert flags, then a 350 px wheel moves scrollY to 650. A separate test restores a pre-existing overflow:auto exactly. Resizing an open sheet to 768 also clears the dialog, inertness and lock. Hash-navigation focus has the R2 qualification below. |
| QA03 — immediate hero content | verified | Chrome, Edge | [t6-chrome-390-hero-visible.png](screenshots/t6-chrome-390-hero-visible.png); [t6-edge-390-hero-visible.png](screenshots/t6-edge-390-hero-visible.png) | The LCP paragraph, both CTA anchors and every ancestor have opacity:1, visibility:visible and animation-name:none from their first observed animation-frame sample; no sampled hidden state. The paragraph and CTA group no longer carry hero-in. Three font/woff2 preloads are present for the declared Newsreader, Geist and Geist Mono faces; unused Newsreader italic is absent. Immediate means no application reveal delay, not zero network/font/paint time. |
| QA03 — consistent LCP below 2.5 s | failed | Chrome, Lighthouse mobile | [t6-lighthouse-mobile-1.jpg](screenshots/t6-lighthouse-mobile-1.jpg); [t6-lighthouse-mobile-2.jpg](screenshots/t6-lighthouse-mobile-2.jpg); [t6-lighthouse-mobile-3.jpg](screenshots/t6-lighthouse-mobile-3.jpg) | LCP 2.897 / 2.441 / 2.293 s, performance 92 / 93 / 96. Median LCP is 2.441 s, but the only warning-free run is above target; both faster runs warn that origin-data clearing timed out. The opacity fix is verified and performance improved substantially, but these three runs do not establish a consistently clean sub-2.5-second result. |
| QA05 | verified | Chrome, Edge | [t6-chrome-768-value-props.png](screenshots/t6-chrome-768-value-props.png); [t6-edge-768-value-props.png](screenshots/t6-edge-768-value-props.png) | At 768, first cell spans x41 to x498; the data-flow SVG spans x81 to x458 (377 px wide), preserving exactly 40 px on both sides. Its rightmost box is fully visible inside its cell. |
| QA06 — 768 | verified | Chrome, Edge | [t6-chrome-768-proof.png](screenshots/t6-chrome-768-proof.png); [t6-edge-768-proof.png](screenshots/t6-edge-768-proof.png) | Input bottom 5003.719 px versus figure bottom 5023.719 px: a visible 20 px bottom inset in both browsers. |
| QA06 — 1280 | verified | Chrome, Edge | [t6-chrome-1280-proof.png](screenshots/t6-chrome-1280-proof.png); [t6-edge-1280-proof.png](screenshots/t6-edge-1280-proof.png) | Input bottom 4724.188 px versus figure bottom 4744.188 px: the same 20 px bottom inset in both browsers. |
| QA07 | verified | Chrome, Edge | [t6-chrome-1280-footer.png](screenshots/t6-chrome-1280-footer.png); [t6-edge-1280-footer.png](screenshots/t6-edge-1280-footer.png) | No footer Privacy link and zero anchors pointing to #privacy at all six widths. Footer links are email, WhatsApp, Valor Labs and LinkedIn. The source comment describes where to restore a real policy link. |
| QA09 | verified | Chrome, Edge / source | [t6-chrome-390-menu-open.png](screenshots/t6-chrome-390-menu-open.png); [t6-edge-390-menu-closed.png](screenshots/t6-edge-390-menu-closed.png) | Visible Menu and Close now come from nav.menuOpenText and nav.menuCloseText in src/content/site.ts; both render correctly. |
| R2 — every close retains toggle focus | failed | Chrome, Edge | [t6-chrome-390-anchor-keyboard-next-tab.png](screenshots/t6-chrome-390-anchor-keyboard-next-tab.png); [t6-edge-390-anchor-keyboard-next-tab.png](screenshots/t6-edge-390-anchor-keyboard-next-tab.png) | Link handlers now call close(), and the focus-event trace proves a brief return to the toggle. However, native #proof navigation subsequently blurs it: settled activeElement is BODY after both mouse click and Enter. Proof lands correctly at y104.375 and the next Tab reaches Visit valor-labs.com. This preserves the earlier useful anchor-navigation behavior but does not satisfy the literal claim that every close path leaves focus on the toggle; it is the existing R2 qualification, not a newly introduced defect. |
| R3 | verified | Chrome, Edge | [t6-chrome-1280-cta.png](screenshots/t6-chrome-1280-cta.png); [t6-edge-1280-cta.png](screenshots/t6-edge-1280-cta.png) | Closing CTA arrow has class h-3 w-5, computed width 20px and a measured 20 x 12 px rectangle; verified at every sweep width. |
| R4 | verified | Chrome, Edge | [t6-chrome-1280-value-props.png](screenshots/t6-chrome-1280-value-props.png); [t6-edge-1280-industries.png](screenshots/t6-edge-1280-industries.png) | Both ul elements have explicit role=list. Actual AX snapshots expose one list with four listitems for value props and one with seven listitems for industries, preserving their headings and paragraphs. Safari/VoiceOver was not exercised in this Chrome/Edge task. |
| Regression — overflow | verified | Chrome, Edge | t6-{chrome,edge}-{320,390,768,1024,1280,1536}-full-page.png | At every requested width, documentElement.scrollWidth and body.scrollWidth equal the viewport; zero visible main/footer elements cross either horizontal viewport edge. All reveal elements were visible after scrolling through the page. |
| Regression — axe and console | verified | Chrome, Edge | [t6-chrome-1280-full-page.png](screenshots/t6-chrome-1280-full-page.png); [t6-edge-1280-full-page.png](screenshots/t6-edge-1280-full-page.png) | axe-core 4.13.0 at 1280: 0 violations, 40 passing rules, 0 incomplete results, with WCAG A/AA through 2.2 and best-practice tags. Both complete sweeps recorded 0 console warnings/errors, 0 uncaught page errors and 0 failed requests. |
| Regression — reference fidelity | verified | Chrome, Edge | t6-{chrome,edge}-1280-hero.png; t6-{chrome,edge}-1280-proof.png; t6-{chrome,edge}-1280-cta.png | Visually compared all six captures with design/reference/01-hero.png, 05-proof.png and 06-cta.png. The two-line underlined hero, lower schematic/inspection note, inverted chat-left Proof and centered ruled CTA retain the reference compositions and palette. The Proof input inset and smaller CTA arrow now match the intended details. Previously documented production scale, 19 px hero lead, natural section heights and Arabic dialogue choices remain; no new visual regression was observed. |

The complete runtime records are [Chrome evidence](screenshots/t6-chrome-evidence.json), [Edge evidence](screenshots/t6-edge-evidence.json) and [combined results](screenshots/t6-results.json). The focused follow-up records are [Chrome focus events](screenshots/t6-chrome-focus-check.json) and [Edge focus events](screenshots/t6-edge-focus-check.json); they include both click and keyboard navigation and scroll-style restoration.

### Three Lighthouse mobile runs

Lighthouse **12.8.2**, actual installed Chrome, fresh CLI-launched profiles, performance preset with form-factor=mobile, mobile screen emulation **412 x 823 / DPR 1.75**, simulated **150 ms RTT / 1638.4 Kbps / 4x CPU slowdown**, URL **http://localhost:3100**. The cached Lighthouse CLI was called from the external temp directory with the same flags specified by the coordinator, including --preset=perf, --throttling-method=simulate and --chrome-flags=--headless=new. No browser interaction sweep ran during the audits; this was the user's shared Windows machine, not a controlled performance lab.

| Run | Fetched (UTC) | Performance | LCP | FCP | TBT | CLS | Warning / raw result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 18:30:42.863 | **92** | **2.897 s** | 1.187 s | 199 ms | 0 | None; [JSON](screenshots/t6-lighthouse-mobile-1.json) |
| 2 | 18:31:04.730 | **93** | **2.441 s** | 1.133 s | 252 ms | 0 | Origin-data clearing timed out; [JSON](screenshots/t6-lighthouse-mobile-2.json) |
| 3 | 18:31:33.915 | **96** | **2.293 s** | 1.004 s | 163 ms | 0 | Origin-data clearing timed out; [JSON](screenshots/t6-lighthouse-mobile-3.json) |

All three audits completed without runtime errors; the storage-reset warnings are retained rather than silently replacing those runs. Median performance is **93** and median LCP **2.441 s**, versus the earlier report's **78 / 5.7 s** final run (and **76 / 4.1 s** earlier completed run). These are local synthetic comparisons, not field measurements or proof that the full improvement comes from one change.

Every Lighthouse run still identifies the **hero lead paragraph** as LCP, now without an opacity animation. The legacy simulated LCP phase table attributes approximately **2.349 / 1.896 / 1.822 s** to render delay; these broad timing buckets do not identify a single cause and must not be confused with the separate observed-trace insight timings. Critical fonts are preloaded and use the coordinator-approved swap policy. To close the remaining QA03 performance concern, obtain warning-free repeat measurements and investigate the remaining render/font/main-thread path; the report does not claim the removed animation explains all residual delay. [Metric and configuration summary](screenshots/t6-lighthouse-summary.json).

### Remaining scope and shutdown

**No new distinct defect was discovered, so no QA10+ finding is added.** QA03 and R2 above retain their existing identities. QA01 remains owner-supplied launch placeholders by decision; QA04 remains the explicitly accepted font-swap trade-off; QA08 remains the accepted 19 px desktop hero hierarchy exception. This re-verification does not turn those decisions into newly fixed issues or alter the historical findings table.

The T6 production server on **port 3100 was stopped**, and a final TCP listener check confirmed **3100 is free**. Only PID 6288 was stopped, after matching its command to this worktree's next start -p 3100 and confirming it owned that listener. The owner's port 3000 server (previously PID 26784) **was not stopped by T6**; it had independently ceased listening by the final check. [Shutdown evidence](screenshots/t6-shutdown.json). Source and dependency manifests remain unchanged; the only tracked file changed by T6 is this appended report, with additional local evidence under qa/screenshots/. No commit or push was made.

Final source-integrity check: HEAD advanced during T6 to **82a4eb076a4ffaa659b77824fd7ff3f4bfe000d2** through the coordinator's documentation-only commit; the sole committed difference from the built 59b23e7 revision is docs/HANDOFF.md, so the verified application source still matches current HEAD. All 37 explicit evidence links resolve, and the new evidence includes 42 PNG captures plus three Lighthouse JPEG captures.
