/**
 * All page copy and owner-replaceable placeholders live in this file.
 * Copy is taken from docs/BRIEF.md section 5; placeholders from section 6.
 */

export interface NavLink {
  readonly label: string;
  readonly href: `#${string}`;
}

export interface TitledItem {
  readonly title: string;
  readonly body: string;
}

export interface Industry {
  readonly name: string;
  readonly leaks: string;
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
    /** WhatsApp number in E.164 format, e.g. "+201000000000". */
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
    whatsappE164: "+201000000000",
    email: "hello@billion.example",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/billion",
  },
  proof: {
    quote: null,
  },
};

/** Returns the wa.me link for the configured WhatsApp number (digits only). */
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
  title: "Billion — Industrial software, made in Egypt",
} as const;

export const nav = {
  links: [
    { label: "What we do", href: "#what-we-do" },
    { label: "Industries", href: "#industries" },
    { label: "How we work", href: "#how-we-work" },
    { label: "Proof", href: "#proof" },
  ] satisfies readonly NavLink[],
  whatsappLabel: "WhatsApp",
  menuOpenLabel: "Open menu",
  menuCloseLabel: "Close menu",
} as const;

export const hero = {
  eyebrow: "Industrial software, made in Egypt",
  title: "Run the plant on facts, not phone calls.",
  /** Word in the title that gets the single Kiln underline. */
  titleEmphasis: "facts",
  sub: "Billion builds AI and operations software for Egyptian manufacturers: production tracking, predictive maintenance, quality control and planning that work on the floor from day one, with a payback you can measure.",
  primaryCta: "Book a plant walkthrough",
  secondaryCta: { label: "See how we work", href: "#how-we-work" },
  trustLine:
    "Egyptian team. On site across the industrial zones: 10th of Ramadan, 6th of October, Borg El Arab, Sadat City.",
  panel: {
    index: "01",
    title: "What we look at first",
    items: [
      "stoppages",
      "scrap rate",
      "energy per unit",
      "changeover time",
      "delivery slips",
    ],
  },
} as const;

export const valueProps = {
  section: { id: "what-we-do", index: "02", label: "What you get" } satisfies SectionMeta,
  items: [
    {
      title: "Decisions from your own data",
      body: "We connect what you already run, ERP, PLCs, Excel, paper logs, and turn it into answers: which line loses the most, why, and what to do this shift.",
    },
    {
      title: "Measured payback",
      body: "Every project starts with a baseline and a target: scrap rate, downtime hours, energy per unit. If the number does not move, we are not finished.",
    },
    {
      title: "Built to survive the floor",
      body: "Works through power cuts and bad connectivity, runs on the hardware you have, and hands over with operator training in Arabic.",
    },
    {
      title: "Weeks, not quarters",
      body: "A pilot on one line first. We scale only after it proves itself, with the same people and the same numbers.",
    },
  ] satisfies readonly TitledItem[],
} as const;

export const industries = {
  section: { id: "industries", index: "03", label: "Industries" } satisfies SectionMeta,
  items: [
    { name: "Food and beverage", leaks: "changeovers, shelf-life traceability, line stoppages" },
    { name: "Textiles and garments", leaks: "fabric defects, order tracking, delivery slips" },
    { name: "Plastics and packaging", leaks: "scrap and regrind, mold changeover, energy per kg" },
    {
      name: "Building materials (cement, ceramics, steel)",
      leaks: "kiln and furnace energy, predictive maintenance",
    },
    { name: "Pharmaceuticals", leaks: "batch records, deviations, compliance paperwork" },
    { name: "Chemicals and fertilizers", leaks: "yield, dosing accuracy, safety logs" },
    { name: "Automotive and metal components", leaks: "rework, tool wear, takt time" },
  ] satisfies readonly Industry[],
  closing: "Different products, same leaks. We start where yours is biggest.",
} as const;

export const howItWorks = {
  section: { id: "how-we-work", index: "04", label: "How we work" } satisfies SectionMeta,
  steps: [
    {
      index: "01",
      title: "Walk the floor",
      body: "Half a day on site. We watch the lines, talk to the shift leads, and map where money leaks: stoppages, rework, waiting.",
    },
    {
      index: "02",
      title: "Pick one number",
      body: "One line, one metric, one baseline. A pilot scoped to prove value, not to impress.",
    },
    {
      index: "03",
      title: "Build and run it with your team",
      body: "We deploy on your network, train operators in Arabic, and stay through the first production weeks.",
    },
    {
      index: "04",
      title: "Scale what worked",
      body: "Roll out to the next lines with the same people and the same numbers. You own the system and the data.",
    },
  ] satisfies readonly Step[],
} as const;

export const proof = {
  section: { id: "proof", index: "05", label: "Proof" } satisfies SectionMeta,
  eyebrow: "Sister company · valor-labs.com",
  title: "Valor Labs: an AI engineer in every farmer's pocket",
  body: "Valor, Billion's sister company, sells soil and crop products to farmers and distributors across Egypt. Billion built its 'Ask Our Engineer' assistant: agronomy answers in Egyptian Arabic, weather for the farmer's own location, and market prices, on the phone the farmer already owns.",
  pullLine:
    "What it proves for a factory: Arabic-language AI that non-technical people actually use, in the field, on ordinary phones. The same discipline goes on the shop floor.",
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
  title: "Start with one line.",
  body: "Tell us which line hurts most. We will come to the plant, look at it with you, and say honestly whether software will pay off and what it would cost.",
  whatsappLabel: "WhatsApp us",
  emailLabel: "Email us",
  responseNote: "Replies within one working day. Cairo time.",
} as const;

export const footer = {
  index: "07",
  tagline: "Software for Egyptian industry.",
  whatsappLabel: "WhatsApp",
  location: "Cairo, Egypt",
  links: {
    valor: { label: "Valor Labs", href: valorUrl },
    linkedin: { label: "LinkedIn" },
    privacy: { label: "Privacy", href: "#privacy" },
  },
  copyright: "© 2026 Billion.",
} as const;

export const skipLinkLabel = "Skip to content";

/** Screen-reader hint appended to links that open in a new tab. */
export const newTabHint = "(opens in a new tab)";
