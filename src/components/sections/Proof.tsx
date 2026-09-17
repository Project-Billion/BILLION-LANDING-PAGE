import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowUpRight } from "@/components/ui/Icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { newTabHint, proof, siteConfig } from "@/content/site";

/** Static, flat drawing of the Ask Our Engineer chat. Real Arabic text, right to left, no live input. */
function ChatStill() {
  const { chat } = proof;
  return (
    <figure
      aria-labelledby="proof-chat-caption"
      className="rounded-lg border border-rule bg-bg-2 text-fg"
    >
      <figcaption id="proof-chat-caption" className="sr-only">
        {chat.caption}
      </figcaption>
      <div lang="ar" dir="rtl" className="font-arabic pb-5">
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
                message.from === "farmer" ? "ms-auto max-w-[85%] bg-fg/10" : "bg-bg"
              }`}
            >
              {message.text}
            </li>
          ))}
        </ul>

        <div aria-hidden="true" className="mx-5 flex min-h-12 items-center rounded-sm border border-rule bg-bg">
          <span className="flex-1 px-4 text-ui text-fg-2">{chat.inputPlaceholder}</span>
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
 * 05 Proof: story left, chat still right (7/5 columns) from lg up;
 * below lg the DOM order reads label, eyebrow, title, body, chat, pull line, link.
 */
export function Proof() {
  const { section } = proof;
  const quote = siteConfig.proof.quote;
  const storyColumn = "lg:col-span-7 lg:col-start-1";

  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="py-40 lg:py-56">
      <Container>
        <SectionLabel index={section.index} label={section.label} />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12 lg:gap-x-16">
          <Reveal className={storyColumn}>
            <p className="font-mono text-meta uppercase text-fg-2">{proof.eyebrow}</p>
          </Reveal>
          <Reveal index={1} className={storyColumn}>
            <h2 id={`${section.id}-title`} className="max-w-[20ch] text-h2 text-fg">
              {proof.title}
            </h2>
          </Reveal>
          <Reveal index={2} className={storyColumn}>
            <p className="max-w-[62ch] text-body text-fg-2">{proof.body}</p>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:col-start-8 lg:row-span-5 lg:row-start-1 lg:self-center">
            <ChatStill />
          </Reveal>

          <Reveal index={3} className={storyColumn}>
            <p className="border-t border-rule pt-8 text-sub text-fg">{proof.pullLine}</p>
            {quote ? (
              <figure className="mt-8">
                <blockquote className="font-display text-xl leading-[1.4] text-fg">
                  <p>&ldquo;{quote.text}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-4 font-mono text-meta uppercase text-fg-2">
                  {quote.name}, {quote.role}
                </figcaption>
              </figure>
            ) : null}
          </Reveal>

          <Reveal index={4} className={storyColumn}>
            <Button href={proof.link.href} variant="secondary" target="_blank" rel="noopener noreferrer">
              {proof.link.label}
              <ArrowUpRight className="text-ember" />
              <span className="sr-only">{newTabHint}</span>
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
