import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowUpRight } from "lucide-react";
import { IMAGES } from "../lib/images";
import { SplitHeading, Reveal, RevealStagger, RevealChild, CyclingHeadline } from "../components/Reveal";

const REVIEW_HEADLINES = [
  "Stories Our Guests Tell",
  "Words From the Road",
  "Real Trips, Real Voices",
  "128 Journeys, One Standard",
];

const REVIEWS = [
  { name: "Anja & Peter", country: "🇩🇪", flag: "Germany", trip: "Serengeti 5-day", date: "March 2026", stars: 5, text: "The most seamless safari we've ever taken. Our guide Emmanuel knew every bird call by name, and the vehicle was spotless every morning. UrbanWay set a new benchmark." },
  { name: "Marcus Lee", country: "🇺🇸", flag: "USA", trip: "JRO airport pickup", date: "February 2026", stars: 5, text: "Picked up at JRO at midnight, greeted with cold water and a warm smile. Set the tone for the whole trip. Reliable, kind, professional." },
  { name: "Sanne", country: "🇳🇱", flag: "Netherlands", trip: "Materuni day trip", date: "January 2026", stars: 5, text: "The Materuni waterfalls day was unforgettable. Coffee roasting with the family, a real hike, and honest conversation. This is the Tanzania I hoped for." },
  { name: "James & Rita", country: "🇬🇧", flag: "UK", trip: "Ngorongoro 7-day", date: "December 2025", stars: 5, text: "Booked six months out, and every single detail matched what was promised. The crater at dawn is something I'll be telling grandchildren about." },
  { name: "Kioko", country: "🇰🇪", flag: "Kenya", trip: "Corporate transfer", date: "October 2025", stars: 5, text: "We used UrbanWay for a five-day corporate offsite. Fleet was immaculate, drivers were kind, and the trip designer answered WhatsApps at 11pm without fuss." },
  { name: "Yuki Tanaka", country: "🇯🇵", flag: "Japan", trip: "Photography safari", date: "August 2025", stars: 5, text: "As a photographer I need patience, silence, and the right angle. Frank, my guide, understood without me explaining. Every image I took, he made possible." },
  { name: "Lena", country: "🇩🇪", flag: "Germany", trip: "Kilimanjaro trek", date: "September 2025", stars: 5, text: "The pre-trek briefing alone was worth the fee. Every kilometer felt considered, safe, and celebratory. Reached Uhuru Peak thanks to their team." },
  { name: "David & Sara", country: "🇺🇸", flag: "USA", trip: "Honeymoon package", date: "June 2025", stars: 5, text: "A honeymoon custom trip through Tarangire and Zanzibar. UrbanWay handled surprises we didn't even know to ask about. Faultless." },
  { name: "Ilse", country: "🇳🇱", flag: "Netherlands", trip: "Lake Manyara day", date: "April 2025", stars: 4, text: "Great value day trip, our driver was funny and knowledgeable. Only note is I wish we had one more hour at the tree-climbing lions viewpoint." },
  { name: "Priya", country: "🇬🇧", flag: "UK", trip: "Family safari 10-day", date: "July 2025", stars: 5, text: "Traveling with kids can be stressful. UrbanWay adapted every day to the children's mood, added a pool afternoon we needed, and never made us feel demanding." },
  { name: "Tom", country: "🇺🇸", flag: "USA", trip: "Car hire", date: "November 2025", stars: 5, text: "Self-drive Land Cruiser for two weeks. Vehicle was newer than our own car at home, and their WhatsApp support answered a border question in three minutes." },
  { name: "Chihiro", country: "🇯🇵", flag: "Japan", trip: "Serengeti balloon", date: "August 2025", stars: 5, text: "Balloon at dawn over Serengeti, breakfast on the plains. UrbanWay coordinated the entire day including a birthday surprise. Karibu indeed." },
];

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "UrbanWay Tours & Safari Reviews | Rated by Travelers Worldwide" },
      { name: "description", content: "Read verified guest reviews of UrbanWay Tours & Safari. 4.9 stars across 128 journeys through Tanzania." },
      { property: "og:title", content: "UrbanWay Tours & Safari Reviews" },
      { property: "og:description", content: "Stories from travelers who chose UrbanWay." },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        name: "UrbanWay Tours & Safari",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "128",
        },
        review: REVIEWS.slice(0, 4).map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.name },
          reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 },
          reviewBody: r.text,
        })),
      }),
    }],
  }),
  component: Reviews,
});

function Reviews() {
  return (
    <>
      <section className="relative h-[58vh] min-h-[440px] overflow-hidden text-white">
        <img src={IMAGES.zebra} alt="A white lion resting in golden light" className="absolute inset-0 h-full w-full object-cover object-[center_38%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--forest-deep)]/85 via-[color:var(--forest-deep)]/35 to-[color:var(--forest-deep)]/10" />
        <div className="relative container-lodge h-full grid md:grid-cols-2 items-end pb-16 pt-32 gap-10">
          <div>
            <p className="eyebrow !text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">Reviews</p>
            <CyclingHeadline
              phrases={REVIEW_HEADLINES}
              className="mt-3 !text-white font-display font-medium leading-[1.02] text-[clamp(2.4rem,5.2vw,4.75rem)] [text-shadow:0_4px_30px_rgba(0,0,0,0.45)]"
            />
          </div>
          <div className="md:justify-self-end">
            <p className="font-display text-8xl md:text-9xl !text-white leading-none">4.9</p>
            <div className="mt-3 flex gap-1">
              {[0, 1, 2, 3, 4].map((k) => (
                <motion.span key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + k * 0.1 }}>
                  <Star className="h-6 w-6 text-[color:var(--sunrise-gold)] fill-current" />
                </motion.span>
              ))}
            </div>
            <p className="mt-2 text-white/75 text-sm">Based on 128 journeys</p>
          </div>
        </div>
      </section>

      <FeaturedCarousel />

      <section className="bg-[color:var(--savanna-sand)] py-16 md:py-36">
        <div className="container-lodge">
          <p className="eyebrow">Every voice matters</p>
          <SplitHeading className="display-section mt-3 max-w-3xl" text="Voices from twelve countries and counting" />

          <RevealStagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <RevealChild key={i} className="bg-[color:var(--kilimanjaro-snow)] rounded-2xl p-8 shadow-[0_10px_30px_rgba(23,24,26,0.05)]">
                <div className="flex gap-1 text-[color:var(--sunrise-gold)]">
                  {Array.from({ length: r.stars }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-5 text-[color:var(--charcoal)]/85 leading-relaxed">"{r.text}"</p>
                <div className="mt-6 pt-6 border-t border-black/8 flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg">{r.name} <span>{r.country}</span></p>
                    <p className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60 mt-1">{r.trip}</p>
                  </div>
                  <p className="text-xs text-[color:var(--charcoal)]/50">{r.date}</p>
                </div>
              </RevealChild>
            ))}
          </RevealStagger>
        </div>
      </section>

      <section className="py-24 bg-[color:var(--kilimanjaro-snow)]">
        <div className="container-lodge">
          <p className="eyebrow text-center">Coming to these platforms</p>
          <div className="mt-8 flex flex-wrap justify-center items-center gap-10 md:gap-16 text-[color:var(--charcoal)]/40">
            {["TripAdvisor", "SafariBookings", "Google Reviews"].map((b) => (
              <div key={b} className="font-display text-2xl md:text-3xl italic">{b}</div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative py-16 md:py-36 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--trail-green), var(--forest-deep))" }}
      >
        <div className="container-lodge relative text-center">
          <p className="eyebrow !text-white/85">Your turn</p>
          <SplitHeading className="mt-4 !text-white font-display font-medium text-[clamp(2.5rem,7vw,6rem)] leading-[0.98]" text="Write the Next Story" />
          <Reveal delay={0.3} className="mt-10">
            <Link to="/services" className="btn-primary !bg-white !text-[color:var(--forest-deep)]" data-cursor="Book">
              Start Planning <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FeaturedCarousel() {
  const [i, setI] = useState(0);
  const featured = REVIEWS.slice(0, 4);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % featured.length), 6000);
    return () => clearInterval(t);
  }, [featured.length]);

  const r = featured[i];
  return (
    <section className="py-14 md:py-32 bg-[color:var(--kilimanjaro-snow)]">
      <div className="container-lodge">
        <div className="relative bg-white rounded-2xl p-10 md:p-16 shadow-[0_20px_60px_rgba(23,24,26,0.06)] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex gap-1 text-[color:var(--sunrise-gold)]">
                {Array.from({ length: r.stars }).map((_, k) => <Star key={k} className="h-5 w-5 fill-current" />)}
              </div>
              <p className="font-display text-2xl md:text-4xl leading-snug mt-8 max-w-4xl">"{r.text}"</p>
              <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-display text-xl">{r.name} <span>{r.country}</span></p>
                  <p className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/60 mt-1">{r.trip} · {r.date}</p>
                </div>
                <div className="flex gap-2">
                  {featured.map((_, k) => (
                    <button
                      key={k}
                      onClick={() => setI(k)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? "w-10 bg-[color:var(--trail-green)]" : "w-4 bg-black/15"}`}
                      aria-label={`Review ${k + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
