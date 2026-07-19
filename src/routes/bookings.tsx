import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, MessageCircle, Check } from "lucide-react";
import { IMAGES } from "../lib/images";
import { SplitHeading, Reveal, CyclingHeadline } from "../components/Reveal";
import { toast } from "sonner";
import { CATEGORIES, COUNTRY_CODES, buildWhatsAppUrl } from "../lib/trips";

const PLAN_HEADLINES = [
  "Let's Plan It Together",
  "Tell Us What You Have in Mind",
  "Your Trip, Your Way",
  "We'll Handle the Rest",
];

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
      <section className="relative h-[62vh] min-h-[500px] overflow-hidden text-white">
        <img src={IMAGES.ngorongoro} alt="Ngorongoro Crater rim at first light" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--forest-deep)]/85 via-[color:var(--forest-deep)]/35 to-[color:var(--forest-deep)]/10" />
        <div className="relative container-lodge h-full flex flex-col justify-end pb-14 pt-32">
          <p className="eyebrow !text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">Not sure where to start?</p>
          <CyclingHeadline
            phrases={PLAN_HEADLINES}
            className="mt-3 !text-white font-display font-medium leading-[1.05] max-w-3xl text-[clamp(2.2rem,4.8vw,4.25rem)] [text-shadow:0_4px_30px_rgba(0,0,0,0.45)]"
          />
          <Reveal delay={0.3} className="mt-4 max-w-xl text-white/85 text-lg">
            Already know which trip you want?{" "}
            <Link to="/services" className="underline underline-offset-4 hover:text-white">
              Browse the catalog
            </Link>{" "}
            instead. Otherwise, tell us what you have in mind below.
          </Reveal>
        </div>
      </section>

      <section className="bg-[color:var(--kilimanjaro-snow)] py-14 md:py-32">
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

      <section className="bg-[color:var(--savanna-sand)] py-16 md:py-36">
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
