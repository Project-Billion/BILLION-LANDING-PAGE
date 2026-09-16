# Billion reference mockups — build handoff

These seven images are independent section references for the same page, in order. Read [BRIEF.md](../../docs/BRIEF.md) as the source of truth for production values and content. Rebuild the composition with semantic HTML, Tailwind, inline SVG primitives and real text; do not ship these PNGs as the website.

## Global decisions

**Direction used:** warm engineering report, Swiss grid discipline, restrained editorial serif, numbered records and fine structural rules. The conceptual thread is an engineering dossier: diagnose the losses, identify the sector, explain the process, demonstrate practical Arabic-language software, invite an on-site conversation.

**Skill selections:** Quiet Premium Neutral; quiet paper background character; editorial serif plus grotesk typography; Mid Editorial hero with a full-width statement and low supporting detail; Swiss grid section system. The four component families are Off-Grid Editorial Layout, Pristine Gapless Bento Grid, Vertical Rhythm Lines, and Product UI Panel Stack (the chat messages, without floating dashboard cards). Motion cues are staggered float-up and cinematic fade-through, both interpreted as a single restrained reveal, never a loop. Use the brief's <=12px translation and reduced-motion behavior.

### Palette

| Token | Pinned value | Use in these references |
| --- | --- | --- |
| Paper | #F5F2EC | Hero, industries, process, footer, light content cells |
| Paper-2 | #EDE8DF | Value-prop surround/cells, CTA, chat message surfaces |
| White | #FFFFFF | Farmer message and input surface |
| Ink | #15130F | Display text; full Proof background only |
| Ink-2 | #2B2822 | Main body copy |
| Graphite | #6B665C | Secondary copy and metadata on light |
| Rule | rgba(21,19,15,0.10) | Cell boundaries, ledger rows, timeline, footer rules |
| Dark rule | rgba(245,242,236,0.14) | Proof divider |
| Kiln | #B5502F | WhatsApp actions, small indices, one underline under “facts” |
| Kiln-hover | #9E4327 | Production hover state; not separately illustrated |
| Kiln-tint | #F3E4DD | Available token; no tag system needed in these comps |

Section 05 is the only inverted section. Small link text on dark is Paper with an underline; the small arrow is a secondary detail, not the sole link affordance. Use actual solid CSS colors. Do not sample raster anti-aliasing or the generation's slight surface variation to create new palette tokens. No designed gradient, photograph, glow, elevated card shadow or glass effect is part of the direction.

### Typography and dimensions

The images distinguish the three roles: Newsreader-style editorial serif for statements and headings, Geist-style grotesk for prose/navigation/buttons, Geist Mono-style metadata. Image generation synthesizes letterforms; install the exact brief fonts through next/font/google rather than trying to match a raster substitute.

| Role | Production value from brief | Reference usage |
| --- | --- | --- |
| H1 | clamp(2.75rem, 6vw, 5.5rem), weight 400–500 | Two-line hero statement, normal weight |
| H2 | clamp(2rem, 4vw, 3.5rem), weight 400–500 | Proof title, closing CTA |
| Section/item headings | Generally 28–34px desktop, 24–28px mobile | Bento titles, industries, process steps |
| Body | 17px / 1.6, weight 400 | Full paragraphs retained |
| UI | 15px, weight 400–500 | Nav, buttons, footer links |
| Metadata | 12–13px, 0.08em tracking | Section labels, step indices, inspection list |
| Display tracking/leading | -0.02em / 1.05 | All Newsreader headings |

Use an 8px base, max-width 1280px container, 40px desktop and 20px mobile minimum gutters. Main sections use 160px desktop and 96px mobile vertical padding; internal gaps use 16/24/32/48/64px. The compact footer can use a shorter natural content band. Default radius 4px within the brief's 2–6px range. Buttons are rectangular, >=48px tall, with 24px horizontal padding and visible focus treatment.

All boards are 1600 × 900 for comparison, not literal CSS section heights. Their generated text and content widths are somewhat enlarged; use the pinned production values above, allowing text to wrap naturally. In particular, do not hard-code screenshot coordinates or 900px section heights.

## 01 — Hero

**Composition anchor / background:** top-left lead, support low-right; Paper with a fine production-line schematic. The headline spans the composition. The diagram and technical note come below the trust line and a full-width rule, so this is not a left-text/right-image hero.

**Grid:** inset nav across the container; wordmark left, navigation and WhatsApp right. Full-width headline, prose limited to about 850px. Lower row approximately 8/4 columns for schematic and inspection note. The note remains small and clearly subordinate.

**Spacing:** nav inset 24px from the top; 64px to the opening copy, 24–32px between content groups, 16px from buttons to trust line, 24px below the long rule. Let the schematic scale within its column.

**Type / palette:** H1 uses the pinned 44–88px clamp, 34px serif wordmark, 17px prose, 15px UI/trust line, 12–13px mono label and note. Paper canvas, Ink heading, Graphite support, Kiln WhatsApp actions and one restrained underline.

**Copy shown:**

- Wordmark: “Billion”.
- Navigation: “What we do”, “Industries”, “How we work”, “Proof”, “WhatsApp”.
- Eyebrow: “Industrial software, made in Egypt”.
- H1: “Run the plant on facts, not phone calls.”
- Body: “Billion builds AI and operations software for Egyptian manufacturers: production tracking, predictive maintenance, quality control and planning that work on the floor from day one, with a payback you can measure.”
- Actions: “Book a plant walkthrough”; “See how we work”.
- Trust line: “Egyptian team. On site across the industrial zones: 10th of Ramadan, 6th of October, Borg El Arab, Sadat City.”
- Note: “What we look at first”; “stoppages”, “scrap rate”, “energy per unit”, “changeover time”, “delivery slips”.
- Small section index: “01”.

**Second-read moment:** this is the one deliberate second-read motif for the entire page: the small hairline-boxed mono inspection note. No fake numbers. Do not repeat this note style as decoration elsewhere.

**Mobile:** switch nav to the brief's full-height sheet. Headline, prose, stacked actions, trust line, schematic and note become one column in that reading order. Remove any forced desktop line break. Keep the note full-width and the schematic within the available width; simplify SVG detail if needed, not the copy.

## 02 — What you get

**Composition anchor / background:** asymmetrical gapless bento on Paper-2 with alternate Paper cells. Four benefits, not three identical cards.

**Grid:** first row roughly 8/4 columns, second row roughly 5/7. The final image has clearly offset T-junctions: the upper divider is around two-thirds across and the lower divider around two-fifths. Upper row is taller to accommodate the data-flow drawing and payback paragraph. Row heights are content-driven.

**Spacing:** 48px after the section label, 32–40px cell padding, 16–24px from heading to paragraph, 24px before the first schematic. No gutters between cells; one-pixel shared boundaries.

**Type / palette:** 28–34px Newsreader item titles; 17px Geist paragraphs; 12–13px Geist Mono label/indices. Kiln only on small indices. No CTA in this section.

**Copy shown:**

- “02 — What you get”
- “Decisions from your own data” — “We connect what you already run, ERP, PLCs, Excel, paper logs, and turn it into answers: which line loses the most, why, and what to do this shift.”
- “Measured payback” — “Every project starts with a baseline and a target: scrap rate, downtime hours, energy per unit. If the number does not move, we are not finished.”
- “Built to survive the floor” — “Works through power cuts and bad connectivity, runs on the hardware you have, and hands over with operator training in Arabic.”
- “Weeks, not quarters” — “A pilot on one line first. We scale only after it proves itself, with the same people and the same numbers.”

**Second-read moment:** none added. The unlabeled connection diagram supports the data-consolidation paragraph; it is not a dashboard or a metric claim. Small internal indices 01–04 establish scan order.

**Mobile:** four cells in source order, one column, 24px padding, 32px content gaps. Keep shared horizontal rules, remove desktop column boundaries, keep schematics contained. Do not maintain fixed row heights.

## 03 — Industries

**Composition anchor / background:** left caption with a broad right ledger on Paper. Typography and rules carry the entire section.

**Grid:** 2-column label rail plus 10-column ledger; within each ledger row, approximately 47/53 title/description. Building materials is intentionally two lines. Align descriptions to the row's visual center.

**Spacing:** rows approximately 72–88px high, longer rows auto-height; 16–24px vertical padding, 32px column gap, 48px before the closing line. Section outer padding follows the global rhythm.

**Type / palette:** industry titles 28–32px Newsreader; descriptions 17px Geist; label 12–13px mono; closing sentence approximately 32–34px Newsreader. Ink titles, Graphite descriptions, light rules, Kiln only on the section index.

**Copy shown:**

- “03 — Industries”
- “Food and beverage” — “changeovers, shelf-life traceability, line stoppages”
- “Textiles and garments” — “fabric defects, order tracking, delivery slips”
- “Plastics and packaging” — “scrap and regrind, mold changeover, energy per kg”
- “Building materials (cement, ceramics, steel)” — “kiln and furnace energy, predictive maintenance”
- “Pharmaceuticals” — “batch records, deviations, compliance paperwork”
- “Chemicals and fertilizers” — “yield, dosing accuracy, safety logs”
- “Automotive and metal components” — “rework, tool wear, takt time”
- “Different products, same leaks. We start where yours is biggest.”

**Second-read moment:** none added. Do not introduce icons, hover expansion, or extra row numbers.

**Mobile:** section label above ledger. Each row stacks the industry and its description with an 8–12px gap, then 24px to the next rule. Wrap the closing sentence; no horizontal ledger scrolling.

## 04 — How we work

**Composition anchor / background:** staggered editorial timeline on Paper. Four waypoints lie on a continuous horizontal datum.

**Grid:** four equal three-column slots. Steps 01/03 appear below the datum; 02/04 above it. Short vertical leaders connect each index to its waypoint. Source order remains 01, 02, 03, 04 despite the stagger.

**Spacing:** 64px after the section label, 32px between step columns, 24–32px from timeline to text, 16px heading/body gap. Give the longest third heading enough room to wrap over two lines. No fixed paragraph heights.

**Type / palette:** 28–32px Newsreader headings, 17px Geist paragraphs, 12–13px Kiln mono numbers. Waypoints are tiny Kiln squares, not large decorative numerals. Fine Ink/Graphite line.

**Copy shown:**

- “04 — How we work”
- 01 “Walk the floor” — “Half a day on site. We watch the lines, talk to the shift leads, and map where money leaks: stoppages, rework, waiting.”
- 02 “Pick one number” — “One line, one metric, one baseline. A pilot scoped to prove value, not to impress.”
- 03 “Build and run it with your team” — “We deploy on your network, train operators in Arabic, and stay through the first production weeks.”
- 04 “Scale what worked” — “Roll out to the next lines with the same people and the same numbers. You own the system and the data.”

**Second-read moment:** none added. The stagger expresses sequence and changes page rhythm; it is not a second decorative device.

**Mobile:** replace the horizontal line with one vertical line at the start edge; stack steps in numerical order with 40–48px gaps. Remove above/below offsets. Keep readable body width at 320px.

## 05 — Proof

**Composition anchor / background:** inverted editorial split: chat still on the left, narrative on the right. Full Ink field, the only dark block.

**Grid:** roughly 5/7 columns, 64px gap, chat centered against the narrative. Chat is a flat HTML-style panel, not a phone photo or device frame. Story contains eyebrow, title, body, rule, pull line and an underlined link.

**Spacing:** 32px between eyebrow/title/body groups, 32px around the pull-line divider, 32px before the external link. Chat padding 20–24px and message gaps 16–24px.

**Type / palette:** Newsreader H2 capped at 56px in code; body 17px; pull line 24px serif; link 15px Geist; label/eyebrow 12–13px mono. Paper text on Ink, muted Paper support text, Paper/Paper-2/White chat surfaces. Use a readable Arabic-supporting face for the chat; the brief does not prescribe one. Load it locally with the project's font pipeline if an additional font is needed.

**Copy shown:**

- “05 — Proof”
- “Sister company · valor-labs.com”
- “Valor Labs: an AI engineer in every farmer's pocket”
- “Valor, Billion's sister company, sells soil and crop products to farmers and distributors across Egypt. Billion built its 'Ask Our Engineer' assistant: agronomy answers in Egyptian Arabic, weather for the farmer's own location, and market prices, on the phone the farmer already owns.”
- “What it proves for a factory: Arabic-language AI that non-technical people actually use, in the field, on ordinary phones. The same discipline goes on the shop floor.”
- “Visit valor-labs.com”

**Illustrative chat text:** the brief specifies a chat but does not provide its dialogue. This neutral weather-request exchange was added for the schematic; it is not a verified screenshot or a claim about a real conversation.

- Header: “اسأل مهندسنا”; wordmark: “Valor”.
- Assistant: “أهلاً، إزاي أقدر أساعدك؟”
- Farmer: “عايز أعرف حالة الطقس عندي.”
- Assistant: “ابعتلي موقع الأرض علشان أجيبلك توقعات الطقس.”
- Input placeholder: “اكتب سؤالك هنا”

Implement the Arabic content as real text with lang="ar" and dir="rtl", joined glyphs, correct punctuation and right alignment; isolate the Latin Valor wordmark. Use a static demonstration rather than implying a functioning chat input. Rebuild all message surfaces and the send primitive in code. No fabricated weather values, prices, metrics, or testimonial. Keep proof.quote null and hidden.

**Second-read moment:** none added. The material change from light page to dark proof is required section contrast, not an extra motif.

**Mobile:** reading order should be label, eyebrow, title, body, chat, pull line, link. Move the visual with responsive grid areas while keeping an intelligible DOM order. Chat becomes full-width; allow Arabic messages to wrap naturally. Keep 24–32px gaps.

## 06 — CTA

**Composition anchor / background:** stacked center, a quiet full-width Paper-2 banner. This is the deliberately minimal pause after the dense proof.

**Grid:** one centered column; prose max-width about 750px; two adjacent actions. Thin upper/lower rules define the band, with small 06 at the upper rule's start.

**Spacing:** 32px from title to prose and prose to buttons, 24px between buttons and before response metadata. Generous equal whitespace above and below, using the global section padding rather than a fixed screenshot height.

**Type / palette:** title uses the pinned H2 clamp, body 17px, UI 15px, metadata 12–13px mono. Ink on Paper-2, flat Kiln WhatsApp button, hairline outline Email button.

**Copy shown:**

- “Start with one line.”
- “Tell us which line hurts most. We will come to the plant, look at it with you, and say honestly whether software will pay off and what it would cost.”
- “WhatsApp us”; “Email us”.
- “Replies within one working day. Cairo time.”
- Small section index “06”.

**Second-read moment:** none added. No picture, badge, statistic, oversized punctuation, or extra promise.

**Mobile:** keep centered statement/prose, stack full-width buttons, wrap metadata naturally. WhatsApp remains first and most prominent. Bind actions to the single siteConfig, not literal values copied into multiple components.

## 07 — Footer

**Composition anchor / background:** compact three-part editorial colophon on Paper, framed by hairlines. The large surrounding board whitespace exists to preserve the required 16:9 deliverable.

**Grid:** approximately 6/3/3 columns: brand/tagline, contact, related links. A separate lower row holds small 07 left and copyright right.

**Spacing:** 48px after top rule, 16px between wordmark/tagline, 16–24px between contact/link items, 40px to the lower rule, 24px to metadata. Build a naturally short footer, not a 900px blank expanse.

**Type / palette:** wordmark about48px Newsreader, tagline17px Geist, links15px Geist, location/copyright12–13px mono. Ink and Graphite on Paper; a small Kiln WhatsApp arrow is optional. No filled primary button.

**Copy shown:**

- “Billion”
- “Software for Egyptian industry.”
- “hello@billion.example”
- “WhatsApp”
- “Cairo, Egypt”
- “Valor Labs”
- “LinkedIn”
- “Privacy”
- “© 2026 Billion.”
- Small section index “07”.

**Second-read moment:** none added. No new slogan or illustration.

**Mobile:** stack brand, contact, links, copyright in that order with 32px group gaps. Keep each link's actual tap area at least 44px even if visible text looks compact. Links remain clear without hover.

## Deviations and production interpretation

1. **Generated type, scale and margins are approximations.** The image tool produces raster letterforms, not installed Newsreader/Geist fonts; headline scale and content width were exaggerated in some boards (especially Hero, Proof and CTA). The hero reads around 100–112px and CTA around 88–100px in the final raster; use the brief's 88px H1 and 56px H2 caps in production. Several comps fill about 1360–1420px horizontally; restore max-width 1280px in code. This preserves the pinned visual system.
2. **Minor raster surface/color variance remains.** Flat pinned colors were requested throughout, but the generator adds faint tonal variation and anti-aliasing. Compression also approximates colors. Do not implement gradients, extra colors, texture stronger than the optional 3% grain, or sampled off-palette hues.
3. **The Arabic dialogue is illustrative added content.** The brief gives the chat's purpose, not its actual words. The neutral exchange above demonstrates RTL layout without inventing outcomes, measurements, or advice. The image is a design reference; the build must create the still in code.
4. **Horizontal boards are not page-height specifications.** The footer includes presentation whitespace, while denser boards compress outer section padding. Use the brief's responsive spacing and content-driven height.
5. **Metadata uses visual uppercase and occasional line breaks.** Keep the canonical strings in content and apply uppercase styling as appropriate. The Proof label was rendered title case; production section labels should follow the common mono uppercase treatment.
6. **Tiny decorative color details are not binding.** The compressed Proof arrow reads neutral instead of Kiln; retain the accessible Paper link and use a restrained Kiln arrow only if desired. Do not alter the single-accent rule.

No intentional English-copy edits, invented metrics, customer claims, photography, extra sections or testimonial were introduced. The hero remains outside the excluded left-text/right-image composition. The value grid was edited once to establish the required asymmetry; hero UI type was edited once to restore the grotesk role.

## Asset verification and provenance

Generated using the built-in image_gen.imagegen tool under imagegen-frontend-web, with the imagegen skill's built-in save workflow. Seven independent initial image calls, followed by two targeted image-tool edits (Hero and Value Props). No HTML/CSS drawing was used as an image-generation substitute, no Figma writes, no project dependencies installed, and no app files changed.

Pillow was used only for the explicitly requested sizing/compression: generated 1672 × 941 images were resized to exact 1600 × 900, then saved as optimized 128-color PNGs without dithering. All seven files reopen as valid PNGs; unique hashes confirm separate files. Every generated composition was visually inspected, and compressed Hero/Proof were inspected again for legibility. Size limit uses the stricter decimal 700,000-byte threshold.

| File | Dimensions | Bytes |
| --- | --- | ---: |
| 01-hero.png | 1600 × 900 | 697,696 |
| 02-value-props.png | 1600 × 900 | 656,726 |
| 03-industries.png | 1600 × 900 | 664,108 |
| 04-how-it-works.png | 1600 × 900 | 615,704 |
| 05-proof.png | 1600 × 900 | 677,909 |
| 06-cta.png | 1600 × 900 | 585,118 |
| 07-footer.png | 1600 × 900 | 519,285 |

The build still needs normal responsive, accessibility and browser verification; these are reference images, not a tested implementation. Keep placeholders in the brief's single siteConfig, including hello@billion.example, +201000000000, the LinkedIn URL and null proof quote.

## Generation prompts

The common prompt and section-specific prompts below are preserved for reproducibility. Their requested CSS-like dimensions are guidance to the image model; the deviations above describe the actual raster results.

<details>
<summary>Common prompt</summary>

```text
Use case: ui-mockup. Create ONE finished high fidelity desktop website SECTION design comp, horizontal EXACT 16:9 canvas, ideally 1600x900. Flat straight-on browser content, no browser chrome, no device, no slide border, no presentation caption. Brand: Billion, Egyptian industrial software house; calm Swiss engineering annual report, warm flat typographic editorial precision. Color system locked: Paper #F5F2EC, Paper-2 #EDE8DF, White #FFFFFF, Ink #15130F, Ink-2 #2B2822, Graphite #6B665C; only accent Kiln #B5502F. Hairline rules Ink at 10% on light, Paper at 14% on dark. Display typography Newsreader editorial serif 400-500 with -0.02em tracking and 1.05 line height; body Geist grotesk 17px/1.6 at desktop equivalent; metadata Geist Mono 12-13px uppercase with wide tracking. Never use default Arial/Helvetica/Inter. 1280px content maximum centered within 1600px canvas; 8px spacing base, 40px minimum desktop gutters, very generous whitespace, 2-6px corner radii. Buttons are rectangular 4px radius and at least 48px tall, never pills. Kiln solid buttons ONLY for WhatsApp, Ink solid other primary, hairline secondary, underlined links. Technical precision illustrated only with hairline primitive schematics and code-buildable UI stills; NO photography, stock images, gradients, glows, shadows, floating blobs, generic icons, glassmorphism, fake dashboard, invented metrics, fake client names, or logos. Do NOT add slogans, irrelevant microcopy or metrics. Copy supplied below must be typeset exactly and completely, readable; keep original punctuation and spelling. One isolated website section only; do not include other sections or any additional page slices. This is one coordinated seven-section site, implementation reference for Tailwind. Section 05 alone has dark Ink background; all other sections use Paper/Paper-2. Frame should feel art-directed, spacious, legible, buildable.
```

</details>

<details>
<summary>01-hero — section prompt</summary>

```text
SECTION 01 HERO. Hero scale Mid Editorial, top-left lead with a full-width typographic opening and support panel LOW-RIGHT BELOW a long horizontal rule, not a left-copy/right-image split. Paper canvas. Add an INSET floating navigation bar near top, content width1280, margin-top24, 72px high, no edge-to-edge navbar. Wordmark "Billion" in Newsreader 34px left. Navigation links "What we do", "Industries", "How we work", "Proof" and small solid Kiln rectangular "WhatsApp" button right. Use generous top gap below navigation.
Main eyebrow exact "Industrial software, made in Egypt" mono about13px (visual uppercase allowed). H1 about88px Newsreader regular two lines spanning the width: "Run the plant on facts," / "not phone calls." Keep full exact sentence "Run the plant on facts, not phone calls." with period. A single fine Kiln underline beneath "facts" is allowed. Body below about17px, max-width850: "Billion builds AI and operations software for Egyptian manufacturers: production tracking, predictive maintenance, quality control and planning that work on the floor from day one, with a payback you can measure."
CTA row below: solid Kiln rectangle "Book a plant walkthrough" with small line arrow, secondary hairline outline "See how we work". Trust line UNDER CTAs in Graphite 15px, exact: "Egyptian team. On site across the industrial zones: 10th of Ramadan, 6th of October, Borg El Arab, Sadat City."
Lower hairline spans whole content width. Below this rule sits a small simple production line drawing toward lower-left, purely 1.25px hairline schematic conveyor/process modules, no text or numbers. At low-right, a SMALL mono technical panel in hairline box occupies last4 columns and is vertically offset below the main prose. This is the unique quiet second-read moment, narrow editorial field-note style. Panel exact title "What we look at first", with five legible short rows: "stoppages", "scrap rate", "energy per unit", "changeover time", "delivery slips". No values or fake statistics. Panel has small "01" section index in Kiln. No other content or embellishment. Fit content cleanly with generous bottom margin.
```

Final targeted edit:

```text
Edit the supplied finished Billion hero website comp, preserve its exact composition, all copy, big editorial headline, inset nav bar, trust line, technical panel and production line schematic. Keep one horizontal16:9 image. Make one precise typography correction only: the navigation link labels "What we do", "Industries", "How we work", "Proof", navbar "WhatsApp" button label, hero "Book a plant walkthrough" button label, and "See how we work" button label MUST ALL use the SAME modern Geist GROTESK SANS SERIF type as the existing paragraph, no serifs at all on these UI labels, medium400-500. The wordmark "Billion" and hero headline must REMAIN Newsreader editorial SERIF. Mono eyebrow and technical panel remain monospaced. Keep UI label sizes around15-17px rather than big serif labels. Preserve all words exactly, no missing text. Keep solid flat pinned Paper #F5F2EC canvas, solid flat Kiln #B5502F button fills (no gradient or glossy texture), Ink #15130F headline, Graphite #6B665C secondary. Do not change any layout, do not add any new element.
```

</details>

<details>
<summary>02-value-props — section prompt</summary>

```text
SECTION 02 VALUE PROPS, label exact "02 — What you get". Single isolated 16:9 section, no nav/footer. Dominant Swiss grid, asymmetric pristine GAPLESS BENTO with EXACTLY FOUR content cells, no identical three-card row. Paper-2 full canvas, content1280 wide. Eyebrow mono at top-left about y100 then 48px gap to bento. Bento occupies x160 to1440 and y210 to760: top row spans 8 columns plus4 columns; bottom row spans5 columns plus7 columns. Hairline divides cells, no elevated cards, no shadows. First cell Paper, second Paper-2, third Paper-2, fourth Paper; generous cell padding40. Four subheads in elegant Newsreader serif about34px; body MUST be distinct Geist SANS SERIF grotesk 17px/1.6 (absolutely no serif body). Keep all paragraph text fully legible and COMPLETE. Small mono indices in Kiln at the upper edge of each cell optionally 01,02,03,04. A simple precise data-flow schematic made from three thin boxes connected to a fourth integrated under the first paragraph, no labels, no numbers, no graph. Another tiny short circuit/path schematic as quiet structural detail in lower-right cell is okay. Preserve big margins and plenty of breathing room. Do not add an overall invented heading or CTA.
Text verbatim, paired correctly:
"Decisions from your own data"
"We connect what you already run, ERP, PLCs, Excel, paper logs, and turn it into answers: which line loses the most, why, and what to do this shift."
"Measured payback"
"Every project starts with a baseline and a target: scrap rate, downtime hours, energy per unit. If the number does not move, we are not finished."
"Built to survive the floor"
"Works through power cuts and bad connectivity, runs on the hardware you have, and hands over with operator training in Arabic."
"Weeks, not quarters"
"A pilot on one line first. We scale only after it proves itself, with the same people and the same numbers."
Precision over decoration. No big decorative numeral, side-rail note, extra motif, giant quotation marks or additional second-read flourish; the site's only such motif is in its hero.
```

Final targeted edit:

```text
Edit this existing website section mockup. Preserve ALL exact text, same palette, same Newsreader headings and Geist sans body, same four content items in same reading order, same horizontal16:9 canvas, no new content. Make ONE intentional layout correction: change the four-cell bento from equal halves into CLEARLY ASYMMETRIC staggered column widths. Upper-row divider MUST move far RIGHT to 65% of the whole grid width: first upper cell wide65%, second upper cell narrow35%. Lower-row divider MUST move LEFT to42% of whole grid width: first lower cell42%, last lower cell58%. Upper divider and lower divider must NOT align; they join the continuous horizontal midline at two different x positions. This is a gapless mosaic with offset T-junctions, NOT a four-square matrix. Keep upper row55% of grid height and lower row45%. Wrap "Measured payback" onto two lines in narrow upper-right cell; body copy wrap into roughly5 lines but fit. Keep all body copy complete, fully legible, generous padding36px. First heading may fit on one line in wider cell; retain small data flow schematic under first paragraph. Bottom-right wider cell heading "Weeks, not quarters" on one line with subtle circuit beneath. Remove grain/shading from colored cell backgrounds: exact flat solid Paper #F5F2EC and Paper-2 #EDE8DF. Thin rules only, no shadows. Do not alter the supplied copy wording.
```

</details>

<details>
<summary>03-industries — section prompt</summary>

```text
SECTION 03 INDUSTRIES. A minimal typographic engineering LEDGER, not cards and no icons. Paper full background. Anchor: top-left small caption and a broad ruled ledger to its right; 12-column grid, first2 columns small section label, last10 columns main ledger; x100 left label and ledger starts around x345 ending1500. Large generous top/bottom margins. Section label exact "03 — Industries" in small Geist Mono uppercase, broken after dash if needed to fit. Seven rows ordered exactly below, with light horizontal rules; each row has a Newsreader serif industry title around27-30px on LEFT45% and Geist SANS SERIF body17px explanation on RIGHT55%. All text must fit inside canvas, clear spacing, no overlaps. Each row about76px height; slightly taller building-materials row because longer. The parenthesis must be shown, same industry on two lines allowed. Do not add a column heading, index numbers per row, arrows, logos, icons or nav. Row text, exact:
"Food and beverage" — "changeovers, shelf-life traceability, line stoppages"
"Textiles and garments" — "fabric defects, order tracking, delivery slips"
"Plastics and packaging" — "scrap and regrind, mold changeover, energy per kg"
"Building materials (cement, ceramics, steel)" — "kiln and furnace energy, predictive maintenance"
"Pharmaceuticals" — "batch records, deviations, compliance paperwork"
"Chemicals and fertilizers" — "yield, dosing accuracy, safety logs"
"Automotive and metal components" — "rework, tool wear, takt time"
Below final rule with48px breathing space, a single Newsreader serif closing sentence about34px spanning ledger width: "Different products, same leaks. We start where yours is biggest."
Use ink for headings/body; graphite for descriptions; tiny Kiln only section number03. NO CTA. This is an elegant mid-density section with hierarchy created by typography and rules. No decorative second-read flourish.
```

</details>

<details>
<summary>04-how-it-works — section prompt</summary>

```text
SECTION 04 HOW WE WORK. One isolated horizontal16:9 website section, Paper canvas, no navigation/footer. Top-left section label exact "04 — How we work", Geist Mono uppercase13 at x160 y140. Editorial process timeline, FOUR numbered steps connected on ONE continuous thin horizontal datum at around y340; line goes x160 to1440 with four small precise kiln square waypoints (not circles/cards). Four equal3-column text slots with32px gaps, but STAGGER text vertically: Step01 description positioned below datum, Step02 heading and description positioned ABOVE datum, Step03 below datum, Step04 above datum. Keep reading order left-to-right unambiguous with small mono Kiln step numbers01/02/03/04 next to their connection points and short vertical leader rules, all same font size13; no giant decorative numbers, no diagrams, no extra slogan. Vertical space should feel intentional and balanced. Each heading Newsreader serif about32px regular; paragraph strictly Geist SANS SERIF 17px/1.6. Paragraph width240-270px, some wrap over5 lines. Generous top/bottom whitespace and fine rule semantics, no boxes or cards. Body text dark Ink-2, graphite for small labels.
Exact text in order:
01 "Walk the floor"
"Half a day on site. We watch the lines, talk to the shift leads, and map where money leaks: stoppages, rework, waiting."
02 "Pick one number"
"One line, one metric, one baseline. A pilot scoped to prove value, not to impress."
03 "Build and run it with your team"
"We deploy on your network, train operators in Arabic, and stay through the first production weeks."
04 "Scale what worked"
"Roll out to the next lines with the same people and the same numbers. You own the system and the data."
All copy fully visible and exact. Do not add any CTA or proof statistics. Keep visual transition into next dark section possible via generous bottom breathing room.
```

</details>

<details>
<summary>05-proof — section prompt</summary>

```text
SECTION 05 PROOF. The ONLY DARK section: full flat Ink #15130F canvas, paper foreground text, no gradients or glows. Composition anchor inverted editorial: Arabic CHAT UI still on LEFT5 columns, narrative on RIGHT7 columns. Max1280px content centered, outer margins120-160px, generous vertical breathing room. At upper-left of whole section label exact "05 — Proof", Geist Mono13 in Paper. Chat appears at x140 y240 approximately430x490px, a simple flat rectangular Paper window, 4px radius, NO smartphone hardware frame. This is a schematic web app STILL buildable with HTML, not a photo or fabricated captured real screen. Header says "اسأل مهندسنا" aligned RIGHT. Small "Valor" wordmark in header left, normal simple type. Hairline separator; three stacked message panels with proper RTL Arabic text shaping and RIGHT alignment, alternating Paper-2 and White matte rectangles, 4px radius, generous padding20; no huge bubbly radius. All Arabic text is real joined script and exact:
Assistant first: "أهلاً، إزاي أقدر أساعدك؟"
Farmer second: "عايز أعرف حالة الطقس عندي."
Assistant third: "ابعتلي موقع الأرض علشان أجيبلك توقعات الطقس."
Bottom input field exact Arabic placeholder "اكتب سؤالك هنا" right-aligned, small primitive outlined send arrow at left. No numeric weather data, prices, timestamps, invented measurements, profile photos or generic icons.
Right narrative at x660 y150 width770:
eyebrow exact "Sister company · valor-labs.com" in Paper at70% opacity mono13.
Title Newsreader serif about50px regular,3 lines maximum, exact: "Valor Labs: an AI engineer in every farmer's pocket"
Then Geist SANS SERIF body17px/1.6 in Paper at85% opacity, ALL text exact:
"Valor, Billion's sister company, sells soil and crop products to farmers and distributors across Egypt. Billion built its 'Ask Our Engineer' assistant: agronomy answers in Egyptian Arabic, weather for the farmer's own location, and market prices, on the phone the farmer already owns."
Below thin Paper14% rule and32px gap, pull line smaller Newsreader24px, exact:
"What it proves for a factory: Arabic-language AI that non-technical people actually use, in the field, on ordinary phones. The same discipline goes on the shop floor."
At bottom underlined inline link exact "Visit valor-labs.com" in Paper Geist15 with small Kiln arrow; no Kiln small text on dark. No quote attribution or testimonial, no hidden-null placeholder, no metrics. Keep complete copy visible. This is editorial proof through a tangible language interface.
```

</details>

<details>
<summary>06-cta — section prompt</summary>

```text
SECTION 06 CTA. A calm, minimal FULL-WIDTH BANNER on flat Paper-2 #EDE8DF, isolated horizontal16:9 website section, no nav/footer, lots of purposeful empty surrounding space. Stacked-center composition, a different rhythm from the other editorial sections. This is one ask, not a pricing section. Content bounded by thin horizontal hairlines x160 to1440 near y170 and y725. Tiny mono "06" at left end upper rule (not an invented heading).
Headline centered at y300, exact "Start with one line." in elegant Newsreader SERIF regular about68px, dark Ink, one line. Below32px gap centered paragraph max750px, STRICTLY GEIST GROTESK SANS SERIF17px/1.6, exact:
"Tell us which line hurts most. We will come to the plant, look at it with you, and say honestly whether software will pay off and what it would cost."
Two centered rectangular48px high buttons with4px radius,24px gap,32px below body: primary solid flat Kiln #B5502F with Paper GEIST SANS SERIF15px label "WhatsApp us" and small simple arrow; secondary transparent hairline Ink outline with Ink GEIST SANS SERIF15px label "Email us". Absolutely NO SERIF type on button labels. No WhatsApp logo icon needed. Under buttons at24px, centered exact mono metadata13px Graphite, "Replies within one working day. Cairo time." (visual uppercase okay).
No illustration, no photo, no gradient, no texture above subtle3% grain, no drop shadows, no huge decorative punctuation, no invented extra slogan, no email address in this section, no metrics, no second-read flourish. The fine upper/lower rules and typography should feel decisive and spacious.
```

</details>

<details>
<summary>07-footer — section prompt</summary>

```text
SECTION 07 FOOTER. One isolated minimalist footer design comp, exact16:9 horizontal board. Paper #F5F2EC canvas, restrained quiet editorial colophon. Footer is naturally SHORT; show one compact footer band comfortably surrounded by empty Paper within the horizontal board, not a giant full-height web footer. No other site sections, no nav, no extra CTA, no hero. Top hairline across content x160 to1440 near y285. Content row below it at y340 with THREE horizontal zones: left6 columns brand, middle3 contact, right3 links. Bottom copyright row at y620 with secondary hairline above aroundy585. This is small, airy, sophisticated.
Left group: "Billion" in Newsreader serif regular48px, then16px below exact one-line Geist SANS SERIF17px "Software for Egyptian industry."
Middle group: contact email exact "hello@billion.example" in Geist SANS SERIF15, below24px "WhatsApp" as understated link, below24px "Cairo, Egypt" in Geist Mono13.
Right group: Geist SANS SERIF15 links in vertical list with24px spacing, exact "Valor Labs", "LinkedIn", "Privacy". Tiny primitive external arrow after Valor Labs only. No logo icons.
Bottom left tiny mono "07"; bottom right exact "© 2026 Billion." in Geist Mono13 Graphite.
Colors Ink/Graphite, thin Rule lines. Optional tiny Kiln arrow by WhatsApp only; NO Kiln filled footer button. Corners no cards. No extra contact phone digits, no added link headings, no placeholder annotations, no decorative imagery, no giant ghosted type, no slogans, no huge numbers, no secondary read flourish. All typography clear and smaller scale than previous CTA section. Real website footer, premium restraint.
```

</details>

