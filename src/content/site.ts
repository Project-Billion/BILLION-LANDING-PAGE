/**
 * All page copy and owner-replaceable placeholders live in this file.
 * Copy comes from docs/superpowers/specs/2026-09-16-software-house-pivot-design.md.
 * Owner-replaceable placeholders remain from docs/BRIEF.md section 6.
 */

export interface NavLink {
  readonly label: string;
  readonly href: `#${string}`;
}

export interface TitledItem {
  readonly title: string;
  readonly body: string;
}

/** Core Web Vital and the target every project is measured against. */
export interface Vital {
  readonly key: "LCP" | "CLS" | "INP";
  readonly label: string;
  readonly target: string;
}

/** A measured result from an audit of this build; populated by the QA task. */
export interface AuditRow {
  readonly label: string;
  readonly value: string;
}

export interface Step extends TitledItem {
  readonly index: string;
}

export interface SectionMeta {
  readonly id: string;
  readonly index: string;
  /** Omitted where the reference shows only the index (06 CTA). */
  readonly label?: string;
}

export interface ChatMessage {
  readonly from: "assistant" | "farmer";
  readonly text: string;
}

export interface Quote {
  readonly text: string;
  readonly name: string;
  readonly role: string;
}

export interface SiteConfig {
  readonly contact: {
    /** WhatsApp number in E.164 format, e.g. "+201000000000". Shown in the footer only. */
    readonly whatsappE164: string;
    readonly email: string;
  };
  readonly social: {
    readonly linkedin: string;
  };
  readonly proof: {
    /** Quote from Valor's team. Hidden in the UI while null. */
    readonly quote: Quote | null;
  };
}

/** Placeholders the owner must replace before launch (BRIEF section 6). */
export const siteConfig: SiteConfig = {
  contact: {
    whatsappE164: "+201018683531",
    email: "billion-solution@hotmail.com",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/billioneg",
  },
  proof: {
    quote: null,
  },
};

/** Returns the wa.me link for the configured WhatsApp number (digits only). Used in the footer only. */
export function whatsappUrl(): string {
  const digits = siteConfig.contact.whatsappE164.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

/** Returns the mailto link for the configured email address. */
export function mailtoUrl(): string {
  return `mailto:${siteConfig.contact.email}`;
}

export const valorUrl = "https://valor-labs.com";

export const brand = {
  name: "Billion",
  title: "Billion — Software house. Think Bigger.",
} as const;

export const nav = {
  links: [
    { label: "What we build", href: "#what-we-build" },
    { label: "Performance", href: "#performance" },
    { label: "How we work", href: "#how-we-work" },
    { label: "Proof", href: "#proof" },
  ] satisfies readonly NavLink[],
  bookLabel: "Book a call",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
  /** Visible toggle text; the accessible names above stay the source for screen readers. */
  menuOpenText: "Menu",
  menuCloseText: "Close",
  /** Accessible name of the open sheet dialog. */
  menuDialogLabel: "Site menu",
} as const;

export const hero = {
  eyebrow: "Software house · Cairo, Egypt",
  title: { line1: "Think Bigger", line2: "Think Billion" },
  sub: "Billion is a software house with one obsession: performance, pushed to the maximum. AI products, platforms, data systems, operations software. Bring us any problem; we build the solution and we make it fast.",
  secondaryCta: { label: "See what we build", href: "#what-we-build" },
  trustLine:
    "Engineers in Cairo. Arabic-first when it matters, English everywhere else. Sister company: Valor Labs.",
  panel: {
    index: "01",
    title: "What we optimize first",
    items: [
      "load time",
      "response latency",
      "cost per request",
      "failure rate",
      "time to ship",
    ],
  },
} as const;

export const whatWeBuild = {
  section: { id: "what-we-build", index: "02", label: "What we build" } satisfies SectionMeta,
  items: [
    {
      title: "AI products and agents",
      body: "Assistants, agents and retrieval systems that non-technical people actually use, in Arabic or English, on the phones they already own.",
    },
    {
      title: "Platforms and products",
      body: "Web and mobile products, APIs and back offices, built to ship in weeks and to run for years.",
    },
    {
      title: "Performance engineering",
      body: "Bring us something slow. We profile it, find the real bottleneck, and make it fast: pages, APIs, databases, pipelines, models.",
    },
    {
      title: "Data and automation",
      body: "Pipelines, integrations and reporting that connect what you already run, from ERPs to spreadsheets, and remove the manual work in between.",
    },
    {
      title: "Industrial and operations software",
      body: "Production tracking, maintenance and quality systems that survive the factory floor. Where Billion started, and still a specialty.",
    },
    {
      title: "The problem nobody else wants",
      body: "If it is hard, unusual, or half-finished by someone else, that is the work we like. Bring it.",
    },
  ] satisfies readonly TitledItem[],
  closing: "Different problems, same discipline: measure first, build small, make it fast, then scale.",
} as const;

export const performance = {
  section: { id: "performance", index: "03", label: "Performance" } satisfies SectionMeta,
  title: "Optimized to the max. Starting with this page.",
  body: "We hold ourselves to the numbers you are looking at. These are this page's Core Web Vitals, measured in your browser right now, next to the targets we build every project against.",
  vitals: [
    { key: "LCP", label: "Largest Contentful Paint", target: "≤ 2.5 s" },
    { key: "CLS", label: "Cumulative Layout Shift", target: "≤ 0.1" },
    { key: "INP", label: "Interaction to Next Paint", target: "≤ 200 ms" },
  ] satisfies readonly Vital[],
  vitalStates: {
    measuring: "measuring…",
    good: "good",
    needsWork: "needs work",
    poor: "poor",
    awaitingInput: "tap or press a key to measure",
    unsupported: "not measured by this browser",
    notMeasured: "not measured on this visit",
  },
  /** Filled only from an audit of this build; never seed these fields with estimates. */
  audits: {
    note: "Measured on this build with Lighthouse and axe. Performance and Largest Contentful Paint are measured on the live site and added after each release; never estimated.",
    browser: "Chrome 153, Lighthouse 13, simulated mobile" as string | null,
    date: "17 Sep 2026" as string | null,
    rows: [
      { label: "Lighthouse mobile · Accessibility", value: "100" },
      { label: "Lighthouse mobile · Best practices", value: "100" },
      { label: "Lighthouse mobile · SEO", value: "100" },
      { label: "JavaScript shipped, compressed", value: "189 kB" },
    ] as readonly AuditRow[],
  },
  principles: [
    {
      title: "Profile first",
      body: "No guessing. We find the real bottleneck before we touch code.",
    },
    {
      title: "Budgets, not hopes",
      body: "Every project gets performance budgets: load time, latency, cost. The build fails when they are missed.",
    },
    {
      title: "Fast on real devices",
      body: "We test on ordinary phones and slow networks, not on our own laptops.",
    },
  ] satisfies readonly TitledItem[],
} as const;

export const howItWorks = {
  section: { id: "how-we-work", index: "04", label: "How we work" } satisfies SectionMeta,
  steps: [
    {
      index: "01",
      title: "Understand the problem",
      body: "Half a day with the people who live with it. We map where time, money or trust leaks before we propose anything.",
    },
    {
      index: "02",
      title: "Pick one number",
      body: "One outcome, one metric, one baseline. A first release scoped to prove value, not to impress.",
    },
    {
      index: "03",
      title: "Build it with your team",
      body: "We ship in weeks, deploy where you run, and stay through the first real usage. Arabic or English, your choice.",
    },
    {
      index: "04",
      title: "Scale what worked",
      body: "Grow it with the same people and the same numbers. You own the code, the system and the data.",
    },
  ] satisfies readonly Step[],
} as const;

export const proof = {
  section: { id: "proof", index: "05", label: "Proof" } satisfies SectionMeta,
  eyebrow: "Sister company · valor-labs.com",
  title: "Valor Labs: an AI engineer in every farmer's pocket",
  body: "Valor, Billion's sister company, sells soil and crop products to farmers and distributors across Egypt. Billion built its 'Ask Our Engineer' assistant: agronomy answers in Egyptian Arabic, weather for the farmer's own location, and market prices, on the phone the farmer already owns.",
  pullLine:
    "What it proves: AI that non-technical people actually use, in their own language, on ordinary phones, in the field. The same discipline goes into everything we build.",
  link: { label: "Visit valor-labs.com", href: valorUrl },
  /** Illustrative schematic dialogue about a crop question, not a real transcript. */
  chat: {
    caption: "Illustration: a farmer asks the Ask Our Engineer assistant about a crop, in Egyptian Arabic.",
    header: "اسأل مهندسنا",
    wordmark: "Valor",
    messages: [
      { from: "assistant", text: "أهلاً، إزاي أقدر أساعدك؟" },
      { from: "farmer", text: "ورق الطماطم عندي بدأ يصفر، أعمل إيه؟" },
      { from: "assistant", text: "ابعتلي صورة للورق، وقولي آخر مرة سمدت الأرض إمتى." },
    ] satisfies readonly ChatMessage[],
    inputPlaceholder: "اكتب سؤالك هنا",
  },
} as const;

export const cta = {
  section: { id: "contact", index: "06" } satisfies SectionMeta,
  title: "Bring us the hardest thing on your plate.",
  body: "Tell us what is slow, stuck or not built yet. Pick a time and we will look at it with you on a Google Meet call, and say honestly whether it is worth building, how fast it can be, and what it would cost.",
  bookLabel: "Book a call",
  emailLabel: "Email us",
  responseNote: "Calendar invite and Meet link arrive by email.",
} as const;

export const footer = {
  index: "07",
  tagline: "Think Bigger. Think Billion.",
  whatsappLabel: "WhatsApp",
  location: "Cairo, Egypt",
  links: {
    valor: { label: "Valor Labs", href: valorUrl },
    linkedin: { label: "LinkedIn" },
    privacy: { label: "Privacy", href: "/privacy" },
  },
  copyright: "© 2026 Billion.",
} as const;

export const skipLinkLabel = "Skip to content";

/** Screen-reader hint appended to links that open in a new tab. */
export const newTabHint = "(opens in a new tab)";
