import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  Clock,
  Download,
  MapPin,
  Minus,
  Plus,
  X,
  MessageCircle,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Reveal, SplitHeading } from "../components/Reveal";
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

export const Route = createFileRoute("/trips/$slug")({
  head: ({ params }) => {
    const trip = findTrip(params.slug);
    if (!trip) return { meta: [{ title: "Trip not found | UrbanWay" }] };
    return {
      meta: [
        {
          title: `${trip.title} | UrbanWay Tours & Safari`,
        },
        { name: "description", content: trip.shortDesc },
        { property: "og:title", content: trip.title },
        { property: "og:description", content: trip.shortDesc },
        { property: "og:image", content: trip.images[0] },
        { name: "twitter:image", content: trip.images[0] },
      ],
      links: [{ rel: "canonical", href: `/trips/${params.slug}` }],
    };
  },
  loader: ({ params }) => {
    const trip = findTrip(params.slug);
    if (!trip) throw notFound();
    const category = findCategory(trip.category)!;
    return { trip, category };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-24 container-lodge text-center">
      <div>
        <p className="eyebrow">Not found</p>
        <h1 className="display-section mt-3">This trip doesn't exist</h1>
        <Link to="/services" className="btn-primary mt-8 inline-flex">
          Browse services
        </Link>
      </div>
    </div>
  ),
  component: TripPage,
});

type Counts = Record<AgeBand, number>;

function AccordionStep({
  n,
  title,
  isOpen,
  isComplete,
  summary,
  children,
}: {
  n: number;
  title: string;
  isOpen: boolean;
  isComplete: boolean;
  summary?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="w-full flex items-center gap-4 p-6 sm:p-8 text-left">
        <span
          className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center font-display text-sm border transition-colors duration-300 ${
            isOpen
              ? "bg-[color:var(--trail-green)] border-[color:var(--trail-green)] text-white"
              : isComplete
                ? "bg-[color:var(--trail-green)]/15 border-[color:var(--trail-green)]/40 text-[color:var(--trail-green)]"
                : "border-white/25 text-white/60"
          }`}
        >
          {isComplete && !isOpen ? <Check className="h-4 w-4" /> : n}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-white/60">Step {n} of 4</p>
          <p className="font-display text-xl text-white">{title}</p>
          {!isOpen && summary && (
            <p className="text-sm text-white/50 truncate mt-0.5">{summary}</p>
          )}
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="px-6 sm:px-8 pb-8">{children}</div>
      </motion.div>
    </div>
  );
}

function TripPage() {
  const { trip, category } = Route.useLoaderData();
  const [activeImg, setActiveImg] = useState(0);
  const [confirmation, setConfirmation] = useState<null | {
    ref: string;
    name: string;
    total: number;
    paid: number;
    mode: "full" | "half" | "negotiate";
    email: string;
    phone: string;
    rows: { label: string; qty: number; lineTotal: number }[];
  }>(null);

  return (
    <>
      <section className="pt-28 pb-6 bg-[color:var(--kilimanjaro-snow)]">
        <div className="container-lodge">
          <Link
            to="/services/$category"
            params={{ category: category.slug }}
            className="inline-flex items-center gap-2 text-sm text-[color:var(--charcoal)]/60 hover:text-[color:var(--forest-deep)]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {category.title}
          </Link>
        </div>
      </section>

      <section className="bg-[color:var(--kilimanjaro-snow)]">
        <div className="container-lodge grid gap-10 lg:grid-cols-12 pt-6 pb-16">
          <div className="lg:col-span-7">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden img-treat">
              <motion.img
                key={activeImg}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                src={trip.images[activeImg]}
                alt={trip.title}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {trip.images.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-[4/3] rounded-xl overflow-hidden transition-all duration-500 ${
                    activeImg === i
                      ? "ring-2 ring-[color:var(--trail-green)] ring-offset-2 ring-offset-[color:var(--kilimanjaro-snow)]"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Image ${i + 1}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="eyebrow">{category.title}</p>
            <SplitHeading
              as="h1"
              className="display-section mt-3"
              text={trip.title}
            />
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[color:var(--charcoal)]/70">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--trail-green)]" />
                {trip.location}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[color:var(--trail-green)]" />
                {trip.duration}
              </span>
            </div>
            <Reveal
              delay={0.2}
              className="mt-6 text-lg text-[color:var(--charcoal)]/80 leading-relaxed"
            >
              {trip.longDesc}
            </Reveal>

            <div className="mt-8 p-6 rounded-2xl bg-white shadow-[0_20px_60px_rgba(23,24,26,0.06)]">
              <p className="eyebrow">Starting from</p>
              <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-4xl">
                  {formatUsd(trip.pricePerPerson)}
                </span>
                <span className="text-[color:var(--charcoal)]/60">
                  per adult
                </span>
              </div>
              <p className="text-sm text-[color:var(--charcoal)]/60 mt-1">
                {formatTzs(trip.pricePerPerson)}
              </p>
              {trip.priceNote && (
                <p className="mt-3 text-xs text-[color:var(--charcoal)]/60">
                  {trip.priceNote}
                </p>
              )}
              <a
                href="#book"
                className="btn-primary mt-6 w-full justify-center"
                data-cursor="Book"
              >
                Book this trip <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-24">
        <div className="container-lodge grid gap-16 md:grid-cols-3">
          <div>
            <p className="eyebrow">Activities</p>
            <h2 className="font-display text-3xl mt-3">What you'll do</h2>
            <ul className="mt-6 space-y-3">
              {trip.activities.map((a: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--trail-green)] shrink-0" />
                  <span className="text-[color:var(--charcoal)]/80">{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Included</p>
            <h2 className="font-display text-3xl mt-3">In the price</h2>
            <ul className="mt-6 space-y-3">
              {trip.included.map((a: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[color:var(--charcoal)]/80"
                >
                  <Check className="h-4 w-4 mt-1 text-[color:var(--trail-green)] shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow !text-[color:var(--charcoal)]/50">
              Not included
            </p>
            <h2 className="font-display text-3xl mt-3">You'll cover</h2>
            <ul className="mt-6 space-y-3">
              {trip.notIncluded.map((a: string, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[color:var(--charcoal)]/70"
                >
                  <X className="h-4 w-4 mt-1 text-[color:var(--charcoal)]/40 shrink-0" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="book"
        className="bg-[color:var(--forest-deep)] text-white py-14 md:py-32"
      >
        <div className="container-lodge">
          <div className="max-w-2xl">
            <p className="eyebrow !text-[color:var(--trail-green)]">
              Reserve your spot
            </p>
            <SplitHeading
              className="display-section mt-3 !text-white"
              text="Tell us who's coming, we'll do the rest"
            />
            <p className="mt-6 text-white/80 max-w-lg">
              Fill in your details, choose a payment mode, and we'll follow up
              on WhatsApp within 12 hours to confirm your booking.
            </p>
          </div>

          <div className="mt-14">
            <BookingForm
              tripSlug={trip.slug}
              tripTitle={trip.title}
              pricePerPerson={trip.pricePerPerson}
              onConfirmed={(c) => setConfirmation(c)}
            />
          </div>
        </div>
      </section>

      <AnimatePresence>
        {confirmation && (
          <Receipt
            data={confirmation}
            trip={trip}
            onClose={() => setConfirmation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
   Booking Form
   ============================================================ */
function BookingForm({
  tripSlug,
  tripTitle,
  pricePerPerson,
  onConfirmed,
}: {
  tripSlug: string;
  tripTitle: string;
  pricePerPerson: number;
  onConfirmed: (c: {
    ref: string;
    name: string;
    total: number;
    paid: number;
    mode: "full" | "half" | "negotiate";
    email: string;
    phone: string;
    rows: { label: string; qty: number; lineTotal: number }[];
  }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+255");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [counts, setCounts] = useState<Counts>({
    adult: 2,
    youth: 0,
    child: 0,
    infant: 0,
  });
  const [special, setSpecial] = useState("");
  const [mode, setMode] = useState<"full" | "half" | "negotiate">("full");
  const [submitting, setSubmitting] = useState(false);
  const [openStep, setOpenStep] = useState(1);

  const totals = useMemo(() => {
    const per = pricePerPerson;
    const rows = AGE_BANDS.map((b) => ({
      band: b,
      qty: counts[b.id],
      lineTotal: counts[b.id] * per * b.multiplier,
    }));
    const total = rows.reduce((s, r) => s + r.lineTotal, 0);
    const payable =
      mode === "full" ? total : mode === "half" ? total / 2 : 0;
    return { rows, total, payable };
  }, [counts, pricePerPerson, mode]);

  const totalGuests =
    counts.adult + counts.youth + counts.child + counts.infant;

  const PAYMENT_OPTIONS = [
    {
      id: "full" as const,
      title: "Pay in full",
      desc: "Settle 100% now. Full receipt and SMS confirmation.",
      badge: formatUsd(totals.total),
    },
    {
      id: "half" as const,
      title: "Pay 50% deposit",
      desc: "Half now, balance on the day. Spot is confirmed.",
      badge: formatUsd(totals.total / 2),
    },
    {
      id: "negotiate" as const,
      title: "Negotiate",
      desc: "Chat with us on WhatsApp to arrange group rates or a custom plan.",
      badge: "WhatsApp",
    },
  ];

  function updateCount(band: AgeBand, delta: number) {
    setCounts((c) => ({ ...c, [band]: Math.max(0, c[band] + delta) }));
  }

  function goNext(step: number) {
    if (step === 1 && !(name.trim() && email.trim() && phone.trim())) {
      toast.error("Please fill in your name, email and phone first.");
      return;
    }
    setOpenStep(step + 1);
  }

  function goBack(step: number) {
    setOpenStep(step - 1);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (totalGuests === 0) {
      toast.error("Please add at least one traveler.");
      return;
    }
    if (totals.total === 0 && mode !== "negotiate") {
      toast.error("Infants only. Please use Negotiate to arrange details.");
      return;
    }

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

    setSubmitting(true);
    setTimeout(() => {
      const ref =
        "UW-" +
        tripSlug.slice(0, 4).toUpperCase() +
        "-" +
        Math.floor(100000 + Math.random() * 899999);
      onConfirmed({
        ref,
        name,
        total: totals.total,
        paid: totals.payable,
        mode,
        email,
        phone: `${countryCode} ${phone}`,
        rows: totals.rows
          .filter((r) => r.qty > 0)
          .map((r) => ({ label: r.band.label, qty: r.qty, lineTotal: r.lineTotal })),
      });
      toast.success(
        `Payment simulated. Receipt sent to ${email} and SMS to ${countryCode} ${phone}.`,
      );
      setSubmitting(false);
    }, 1400);
  }

  return (
    <form onSubmit={submit} className="max-w-2xl">
      <div className="bg-white/5 rounded-2xl border border-white/10 divide-y divide-white/10 overflow-hidden">
        <AccordionStep
          n={1}
          title="Your details"
          isOpen={openStep === 1}
          isComplete={Boolean(name.trim() && email.trim() && phone.trim())}
          summary={name && email ? `${name} · ${email}` : undefined}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-white/60">
                Full name
              </span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-2 w-full bg-transparent border-b border-white/25 py-3 outline-none text-white placeholder:text-white/30 focus:border-[color:var(--trail-green)]"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-white/60">
                Email
              </span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full bg-transparent border-b border-white/25 py-3 outline-none text-white placeholder:text-white/30 focus:border-[color:var(--trail-green)]"
              />
            </label>
            <div className="sm:col-span-2">
              <span className="text-xs uppercase tracking-widest text-white/60">
                Phone number
              </span>
              <div className="mt-2 flex gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent border-b border-white/25 py-3 outline-none text-white focus:border-[color:var(--trail-green)] max-w-[9rem]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option
                      key={c.code + c.label}
                      value={c.code}
                      className="bg-[color:var(--forest-deep)]"
                    >
                      {c.flag} {c.code} {c.label}
                    </option>
                  ))}
                </select>
                <input
                  required
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/[^0-9 ]/g, ""))
                  }
                  placeholder="712 345 678"
                  inputMode="tel"
                  className="flex-1 bg-transparent border-b border-white/25 py-3 outline-none text-white placeholder:text-white/30 focus:border-[color:var(--trail-green)]"
                />
              </div>
            </div>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-widest text-white/60">
                Preferred start date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full bg-transparent border-b border-white/25 py-3 outline-none text-white focus:border-[color:var(--trail-green)]"
              />
            </label>
          </div>
          <div className="mt-8 flex items-center justify-end">
            <button type="button" onClick={() => goNext(1)} className="btn-primary py-3 px-6 text-sm">
              Next <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </AccordionStep>

        <AccordionStep
          n={2}
          title="Travelers & age groups"
          isOpen={openStep === 2}
          isComplete={openStep > 2}
          summary={totalGuests > 0 ? `${totalGuests} traveler${totalGuests > 1 ? "s" : ""}` : undefined}
        >
          <p className="text-sm text-white/60 mb-6">
            Price adjusts automatically per age group.
          </p>
          <div className="space-y-4">
            {AGE_BANDS.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-4 py-3 border-b border-white/10 last:border-0"
              >
                <div>
                  <p className="font-display text-xl text-white">{b.label}</p>
                  <p className="text-xs text-white/55">
                    {b.range} ·{" "}
                    {b.multiplier === 0
                      ? "Free"
                      : `${Math.round(b.multiplier * 100)}% of adult price`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateCount(b.id, -1)}
                    aria-label={`Remove ${b.label}`}
                    className="h-9 w-9 rounded-full border border-white/25 flex items-center justify-center hover:border-white/60 disabled:opacity-30"
                    disabled={counts[b.id] === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-display text-xl">
                    {counts[b.id]}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCount(b.id, 1)}
                    aria-label={`Add ${b.label}`}
                    className="h-9 w-9 rounded-full border border-white/25 flex items-center justify-center hover:border-[color:var(--trail-green)] hover:text-[color:var(--trail-green)]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => goBack(2)} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button type="button" onClick={() => goNext(2)} className="btn-primary py-3 px-6 text-sm">
              Next <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </AccordionStep>

        <AccordionStep
          n={3}
          title="Anything special"
          isOpen={openStep === 3}
          isComplete={openStep > 3}
          summary={special ? special.slice(0, 50) + (special.length > 50 ? "…" : "") : "No special requests"}
        >
          <textarea
            value={special}
            onChange={(e) => setSpecial(e.target.value)}
            placeholder="Dietary needs, accessibility, celebrations, photography focus, pickup location, or anything else."
            rows={4}
            maxLength={500}
            className="w-full bg-transparent border-b border-white/25 py-3 outline-none text-white placeholder:text-white/30 focus:border-[color:var(--trail-green)] resize-none"
          />
          <p className="text-xs text-white/40 mt-2">
            {special.length}/500
          </p>
          <div className="mt-8 flex items-center justify-between">
            <button type="button" onClick={() => goBack(3)} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            <button type="button" onClick={() => goNext(3)} className="btn-primary py-3 px-6 text-sm">
              Next <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </AccordionStep>

        <AccordionStep
          n={4}
          title="Payment mode"
          isOpen={openStep === 4}
          isComplete={false}
          summary={PAYMENT_OPTIONS.find((o) => o.id === mode)?.title}
        >
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {PAYMENT_OPTIONS.map((opt) => {
              const active = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className={`text-center sm:text-left p-3 sm:p-5 rounded-xl border transition-all duration-500 ${
                    active
                      ? "bg-[color:var(--trail-green)] border-[color:var(--trail-green)] text-white"
                      : "border-white/15 text-white/85 hover:border-white/40"
                  }`}
                >
                  <p className="font-display text-sm sm:text-xl leading-tight">{opt.title}</p>
                  <p
                    className={`mt-1 sm:mt-4 text-[10px] sm:text-xs uppercase tracking-widest ${active ? "text-white" : "text-white/60"}`}
                  >
                    {opt.badge}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-white/60">
            {PAYMENT_OPTIONS.find((o) => o.id === mode)?.desc}
          </p>
          <div className="mt-8">
            <button type="button" onClick={() => goBack(4)} className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </AccordionStep>

        {/* Summary + submit, part of the same card */}
        <div className="bg-[color:var(--kilimanjaro-snow)] text-[color:var(--charcoal)] p-6 sm:p-8">
          <p className="eyebrow">Booking summary</p>
          <h3 className="font-display text-2xl mt-2">{tripTitle}</h3>

          <div className="mt-6 space-y-2 text-sm">
            {totals.rows
              .filter((r) => r.qty > 0)
              .map((r) => (
                <div key={r.band.id} className="flex justify-between">
                  <span>
                    {r.qty} × {r.band.label}{" "}
                    <span className="text-[color:var(--charcoal)]/50">
                      ({Math.round(r.band.multiplier * 100)}%)
                    </span>
                  </span>
                  <span>{formatUsd(r.lineTotal)}</span>
                </div>
              ))}
            {totalGuests === 0 && (
              <p className="text-[color:var(--charcoal)]/60">
                Add travelers above to see the price.
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-black/10">
            <div className="flex justify-between font-display text-2xl">
              <span>Total</span>
              <span>{formatUsd(totals.total)}</span>
            </div>
            <p className="text-xs text-[color:var(--charcoal)]/55 text-right">
              {formatTzs(totals.total)}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-dashed border-black/15">
            <p className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/55">
              Payable now ({mode})
            </p>
            <p className="font-display text-3xl mt-1">
              {mode === "negotiate" ? "To be agreed" : formatUsd(totals.payable)}
            </p>
            {mode !== "negotiate" && (
              <p className="text-xs text-[color:var(--charcoal)]/55">
                {formatTzs(totals.payable)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full justify-center mt-6"
            data-cursor="Book"
          >
            {submitting
              ? "Processing..."
              : mode === "negotiate"
                ? "Open WhatsApp"
                : mode === "half"
                  ? "Pay 50% & confirm"
                  : "Pay in full & confirm"}
            {!submitting && (
              mode === "negotiate" ? (
                <MessageCircle className="h-4 w-4" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )
            )}
          </button>

          <p className="mt-4 flex items-center gap-2 text-xs text-[color:var(--charcoal)]/55">
            <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--trail-green)]" />
            Simulated checkout. Real payments will be wired to a secure
            provider.
          </p>
        </div>
      </div>
    </form>
  );
}

/* ============================================================
   Receipt Modal
   ============================================================ */
function Receipt({
  data,
  trip,
  onClose,
}: {
  data: {
    ref: string;
    name: string;
    total: number;
    paid: number;
    mode: "full" | "half" | "negotiate";
    email: string;
    phone: string;
    rows: { label: string; qty: number; lineTotal: number }[];
  };
  trip: { title: string; location: string; duration: string };
  onClose: () => void;
}) {
  const balance = data.total - data.paid;
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const { downloadReceiptPdf } = await import("../lib/receiptPdf");
      await downloadReceiptPdf({ ...data, trip });
    } catch {
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] bg-[color:var(--charcoal)]/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-lg w-full rounded-2xl overflow-hidden relative"
      >
        <button
          onClick={onClose}
          aria-label="Close receipt"
          className="absolute top-5 right-5 p-2 z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-[color:var(--forest-deep)] text-white p-8">
          <div className="flex items-center justify-between">
            <img src="/logo-mark.png" alt="UrbanWay Tours & Safari" className="h-11 w-auto" />
            <span className="text-xs uppercase tracking-widest text-white/60">
              Receipt
            </span>
          </div>
          <div className="mt-8 h-14 w-14 rounded-full bg-[color:var(--trail-green)] flex items-center justify-center">
            <Check className="h-7 w-7 text-white" />
          </div>
          <h3 className="font-display text-3xl mt-4">Asante sana!</h3>
          <p className="text-white/70 mt-1">
            Your booking is confirmed. We'll be in touch within 12 hours.
          </p>
        </div>

        <div className="p-8">
          <div className="text-sm text-[color:var(--charcoal)]/60">
            Reference
          </div>
          <div className="font-mono text-lg">{data.ref}</div>

          <div className="mt-6 space-y-3 text-sm">
            <Row label="Trip" value={trip.title} />
            <Row label="Location" value={trip.location} />
            <Row label="Duration" value={trip.duration} />
            <Row
              label="Payment"
              value={data.mode === "full" ? "Paid in full" : "50% deposit"}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-dashed border-black/15 space-y-2">
            <div className="flex justify-between">
              <span className="text-[color:var(--charcoal)]/60">
                Trip total
              </span>
              <span>{formatUsd(data.total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:var(--charcoal)]/60">Paid now</span>
              <span className="text-[color:var(--trail-green)] font-semibold">
                {formatUsd(data.paid)}
              </span>
            </div>
            {balance > 0 && (
              <div className="flex justify-between">
                <span className="text-[color:var(--charcoal)]/60">
                  Balance on the day
                </span>
                <span>{formatUsd(balance)}</span>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-2 text-xs text-[color:var(--charcoal)]/70">
            <p className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[color:var(--trail-green)]" />
              Receipt emailed to {data.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[color:var(--trail-green)]" />
              SMS confirmation sent to {data.phone}
            </p>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full border border-black/15 text-[color:var(--charcoal)] font-semibold text-sm hover:bg-black/5 transition-colors mt-8 disabled:opacity-50"
          >
            {downloading ? "Preparing PDF..." : "Download PDF Receipt"}
            {!downloading && <Download className="h-4 w-4" />}
          </button>

          <button
            onClick={onClose}
            className="btn-primary w-full justify-center mt-3"
          >
            Karibu Tanzania
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[color:var(--charcoal)]/60">{label}</span>
      <span className="text-[color:var(--charcoal)] text-right">{value}</span>
    </div>
  );
}
