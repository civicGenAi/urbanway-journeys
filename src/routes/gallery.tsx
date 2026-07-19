import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGES } from "../lib/images";
import { SplitHeading } from "../components/Reveal";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Tanzania Safari Photo Gallery | UrbanWay Tours & Safari" },
      { name: "description", content: "Moments from the road: Chemka hot springs, coffee farms, Materuni and Napuru waterfalls, and giraffe encounters across Tanzania." },
      { property: "og:title", content: "Tanzania Safari Gallery | UrbanWay" },
      { property: "og:description", content: "Handpicked moments from our journeys across Tanzania." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: "UrbanWay Tours & Safari Gallery",
      }),
    }],
  }),
  component: Gallery,
});

const EASE = [0.16, 1, 0.3, 1] as const;

const GALLERY_HEADLINES = [
  "Moments From the Road",
  "Stories Worth Keeping",
  "Tanzania, Frame by Frame",
  "Memories in the Making",
];

type Photo = { src: string; alt: string };

const CHAPTERS: { number: string; title: string; place: string; blurb: string; photos: [Photo, Photo, Photo] }[] = [
  {
    number: "01",
    title: "The Hidden Springs",
    place: "Chemka Hot Springs",
    blurb: "A hot spring hidden in the palms outside Moshi. Swing in, float out, and let the current do the rest.",
    photos: [
      { src: IMAGES.galChemka1, alt: "Aerial view of a guest floating in Chemka hot springs" },
      { src: IMAGES.galChemka2, alt: "Clear turquoise water at Chemka hot springs" },
      { src: IMAGES.galChemka3, alt: "Guest swinging over the water at Chemka" },
    ],
  },
  {
    number: "02",
    title: "Bean to Cup",
    place: "Coffee Tour, Materuni",
    blurb: "A morning on a family coffee farm — hand-picked cherries, an old iron grinder, and a cup earned the slow way.",
    photos: [
      { src: IMAGES.galCoffee1, alt: "Local host handing coffee to a guest" },
      { src: IMAGES.galCoffee2, alt: "Hands-on coffee cherry processing" },
      { src: IMAGES.galCoffee3, alt: "Local guide showing a guest the coffee grinder" },
    ],
  },
  {
    number: "03",
    title: "Materuni Falls",
    place: "Materuni Village",
    blurb: "An 80-metre waterfall at the end of a rainforest trail, with Kilimanjaro's foothills at your back.",
    photos: [
      { src: IMAGES.galMateruni1, alt: "Distant view of Materuni waterfall in a lush valley" },
      { src: IMAGES.galMateruni2, alt: "Guests admiring Materuni waterfall" },
      { src: IMAGES.galMateruni3, alt: "Guest smiling on the Materuni trail" },
    ],
  },
  {
    number: "04",
    title: "Off the Beaten Path",
    place: "Napuru Falls",
    blurb: "Fewer crowds, same magic. A quieter waterfall trek through forest streams and volcanic rock.",
    photos: [
      { src: IMAGES.galNapuru1, alt: "Tall waterfall framed by rainforest at Napuru" },
      { src: IMAGES.galNapuru2, alt: "Guests walking along a forest stream" },
      { src: IMAGES.galNapuru3, alt: "Local guide playing in the water at Napuru" },
    ],
  },
  {
    number: "05",
    title: "Close Encounters",
    place: "Giraffe & Wildlife Feeding",
    blurb: "Hand-feed a giraffe, share a paddock with zebra, and meet a few residents you won't find in any brochure.",
    photos: [
      { src: IMAGES.galGiraffe1, alt: "Local guide with a giraffe leaning down" },
      { src: IMAGES.galGiraffe2, alt: "Guest feeding a giraffe" },
      { src: IMAGES.galGiraffe3, alt: "Guest with a white lion on a lodge porch" },
    ],
  },
];

const ALL_PHOTOS: (Photo & { place: string })[] = CHAPTERS.flatMap((c) =>
  c.photos.map((p) => ({ ...p, place: c.place }))
);

function GalleryHeadline() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % GALLERY_HEADLINES.length), 4600);
    return () => clearInterval(t);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div key={i} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
        <SplitHeading as="h1" className="display-hero mt-3 !text-white" text={GALLERY_HEADLINES[i]} />
      </motion.div>
    </AnimatePresence>
  );
}

function PolaroidPhoto({
  photo,
  onOpen,
  rotate,
  delay,
  tall = false,
}: {
  photo: Photo;
  onOpen: (src: string) => void;
  rotate: number;
  delay: number;
  tall?: boolean;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30, rotate: rotate * 1.6 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      onClick={() => onOpen(photo.src)}
      className={`relative bg-white p-2.5 pb-8 shadow-[0_20px_45px_rgba(23,24,26,0.18)] ${tall ? "row-span-2" : ""}`}
      data-cursor="View"
    >
      <div className={`overflow-hidden ${tall ? "h-full" : "aspect-[3/4]"}`}>
        <img src={photo.src} alt={photo.alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    </motion.button>
  );
}

function ChapterSection({
  chapter,
  index,
  onOpen,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  onOpen: (src: string) => void;
}) {
  const flipped = index % 2 === 1;
  return (
    <section className={`py-20 md:py-28 ${index % 2 === 0 ? "bg-[color:var(--kilimanjaro-snow)]" : "bg-white"}`}>
      <div className="container-lodge grid gap-12 md:grid-cols-12 items-center">
        <div className={`md:col-span-5 ${flipped ? "md:order-2" : ""}`}>
          <p className="font-display text-7xl text-[color:var(--trail-green)]/20 leading-none">{chapter.number}</p>
          <p className="eyebrow -mt-2">{chapter.place}</p>
          <h3 className="display-section mt-3">{chapter.title}</h3>
          <p className="mt-5 text-lg text-[color:var(--charcoal)]/70 max-w-md leading-relaxed">{chapter.blurb}</p>
        </div>
        <div className={`md:col-span-7 ${flipped ? "md:order-1" : ""}`}>
          <div className="grid grid-cols-2 gap-5 sm:gap-6 max-w-sm sm:max-w-md mx-auto md:max-w-none">
            <PolaroidPhoto photo={chapter.photos[0]} onOpen={onOpen} rotate={-2} delay={0} tall />
            <PolaroidPhoto photo={chapter.photos[1]} onOpen={onOpen} rotate={2.5} delay={0.15} />
            <PolaroidPhoto photo={chapter.photos[2]} onOpen={onOpen} rotate={-1.5} delay={0.3} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const lightboxIndex = lightboxSrc ? ALL_PHOTOS.findIndex((p) => p.src === lightboxSrc) : -1;

  const next = () => setLightboxSrc(ALL_PHOTOS[(lightboxIndex + 1) % ALL_PHOTOS.length].src);
  const prev = () => setLightboxSrc(ALL_PHOTOS[(lightboxIndex - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length].src);

  return (
    <>
      <section className="relative h-[60vh] min-h-[440px] overflow-hidden text-white">
        <img src={IMAGES.galleryHero} alt="Chemka hot springs, Tanzania" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-[color:var(--forest-deep)]/80" />
        <div className="relative container-lodge h-full flex flex-col justify-end pb-16 pt-32">
          <p className="eyebrow !text-white/80">Field notebook</p>
          <GalleryHeadline />
        </div>
      </section>

      {CHAPTERS.map((chapter, i) => (
        <ChapterSection key={chapter.number} chapter={chapter} index={i} onOpen={setLightboxSrc} />
      ))}

      <AnimatePresence>
        {lightboxSrc !== null && lightboxIndex !== -1 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[color:var(--charcoal)]/95 flex items-center justify-center p-4"
            onClick={() => setLightboxSrc(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setLightboxSrc(null);
              if (e.key === "ArrowRight") next();
              if (e.key === "ArrowLeft") prev();
            }}
            tabIndex={-1}
          >
            <button onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }} className="absolute top-6 right-6 text-white p-2" aria-label="Close"><X className="h-6 w-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-2" aria-label="Previous"><ChevronLeft className="h-8 w-8" /></button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-2" aria-label="Next"><ChevronRight className="h-8 w-8" /></button>

            <motion.img
              key={lightboxSrc}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={ALL_PHOTOS[lightboxIndex].src}
              alt={ALL_PHOTOS[lightboxIndex].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 text-sm">
              <p className="uppercase tracking-widest text-xs mb-1">{ALL_PHOTOS[lightboxIndex].place}</p>
              <p className="text-white/40 text-xs">{String(lightboxIndex + 1).padStart(2, "0")} / {String(ALL_PHOTOS.length).padStart(2, "0")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
