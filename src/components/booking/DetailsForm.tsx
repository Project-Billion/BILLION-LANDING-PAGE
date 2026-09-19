"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "@/components/ui/Icons";
import { bookingCopy } from "@/content/booking";

export interface Details {
  name: string;
  email: string;
  note: string;
}

type FieldErrors = Partial<Record<keyof Details, string>>;

const NOTE_MAX = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(details: Details): FieldErrors {
  const errors: FieldErrors = {};
  if (details.name.trim().length < 1) errors.name = bookingCopy.errors.nameRequired;
  const email = details.email.trim();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) errors.email = bookingCopy.errors.emailInvalid;
  if (details.note.length > NOTE_MAX) errors.note = bookingCopy.errors.noteTooLong;
  return errors;
}

const fieldClass =
  "mt-2 w-full rounded-sm border bg-bg px-3 text-ui text-fg placeholder:text-fg-2 aria-[invalid=true]:border-kiln";

interface DetailsFormProps {
  details: Details;
  onChange: (details: Details) => void;
  /** "Mon 21 Sep, 11:00, 30 min" recap of the chosen slot. */
  recap: string;
  pending: boolean;
  /** Form-level failure from the server (validation, rate limit, not configured, generic). */
  error: string | null;
  onBack: () => void;
  /** Called with the honeypot value once the fields pass validation. */
  onSubmit: (honeypot: string) => void;
}

/** Name, email and optional note, plus an off-screen honeypot called "website". */
export function DetailsForm({ details, onChange, recap, pending, error, onBack, onSubmit }: DetailsFormProps) {
  const ids = { name: useId(), email: useId(), note: useId() };
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    nameRef.current?.focus({ preventScroll: true });
  }, []);

  function update(field: keyof Details, value: string) {
    onChange({ ...details, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(details);
    setErrors(found);
    if (found.name) return void nameRef.current?.focus();
    if (found.email) return void emailRef.current?.focus();
    if (found.note) return void noteRef.current?.focus();
    const honeypot = new FormData(event.currentTarget).get("website");
    onSubmit(typeof honeypot === "string" ? honeypot : "");
  }

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onBack}
        className="btn -ml-2 inline-flex min-h-12 items-center gap-1 self-start rounded-sm pr-3 pl-2 text-ui text-fg-2 hover:text-fg"
      >
        <ChevronLeft />
        {bookingCopy.backToTimesLabel}
      </button>
      <h2 className="mt-2 text-h3 text-fg">{bookingCopy.detailsTitle}</h2>
      <p className="mt-2 font-mono text-meta normal-case text-ember">{recap}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <div>
          <label htmlFor={ids.name} className="text-ui text-fg">
            {bookingCopy.nameLabel}
          </label>
          <input
            ref={nameRef}
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            value={details.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${ids.name}-error` : undefined}
            className={`${fieldClass} min-h-12 ${errors.name ? "border-kiln" : "border-rule"}`}
          />
          {errors.name ? (
            <p id={`${ids.name}-error`} className="mt-2 text-meta normal-case text-ember">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.email} className="text-ui text-fg">
            {bookingCopy.emailLabel}
          </label>
          <input
            ref={emailRef}
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            required
            value={details.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${ids.email}-error` : undefined}
            className={`${fieldClass} min-h-12 ${errors.email ? "border-kiln" : "border-rule"}`}
          />
          {errors.email ? (
            <p id={`${ids.email}-error`} className="mt-2 text-meta normal-case text-ember">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={ids.note} className="text-ui text-fg">
            {bookingCopy.noteLabel} <span className="text-fg-2">({bookingCopy.optionalLabel})</span>
          </label>
          <textarea
            ref={noteRef}
            id={ids.note}
            name="note"
            rows={4}
            value={details.note}
            onChange={(event) => update("note", event.target.value)}
            aria-invalid={errors.note ? true : undefined}
            aria-describedby={errors.note ? `${ids.note}-error` : undefined}
            className={`${fieldClass} resize-y py-3 ${errors.note ? "border-kiln" : "border-rule"}`}
          />
          {errors.note ? (
            <p id={`${ids.note}-error`} className="mt-2 text-meta normal-case text-ember">
              {errors.note}
            </p>
          ) : null}
        </div>

        {/* Honeypot: real visitors never see or reach it; bots that fill every field get dropped by the server. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            {bookingCopy.websiteLabel}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        {error ? (
          <p role="alert" className="rounded-sm border border-kiln px-3 py-2 text-ui text-fg">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="accent" disabled={pending} className="w-full disabled:opacity-60">
          {pending ? bookingCopy.confirmingButton : bookingCopy.confirmButton}
        </Button>
      </form>
    </div>
  );
}
