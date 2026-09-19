# Book a call: design

Date: 2026-09-19. Status: awaiting owner review.

## Goal

"Talk to an engineer" no longer exposes the owner's WhatsApp number. Visitors pick a
duration, a day and a time on a dedicated `/book` page. Confirming creates a Google
Calendar event with a Google Meet link and emails the invite to the visitor and the owner.
Inspiration: meet.swegit.io/discovery-session (three-panel scheduler). Our own visual
style (paper / ink / kiln, serif headings, square buttons), not a copy of theirs.

## Decisions (owner-approved 2026-09-19)

| Topic | Decision |
|---|---|
| Meet + calendar | Google Calendar REST API, owner's account via OAuth refresh token |
| Placement | Dedicated `/book` page, linked from every "Talk to an engineer" / "Book a call" button |
| Availability | Sun-Thu, 10:00-18:00 Africa/Cairo, 30-minute start slots, 15-minute buffer, min 24 h notice, max 30 days ahead |
| Durations | 15 / 30 / 60 minutes, default 30 |
| Storage | None. Google Calendar is the only record |
| Phone number | Removed from nav, mobile menu and CTA. Stays in the footer as the existing WhatsApp link |
| Email | Stays in the footer and in the CTA section (unchanged) |

Open point for the owner: footer keeps the current "WhatsApp" link (number not printed as
text). Say so if the digits should be printed.

## Visitor flow (`/book`)

Three panels in one card; stacks vertically on phones.

1. Left: title "Discovery call with a Billion engineer", short description, "Google Meet" note,
   duration picker (15 / 30 / 60), visitor timezone (auto-detected, changeable).
2. Middle: month calendar. Days with no free slot are disabled. Prev/next month.
3. Right: free times for the selected day in the visitor's timezone.
4. After a time is chosen: form (name, email, optional "what should we look at?"). Confirm button.
5. Confirmation: date, time, duration, "Meet link sent to your email", link to add to calendar is
   the invite itself. Error states: slot just taken (return to time list with a message),
   validation, server not configured, generic failure.

Accessibility: calendar is a labelled grid with keyboard arrows; selected day / time announced;
respects `prefers-reduced-motion`; 48 px tap targets; visible focus (global rule).

## Architecture

```
src/content/booking.ts            rules + all UI copy (single source of truth)
src/lib/booking/
  slots.ts                        pure: rules + busy intervals + now -> free slot starts (UTC ISO)
  provider.ts                     interface CalendarProvider { getBusy(from,to); createEvent(input) }
  google.ts                       provider: OAuth refresh-token exchange + freeBusy + events.insert via fetch
  mock.ts                         provider for local dev when Google env vars are absent
  validate.ts                     request validation (no dependency)
  rate-limit.ts                   in-memory per-IP limiter (best effort on serverless)
src/app/api/availability/route.ts GET  ?month=YYYY-MM&duration=30 -> { slots: string[] }
src/app/api/book/route.ts         POST { start, duration, name, email, note?, timezone, website } -> 200 | 400 | 409 | 429 | 503
src/app/book/page.tsx             server page + metadata
src/components/booking/           BookingScheduler (client), Calendar, TimeList, DetailsForm, Confirmation
.env.example                      variable names only, empty values
docs/BOOKING-SETUP.md             how to obtain Google credentials (owner steps)
```

Provider selection: Google when `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`,
`GOOGLE_REFRESH_TOKEN` are all set. Otherwise mock in `NODE_ENV=development`; in production the
routes return 503 with a generic message (never silently fake a booking in production).

Env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`,
`GOOGLE_CALENDAR_ID` (default `primary`).

### Availability

`slots.ts` is pure and unit-tested. Africa/Cairo has daylight saving, so conversion between Cairo
wall time and UTC must use `Intl` (no hard-coded +02:00) and be tested across a DST change.
A slot is free when it lies inside working hours, on a working day, at least 24 h from now and at most
30 days out, and `[start - buffer, end + buffer]` overlaps no busy interval.
`GET /api/availability` returns every free slot for the requested month as UTC ISO strings; the client
groups them by the visitor's local day. Response is `Cache-Control: no-store`.

### Booking

`POST /api/book` recomputes the free slots server-side and rejects (409) any `start` that is not in
that set, so arbitrary times cannot be booked. It re-checks busy time immediately before
`events.insert`. Event: summary "Billion discovery call: <name>", organizer is the owner, attendee is the
visitor, time zone Africa/Cairo, description carries the visitor's note,
`conferenceData.createRequest` with `conferenceSolutionKey.type = "hangoutsMeet"` and a random
`requestId`, `conferenceDataVersion=1`, `sendUpdates=all`.

### Security

- Secrets only in server env; never in client code, logs or responses.
- Validate every field: name 1-100 chars, email format and <= 254 chars, note <= 1000, `duration`
  in the allowed set, `timezone` must be a valid IANA zone, `start` must be an ISO instant.
  Strip CR/LF from anything placed in event fields.
- Honeypot field `website` (must be empty) plus per-IP limit (5 bookings / hour, 60 availability calls / minute).
- Errors returned to the client are generic; details go to server logs without personal data.
- `security-auditor` review is mandatory before merge.

## WhatsApp / contact changes

- `src/components/site/Nav.tsx`, `MobileMenu.tsx`, `sections/CTA.tsx`, hero primary CTA: link to `/book`,
  label "Book a call" (hero keeps "Talk to an engineer"). No `wa.me`, no `target="_blank"`.
- `src/content/site.ts`: keep `siteConfig.contact.whatsappE164` and `whatsappUrl()` for the footer only;
  drop `nav.whatsappLabel` and `cta.whatsappLabel`; update copy in `cta`.
- `Footer.tsx`: unchanged.
- `Button.tsx`: fix the stale "WhatsApp only" comment on `accent`.
- Docs (`README.md`, `docs/BRIEF.md`, `docs/HANDOFF.md`) describe the new flow.

## Testing

- Add `vitest` as a dev dependency (`npm test`). Unit tests: slot generation (working days, hours,
  buffer, notice, horizon, DST), validation, rate limiter, Google provider request shaping with a mocked `fetch`.
- Gates on every task: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`.
- UI task also verified in a real browser at 375 / 768 / 1280 px with the mock provider.

## Out of scope

Rescheduling / cancelling, reminders beyond Google's, payment, multiple hosts, database, admin UI.

## Notes for implementers

`AGENTS.md`: this Next.js version has breaking changes. Read the relevant guide in
`node_modules/next/dist/docs/` (route handlers, `params`/`searchParams` being async, metadata) before writing code.
