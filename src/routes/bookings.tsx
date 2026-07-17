import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { IMAGES } from "../lib/images";
import { SplitHeading, Reveal } from "../components/Reveal";
import { toast } from "sonner";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "Book a Safari or Transfer in Tanzania | UrbanWay Tours & Safari" },
      { name: "description", content: "Plan your Tanzania safari or transfer in three simple steps. Reach a Tanzanian host within 12 hours." },
      { property: "og:title", content: "Book a Safari or Transfer | UrbanWay" },
      { property: "og:description", content: "Three steps to your Tanzanian journey." },
      { property: "og:url", content: "/bookings" },
    ],
    links: [{ rel: "canonical", href: "/bookings" }],
  }),
  component: Bookings,
});

const SERVICES = ["Wildlife Safari", "Airport Transfer", "Day Trip", "Car Hire", "Custom Package"];
const DESTS = ["Serengeti", "Ngorongoro", "Kilimanjaro", "Tarangire", "Zanzibar", "Lake Manyara"];
const PREFS = ["Luxury lodge", "Tented camp", "Vegetarian meals", "Photography focus", "Family friendly", "Honeymoon"];

const FAQ = [
  { q: "How much deposit is required to confirm?", a: "A 30 percent deposit confirms your booking. Balance is due 14 days before arrival." },
  { q: "What is your cancellation policy?", a: "Free cancellation up to 30 days before departure. Between 30 and 14 days, deposit is retained. Under 14 days, 50 percent charge." },
  { q: "What payment methods do you accept?", a: "Bank transfer, Wise, Visa and Mastercard. Mobile money accepted for Tanzanian residents." },
  { q: "What should I pack?", a: "Neutral clothing, layers for cool mornings, a good hat, closed shoes, and a camera with extra batteries. We send a full packing list on confirmation." },
  { q: "When is the best season?", a: "June through October for the great migration in Serengeti. January to March for calving season. Kilimanjaro is best in the dry months." },
];

function Bookings() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    service: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 2,
    prefs: [] as string[],
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [done, setDone] = useState(false);

  const update = (k: string, v: any) => setData((d) => ({ ...d, [k]: v }));
  const togglePref = (p: string) =>
    setData((d) => ({ ...d, prefs: d.prefs.includes(p) ? d.prefs.filter((x) => x !== p) : [...d.prefs, p] }));

  const progress = done ? 100 : (step / 3) * 100;

  return (
    <>
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden text-white">
        <img src={IMAGES.ngorongoro} alt="Ngorongoro Crater rim at first light" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[color:var(--forest-deep)]/70" />
        <div className="relative container-lodge h-full flex flex-col justify-end pb-14 pt-32">
          <p className="eyebrow !text-white/80">Plan your journey</p>
          <SplitHeading as="h1" className="display-hero mt-3 !text-white max-w-3xl" text="Plan Your Journey in Three Steps" />
        </div>
      </section>

      <section className="bg-[color:var(--kilimanjaro-snow)] py-24 md:py-32">
        <div className="container-lodge grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {/* Road progress */}
            <div className="mb-10">
              <div className="h-1 bg-[color:var(--charcoal)]/10 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[color:var(--trail-green)]"
                />
              </div>
              <div className="mt-3 flex justify-between text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">
                <span className={step >= 1 ? "text-[color:var(--trail-green)]" : ""}>01 Trip</span>
                <span className={step >= 2 ? "text-[color:var(--trail-green)]" : ""}>02 Details</span>
                <span className={step >= 3 ? "text-[color:var(--trail-green)]" : ""}>03 You</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(23,24,26,0.06)] min-h-[520px]">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <svg className="mx-auto" width="80" height="80" viewBox="0 0 80 80">
                      <motion.circle cx="40" cy="40" r="36" fill="none" stroke="var(--trail-green)" strokeWidth="2"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
                      <motion.path d="M25 41 L36 52 L56 30" fill="none" stroke="var(--trail-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6 }} />
                    </svg>
                    <h3 className="font-display text-4xl mt-8">Asante!</h3>
                    <p className="mt-3 text-[color:var(--charcoal)]/70 max-w-md mx-auto">
                      Your request is on its way. Our team replies within 12 hours on WhatsApp, always with a human.
                    </p>
                    <button onClick={() => { setDone(false); setStep(1); }} className="btn-primary mt-8">Plan another journey</button>
                  </motion.div>
                ) : (
                  <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                    {step === 1 && (
                      <div>
                        <p className="eyebrow">Step 01</p>
                        <h3 className="font-display text-3xl mt-2">What kind of journey?</h3>
                        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                          {SERVICES.map((s) => (
                            <button
                              key={s}
                              onClick={() => update("service", s)}
                              className={`p-4 rounded-xl border text-left transition-all duration-300 ${data.service === s ? "border-[color:var(--trail-green)] bg-[color:var(--trail-green)]/8" : "border-black/10 hover:border-[color:var(--trail-green)]/50"}`}
                            >
                              <span className="font-medium">{s}</span>
                            </button>
                          ))}
                        </div>
                        <p className="eyebrow mt-10">Destination</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {DESTS.map((d) => (
                            <button
                              key={d}
                              onClick={() => update("destination", d)}
                              className={`px-4 py-2 rounded-full border text-sm transition-all ${data.destination === d ? "bg-[color:var(--forest-deep)] text-white border-[color:var(--forest-deep)]" : "border-black/15 hover:border-[color:var(--forest-deep)]"}`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <p className="eyebrow">Step 02</p>
                        <h3 className="font-display text-3xl mt-2">When and with whom?</h3>
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          <label className="block">
                            <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Start date</span>
                            <input type="date" value={data.startDate} onChange={(e) => update("startDate", e.target.value)}
                              className="mt-2 w-full border-b border-black/15 py-2 outline-none focus:border-[color:var(--trail-green)]" />
                          </label>
                          <label className="block">
                            <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">End date</span>
                            <input type="date" value={data.endDate} onChange={(e) => update("endDate", e.target.value)}
                              className="mt-2 w-full border-b border-black/15 py-2 outline-none focus:border-[color:var(--trail-green)]" />
                          </label>
                        </div>
                        <div className="mt-8">
                          <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Travelers</span>
                          <div className="mt-3 flex items-center gap-6">
                            <button onClick={() => update("travelers", Math.max(1, data.travelers - 1))} className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-[color:var(--forest-deep)] hover:text-white transition-colors"><Minus className="h-4 w-4" /></button>
                            <span className="font-display text-4xl w-10 text-center">{data.travelers}</span>
                            <button onClick={() => update("travelers", data.travelers + 1)} className="h-11 w-11 rounded-full border border-black/15 flex items-center justify-center hover:bg-[color:var(--forest-deep)] hover:text-white transition-colors"><Plus className="h-4 w-4" /></button>
                          </div>
                        </div>
                        <div className="mt-8">
                          <span className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60">Preferences</span>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {PREFS.map((p) => (
                              <button key={p} onClick={() => togglePref(p)}
                                className={`px-4 py-2 rounded-full border text-sm transition-all ${data.prefs.includes(p) ? "bg-[color:var(--trail-green)] text-white border-[color:var(--trail-green)]" : "border-black/15"}`}>
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <p className="eyebrow">Step 03</p>
                        <h3 className="font-display text-3xl mt-2">How do we reach you?</h3>
                        <div className="mt-6 space-y-4">
                          <input required placeholder="Full name" value={data.name} onChange={(e) => update("name", e.target.value)}
                            className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                          <input required type="email" placeholder="Email" value={data.email} onChange={(e) => update("email", e.target.value)}
                            className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                          <input placeholder="WhatsApp number" value={data.phone} onChange={(e) => update("phone", e.target.value)}
                            className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                          <textarea placeholder="Anything we should know?" rows={3} value={data.notes} onChange={(e) => update("notes", e.target.value)}
                            className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)] resize-none" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {!done && (
                <div className="mt-10 flex justify-between">
                  <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}
                    className="inline-flex items-center gap-2 text-sm font-medium disabled:opacity-30">
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  {step < 3 ? (
                    <button onClick={() => setStep(step + 1)} className="btn-primary" data-cursor="Book">
                      Continue <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setDone(true); toast.success("Karibu! Your request is on its way."); }}
                      className="btn-primary"
                      data-cursor="Book"
                    >
                      Send request <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary boarding pass */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <div className="relative bg-[color:var(--forest-deep)] text-white rounded-2xl p-8 overflow-hidden">
                <p className="eyebrow !text-[color:var(--trail-green)]">Journey summary</p>
                <div className="mt-4 space-y-4 text-sm">
                  <Row label="Service" value={data.service || "—"} />
                  <Row label="Destination" value={data.destination || "—"} />
                  <Row label="Dates" value={data.startDate && data.endDate ? `${data.startDate} → ${data.endDate}` : "—"} />
                  <Row label="Travelers" value={String(data.travelers)} />
                  <Row label="Preferences" value={data.prefs.length ? data.prefs.join(", ") : "—"} />
                </div>
                {/* perforation */}
                <div className="my-6 flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-[color:var(--kilimanjaro-snow)] -ml-10" />
                  <div className="flex-1 border-t border-dashed border-white/25" />
                  <div className="h-4 w-4 rounded-full bg-[color:var(--kilimanjaro-snow)] -mr-10" />
                </div>
                <p className="font-display italic text-white/85">Karibu Tanzania.</p>
                <svg className="absolute right-4 bottom-4 opacity-30" width="80" height="40" viewBox="0 0 80 40">
                  <path d="M0 30 C 20 10, 40 40, 60 20 S 80 30, 80 30" stroke="var(--trail-green)" strokeWidth="1.5" fill="none" />
                </svg>
              </div>

              <a href="#" className="mt-4 flex items-center gap-3 bg-[color:var(--trail-green)] text-white p-5 rounded-2xl hover:bg-[color:var(--forest-deep)] transition-colors">
                <MessageCircle className="h-5 w-5" />
                <div className="text-sm">
                  <p className="font-semibold">Prefer WhatsApp?</p>
                  <p className="opacity-85">+255 000 000 000</p>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/50 uppercase tracking-widest text-xs">{label}</span>
      <span className="text-right">{value}</span>
    </div>
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
