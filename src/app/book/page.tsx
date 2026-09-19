import type { Metadata } from "next";
import { BookingScheduler } from "@/components/booking/BookingScheduler";
import { Container } from "@/components/ui/Container";
import { bookingCopy } from "@/content/booking";

export const metadata: Metadata = {
  title: "Book a call | Billion",
  description: bookingCopy.description,
  openGraph: {
    title: "Book a call | Billion",
    description: bookingCopy.description,
  },
};

/** /book: header, then the three-panel scheduler card. All interaction lives in BookingScheduler. */
export default function BookPage() {
  return (
    <div className="pt-[calc(var(--nav-height)+3rem+env(safe-area-inset-top,0px))] pb-24 md:pt-[calc(var(--nav-height)+4rem)] lg:pb-32">
      <Container>
        <header className="mb-10 max-w-[48rem]">
          <p className="font-mono text-meta uppercase text-fg-2">{bookingCopy.eyebrow}</p>
          <h1 className="mt-4 text-h2">{bookingCopy.title}</h1>
        </header>
        <BookingScheduler />
      </Container>
    </div>
  );
}
