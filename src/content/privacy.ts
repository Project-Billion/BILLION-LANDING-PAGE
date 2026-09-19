/**
 * Copy for /privacy. Every claim here was checked against the code (booking form, /api/book,
 * rate limiter, Google provider, vitals store). Update the date when the text or the code changes.
 */

export interface PrivacySection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

export const privacyCopy = {
  eyebrow: "Legal",
  title: "Privacy policy",
  description:
    "What Billion collects when you book a call, where it goes, how long we keep it, and how to ask us to change or delete it.",
  updatedLabel: "Last updated",
  updated: "19 September 2026",
  googlePolicy: { label: "Google's privacy policy", href: "https://policies.google.com/privacy" },
  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        "Billion is a software house in Cairo, Egypt. This page explains what happens to your information when you use this website. Questions go to the email address at the end of this page.",
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "We collect information only through the booking form on the book page: your name, your email address, an optional note, the time and length of the call you choose, and your timezone.",
        "Your timezone is used to show times correctly on your screen. We do not keep it.",
        "We collect nothing else through this site. There are no accounts, no sign-up and no other forms.",
      ],
    },
    {
      heading: "How we use it",
      paragraphs: [
        "We use it only to schedule and hold the call you asked for, and to reply to you. We do not sell it and we do not use it for advertising.",
      ],
    },
    {
      heading: "Where it goes",
      paragraphs: [
        "When you book, we create an event in our Google Calendar with a Google Meet link. Google then sends the invitation to the email address you entered. Google Calendar and Google Meet are provided by Google and are covered by Google's own privacy policy.",
        "This site is hosted on Vercel. Vercel processes standard technical request logs, such as your IP address, when you visit any page.",
      ],
    },
    {
      heading: "Abuse protection",
      paragraphs: [
        "To limit repeated booking requests, the server keeps your IP address in memory for a short time, up to one hour. It is not saved with your booking and it is not written to the calendar.",
      ],
    },
    {
      heading: "Cookies and analytics",
      paragraphs: [
        "This site sets no cookies and stores nothing in your browser. It uses no advertising or analytics trackers.",
        "The Core Web Vitals shown on the home page are measured in your own browser. They are not sent to us.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "A booking stays in our calendar until we delete it. You can ask us to delete it, or to correct it, by email. We will reply within a reasonable time.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "You can ask us for a copy of what we hold about you, to correct it, or to delete it. Send your request by email from the address you used to book.",
      ],
    },
    {
      heading: "Changes to this page",
      paragraphs: [
        "If we change how we handle your information, we will update this page and the date at the top.",
      ],
    },
  ] satisfies readonly PrivacySection[],
  contactHeading: "Contact",
  contactLead: "Email us at",
} as const;
