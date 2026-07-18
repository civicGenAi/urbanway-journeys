# Services / Catalog / Booking Reconciliation

Date: 2026-07-18
Status: Approved, pending implementation plan

## Problem

The trip catalog (`src/lib/trips.ts`, `/services/$category`, `/trips/$slug`) was built as a well-integrated, design-consistent system, but it was never wired into the rest of the site. Two parallel, disconnected paths currently exist:

- The old `/services` page (9 static cards) opens a fake local-only inquiry modal for every card — none link into `/services/$category`.
- Every primary site CTA (Navbar "Plan Your Safari", Hero "Explore Safaris", both CtaBand "Start Planning" buttons, Reviews page CTA) points at the old generic `/bookings` 3-step form, which duplicates — more shallowly, with no age-band pricing and no real trip context — what `/trips/$slug` already does.
- Home "What we do" cards link to a bare `/services` instead of a specific category.
- Only 4 of the 9 offerings on `/services` (Wildlife Safaris, Airport Transfers, Day Trips, Car Hire) have matching data in `CATEGORIES`/`TRIPS`. The other 5 (City Tours, Private Transfers, Hotel Transfers, Corporate & VIP, Customized Packages) have no catalog content.

Visitors following the site's actual main paths never reach the real catalog/booking system at all.

## Decisions

1. **Orphan services (5 of 9 with no catalog data):** keep as quote-only cards on `/services`, visually distinct from the 4 catalog cards, rather than folding them into existing categories or dropping them.
2. **`/bookings`:** transform into a "Plan With Us" concierge page for undecided visitors, rather than deleting it or leaving it as a duplicate checkout.

## Design

### 1. Routing — `/services` becomes the single entry point into the catalog

Repoint these CTAs from `/bookings` to `/services`:
- `src/components/Navbar.tsx` — "Plan Your Safari" button
- `src/routes/index.tsx` — Hero "Explore Safaris" button
- `src/routes/index.tsx` — CtaBand "Start Planning" button
- `src/routes/reviews.tsx` — CtaBand "Start Planning" button

Home "What we do" cards (`FeaturedServices` in `src/routes/index.tsx`) deep-link straight to their matching category:
- Wildlife Safaris → `/services/wildlife-safaris`
- Airport Transfers → `/services/airport-transfers`
- Day Trips & Cultural Tours → `/services/day-trips`
- Car Hire → `/services/car-hire`

### 2. `/services` page — two-tier layout

Rebuild `src/routes/services.tsx` into two sections:

**Catalog tier (4 cards).** Sourced directly from `CATEGORIES` in `src/lib/trips.ts` (not a separately hardcoded array — kills the data-drift risk between the two). Each card shows category hero image, title, tagline, and a "View trips & prices" link to `/services/$category`.

**Quote-only tier (5 cards).** City Tours, Private Transfers, Hotel Transfers, Corporate & VIP Transportation, Customized Travel Packages. Own small data array (title/blurb/image) local to `services.tsx` since these have no catalog entry. Each card opens an inquiry modal labeled "Get a custom quote."

**Inquiry modal upgrade.** The existing modal (currently a fake local-only `setSent(true)` + toast, no real send) is rewired to open WhatsApp prefilled with the service name and whatever the visitor entered (name/notes), using the same `CONFIG.whatsapp` and message-building pattern already used by the "Negotiate" payment mode in `src/routes/trips.$slug.tsx`. This makes the quote-only path feel like part of the same real system instead of a dead end.

### 3. `/bookings` → "Plan With Us" concierge

Purpose: capture visitors who haven't picked a specific trip yet. Distinct from the `/trips/$slug` checkout, not a shallower duplicate of it.

- Nav label changes from "Bookings" to "Plan With Us" (`src/components/Navbar.tsx` links array, and the matching entry in `src/components/Footer.tsx`). Route path can stay `/bookings` — only the label and page contents change.
- Drop the existing 3-step-with-fake-payment shape and the boarding-pass summary card entirely.
- Single form, fields:
  - Full name
  - Email
  - Phone, with the same country-code dropdown (`COUNTRY_CODES` from `trips.ts`) used on `/trips/$slug`
  - Which category interests them — radio/select over the 4 `CATEGORIES` titles, plus a "Not sure yet" option
  - Rough travel dates (a loose text/date field, not a strict range — they may not have exact dates)
  - Traveler count (simple number, no age-band breakdown — no price to calculate at this stage)
  - Budget band (Budget / Mid-range / Luxury / Not sure)
  - Notes / special requests (textarea)
- Submit action: opens WhatsApp prefilled with all the above, same pattern as the "Negotiate" flow in `trips.$slug.tsx`. No fake payment, no receipt modal — those only make sense once a specific trip and price exist.
- Keep the existing FAQ section on the page as-is (still generally useful, unrelated to the booking-flow question).

### 4. Explicitly out of scope / unchanged

- `/trips/$slug` — booking form, age-band pricing, three payment modes, receipt modal: unchanged, already works as intended.
- No backend, no database, no real payment provider. Everything stays simulated/WhatsApp-handoff, consistent with the rest of the site today.
- `CONFIG.whatsapp` placeholder number: unchanged, swapped later by the user.
- Gallery, Reviews content, Footer newsletter: untouched.

## Files touched (implementation plan will detail exact edits)

- `src/routes/services.tsx` — rebuilt two-tier layout, WhatsApp-wired inquiry modal
- `src/routes/bookings.tsx` — rebuilt as concierge form
- `src/routes/index.tsx` — Hero CTA, CtaBand CTA, `FeaturedServices` card links
- `src/routes/reviews.tsx` — CtaBand CTA
- `src/components/Navbar.tsx` — nav label, primary CTA link
- `src/components/Footer.tsx` — nav label
- `src/lib/trips.ts` — no changes expected; reused as the single source of truth for categories, country codes, and WhatsApp config
