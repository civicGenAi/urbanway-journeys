import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, ArrowUpRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES } from "../lib/images";
import { Reveal, SplitHeading } from "../components/Reveal";
import { toast } from "sonner";
import type { Category } from "../lib/trips";

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
          itemListElement: SERVICES.map((s, i) => ({
            "@type": "Service",
            position: i + 1,
            name: s.title,
            description: s.blurb,
          })),
        }),
      },
    ],
  }),
  component: Services,
});

const SERVICES: {
  title: string;
  blurb: string;
  inc: string[];
  img: string;
  catalog?: Category["slug"];
}[] = [
  {
    title: "Wildlife Safari Tours",
    blurb: "Multi-day expeditions across Serengeti, Ngorongoro Crater and Tarangire, tailored to your pace.",
    inc: ["Private licensed guide", "Modern 4x4 with roof hatches", "All park fees included"],
    img: IMAGES.lion,
    catalog: "wildlife-safaris",
  },
  {
    title: "Airport Transfers",
    blurb: "Reliable pickups from Kilimanjaro (JRO), Arusha (ARK) and Zanzibar. On time, always.",
    inc: ["Flight tracking", "Meet and greet with name board", "Cold water and Wi-Fi on board"],
    img: IMAGES.fleet,
    catalog: "airport-transfers",
  },
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
    title: "Car Hire",
    blurb: "Late model Land Cruisers and Rav4s with or without a driver. Self-drive with 24/7 support.",
    inc: ["Full comprehensive insurance", "Rooftop tents on request", "Nationwide breakdown cover"],
    img: IMAGES.vehicle,
    catalog: "car-hire",
  },
  {
    title: "Day Trips & Cultural Tours",
    blurb: "Materuni waterfalls, coffee farms, Maasai bomas, Lake Duluti canoeing.",
    inc: ["Community-owned experiences", "Traditional lunch included", "Small group sizes"],
    img: IMAGES.masai,
    catalog: "day-trips",
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

function Services() {
  const [modal, setModal] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

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

      <section className="bg-[color:var(--kilimanjaro-snow)]">
        <nav className="sticky top-20 z-30 bg-[color:var(--kilimanjaro-snow)]/90 backdrop-blur-md border-b border-black/5">
          <div className="container-lodge flex gap-6 overflow-x-auto py-4 text-sm text-[color:var(--charcoal)]/70">
            {SERVICES.map((s, i) => (
              <a key={i} href={`#s-${i}`} className="whitespace-nowrap hover:text-[color:var(--trail-green)] transition-colors">
                {String(i + 1).padStart(2, "0")} · {s.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="py-24">
          {SERVICES.map((s, i) => {
            const flipped = i % 2 === 1;
            return (
              <div id={`s-${i}`} key={i} className="border-t border-black/8">
                <div className="container-lodge py-24 md:py-32 grid gap-12 md:grid-cols-12 items-center">
                  <div className={`md:col-span-6 ${flipped ? "md:order-2" : ""}`}>
                    <Reveal className="aspect-[5/4] rounded-2xl overflow-hidden img-treat" data-cursor="View">
                      <img src={s.img} alt={s.title} />
                    </Reveal>
                  </div>
                  <div className="md:col-span-6">
                    <p className="font-display text-[color:var(--trail-green)] text-lg">
                      {String(i + 1).padStart(2, "0")} <span className="text-[color:var(--charcoal)]/40">/ 09</span>
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
                        Request This Service <ArrowUpRight className="h-4 w-4" />
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
                  <p className="eyebrow">Inquiry</p>
                  <h3 className="font-display text-3xl mt-2">{modal}</h3>
                  <form
                    onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success("Asante! We will WhatsApp you within 12 hours."); }}
                    className="mt-6 space-y-4"
                  >
                    <input required placeholder="Your name" className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                    <input required type="email" placeholder="Email" className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                    <input placeholder="WhatsApp (optional)" className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)]" />
                    <textarea placeholder="Tell us what you have in mind" rows={3} className="w-full border-b border-black/15 py-3 outline-none focus:border-[color:var(--trail-green)] resize-none" />
                    <button className="btn-primary w-full justify-center mt-4" data-cursor="Book">Send inquiry</button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--trail-green)]/15 flex items-center justify-center">
                    <Check className="h-8 w-8 text-[color:var(--trail-green)]" />
                  </div>
                  <h3 className="font-display text-3xl mt-6">Asante!</h3>
                  <p className="mt-2 text-[color:var(--charcoal)]/70">We'll reach out on WhatsApp within 12 hours.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
