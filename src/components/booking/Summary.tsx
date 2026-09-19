"use client";

import { useId } from "react";
import { Video } from "@/components/ui/Icons";
import { bookingCopy, bookingRules, type Duration } from "@/content/booking";

interface BookingLineProps {
  duration: Duration;
  /** "Mon 21 Sep", or null until a day is chosen. */
  dayLabel: string | null;
  /** "11:00", or null until a time is chosen. */
  timeLabel: string | null;
  /** "Cairo, GMT+3". */
  zoneLabel: string;
}

/** The signature element: one mono line that fills in as the visitor chooses. Unchosen parts stay muted. */
function BookingLine({ duration, dayLabel, timeLabel, zoneLabel }: BookingLineProps) {
  const part = (text: string | null, placeholder: string) =>
    text ? <span className="text-ember">{text}</span> : <span className="text-fg-2">{placeholder}</span>;
  return (
    <p aria-live="polite" aria-atomic="true" className="font-mono text-meta normal-case text-fg-2">
      <span className="sr-only">{bookingCopy.bookingLineLabel}: </span>
      {part(`${duration} ${bookingCopy.minutesShort}`, "")}
      <span aria-hidden="true"> / </span>
      <span className="sr-only">, </span>
      {part(dayLabel, bookingCopy.linePlaceholderDay)}
      <span aria-hidden="true"> / </span>
      <span className="sr-only">, </span>
      {part(timeLabel, bookingCopy.linePlaceholderTime)}
      {zoneLabel ? <span className="text-fg-2"> ({zoneLabel})</span> : null}
    </p>
  );
}

interface SummaryProps extends BookingLineProps {
  onDurationChange: (duration: Duration) => void;
  /** Selected timezone, or null while it is being detected. */
  timeZone: string | null;
  /** Every selectable IANA zone; empty before mount. */
  zones: readonly string[];
  onTimeZoneChange: (timeZone: string) => void;
}

/** Left panel: what this is, duration, timezone, and the live booking line. */
export function Summary({ duration, onDurationChange, timeZone, zones, onTimeZoneChange, ...line }: SummaryProps) {
  const selectId = useId();
  const helpId = useId();
  const options = timeZone && !zones.includes(timeZone) ? [timeZone, ...zones] : zones;

  return (
    <div className="flex h-full flex-col gap-8">
      <div>
        <p className="text-h3 font-medium text-fg">{bookingCopy.brandLabel}</p>
        <p className="mt-4 text-ui text-fg-2">{bookingCopy.description}</p>
        <p className="mt-4 flex items-center gap-2 text-ui text-fg-2">
          <Video className="shrink-0" />
          {bookingCopy.meetNote}
        </p>
      </div>

      <fieldset>
        <legend className="font-mono text-meta uppercase text-fg-2">{bookingCopy.durationLabel}</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {bookingRules.durations.map((value) => (
            <label key={value} className="relative block">
              <input
                type="radio"
                name="duration"
                value={value}
                checked={duration === value}
                onChange={() => onDurationChange(value)}
                className="peer sr-only"
              />
              <span className="btn flex min-h-12 items-center justify-center rounded-sm border border-rule text-ui text-fg peer-checked:border-kiln peer-checked:bg-kiln peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-fg hover:border-fg-2 peer-checked:hover:border-kiln">
                {value} {bookingCopy.minutesShort}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={selectId} className="font-mono text-meta uppercase text-fg-2">
          {bookingCopy.timezoneLabel}
        </label>
        <select
          id={selectId}
          aria-describedby={helpId}
          value={timeZone ?? bookingRules.timeZone}
          disabled={!timeZone}
          onChange={(event) => onTimeZoneChange(event.target.value)}
          className="mt-3 min-h-12 w-full rounded-sm border border-rule bg-bg px-3 text-ui text-fg"
        >
          {(options.length > 0 ? options : [timeZone ?? bookingRules.timeZone]).map((zone) => (
            <option key={zone} value={zone}>
              {zone.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <p id={helpId} className="mt-2 text-meta normal-case text-fg-2">
          {bookingCopy.timezoneHelp}
        </p>
      </div>

      <div className="mt-auto border-t border-rule pt-6">
        <BookingLine {...line} duration={duration} />
      </div>
    </div>
  );
}
