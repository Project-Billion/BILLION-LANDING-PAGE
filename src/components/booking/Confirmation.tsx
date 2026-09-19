"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";
import { bookingCopy, type Duration } from "@/content/booking";
import { newTabHint } from "@/content/site";
import { dayKeyInZone, formatLongDate, formatOffset, formatTime, zoneCity } from "./dates";

interface ConfirmationProps {
  /** Booked start, UTC ISO. */
  start: string;
  duration: Duration;
  timeZone: string;
  email: string;
  /** Google Meet link when the API returned one. */
  meetUrl: string | null;
}

/** Replaces the whole scheduler card once the booking is created. */
export function Confirmation({ start, duration, timeZone, email, meetUrl }: ConfirmationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const details: [string, string][] = [
    [bookingCopy.dateDetailLabel, formatLongDate(dayKeyInZone(start, timeZone))],
    [bookingCopy.timeDetailLabel, formatTime(start, timeZone)],
    [bookingCopy.durationDetailLabel, `${duration} ${bookingCopy.minutesShort}`],
    [bookingCopy.timezoneDetailLabel, `${zoneCity(timeZone)}, ${formatOffset(start, timeZone)}`],
  ];

  return (
    <div className="step-in mx-auto flex max-w-xl flex-col items-start px-4 py-12 sm:px-8 md:py-16">
      <span className="flex size-12 items-center justify-center rounded-md border border-kiln text-ember">
        <Check className="size-5" />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-h3 text-fg outline-none">
        {bookingCopy.confirmationTitle}
      </h2>

      <dl className="mt-8 w-full border-t border-rule">
        {details.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-6 border-b border-rule py-3">
            <dt className="font-mono text-meta uppercase text-fg-2">{label}</dt>
            <dd className="text-right text-ui text-fg">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-ui text-fg-2">
        {bookingCopy.sentToPrefix} <span className="break-all text-fg">{email}</span>
      </p>
      {meetUrl ? (
        <a
          href={meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-12 items-center text-ui text-fg underline decoration-rule decoration-1 underline-offset-4 hover:decoration-fg"
        >
          {bookingCopy.meetLinkLabel}
          <span className="sr-only">{newTabHint}</span>
        </a>
      ) : null}

      <Button href="/" variant="secondary" className="mt-8">
        {bookingCopy.backToHomeLabel}
      </Button>
    </div>
  );
}
