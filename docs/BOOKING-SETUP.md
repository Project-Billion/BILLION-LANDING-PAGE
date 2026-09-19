# Setting up the book-a-call feature

The /book page lets visitors schedule calls directly into your Google Calendar. It creates calendar events with Google Meet links and sends invites to both you and the visitor. This guide walks you through obtaining the Google credentials (OAuth tokens) the system needs.

## What you need: 4 environment variables

The booking system needs these variables set in your production environment:

- `GOOGLE_CLIENT_ID`: identifies your app to Google
- `GOOGLE_CLIENT_SECRET`: proves your app to Google (keep private)
- `GOOGLE_REFRESH_TOKEN`: allows the app to create events in your calendar without you logging in again
- `GOOGLE_CALENDAR_ID`: which calendar to use (defaults to "primary", your main calendar)

Without these, the app shows "Booking unavailable" to visitors on the live site. In local development, it uses a mock calendar so you can test the UI.

## Step 1: Create a Google Cloud project

1. Go to https://console.cloud.google.com/
2. At the top, click the project selector (next to "Google Cloud")
3. Click "New Project"
4. Name it "Billion Booking" (or your choice) and click Create
5. Wait for it to finish, then select the project
6. In the search bar at the top, type "Google Calendar API"
7. Click on it, then click "Enable"

## Step 2: Set up OAuth consent (this prevents token expiry)

1. In the left menu, go to "APIs & Services" > "OAuth consent screen"
2. Under "User Type", select "External" (this allows test users while the app is not publicly available)
3. Fill in the form:
   - App name: "Billion Booking"
   - User support email: your email
   - Developer contact: your email
4. Click Save and Continue (skip optional scopes for now)
5. On the "Test users" page, click "Add Users"
6. Add your Google account (the one whose calendar you want to use for bookings)
7. Click "Back to Dashboard"

**Homepage and privacy policy links (do this before pressing Publish app).** Google requires both to publish the app. On the "Branding" page of the consent screen, set:

- Application home page: `https://billion-solutions.vercel.app`
- Application privacy policy link: `https://billion-solutions.vercel.app/privacy`
- Authorized domains: `billion-solutions.vercel.app`

Save these first. The /privacy page must be live on that domain before you publish.

**Important: Publish to "In production"**

Still on the OAuth consent screen, look for a blue "Publish App" button or similar option to change the status from "Testing" to "In production". This is critical: while the app status is "Testing", Google deletes refresh tokens after 7 days, and bookings will silently fail. An in-production app with an unverified domain just shows a warning screen to test users (you), which is fine for a personal calendar.

## Step 3: Create OAuth credentials

1. In the left menu, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Under "Authorized redirect URIs", add exactly this:
   ```
   https://developers.google.com/oauthplayground
   ```
5. Click Create
6. A dialog shows your Client ID and Client Secret. Copy both and keep them safe; you will need them in the next step.

## Step 4: Get the refresh token using OAuth Playground

1. Go to https://developers.google.com/oauthplayground
2. Click the gear icon (Settings) in the top right
3. Check "Use your own OAuth credentials"
4. Paste your Client ID and Client Secret from Step 3
5. In the left panel, under "Select & authorize APIs", paste these two scope URLs (one per line, in the text box labeled "Input your own scopes"):
   ```
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/calendar.freebusy
   ```
6. Click "Authorize the APIs"
7. A dialog asks for permission; choose your account and approve
8. In the right panel, look for "Authorization code" and click "Exchange authorization code for tokens"
9. Copy the "Refresh token" from the response (a long string)

## Step 5: Set environment variables in Vercel

1. Go to your Vercel project settings
2. In "Environment Variables", add these four:

   | Name | Value |
   |------|-------|
   | `GOOGLE_CLIENT_ID` | The value from Step 3 |
   | `GOOGLE_CLIENT_SECRET` | The value from Step 3 |
   | `GOOGLE_REFRESH_TOKEN` | The value from Step 4 |
   | `GOOGLE_CALENDAR_ID` | `primary` (unless you want a different calendar) |

3. Set each to both "Production" and "Preview" environments
4. Click "Save"
5. Redeploy your site so the variables take effect

## Step 6: Set up local development (optional)

To test with real Google credentials on your laptop:

1. In your project root, create a file named `.env.local` (note: the dot at the start, and the `.local` suffix)
2. Add the same four variables:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   GOOGLE_REFRESH_TOKEN=your-refresh-token-here
   GOOGLE_CALENDAR_ID=primary
   ```
3. Save the file
4. This file is listed in `.gitignore`, so it will never be committed to git

**Important:** The `.env.local` file contains secrets. Never commit it, never share it, never paste it in messages or tickets.

## Step 7: Test the booking flow

1. Visit the /book page on your live site or localhost
2. Pick a date and time (make sure your availability is set correctly; see "Changing availability" below)
3. Fill in your name and email and confirm the booking
4. Check:
   - Your inbox for the invite email
   - Your Google Calendar for the event
   - The event should show "Google Meet" as the location with a clickable link

If any of these is missing, see "Troubleshooting" below.

## Changing availability

Availability is defined in `src/content/booking.ts` under the `availability` object:

- `daysOfWeek`: which days are open (0 = Sunday, 1 = Monday, ..., 6 = Saturday). Default is 0-4 (Sunday-Thursday)
- `startHour` and `endHour`: working hours in Cairo time (Africa/Cairo timezone)
- `slotDuration`: how long each booking option is (in minutes)
- `bufferMinutes`: minimum gap between back-to-back bookings
- `minNotice`: how far in advance a visitor must book (in hours)
- `maxHorizon`: how far ahead bookings are allowed (in days)

Edit these values to match your calendar preferences, redeploy, and the /book page will update automatically.

## Troubleshooting

**Booking or availability returns an error (502)**
The server log line ("booking failed" or "availability lookup failed") includes a `step` and, when Google sent one, a short `code`. Find the matching row. The four Google values (client ID, client secret, refresh token, calendar ID) are trimmed automatically, including stray spaces, line breaks and one pair of wrapping quotes, but re-copy them anyway if a row below points at them.

| `step` | `code` (status) | Meaning and fix |
| --- | --- | --- |
| `token` | `invalid_client` (401) | Client ID or Client secret is wrong, or does not match the client that issued the refresh token. Re-copy both, with no spaces or quotes. |
| `token` | `invalid_grant` (400) | Refresh token is wrong, expired or revoked. Redo Step 4, and check the app is In production. |
| `freebusy` or `insert` | `PERMISSION_DENIED` or `accessNotConfigured` (403) | The Google Calendar API is not enabled, or a scope is missing. Enable the API and repeat Steps 3 and 4. |
| `freebusy` or `insert` | `NOT_FOUND` (404) | `GOOGLE_CALENDAR_ID` is wrong. |

**"invalid_grant" error when booking**
The refresh token has expired or been revoked. This usually means Google deleted it because the app was in "Testing" mode for 7 days (Step 2). Go back to Step 4 to get a fresh refresh token, then update it in Vercel and redeploy.

**"403 insufficient scopes" error**
The OAuth credentials are missing one of the required scopes. Repeat Steps 3 and 4, making sure both scopes are included. Then regenerate the refresh token.

**Booking succeeds but no Google Meet link appears in the calendar event**
Check two things:
1. In your Google Workspace settings (if using Workspace), ensure Meet is enabled for calendar events.
2. Make sure `GOOGLE_CALENDAR_ID` points to a calendar that allows conferencing.

**The time slot shows "free" on /book but the booking fails**
Your calendar changed between when the page showed the free slot and when you confirmed the booking. The server checks availability again when the booking request arrives and refuses a slot that is no longer free. Simply try again with a different slot.

**Bookings don't appear in Google Calendar**
Check that `GOOGLE_CALENDAR_ID` is correct. If omitted or set incorrectly, events go to an unexpected calendar.

## Known limits

The rate limits (5 bookings per hour per visitor and 30 per hour for the whole site) are kept in memory
on each serverless instance, so they are best effort rather than a hard guarantee, and two instances
could in rare cases book the same slot at once. Google emails the visitor-supplied address from your
account when an event is created (`sendUpdates=all`), so abuse could cause unwanted invitations. The
durable fix is a shared store (Upstash or Vercel KV) or Vercel WAF rate limiting; both are follow-ups.
A password manager that fills the hidden `website` field makes the server silently drop the booking while the page shows success (unlikely, but possible).
