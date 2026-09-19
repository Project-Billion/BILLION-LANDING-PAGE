import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { privacyCopy } from "@/content/privacy";
import { mailtoUrl, siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy policy | Billion",
  description: privacyCopy.description,
  openGraph: {
    title: "Privacy policy | Billion",
    description: privacyCopy.description,
  },
};

const linkClass =
  "text-fg underline decoration-rule decoration-1 underline-offset-4 transition-colors duration-(--duration-hover) hover:decoration-fg";

/** Renders one paragraph, turning the phrase "Google's own privacy policy" into a link. */
function Paragraph({ text }: { text: string }) {
  const { label, href } = privacyCopy.googlePolicy;
  const phrase = "Google's own privacy policy";
  const at = text.indexOf(phrase);
  if (at === -1) return <p>{text}</p>;
  return (
    <p>
      {text.slice(0, at)}
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {phrase}
        <span className="sr-only"> ({label}, opens in a new tab)</span>
      </a>
      {text.slice(at + phrase.length)}
    </p>
  );
}

/** /privacy: plain-language policy. All copy lives in src/content/privacy.ts. */
export default function PrivacyPage() {
  return (
    <div className="pt-[calc(var(--nav-height)+3rem+env(safe-area-inset-top,0px))] pb-24 md:pt-[calc(var(--nav-height)+4rem)] lg:pb-32">
      <Container>
        <header className="mb-12 max-w-[65ch]">
          <p className="font-mono text-meta uppercase text-fg-2">{privacyCopy.eyebrow}</p>
          <h1 className="mt-4 text-h2">{privacyCopy.title}</h1>
          <p className="mt-4 font-mono text-meta uppercase text-fg-2">
            {privacyCopy.updatedLabel}: {privacyCopy.updated}
          </p>
        </header>

        <div className="flex max-w-[65ch] flex-col gap-10">
          {privacyCopy.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-h3">{section.heading}</h2>
              {section.paragraphs.map((text) => (
                <Paragraph key={text} text={text} />
              ))}
            </section>
          ))}

          <section className="flex flex-col gap-4">
            <h2 className="text-h3">{privacyCopy.contactHeading}</h2>
            <p>
              {privacyCopy.contactLead}{" "}
              <a href={mailtoUrl()} className={linkClass}>
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
