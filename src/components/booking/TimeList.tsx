"use client";

import { useEffect, useRef } from "react";
import { bookingCopy } from "@/content/booking";
import { formatLongDate, formatTime } from "./dates";

interface TimeListProps {
  /** Selected local day, or null before a day is chosen. */
  day: string | null;
  /** Slot instants (UTC ISO) on that day. */
  slots: readonly string[];
  timeZone: string;
  selectedTime: string | null;
  loading: boolean;
  /** Set when the month has no free slot at all. */
  monthEmpty: boolean;
  /** Message such as "This time was just booked", announced when it appears. */
  notice: string | null;
  onSelectTime: (slot: string) => void;
}

/** Free times for the chosen day. Scrolls inside its panel on large screens (the panel gives it a fixed height). */
export function TimeList({ day, slots, timeZone, selectedTime, loading, monthEmpty, notice, onSelectTime }: TimeListProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);

  // Coming back from the form: put focus on the time that was chosen.
  useEffect(() => {
    selectedRef.current?.focus({ preventScroll: true });
  }, []);

  // After a slot was taken the visitor lands back here: move focus to the notice so keyboard focus is not lost.
  useEffect(() => {
    if (notice) noticeRef.current?.focus({ preventScroll: true });
  }, [notice]);

  let body;
  if (loading) {
    body = (
      <div aria-hidden="true" className="flex flex-col gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="skeleton h-12 rounded-sm bg-white/5" />
        ))}
      </div>
    );
  } else if (!day) {
    body = <p className="text-ui text-fg-2">{monthEmpty ? bookingCopy.emptyMonth : bookingCopy.selectDay}</p>;
  } else if (slots.length === 0) {
    body = <p className="text-ui text-fg-2">{bookingCopy.emptyDay}</p>;
  } else {
    body = (
      <ul className="flex flex-col gap-2">
        {slots.map((slot) => {
          const selected = slot === selectedTime;
          return (
            <li key={slot}>
              <button
                ref={selected ? selectedRef : undefined}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectTime(slot)}
                className={`btn flex min-h-12 w-full items-center justify-center rounded-sm border font-mono text-ui tabular-nums ${
                  selected ? "border-kiln bg-kiln text-white" : "border-rule text-fg hover:border-fg-2"
                }`}
              >
                {formatTime(slot, timeZone)}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h2 className="text-h3 text-fg">{day ? formatLongDate(day) : bookingCopy.timeLabel}</h2>
      {notice ? (
        <p ref={noticeRef} role="alert" tabIndex={-1} className="mt-4 rounded-sm border border-kiln px-3 py-2 text-ui text-fg">
          {notice}
        </p>
      ) : null}
      <div className="mt-4 min-h-0 flex-1 lg:overflow-y-auto lg:pr-1">{body}</div>
    </div>
  );
}
