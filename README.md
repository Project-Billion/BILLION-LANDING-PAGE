# Billion landing page

Single-page marketing site for Billion, a Cairo-based software house with one obsession: performance optimized to the maximum. Billion solves problems across AI products, platforms, data systems, and operations software — and specializes in the hard problems nobody else wants. Dark single-background design with canvas-based interactive effects. The design and copy brief lives in [docs/BRIEF.md](docs/BRIEF.md); reference mockups are in [design/reference/](design/reference/).

## Stack

- Next.js (App Router, TypeScript, `src/` directory, `@/*` import alias)
- Tailwind CSS v4 (tokens in `src/app/globals.css` via `@theme`)
- Fonts through `next/font/google`: Outfit, Geist Mono, IBM Plex Sans Arabic
- motion (scroll and interaction animations with `domAnimation` only; ~15 kB gzip)
- thinking-orbs (canvas-based animated thinking orb as the hero's full stop)
- web-vitals (client-side Core Web Vitals measurement for the performance band)
- Hyperspace canvas starfield effect on the hero (zero dependencies, `src/components/hero/`)
- npm

## Develop

```sh
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Deploy

Import the repository into Vercel and deploy with the default Next.js settings. No environment variables are required.

## Before launch: replace the placeholders

All owner-editable values sit in one object, `siteConfig`, in [src/content/site.ts](src/content/site.ts):

| Key | Placeholder | Notes |
| --- | --- | --- |
| `contact.whatsappE164` | `+201000000000` | Rendered as `https://wa.me/201000000000` |
| `contact.email` | `hello@billion.example` | Used for the Email button and footer |
| `social.linkedin` | `https://www.linkedin.com/company/billion` | Footer link |
| `proof.quote` | `null` | Quote from Valor's team; hidden until filled |

All other page copy is in the same file.
