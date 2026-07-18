import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowUpRight, Play, Star } from "lucide-react";
import { IMAGES } from "../lib/images";
import { Reveal, RevealStagger, RevealChild, SplitHeading } from "../components/Reveal";
import { JourneyRoad } from "../components/JourneyRoad";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UrbanWay Tours & Safari | Tanzania Safaris, Transfers & Tours from Arusha" },
      {
        name: "description",
        content:
          "Serengeti and Kilimanjaro safaris, JRO airport transfers, day trips and car hire. Licensed Tanzanian guides. Karibu.",
      },
      { property: "og:title", content: "UrbanWay Tours & Safari | Your Gateway to Tanzania" },
      { property: "og:description", content: "From Arusha to the Serengeti. Licensed guides, modern 4x4s, tailor-made journeys." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <JourneyRoad />
      <Hero />
      <Intro />
      <CityToWild />
      <FeaturedServices />
      <Marquee />
      <WhyUs />
      <TestimonialsPreview />
      <CtaBand />
    </>
  );
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const HERO_HEADLINES = [
  { text: "Your Trusted Gateway to Tanzania", italicWord: "Tanzania" },
  { text: "Handcrafted Journeys Into the Wild", italicWord: "Wild" },
  { text: "Where the City Meets Kilimanjaro", italicWord: "Kilimanjaro" },
];

function HeroHeadline() {
  const [i, setI] = useState(0);
  const [cycles, setCycles] = useState(0);
  useEffect(() => {
    if (cycles >= 3) return;
    const t = setTimeout(() => {
      setI((x) => (x + 1) % HERO_HEADLINES.length);
      setCycles((c) => c + 1);
    }, 4200);
    return () => clearTimeout(t);
  }, [cycles]);

  const h = HERO_HEADLINES[i];
  return (
    <AnimatePresence mode="wait">
      <motion.div key={i} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
        <SplitHeading
          as="h1"
          className="display-hero text-white mt-4 max-w-5xl !text-white"
          text={h.text}
          italicWord={h.italicWord}
        />
      </motion.div>
    </AnimatePresence>
  );
}

const HERO_STATS = [
  { n: 5, s: "+", label: "Years of Experience" },
  { n: 15, s: "+", label: "Destinations" },
  { n: 1200, s: "+", label: "Happy Travelers" },
  { n: 8, s: "", label: "Safari Vehicles" },
];

function HeroStatCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HERO_STATS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const s = HERO_STATS[i];
  return (
    <div className="md:hidden">
      <div className="relative h-16 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <p className="font-display text-3xl text-white">
              <Counter to={s.n} suffix={s.s} />
            </p>
            <p className="text-xs uppercase tracking-widest text-white/60 mt-1">{s.label}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex gap-1.5">
        {HERO_STATS.map((_, k) => (
          <span
            key={k}
            className={`h-1 rounded-full transition-all duration-700 ${
              k === i ? "w-7 bg-[color:var(--trail-green)]" : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden text-white">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <img src={IMAGES.heroSavanna} alt="Golden hour over the Tanzanian savanna with Kilimanjaro on the horizon" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[color:var(--forest-deep)]/85" />

      <div className="relative z-10 container-lodge h-full flex flex-col justify-end pb-24 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="eyebrow !text-white/80"
        >
          Tanzania, from the city to the wild
        </motion.p>

        <HeroHeadline />

        <Reveal delay={0.4} className="hidden md:block mt-8 max-w-xl text-white/85 text-lg leading-relaxed">
          Handcrafted safaris, seamless transfers and cultural journeys, led by Tanzanian hosts who call this landscape home.
        </Reveal>

        <Reveal delay={0.6} className="mt-10 flex flex-wrap gap-4">
          <Link to="/services" className="btn-primary" data-cursor="Book">
            Explore Safaris <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button className="btn-ghost" data-cursor="Play">
            <Play className="h-4 w-4" /> Watch Our Story
          </button>
        </Reveal>

        <div className="mt-16 border-t border-white/20 pt-8">
          <div className="hidden md:flex flex-wrap gap-x-12 gap-y-6">
            {HERO_STATS.map((s, i) => (
              <div key={i}>
                <p className="font-display text-3xl md:text-4xl text-white">
                  <Counter to={s.n} suffix={s.s} />
                </p>
                <p className="text-xs uppercase tracking-widest text-white/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <HeroStatCarousel />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/60">Scroll</span>
        <span className="block h-12 w-px bg-white/40 relative overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-4 bg-[color:var(--trail-green)] animate-[pulse_2s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="py-16 md:py-40 bg-[color:var(--kilimanjaro-snow)]">
      <div className="container-lodge grid gap-16 md:grid-cols-12 items-center">
        <div className="md:col-span-7">
          <p className="eyebrow">Our name, our promise</p>
          <SplitHeading
            className="display-section mt-4"
            text="Urban means the city. Way means the journey."
          />
          <Reveal delay={0.2} className="mt-6 max-w-xl text-lg leading-relaxed text-[color:var(--charcoal)]/80">
            Together they are the road that connects modern comfort to the heart of the wild.
            We meet you at the airport in Arusha, then we take you deep into the parks that raised us,
            with real Tanzanian hospitality at every stop.
          </Reveal>
          <Reveal delay={0.35} className="mt-8">
            <Link to="/services" className="link-slide text-[color:var(--forest-deep)] font-semibold">
              See what we offer →
            </Link>
          </Reveal>
        </div>
        <div className="md:col-span-5">
          <div className="relative aspect-square">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 rounded-full border-2 border-[color:var(--trail-green)]/30"
            />
            <div className="absolute inset-8 rounded-full border border-[color:var(--forest-deep)]/20" />
            <div className="absolute inset-16 rounded-full overflow-hidden img-treat">
              <img src={IMAGES.acacia} alt="Acacia tree at dawn in Tanzania" />
            </div>
            <span
              aria-hidden
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-display italic text-[color:var(--trail-green)] text-xl"
            >
              ~ Karibu ~
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CityToWild() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const panels = [
    { img: IMAGES.city, word: "City", copy: "Begin in Arusha. Modern comfort, real coffee, warm welcomes." },
    { img: IMAGES.road, word: "Road", copy: "A quiet drive north. Acacia shadows lengthen across the tarmac." },
    { img: IMAGES.elephant, word: "Wild", copy: "You arrive. The herd is already there, and so are the stars tonight." },
  ];

  return (
    <section ref={ref} className="relative bg-[color:var(--charcoal)] text-white h-[220vh] md:h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {panels.map((p, i) => {
          const start = i / panels.length;
          const end = (i + 1) / panels.length;
          const opacity = useTransform(
            scrollYProgress,
            [Math.max(0, start - 0.05), start, end - 0.05, end],
            [0, 1, 1, 0]
          );
          const scale = useTransform(scrollYProgress, [start, end], [1.08, 1]);
          return (
            <motion.div key={i} style={{ opacity }} className="absolute inset-0">
              <motion.img
                style={{ scale }}
                src={p.img}
                alt={p.word}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 container-lodge flex flex-col justify-center">
                <p className="eyebrow !text-white/70">Chapter 0{i + 1}</p>
                <h3 className="font-display text-[clamp(4rem,14vw,14rem)] leading-none text-white mt-2">{p.word}</h3>
                <p className="max-w-md text-lg text-white/85 mt-4">{p.copy}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedServices() {
  const services: {
    title: string;
    copy: string;
    img: string;
    slug: "wildlife-safaris" | "airport-transfers" | "day-trips" | "car-hire";
  }[] = [
    { title: "Wildlife Safaris", copy: "Serengeti, Ngorongoro, Tarangire. Private guides, unhurried days.", img: IMAGES.lion, slug: "wildlife-safaris" },
    { title: "Airport Transfers", copy: "JRO to Arusha and beyond. On time, air-conditioned, tracked.", img: IMAGES.fleet, slug: "airport-transfers" },
    { title: "Day Trips & Cultural Tours", copy: "Materuni waterfalls, coffee farms, Maasai villages.", img: IMAGES.masai, slug: "day-trips" },
    { title: "Car Hire", copy: "Modern Land Cruisers with a driver, or self-drive with support.", img: IMAGES.vehicle, slug: "car-hire" },
  ];
  return (
    <section className="py-16 md:py-40 bg-[color:var(--savanna-sand)]">
      <div className="container-lodge">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-16">
          <div>
            <p className="eyebrow">What we do</p>
            <SplitHeading className="display-section mt-3 max-w-2xl" text="Journeys made for you, guided by locals" />
          </div>
          <Link to="/services" className="link-slide text-[color:var(--forest-deep)] font-semibold">All services →</Link>
        </div>
        <RevealStagger className="grid gap-6 md:grid-cols-2">
          {services.map((s, i) => (
            <RevealChild key={i} className="group relative overflow-hidden rounded-2xl bg-white" >
              <Link
                to="/services/$category"
                params={{ category: s.slug }}
                className="block aspect-[16/10] img-treat"
                data-cursor="View"
              >
                <img src={s.img} alt={s.title} />
              </Link>
              <div className="p-8 flex items-start justify-between gap-6">
                <div>
                  <h3 className="font-display text-3xl">
                    <Link
                      to="/services/$category"
                      params={{ category: s.slug }}
                      className="link-slide"
                    >
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[color:var(--charcoal)]/70 max-w-sm">{s.copy}</p>
                </div>
                <Link
                  to="/services/$category"
                  params={{ category: s.slug }}
                  aria-label={`Explore ${s.title}`}
                  className="mt-2 h-12 w-12 shrink-0 rounded-full bg-[color:var(--forest-deep)] text-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-45"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>
            </RevealChild>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}

function Marquee() {
  const words = ["Serengeti", "Ngorongoro", "Kilimanjaro", "Tarangire", "Zanzibar", "Lake Manyara"];
  const track = [...words, ...words];
  return (
    <section className="py-16 border-y border-black/5 bg-[color:var(--kilimanjaro-snow)] overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap gap-16">
        {track.map((w, i) => (
          <span
            key={i}
            className="font-display text-[clamp(4rem,10vw,10rem)] leading-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px var(--forest-deep)",
            }}
          >
            {w} <span className="text-[color:var(--trail-green)]" style={{ WebkitTextStroke: "0", opacity: 0.5 }}>✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

function WhyUs() {
  const reasons = [
    "Licensed local experts",
    "Modern 4x4 fleet",
    "24/7 WhatsApp support",
    "Transparent pricing, no hidden fees",
    "Tailor-made itineraries",
  ];
  return (
    <section className="py-16 md:py-40 bg-[color:var(--forest-deep)] text-white">
      <div className="container-lodge grid gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="eyebrow !text-[color:var(--trail-green)]">Why UrbanWay</p>
          <SplitHeading className="display-section mt-4 !text-white" text="Five reasons guests keep returning" />
        </div>
        <ul className="md:col-span-8 divide-y divide-white/15">
          {reasons.map((r, i) => (
            <Reveal
              key={i}
              delay={i * 0.06}
              className="group flex items-center justify-between py-8"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-display text-sm text-white/50">0{i + 1}</span>
                <span className="font-display text-3xl md:text-4xl group-hover:text-[color:var(--trail-green)] transition-colors duration-500">
                  {r}
                </span>
              </div>
              <ArrowUpRight className="h-6 w-6 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TestimonialCard({ q }: { q: { text: string; who: string; trip: string } }) {
  return (
    <>
      <div className="flex gap-1 text-[color:var(--sunrise-gold)]">
        {Array.from({ length: 5 }).map((_, k) => (
          <Star key={k} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="font-display text-2xl md:text-3xl leading-snug mt-6">"{q.text}"</p>
      <div className="mt-8 flex justify-between text-sm text-[color:var(--charcoal)]/60">
        <span>{q.who}</span>
        <span className="uppercase tracking-widest text-xs">{q.trip}</span>
      </div>
    </>
  );
}

function TestimonialsPreview() {
  const quotes = [
    { text: "The most seamless safari we've ever taken. Our guide Emmanuel knew every bird call by name.", who: "Anja & Peter, Germany", trip: "Serengeti 5-day" },
    { text: "Picked up at JRO at midnight, greeted with cold water and a warm smile. Set the tone for the whole trip.", who: "Marcus, USA", trip: "JRO airport pickup" },
  ];
  const track = [...quotes, ...quotes];
  return (
    <section className="py-16 md:py-40 bg-[color:var(--kilimanjaro-snow)] overflow-hidden">
      <div className="container-lodge">
        <div className="flex justify-between items-end mb-14">
          <div>
            <p className="eyebrow">Stories</p>
            <SplitHeading className="display-section mt-3 max-w-2xl" text="From guests who traveled with us" />
          </div>
          <Link to="/reviews" className="link-slide text-[color:var(--forest-deep)] font-semibold">All reviews →</Link>
        </div>

        {/* Desktop / tablet: static side-by-side grid */}
        <RevealStagger className="hidden md:grid gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <RevealChild key={i} className="bg-white p-10 md:p-12 rounded-2xl shadow-[0_20px_60px_rgba(23,24,26,0.08)]">
              <TestimonialCard q={q} />
            </RevealChild>
          ))}
        </RevealStagger>
      </div>

      {/* Mobile: one continuous line, drifting slowly left to right */}
      <div className="md:hidden mt-2 -mx-5">
        <div className="flex gap-6 w-max px-5 marquee-track-reverse">
          {track.map((q, i) => (
            <div key={i} className="w-[82vw] shrink-0 bg-white p-8 rounded-2xl shadow-[0_20px_60px_rgba(23,24,26,0.08)]">
              <TestimonialCard q={q} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  return (
    <section
      className="relative py-16 md:py-40 text-white overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--trail-green), var(--forest-deep))" }}
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-20"
        preserveAspectRatio="none"
        viewBox="0 0 1440 500"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${60 + i * 55} C 360 ${20 + i * 55}, 1080 ${100 + i * 55}, 1440 ${40 + i * 55}`}
            fill="none"
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>
      <div className="container-lodge relative text-center">
        <p className="eyebrow !text-white/80">The wild is calling</p>
        <SplitHeading className="mt-4 font-display font-medium text-[clamp(3rem,9vw,8rem)] leading-[0.95] !text-white" text="Let's build your journey" />
        <Reveal delay={0.3} className="mt-10">
          <Link to="/services" className="btn-primary !bg-white !text-[color:var(--forest-deep)] hover:!bg-[color:var(--kilimanjaro-snow)]" data-cursor="Book">
            Start Planning <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
