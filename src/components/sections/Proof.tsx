import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { newTabHint, proof, siteConfig } from "@/content/site";

/** Static, flat drawing of the Ask Our Engineer chat. Real Arabic text, right to left, no live input. */
function ChatStill() {
  const { chat } = proof;
  return (
    <figure aria-labelledby="proof-chat-caption" className="rounded-sm bg-paper text-ink">
      <figcaption id="proof-chat-caption" className="sr-only">
        {chat.caption}
      </figcaption>
      <div lang="ar" dir="rtl" className="font-arabic">
        <div className="flex items-center justify-between border-b border-rule px-5 py-4">
          <p className="text-[1.0625rem] font-medium">{chat.header}</p>
          <span lang="en" dir="ltr" className="font-display text-xl leading-none tracking-[-0.02em]">
            {chat.wordmark}
          </span>
        </div>

        <ul className="flex flex-col gap-4 p-5">
          {chat.messages.map((message) => (
            <li
              key={message.text}
              className={`rounded-sm px-5 py-4 text-[1.0625rem] leading-[1.8] ${
                message.from === "farmer" ? "ms-auto max-w-[85%] bg-white" : "bg-paper-2"
              }`}
            >
              {message.text}
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="mx-5 mb-5 flex min-h-12 items-center rounded-sm border border-rule bg-white">
          <span className="flex-1 px-4 text-ui text-graphite">{chat.inputPlaceholder}</span>
          <span className="flex h-12 w-12 items-center justify-center border-s border-rule">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" className="size-5 -scale-x-100">
              <path d="M2 10 18 3l-5 15-3-6-8-2ZM10 12l8-9" />
            </svg>
          </span>
        </div>
      </div>
    </figure>
  );
}

/**
 * 05 Proof: the only inverted block. Chat still left, narrative right (5/7 columns) from lg up;
 * below lg the DOM order reads label, eyebrow, title, body, chat, pull line, link.
 */
export function Proof() {
  const { section } = proof;
  const quote = siteConfig.proof.quote;
  const storyColumn = "lg:col-span-7 lg:col-start-6";

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="bg-ink py-24 text-paper lg:py-40">
      <Container>
        <SectionLabel index={section.index} label={section.label} tone="ink" />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-x-16">
          <Reveal className={storyColumn}>
            <p className="font-mono text-meta uppercase text-paper/70">{proof.eyebrow}</p>
          </Reveal>
          <Reveal index={1} className={storyColumn}>
            <h2 id={`${section.id}-title`} className="max-w-[20ch] text-h2 text-paper">
              {proof.title}
            </h2>
          </Reveal>
          <Reveal index={2} className={storyColumn}>
            <p className="max-w-[62ch] text-body text-paper/85">{proof.body}</p>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:col-start-1 lg:row-span-5 lg:row-start-1 lg:self-center">
            <ChatStill />
          </Reveal>

          <Reveal index={3} className={storyColumn}>
            <p className="border-t border-rule-dark pt-8 font-display text-2xl leading-[1.35] text-paper">
              {proof.pullLine}
            </p>
            {quote ? (
              <figure className="mt-8">
                <blockquote className="font-display text-xl leading-[1.4] text-paper">
                  <p>&ldquo;{quote.text}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-4 font-mono text-meta uppercase text-paper/70">
                  {quote.name}, {quote.role}
                </figcaption>
              </figure>
            ) : null}
          </Reveal>

          <Reveal index={4} className={storyColumn}>
            <a
              href={proof.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-3 text-ui text-paper underline decoration-paper/40 underline-offset-4 transition-colors duration-(--duration-hover) hover:decoration-paper"
            >
              {proof.link.label}
              <ArrowUpRight className="text-kiln" />
              <span className="sr-only">{newTabHint}</span>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
