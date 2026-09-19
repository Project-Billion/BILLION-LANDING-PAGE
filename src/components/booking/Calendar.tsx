"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "@/components/ui/Icons";
import { bookingCopy } from "@/content/booking";
import { calendarCells, formatLongDate, formatMonthTitle } from "./dates";

const WEEKDAYS = [
  { short: "Su", long: "Sunday" },
  { short: "Mo", long: "Monday" },
  { short: "Tu", long: "Tuesday" },
  { short: "We", long: "Wednesday" },
  { short: "Th", long: "Thursday" },
  { short: "Fr", long: "Friday" },
  { short: "Sa", long: "Saturday" },
] as const;

const navButtonClass =
  "btn inline-flex size-12 items-center justify-center rounded-sm text-fg hover:bg-white/5 disabled:pointer-events-none disabled:text-fg-2/40";

interface CalendarProps {
  /** Visible month, "YYYY-MM". */
  month: string;
  /** Free slots per local day ("YYYY-MM-DD" -> slots). */
  slotsByDay: ReadonlyMap<string, readonly string[]>;
  /** Today's day key in the visitor's timezone. */
  today: string;
  selectedDay: string | null;
  onSelectDay: (day: string) => void;
  onMonthChange: (delta: -1 | 1) => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  loading: boolean;
  /** Visitor-facing failure message; shows a retry button instead of the grid. */
  errorMessage: string | null;
  onRetry: () => void;
}

function dayClass(state: { available: boolean; selected: boolean; today: boolean }): string {
  const base = "btn relative flex h-12 w-full items-center justify-center rounded-sm text-ui tabular-nums";
  if (state.selected) return `${base} bg-kiln text-white`;
  const ring = state.today ? "ring-1 ring-inset ring-fg-2" : "";
  if (!state.available) return `${base} cursor-default text-fg-2/40 ${ring}`;
  return `${base} text-fg hover:bg-white/5 after:absolute after:bottom-1.5 after:size-1 after:rounded-full after:bg-ember ${ring}`;
}

/** Month grid, Sunday first. Days without a free slot are aria-disabled; one roving tab stop; arrow keys move by day and week, PageUp/PageDown by month. */
export function Calendar({
  month,
  slotsByDay,
  today,
  selectedDay,
  onSelectDay,
  onMonthChange,
  canGoPrevious,
  canGoNext,
  loading,
  errorMessage,
  onRetry,
}: CalendarProps) {
  const titleId = useId();
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedDay, setFocusedDay] = useState<string | null>(null);
  // Day of month to focus once the next/previous month has rendered (PageUp / PageDown).
  const pendingDayRef = useRef<number | null>(null);

  const cells = calendarCells(month);
  const days = cells.filter((cell): cell is string => cell !== null);
  const firstAvailable = days.find((day) => slotsByDay.has(day));
  const tabDay =
    (focusedDay && days.includes(focusedDay) ? focusedDay : null) ??
    (selectedDay && days.includes(selectedDay) ? selectedDay : null) ??
    firstAvailable ??
    days[0];

  const rows: (string | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) rows.push(cells.slice(index, index + 7));

  // After PageUp / PageDown swaps the month, focus the same day number (or the month's last day).
  useEffect(() => {
    const wanted = pendingDayRef.current;
    if (wanted === null || loading) return;
    pendingDayRef.current = null;
    const buttons = Array.from(gridRef.current?.querySelectorAll<HTMLElement>("[data-day]") ?? []);
    const target = buttons.find((button) => Number(button.dataset.day?.slice(8)) === wanted) ?? buttons[buttons.length - 1];
    target?.focus();
  }, [month, loading]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = (event.target as HTMLElement).closest<HTMLElement>("[data-day]")?.dataset.day;
    if (!current) return;

    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      const delta = event.key === "PageUp" ? -1 : 1;
      if (delta === -1 ? !canGoPrevious : !canGoNext) return;
      pendingDayRef.current = Number(current.slice(8));
      onMonthChange(delta);
      return;
    }

    const index = cells.indexOf(current);
    const rowStart = index - (index % 7);
    const targets: Record<string, number> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      ArrowUp: index - 7,
      ArrowDown: index + 7,
      Home: rowStart,
      End: rowStart + 6,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    let next = cells[target];
    // Landing on padding: Home/End pick the nearest real day of the row, Up/Down the month's first/last day
    // (unless already there); Left/Right at the month's edge stay put.
    if (!next) {
      const row = cells.slice(rowStart, rowStart + 7).filter((cell): cell is string => cell !== null);
      if (event.key === "Home") next = row[0];
      else if (event.key === "End") next = row[row.length - 1];
      else if (event.key === "ArrowDown") next = days[days.length - 1];
      else if (event.key === "ArrowUp") next = days[0];
    }
    if (!next || next === current) return;
    gridRef.current?.querySelector<HTMLElement>(`[data-day="${next}"]`)?.focus();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p id={titleId} aria-live="polite" className="pl-2 text-body font-medium text-fg">
          {formatMonthTitle(month)}
        </p>
        <div className="flex">
          <button
            type="button"
            className={navButtonClass}
            disabled={!canGoPrevious}
            aria-label={bookingCopy.previousMonthLabel}
            onClick={() => onMonthChange(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className={navButtonClass}
            disabled={!canGoNext}
            aria-label={bookingCopy.nextMonthLabel}
            onClick={() => onMonthChange(1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {errorMessage ? (
        <div role="alert" className="mt-4 flex flex-col items-start gap-4 rounded-md border border-rule p-4">
          <p className="text-ui text-fg">{errorMessage}</p>
          <Button variant="secondary" onClick={onRetry}>
            {bookingCopy.retry}
          </Button>
        </div>
      ) : (
        <div ref={gridRef} role="grid" aria-labelledby={titleId} aria-busy={loading} onKeyDown={onKeyDown} className="mt-3">
          <div role="row" className="grid grid-cols-7">
            {WEEKDAYS.map((weekday) => (
              <div
                key={weekday.long}
                role="columnheader"
                aria-label={weekday.long}
                className="flex h-8 items-center justify-center font-mono text-meta uppercase text-fg-2"
              >
                <span aria-hidden="true">{weekday.short}</span>
              </div>
            ))}
          </div>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} role="row" className="grid grid-cols-7">
              {row.map((day, cellIndex) => {
                if (!day) return <div key={cellIndex} role="gridcell" aria-hidden="true" />;
                if (loading) {
                  return (
                    <div key={day} role="gridcell" aria-disabled="true" className="p-0.5">
                      <div className="skeleton h-11 rounded-sm bg-white/5" />
                    </div>
                  );
                }
                const count = slotsByDay.get(day)?.length ?? 0;
                const available = count > 0;
                const selected = day === selectedDay;
                return (
                  <div key={day} role="gridcell" aria-selected={selected} className="p-0.5">
                    <button
                      type="button"
                      data-day={day}
                      tabIndex={day === tabDay ? 0 : -1}
                      aria-disabled={!available}
                      aria-current={day === today ? "date" : undefined}
                      aria-label={`${formatLongDate(day)}, ${available ? `${count} ${bookingCopy.timesAvailableSuffix}` : bookingCopy.noTimesSuffix}`}
                      className={dayClass({ available, selected, today: day === today })}
                      onFocus={() => setFocusedDay(day)}
                      onClick={() => {
                        if (available) onSelectDay(day);
                      }}
                    >
                      {Number(day.slice(8))}
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {loading ? (
        <p role="status" className="sr-only">
          {bookingCopy.loading}
        </p>
      ) : null}
    </div>
  );
}
