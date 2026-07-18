# Services / Catalog / Booking Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconnect the trip catalog (`/services/$category`, `/trips/$slug`) to the rest of the site so every path a visitor actually takes — nav, hero, CTAs, the services page — leads into it, and repurpose `/bookings` into a distinct "undecided visitor" concierge instead of a shallow duplicate of the real per-trip checkout.

**Architecture:** No new routes or data model. `src/lib/trips.ts` (`CATEGORIES`, `TRIPS`, `COUNTRY_CODES`, `CONFIG`) is already the single source of truth and stays that way; this plan extracts one shared WhatsApp-link helper into it and wires three existing pages (`services.tsx`, `bookings.tsx`) and five CTA locations to use the catalog consistently.

**Tech Stack:** TanStack Start (file-based router, typed `Link`/params), React 19, Tailwind v4 (`@utility` classes in `src/styles.css`), Framer Motion, `sonner` for toasts. No test runner is configured in this project (`package.json` has no `test` script, no `vitest`/`jest`, no `*.test.*` files anywhere) — verification below uses `bun run lint`, `bun run build` (Vite + full TypeScript check, which matters a lot here because TanStack Router's `Link`/`params` are strictly typed), and a manual dev-server browser pass instead of unit tests.

**Important context for whoever executes this:** partway through design, `src/routes/index.tsx` and `src/routes/services.tsx` turned out to already contain more progress than expected (the Home "What we do" cards already deep-link to `/services/$category`, and `services.tsx` already conditionally links 4 of its 9 cards into the catalog). This plan was written against the **current, verified-by-reading state of every file** as of 2026-07-18, not against the original design spec's assumptions. Don't assume anything is "already done" beyond what each task below explicitly says to check — re-read the target file before editing if in doubt.

---

### Task 1: Shared WhatsApp-link helper in `src/lib/trips.ts`

Three places will need to build a `wa.me` link from free text after this plan (the existing "Negotiate" flow, the new services quote modal, the new bookings concierge form). Extract one helper now instead of copying the URL-building logic three times. This also fixes a latent bug in the existing code: it manually inserts `%0A` for newlines but never encodes the rest of the message (quotes, `&`, `#`, etc. would corrupt the URL).

**Files:**
- Modify: `src/lib/trips.ts`
- Modify: `src/routes/trips.$slug.tsx:346-357`

- [ ] **Step 1: Add `buildWhatsAppUrl` to `src/lib/trips.ts`**

Add this function at the end of the file, after `formatTzs` (currently the last export, ending around line 606):

```ts
export function buildWhatsAppUrl(message: string): string {
  const digits = CONFIG.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
```

- [ ] **Step 2: Refactor the existing negotiate flow to use it**

In `src/routes/trips.$slug.tsx`, the import block currently reads (around line 20-29):

```ts
import {
  AGE_BANDS,
  type AgeBand,
  CONFIG,
  COUNTRY_CODES,
  findTrip,
  findCategory,
  formatUsd,
  formatTzs,
} from "../lib/trips";
```

Change it to add `buildWhatsAppUrl` and drop `CONFIG` (it becomes unused once the URL-building moves into the helper):

```ts
import {
  AGE_BANDS,
  type AgeBand,
  COUNTRY_CODES,
  buildWhatsAppUrl,
  findTrip,
  findCategory,
  formatUsd,
  formatTzs,
} from "../lib/trips";
```

Then find this block (currently around line 346-357):

```ts
    if (mode === "negotiate") {
      const msg =
        `Hello UrbanWay! I'd like to negotiate a booking for "${tripTitle}".%0A` +
        `Guests: ${counts.adult} adult, ${counts.youth} youth, ${counts.child} child, ${counts.infant} infant.%0A` +
        (date ? `Preferred date: ${date}.%0A` : "") +
        (special ? `Notes: ${special.slice(0, 200)}%0A` : "") +
        `My name is ${name || "(please ask)"}, email ${email || "(please ask)"}.`;
      const wa = CONFIG.whatsapp.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${wa}?text=${msg}`, "_blank", "noopener");
      toast.success("Opening WhatsApp to negotiate. Karibu!");
      return;
    }
```

Replace it with:

```ts
    if (mode === "negotiate") {
      const msg =
        `Hello UrbanWay! I'd like to negotiate a booking for "${tripTitle}".\n` +
        `Guests: ${counts.adult} adult, ${counts.youth} youth, ${counts.child} child, ${counts.infant} infant.\n` +
        (date ? `Preferred date: ${date}.\n` : "") +
        (special ? `Notes: ${special.slice(0, 200)}\n` : "") +
        `My name is ${name || "(please ask)"}, email ${email || "(please ask)"}.`;
      window.open(buildWhatsAppUrl(msg), "_blank", "noopener");
      toast.success("Opening WhatsApp to negotiate. Karibu!");
      return;
    }
```

- [ ] **Step 3: Verify**

Run: `bun run lint`
Expected: no errors, no `CONFIG is unused` / `CONFIG is not defined` warnings.

- [ ] **Step 4: Commit**

```bash
git add src/lib/trips.ts src/routes/trips.$slug.tsx
git commit -m "$(cat <<'EOF'
Extract shared buildWhatsAppUrl helper, fix unencoded message bug

The negotiate flow only encoded newlines (%0A) and left everything
else raw, which could corrupt the wa.me URL for names/notes containing
quotes, &, or #. Centralizing this now because two more call sites
(services quote modal, bookings concierge) are about to need it too.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Rebuild `src/routes/services.tsx` into a two-tier layout

**Current state (verified 2026-07-18):** the file already has a `catalog?: Category["slug"]` field on 4 of its 9 `SERVICES` entries and already conditionally renders a real `Link` to `/services/$category` for those 4 — that part does not need to be redone. What's still wrong: all 9 cards render in one interleaved alternating list (no visual separation between "browse the catalog" and "request a quote"), the 4 catalog cards duplicate title/image/blurb that already lives in `CATEGORIES` (drift risk), and the quote-only inquiry modal (the other 5 cards) still fakes success locally instead of actually sending anything.

**Files:**
- Modify: `src/routes/services.tsx` (full rewrite)

- [ ] **Step 1: Replace the full contents of `src/routes/services.tsx`**

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, ArrowUpRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "../lib/images";
import { Reveal, SplitHeading } from "../components/Reveal";
import { toast } from "sonner";
import { CATEGORIES, tripsInCategory, formatUsd, buildWhatsAppUrl } from "../lib/trips";

const QUOTE_SERVICES: { title: string; blurb: string; inc: string[]; img: string }[] = [
  {
    title: "City Tours",
    blurb: "Half day and full day tours of Arusha, Moshi and Dar. Markets, cafes, viewpoints.",
    inc: ["Local historian guide", "Curated food stops", "Fully insured transport"],
    img: IMAGES.city,
  },
  {
    title: "Private Transfers",
    blurb: "Point to point private transfers between towns, lodges and parks anywhere in Tanzania.",
    inc: ["Door to door service", "Flexible routing", "Multi-lingual drivers"],
    img: IMAGES.road,
  },
  {
    title: "Hotel Transfers",
    blurb: "Inter-lodge transfers on safari routes, coordinated with your itinerary and check-in times.",
    inc: ["Luggage handling", "Chilled refreshments", "Photo stops on request"],
    img: IMAGES.tarangire,
  },
  {
    title: "Corporate & VIP Transportation",
    blurb: "Executive transport for conferences, delegations and film crews across East Africa.",
    inc: ["Fleet coordinator", "NDA available", "Backup vehicles on standby"],
    img: IMAGES.ngorongoro,
  },
  {
    title: "Customized Travel Packages",
    blurb: "Honeymoons, family reunions, photography workshops. We build the whole journey with you.",
    inc: ["Dedicated trip designer", "Lodge and camp partnerships", "Flexible payment plans"],
    img: IMAGES.zanzibar,
  },
];

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Safari Tours, Airport Transfers & Car Hire in Tanzania | UrbanWay" },
      { name: "description", content: "Nine ways to experience Tanzania: safaris, transfers, city tours, car hire and custom packages, led by Arusha locals." },
      { property: "og:title", content: "Safari Tours & Transfers in Tanzania | UrbanWay" },
      { property: "og:description", content: "Nine services, one trusted local team. Serengeti safaris to JRO transfers." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: [
            ...CATEGORIES.map((c, i) => ({
              "@type": "Service",
              position: i + 1,
              name: c.title,
              description: c.intro,
            })),
            ...QUOTE_SERVICES.map((s, i) => ({
              "@type": "Service",
              position: CATEGORIES.length + i + 1,
              name: s.title,
              description: s.blurb,
            })),
          ],
        }),
      },
    ],
  }),
  component: Services,
});

function Services() {
  const [modal, setModal] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function submitQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const whatsapp = String(form.get("whatsapp") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const msg =
      `Hello UrbanWay! I'd like a quote for "${modal}".\n` +
      `Name: ${name || "(please ask)"}\n` +
      `Email: ${email || "(please ask)"}\n` +
      (whatsapp ? `WhatsApp: ${whatsapp}\n` : "") +
      (notes ? `Notes: ${notes}` : "");
    window.open(buildWhatsAppUrl(msg), "_blank", "noopener");
    setSent(true);
    toast.success("Opening WhatsApp. Karibu!");
  }

  return (
    <>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden text-white">
        <img src={IMAGES.serengetiDawn} alt="Sunrise over the Serengeti" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[color:var(--charcoal)]/60" />
        <div className="relative container-lodge h-full flex flex-col justify-end pb-16 pt-32">
          <p className="eyebrow !text-white/80">What we offer</p>
          <SplitHeading as="h1" className="display-hero mt-4 max-w-4xl !text-white" text="Nine ways to experience Tanzania" />
        </div>
      </section>

      {/* Catalog tier: real trips, real prices */}
      <section className="bg-[color:var(--kilimanjaro-snow)] py-24 md:py-32">
        <div className="container-lodge">
          <div className="mb-14">
            <p className="eyebrow">Browse the catalog</p>
            <h2 className="display-section mt-3 max-w-2xl">Pick a starting point, see real trips and prices</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {CATEGORIES.map((c, i) => {
              const trips = tripsInCategory(c.slug);
              const cheapest = Math.min(...trips.map((t) => t.pricePerPerson));
              return (
                <Reveal
                  key={c.slug}
                  delay={i * 0.08}
                  className="group bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(23,24,26,0.06)] flex flex-col"
                >
                  <Link to="/services/$category" params={{ category: c.slug }} className="block aspect-[16/10] img-treat" data-cursor="View">
                    <img src={c.hero} alt={c.title} />
                  </Link>
                  <div className="p-8 flex flex-col flex-1">
                    <p className="eyebrow">{c.eyebrow}</p>
                    <h3 className="font-display text-3xl mt-2">
                      <Link to="/services/$category" params={{ category: c.slug }} className="link-slide">
                        {c.title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-[color:var(--charcoal)]/70 flex-1">{c.tagline}</p>
                    <div className="mt-6 pt-6 border-t border-black/8 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/50">From</p>
                        <p className="font-display text-2xl mt-1">{formatUsd(cheapest)}</p>
                      </div>
                      <Link
                        to="/services/$category"
                        params={{ category: c.slug }}
                        className="btn-primary text-sm py-3 px-5"
                        data-cursor="Book"
                      >
                        View trips & prices <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote-only tier: bespoke services with no fixed catalog */}
      <section className="bg-white">
        <div className="container-lodge pt-24 md:pt-32">
          <p className="eyebrow">Custom requests</p>
          <h2 className="display-section mt-3 max-w-2xl">More specific? We'll quote it directly</h2>
        </div>
        <nav className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-black/5 mt-14">
          <div className="container-lodge flex gap-6 overflow-x-auto py-4 text-sm text-[color:var(--charcoal)]/70">
            {QUOTE_SERVICES.map((s, i) => (
              <a key={i} href={`#q-${i}`} className="whitespace-nowrap hover:text-[color:var(--trail-green)] transition-colors">
                {String(i + 1).padStart(2, "0")} · {s.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="py-24">
          {QUOTE_SERVICES.map((s, i) => {
            const flipped = i % 2 === 1;
            return (
              <div id={`q-${i}`} key={i} className="border-t border-black/8">
                <div className="container-lodge py-24 md:py-32 grid gap-12 md:grid-cols-12 items-center">
                  <div className={`md:col-span-6 ${flipped ? "md:order-2" : ""}`}>
                    <Reveal className="aspect-[5/4] rounded-2xl overflow-hidden img-treat" data-cursor="View">
                      <img src={s.img} alt={s.title} />
                    </Reveal>
                  </div>
                  <div className="md:col-span-6">
                    <p className="font-display text-[color:var(--trail-green)] text-lg">
                      {String(i + 1).padStart(2, "0")} <span className="text-[color:var(--charcoal)]/40">/ 05</span>
                    </p>
                    <SplitHeading className="display-section mt-4" text={s.title} />
                    <Reveal delay={0.2} className="mt-5 max-w-lg text-lg text-[color:var(--charcoal)]/75 leading-relaxed">
                      {s.blurb}
                    </Reveal>
                    <ul className="mt-8 space-y-3">
                      {s.inc.map((inc, k) => (
                        <Reveal key={k} delay={0.3 + k * 0.05} className="flex items-center gap-3 text-[color:var(--charcoal)]">
                          <Leaf className="h-4 w-4 text-[color:var(--trail-green)]" />
                          <span>{inc}</span>
                        </Reveal>
                      ))}
                    </ul>
                    <Reveal delay={0.5} className="mt-10">
                      <button
                        onClick={() => { setSent(false); setModal(s.title); }}
                        className="btn-primary"
                        data-cursor="Book"
                      >
                        Get a Custom Quote <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </Reveal>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-[color:var(--savanna-sand)] py-28 md:py-36">
        <div className="container-lodge">
          <div className="text-center max-w-2xl mx-auto">
            <p className="eyebrow">Two ways to travel</p>
            <SplitHeading className="display-section mt-3" text="Private or shared, both done right" />
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              { title: "Private Safari", price: "From $280 per day", perks: ["Your own guide and vehicle", "Fully flexible schedule", "Choice of lodges or camps", "Best for families & couples"] },
              { title: "Group Safari", price: "From $180 per day", perks: ["Max 6 guests per vehicle", "Set departure dates", "Shared costs, shared stories", "Best for solo travelers"] },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.1} className={`p-10 rounded-2xl ${i === 0 ? "bg-[color:var(--forest-deep)] text-white" : "bg-white"}`}>
                <p className={`eyebrow ${i === 0 ? "!text-[color:var(--trail-green)]" : ""}`}>{i === 0 ? "Signature" : "Popular"}</p>
                <h3 className={`font-display text-4xl mt-3 ${i === 0 ? "text-white" : ""}`}>{c.title}</h3>
                <p className={`mt-2 text-lg ${i === 0 ? "text-white/70" : "text-[color:var(--charcoal)]/60"}`}>{c.price}</p>
                <ul className="mt-6 space-y-3">
                  {c.perks.map((p, k) => (
                    <li key={k} className="flex items-center gap-3">
                      <Check className={`h-4 w-4 ${i === 0 ? "text-[color:var(--trail-green)]" : "text-[color:var(--forest-deep)]"}`} />
                      <span className={i === 0 ? "text-white/85" : ""}>{p}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-[color:var(--charcoal)]/70 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-lg w-full rounded-2xl p-10 relative"
            >
              <button onClick={() => setModal(null)} className="absolute top-5 right-5 p-2" aria-label="Close"><X className="h-5 w-5" /></button>
              {!sent ? (
                <>
                  <p className="eyebrow">Custom quote</p>
                  <h3 className="font-display text-3xl mt-2">{modal}</h3>
                  <form onSubmit={submitQuote} className="mt-6 space-y-4">
                    <input required name="name" placeholder="Your name" className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                    <input required type="email" name="email" placeholder="Email" className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                    <input name="whatsapp" placeholder="WhatsApp (optional)" className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                    <textarea name="notes" placeholder="Tell us what you have in mind" rows={3} className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)] resize-none" />
                    <button className="btn-primary w-full justify-center mt-4" data-cursor="Book">Send on WhatsApp</button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--trail-green)]/15 flex items-center justify-center">
                    <Check className="h-8 w-8 text-[color:var(--trail-green)]" />
                  </div>
                  <h3 className="font-display text-3xl mt-6">Asante!</h3>
                  <p className="mt-2 text-[color:var(--charcoal)]/70">We've opened WhatsApp with your details. Send the message and we'll reply within 12 hours.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bun run lint`
Expected: no errors. In particular, no "unused import" for `X`/`Check`/`Leaf` and no missing-type errors on `submitQuote`.

- [ ] **Step 3: Commit**

```bash
git add src/routes/services.tsx
git commit -m "$(cat <<'EOF'
Split /services into a catalog tier and a quote-only tier

The 4 categories with real trip data now render as their own card
grid sourced directly from CATEGORIES (was previously duplicated as
separate hardcoded title/image/blurb fields, which could drift from
the catalog). The 5 services with no trip data get their own visually
distinct "Custom requests" section, and their inquiry modal now
actually opens WhatsApp with the visitor's details instead of just
showing a local success toast.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Rebuild `src/routes/bookings.tsx` as the "Plan With Us" concierge

Replaces the 3-step wizard + fake payment/receipt with a single form for visitors who haven't picked a specific trip. No age-band pricing (nothing to price yet), no payment mode selection (nothing to pay yet) — it hands off to WhatsApp, same pattern as the catalog's "Negotiate" option.

**Files:**
- Modify: `src/routes/bookings.tsx` (full rewrite)

- [ ] **Step 1: Replace the full contents of `src/routes/bookings.tsx`**

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, MessageCircle, Check } from "lucide-react";
import { IMAGES } from "../lib/images";
import { SplitHeading, Reveal } from "../components/Reveal";
import { toast } from "sonner";
import { CATEGORIES, COUNTRY_CODES, buildWhatsAppUrl } from "../lib/trips";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Plan With Us | UrbanWay Tours & Safari" },
      { name: "description", content: "Not sure which trip is right for you? Tell us what you have in mind and a Tanzanian host will help you plan it, no obligation." },
      { property: "og:title", content: "Plan With Us | UrbanWay" },
      { property: "og:description", content: "Tell us what you have in mind, we'll help you plan it." },
      { property: "og:url", content: "/bookings" },
    ],
    links: [{ rel: "canonical", href: "/bookings" }],
  }),
  component: PlanWithUs,
});

const BUDGETS = ["Budget", "Mid-range", "Luxury", "Not sure"];

const FAQ = [
  { q: "How much deposit is required to confirm?", a: "A 30 percent deposit confirms your booking. Balance is due 14 days before arrival." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 30 days before departure. Between 30 and 14 days, deposit is retained. Under 14 days, 50 percent charge." },
  { q: "What payment methods do you accept?", a: "Bank transfer, Wise, Visa and Mastercard. Mobile money accepted for Tanzanian residents." },
  { q: "What should I pack?", a: "Neutral clothing, layers for cool mornings, a good hat, closed shoes, and a camera with extra batteries. We send a full packing list on confirmation." },
  { q: "When is the best season?", a: "June through October for the great migration in Serengeti. January to March for calving season. Kilimanjaro is best in the dry months." },
];

function PlanWithUs() {
  return (
    <>
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden text-white">
        <img src={IMAGES.ngorongoro} alt="Ngorongoro Crater rim at first light" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[color:var(--forest-deep)]/70" />
        <div className="relative container-lodge h-full flex flex-col justify-end pb-14 pt-32">
          <p className="eyebrow !text-white/80">Not sure where to start?</p>
          <SplitHeading as="h1" className="display-hero mt-3 !text-white max-w-3xl" text="Let's Plan It Together" />
          <Reveal delay={0.3} className="mt-4 max-w-xl text-white/85 text-lg">
            Already know which trip you want?{" "}
            <Link to="/services" className="underline underline-offset-4 hover:text-white">
              Browse the catalog
            </Link>{" "}
            instead. Otherwise, tell us what you have in mind below.
          </Reveal>
        </div>
      </section>

      <section className="bg-[color:var(--kilimanjaro-snow)] py-24 md:py-32">
        <div className="container-lodge grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <PlanForm />
          </div>
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <a
                href={buildWhatsAppUrl("Hello UrbanWay! I'd like some help planning a trip to Tanzania.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[color:var(--trail-green)] text-white p-5 rounded-2xl hover:bg-[color:var(--forest-deep)] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <div className="text-sm">
                  <p className="font-semibold">Prefer to chat right away?</p>
                  <p className="opacity-85">Message us on WhatsApp</p>
                </div>
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[color:var(--savanna-sand)] py-28 md:py-36">
        <div className="container-lodge grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Good to know</p>
            <SplitHeading className="display-section mt-3" text="Questions we hear often" />
          </div>
          <div className="md:col-span-8">
            {FAQ.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>
    </>
  );
}

function PlanForm() {
  const [countryCode, setCountryCode] = useState("+255");
  const [interest, setInterest] = useState<string>("Not sure yet");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState<string>("Not sure");
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const dates = String(form.get("dates") || "").trim();
    const notes = String(form.get("notes") || "").trim();

    const msg =
      `Hello UrbanWay! I'd like help planning a trip.\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${countryCode} ${phone}\n` +
      `Interested in: ${interest}\n` +
      (dates ? `Rough dates: ${dates}\n` : "") +
      `Travelers: ${travelers}\n` +
      `Budget: ${budget}\n` +
      (notes ? `Notes: ${notes}` : "");

    window.open(buildWhatsAppUrl(msg), "_blank", "noopener");
    setSent(true);
    toast.success("Opening WhatsApp. Karibu!");
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(23,24,26,0.06)] text-center py-16"
      >
        <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--trail-green)]/15 flex items-center justify-center">
          <Check className="h-8 w-8 text-[color:var(--trail-green)]" />
        </div>
        <h3 className="font-display text-4xl mt-6">Asante!</h3>
        <p className="mt-3 text-[color:var(--charcoal)]/70 max-w-md mx-auto">
          We've opened WhatsApp with your details. Send the message and a Tanzanian host will reply within 12 hours.
        </p>
        <button onClick={() => setSent(false)} className="btn-primary mt-8">Start another request</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(23,24,26,0.06)] space-y-8">
      <div>
        <p className="eyebrow">Your details</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Full name</span>
            <input required name="name" placeholder="Jane Doe"
              className="mt-2 w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Email</span>
            <input required type="email" name="email" placeholder="you@example.com"
              className="mt-2 w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
          </label>
          <div className="sm:col-span-2">
            <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Phone number</span>
            <div className="mt-2 flex gap-3">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)] max-w-[9rem]"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code + c.label} value={c.code}>{c.flag} {c.code} {c.label}</option>
                ))}
              </select>
              <input required name="phone" placeholder="712 345 678" inputMode="tel"
                className="flex-1 border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
            </div>
          </div>
          <label className="block sm:col-span-2">
            <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Rough dates</span>
            <input name="dates" placeholder="e.g. mid-August, or flexible"
              className="mt-2 w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
          </label>
        </div>
      </div>

      <div>
        <p className="eyebrow">What interests you?</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {[...CATEGORIES.map((c) => c.title), "Not sure yet"].map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => setInterest(title)}
              className={`p-4 rounded-xl border text-left text-sm transition-all duration-300 ${interest === title ? "border-[color:var(--trail-green)] bg-[color:var(--trail-green)]/8" : "border-black/10 hover:border-[color:var(--trail-green)]/50"}`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-8">
        <div>
          <p className="eyebrow">Travelers</p>
          <div className="mt-3 flex items-center gap-6">
            <button type="button" onClick={() => setTravelers((t) => Math.max(1, t - 1))}
              className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-[color:var(--forest-deep)] hover:text-white transition-colors">
              <Minus className="h-4 w-4" />
            </button>
            <span className="font-display text-4xl w-10 text-center">{travelers}</span>
            <button type="button" onClick={() => setTravelers((t) => t + 1)}
              className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-[color:var(--forest-deep)] hover:text-white transition-colors">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div>
          <p className="eyebrow">Budget</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button key={b} type="button" onClick={() => setBudget(b)}
                className={`px-4 py-2 rounded-full border text-sm transition-all ${budget === b ? "bg-[color:var(--forest-deep)] text-white border-[color:var(--forest-deep)]" : "border-black/15 hover:border-[color:var(--forest-deep)]"}`}>
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Anything else we should know?</span>
        <textarea name="notes" rows={3} placeholder="Dietary needs, accessibility, celebrations, or anything else."
          className="mt-2 w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)] resize-none" />
      </label>

      <button type="submit" className="btn-primary w-full justify-center">
        Send on WhatsApp <MessageCircle className="h-4 w-4" />
      </button>
    </form>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal className="border-b border-black/10">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-6 text-left">
        <span className="font-display text-xl md:text-2xl pr-4">{q}</span>
        <span className={`h-8 w-8 shrink-0 rounded-full border border-black/15 flex items-center justify-center transition-transform duration-500 ${open ? "rotate-45 bg-[color:var(--trail-green)] border-transparent text-white" : ""}`}>
          <Plus className="h-4 w-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 max-w-2xl text-[color:var(--charcoal)]/75 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}
```

- [ ] **Step 2: Verify**

Run: `bun run lint`
Expected: no errors. Confirm no leftover references to the old `SERVICES`/`DESTS`/`PREFS` arrays or `ArrowRight`/`ArrowLeft` imports (they're gone in this rewrite — the 3-step wizard no longer exists).

- [ ] **Step 3: Commit**

```bash
git add src/routes/bookings.tsx
git commit -m "$(cat <<'EOF'
Turn /bookings into a "Plan With Us" concierge for undecided visitors

Replaces the 3-step wizard and fake payment/receipt flow (which
duplicated, more shallowly, what /trips/\$slug already does properly)
with a single form for visitors who haven't picked a specific trip
yet. No age-band pricing or payment mode selection here since there's
no trip/price to attach them to — it hands off to WhatsApp instead,
same pattern as the catalog's "Negotiate" option.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Repoint the remaining primary CTAs from `/bookings` to `/services`

**Verified current state:** these four are the only remaining `to="/bookings"` links in the codebase (checked via `grep -rn 'to="/bookings"' src` — the Home "What we do" cards already link to `/services/$category` and don't need touching).

**Files:**
- Modify: `src/routes/index.tsx:174`
- Modify: `src/routes/index.tsx:505`
- Modify: `src/routes/reviews.tsx:127`
- Modify: `src/components/Navbar.tsx:65`

- [ ] **Step 1: Hero "Explore Safaris" button — `src/routes/index.tsx`**

Find (around line 174):

```tsx
          <Link to="/bookings" className="btn-primary" data-cursor="Book">
            Explore Safaris <ArrowUpRight className="h-4 w-4" />
          </Link>
```

Replace with:

```tsx
          <Link to="/services" className="btn-primary" data-cursor="Book">
            Explore Safaris <ArrowUpRight className="h-4 w-4" />
          </Link>
```

- [ ] **Step 2: CtaBand "Start Planning" button — `src/routes/index.tsx`**

Find (around line 505):

```tsx
          <Link to="/bookings" className="btn-primary !bg-white !text-[color:var(--forest-deep)] hover:!bg-[color:var(--kilimanjaro-snow)]" data-cursor="Book">
            Start Planning <ArrowUpRight className="h-4 w-4" />
          </Link>
```

Replace with:

```tsx
          <Link to="/services" className="btn-primary !bg-white !text-[color:var(--forest-deep)] hover:!bg-[color:var(--kilimanjaro-snow)]" data-cursor="Book">
            Start Planning <ArrowUpRight className="h-4 w-4" />
          </Link>
```

- [ ] **Step 3: Reviews page CtaBand — `src/routes/reviews.tsx`**

Find (around line 127):

```tsx
            <Link to="/bookings" className="btn-primary !bg-white !text-[color:var(--forest-deep)]" data-cursor="Book">
              Start Planning <ArrowUpRight className="h-4 w-4" />
            </Link>
```

Replace with:

```tsx
            <Link to="/services" className="btn-primary !bg-white !text-[color:var(--forest-deep)]" data-cursor="Book">
              Start Planning <ArrowUpRight className="h-4 w-4" />
            </Link>
```

- [ ] **Step 4: Navbar primary button — `src/components/Navbar.tsx`**

Find (around line 65):

```tsx
          <Link to="/bookings" className="hidden md:inline-flex btn-primary text-sm py-3 px-5">
            Plan Your Safari <ArrowUpRight className="h-4 w-4" />
          </Link>
```

Replace with:

```tsx
          <Link to="/services" className="hidden md:inline-flex btn-primary text-sm py-3 px-5">
            Plan Your Safari <ArrowUpRight className="h-4 w-4" />
          </Link>
```

- [ ] **Step 5: Verify**

Run: `grep -rn 'to="/bookings"' src`
Expected: no output (zero remaining matches — the only way to reach `/bookings` now is the nav link and in-page "Prefer to chat" link, not a primary CTA).

- [ ] **Step 6: Commit**

```bash
git add src/routes/index.tsx src/routes/reviews.tsx src/components/Navbar.tsx
git commit -m "$(cat <<'EOF'
Repoint primary CTAs from /bookings to /services

Hero "Explore Safaris", both CtaBand "Start Planning" buttons, and
the Navbar "Plan Your Safari" button now lead into the trip catalog
instead of the old generic booking form.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Rename the "Bookings" nav label to "Plan With Us"

**Files:**
- Modify: `src/components/Navbar.tsx:6-12`
- Modify: `src/components/Footer.tsx:36-46`

- [ ] **Step 1: `src/components/Navbar.tsx`**

Find (near the top of the file):

```tsx
const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/bookings", label: "Bookings" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
];
```

Replace with:

```tsx
const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/bookings", label: "Plan With Us" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reviews", label: "Reviews" },
];
```

- [ ] **Step 2: `src/components/Footer.tsx`**

Find (inside the "Explore" column):

```tsx
            {[
              ["Home", "/"],
              ["Services", "/services"],
              ["Bookings", "/bookings"],
              ["Gallery", "/gallery"],
              ["Reviews", "/reviews"],
            ].map(([label, to]) => (
```

Replace with:

```tsx
            {[
              ["Home", "/"],
              ["Services", "/services"],
              ["Plan With Us", "/bookings"],
              ["Gallery", "/gallery"],
              ["Reviews", "/reviews"],
            ].map(([label, to]) => (
```

- [ ] **Step 3: Verify**

Run: `bun run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/components/Footer.tsx
git commit -m "$(cat <<'EOF'
Rename "Bookings" nav label to "Plan With Us"

Matches its new purpose as an undecided-visitor concierge rather than
a booking form. Route path stays /bookings.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Type-check and build**

Run: `bun run build`
Expected: build succeeds with no TypeScript errors. Pay particular attention to any error mentioning `params` or `to=` — TanStack Router's typed `Link` will fail the build (not just lint) if a `category` param value isn't one of the four literal slugs in `Category["slug"]`.

- [ ] **Step 2: Start the dev server**

Run: `bun run dev &` then poll until ready:

```bash
timeout 30 bash -c 'until curl -sf http://localhost:8080 >/dev/null 2>&1 || curl -sf http://localhost:8081 >/dev/null 2>&1; do sleep 1; done'
```

(Vite will pick 8080 or the next free port — check the terminal output for the actual `Local:` URL.)

- [ ] **Step 3: Manual click-through**

Using a headless browser (`npx playwright` or the `chromium-cli` skill if available) against the dev server, verify:

1. `/` → click a "What we do" card → lands on the matching `/services/$category` (e.g. Wildlife Safaris → `/services/wildlife-safaris`).
2. `/services` → the catalog tier shows 4 cards with a real "From $X" price on each, matching the cheapest trip in that category in `TRIPS`.
3. `/services` → scroll to the "Custom requests" tier → click "Get a Custom Quote" on any card → fill the modal → submit → confirm a new tab/window open attempt targets a `https://wa.me/255700000000?text=...` URL (window.open can be intercepted in the test script rather than actually navigating away).
4. `/services/wildlife-safaris` → click into a trip → `/trips/$slug` renders with images, activities/included/not-included, and the booking form still works exactly as before (unchanged by this plan).
5. `/bookings` → confirm the heading reads "Let's Plan It Together", fill the form, submit → confirm it also targets a `wa.me` URL with the entered details, not a fake receipt.
6. Navbar → confirm the "Plan With Us" label appears (desktop nav) and the primary button reads "Plan Your Safari" linking to `/services`.
7. Check the browser console for errors during the whole click-through (`console --errors` in `chromium-cli`, or `page.on("console", ...)` in a raw Playwright script).

- [ ] **Step 4: Stop the dev server**

```bash
pkill -f "vite dev" || true
```

No commit for this task — it's verification of Tasks 1-5, which are already committed individually.

---

## Self-review notes

- **Spec coverage:** all four numbered sections of the design spec map to tasks above — routing (Task 4), `/services` two-tier layout (Task 2), `/bookings` concierge (Task 3), and the "explicitly unchanged" list (verified, not touched by any task). The WhatsApp-encoding fix in Task 1 wasn't in the original spec; it surfaced while designing the shared helper and is small enough to fold in rather than spin out separately.
- **State drift caught mid-plan:** `services.tsx` and `index.tsx` had already moved past what the design spec assumed (see the "Important context" note at the top). Task 2 was rewritten against the verified current file rather than the spec's original description of a 9-item flat `SERVICES` array with no catalog links at all.
- **No placeholders:** every task shows complete file contents or exact find/replace blocks, no "add appropriate handling" language.
