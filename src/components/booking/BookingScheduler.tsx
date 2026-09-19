"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { bookingCopy, bookingRules, type Duration } from "@/content/booking";
import { ApiError, messageFor, submitBooking } from "./booking-api";
import { Calendar } from "./Calendar";
import { Confirmation } from "./Confirmation";
import {
  dayKeyInZone,
  formatOffset,
  formatShortDate,
  formatTime,
  groupSlotsByLocalDay,
  monthKeyInZone,
  shiftMonth,
  zoneCity,
} from "./dates";
import { DetailsForm, type Details } from "./DetailsForm";
import { Summary } from "./Summary";
import { TimeList } from "./TimeList";
import { useAvailability } from "./useAvailability";

const DAY_MS = 24 * 60 * 60 * 1000;
const EMPTY_ZONES: readonly string[] = [];
const cardClass = "-mx-5 overflow-hidden border-y border-rule bg-bg-2 sm:mx-0 sm:rounded-md sm:border";
const panelClass = "px-4 py-6 sm:px-6 md:p-8";

/* Browser-only values are read through useSyncExternalStore: the server snapshot is null/empty,
   so the first client render matches the server HTML and the real values arrive right after. */
const subscribeNever = () => () => {};

function detectTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

let cachedZones: readonly string[] | undefined;
function listTimeZones(): readonly string[] {
  if (!cachedZones) {
    const zones = Intl.supportedValuesOf("timeZone");
    cachedZones = zones.includes("UTC") ? zones : ["UTC", ...zones];
  }
  return cachedZones;
}

type Step = "pick" | "form" | "done";

interface Booked {
  start: string;
  duration: Duration;
  timeZone: string;
  email: string;
  meetUrl: string | null;
}

/** The whole /book flow: summary, calendar, times, details form, confirmation. */
export function BookingScheduler() {
  const [now] = useState(() => Date.now());
  const detectedZone = useSyncExternalStore(subscribeNever, detectTimeZone, () => null);
  const zones = useSyncExternalStore(subscribeNever, listTimeZones, () => EMPTY_ZONES);

  const [chosenZone, setChosenZone] = useState<string | null>(null);
  const [monthOverride, setMonthOverride] = useState<string | null>(null);
  const [duration, setDuration] = useState<Duration>(bookingRules.defaultDuration);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("pick");
  // The first paint shows the times panel without animation; only later step changes animate.
  const [animateSteps, setAnimateSteps] = useState(false);
  const [details, setDetails] = useState<Details>({ name: "", email: "", note: "" });
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [booked, setBooked] = useState<Booked | null>(null);
  const timesPanelRef = useRef<HTMLElement>(null);
  const stepIn = animateSteps ? "step-in " : "";

  const timeZone = chosenZone ?? detectedZone;
  const currentMonth = timeZone ? monthKeyInZone(new Date(now), timeZone) : null;
  const visibleMonth = monthOverride ?? currentMonth;
  const lastMonth = timeZone ? monthKeyInZone(new Date(now + bookingRules.maxDaysAhead * DAY_MS), timeZone) : null;

  const availability = useAvailability({ visibleMonth, duration, now });
  const slotsByDay = useMemo(
    () => (timeZone ? groupSlotsByLocalDay(availability.slots, timeZone) : new Map<string, string[]>()),
    [availability.slots, timeZone],
  );

  if (booked) {
    return (
      <div className={cardClass}>
        <Confirmation {...booked} />
      </div>
    );
  }

  const monthEmpty =
    !availability.loading && visibleMonth !== null && ![...slotsByDay.keys()].some((day) => day.startsWith(visibleMonth));
  const daySlots = selectedDay ? (slotsByDay.get(selectedDay) ?? []) : [];

  function goToStep(next: Step) {
    if (next === step) return;
    setStep(next);
    setAnimateSteps(true);
  }

  function changeTimeZone(next: string) {
    setChosenZone(next);
    setMonthOverride(null);
    setSelectedDay(null);
    setSelectedTime(null);
    goToStep("pick");
    setNotice(null);
  }

  function changeDuration(next: Duration) {
    setDuration(next);
    setSelectedTime(null);
    goToStep("pick");
    setNotice(null);
  }

  function selectDay(day: string) {
    setSelectedDay(day);
    setSelectedTime(null);
    setNotice(null);
    // Stacked layout: bring the times into view.
    if (window.matchMedia("(max-width: 767px)").matches) {
      timesPanelRef.current?.scrollIntoView({ block: "nearest" });
    }
  }

  function selectTime(slot: string) {
    setSelectedTime(slot);
    setNotice(null);
    setFormError(null);
    goToStep("form");
  }

  async function handleSubmit(honeypot: string) {
    if (!timeZone || !selectedTime) return;
    setPending(true);
    setFormError(null);
    try {
      const { meetUrl } = await submitBooking({
        start: selectedTime,
        duration,
        name: details.name.trim(),
        email: details.email.trim(),
        note: details.note,
        timezone: timeZone,
        website: honeypot,
      });
      setBooked({ start: selectedTime, duration, timeZone, email: details.email.trim(), meetUrl });
      setStep("done");
    } catch (error) {
      const code = error instanceof ApiError ? error.code : "generic";
      if (code === "slotTaken") {
        setSelectedTime(null);
        goToStep("pick");
        setNotice(messageFor("slotTaken"));
        availability.refresh();
      } else {
        setFormError(messageFor(code));
      }
    } finally {
      setPending(false);
    }
  }

  const lineZoneAt = selectedTime ?? new Date(now).toISOString();
  const zoneLabel = timeZone ? `${zoneCity(timeZone)}, ${formatOffset(lineZoneAt, timeZone)}` : "";
  const dayLabel = selectedDay ? formatShortDate(selectedDay) : null;
  const timeLabel = selectedTime && timeZone ? formatTime(selectedTime, timeZone) : null;
  const recap = [dayLabel, timeLabel, `${duration} ${bookingCopy.minutesShort}`].filter(Boolean).join(", ");

  return (
    <div className={cardClass}>
      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        <section aria-label={bookingCopy.bookingLineLabel} className={`${panelClass} md:col-span-2 lg:col-span-1`}>
          <Summary
            duration={duration}
            onDurationChange={changeDuration}
            timeZone={timeZone}
            zones={zones}
            onTimeZoneChange={changeTimeZone}
            dayLabel={dayLabel}
            timeLabel={timeLabel}
            zoneLabel={zoneLabel}
          />
        </section>

        <section
          aria-labelledby="book-calendar-title"
          className="border-t border-rule px-2 py-6 sm:px-6 md:p-6 lg:border-t-0 lg:border-l lg:p-8"
        >
          <h2 id="book-calendar-title" className="mb-3 pl-2 font-mono text-meta uppercase text-fg-2">
            {bookingCopy.calendarLabel}
          </h2>
          {visibleMonth && timeZone && currentMonth && lastMonth ? (
            <Calendar
              month={visibleMonth}
              slotsByDay={slotsByDay}
              today={dayKeyInZone(new Date(now), timeZone)}
              selectedDay={selectedDay}
              onSelectDay={selectDay}
              onMonthChange={(delta) => setMonthOverride(shiftMonth(visibleMonth, delta))}
              canGoPrevious={visibleMonth > currentMonth}
              canGoNext={shiftMonth(visibleMonth, 1) <= lastMonth}
              loading={availability.loading}
              errorMessage={availability.error ? messageFor(availability.error) : null}
              onRetry={availability.retry}
            />
          ) : (
            <div aria-hidden="true" className="skeleton mt-14 h-72 rounded-sm bg-white/5" />
          )}
        </section>

        <section
          ref={timesPanelRef}
          aria-label={bookingCopy.timeLabel}
          className="relative border-t border-rule md:border-l lg:border-t-0"
        >
          {step === "form" && timeZone ? (
            <div key="form" className={`${stepIn}${panelClass}`}>
              <DetailsForm
                details={details}
                onChange={setDetails}
                recap={recap}
                pending={pending}
                error={formError}
                onBack={() => goToStep("pick")}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <div key="times" className={`${stepIn}flex flex-col ${panelClass} lg:absolute lg:inset-0`}>
              <TimeList
                day={selectedDay}
                slots={daySlots}
                timeZone={timeZone ?? bookingRules.timeZone}
                selectedTime={selectedTime}
                loading={availability.loading || !timeZone}
                monthEmpty={monthEmpty}
                notice={notice}
                onSelectTime={selectTime}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
