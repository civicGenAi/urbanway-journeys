import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGES, img } from "../lib/images";
import { SplitHeading } from "../components/Reveal";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Tanzania Safari Photo Gallery | UrbanWay Tours & Safari" },
      { name: "description", content: "Moments from the road: wildlife, landscapes, culture and our fleet across Tanzania." },
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

type Cat = "Wildlife" | "Landscapes" | "Culture" | "Our Fleet" | "Guests";

type Item =
  | { type: "photo"; src: string; alt: string; caption: string; cat: Cat; span?: string }
  | { type: "quote"; text: string; span?: string };

const ITEMS: Item[] = [
  { type: "photo", src: IMAGES.lion, alt: "Male lion at dawn in Serengeti", caption: "Serengeti · Central Corridor", cat: "Wildlife", span: "md:row-span-2" },
  { type: "photo", src: IMAGES.acacia, alt: "Acacia tree silhouette", caption: "Tarangire · Golden hour", cat: "Landscapes" },
  { type: "photo", src: IMAGES.masai, alt: "Maasai elder", caption: "Ngorongoro · Cultural boma", cat: "Culture" },
  { type: "quote", text: "The best road is the one that leads to the wild." },
  { type: "photo", src: IMAGES.elephant, alt: "Elephant herd crossing", caption: "Tarangire · Elephant crossing", cat: "Wildlife" },
  { type: "photo", src: IMAGES.zebra, alt: "Zebras on the plain", caption: "Serengeti · Great migration", cat: "Wildlife", span: "md:col-span-2" },
  { type: "photo", src: IMAGES.zanzibar, alt: "Zanzibar coast", caption: "Zanzibar · Nungwi beach", cat: "Landscapes" },
  { type: "photo", src: IMAGES.fleet, alt: "Land Cruiser fleet", caption: "Arusha · Our fleet", cat: "Our Fleet" },
  { type: "photo", src: IMAGES.giraffe, alt: "Giraffe at sunset", caption: "Manyara · Giraffe country", cat: "Wildlife", span: "md:row-span-2" },
  { type: "quote", text: "In Tanzania, the horizon is a promise." },
  { type: "photo", src: IMAGES.ngorongoro, alt: "Ngorongoro Crater rim", caption: "Ngorongoro · Crater rim", cat: "Landscapes" },
  { type: "photo", src: IMAGES.city, alt: "Arusha at dusk", caption: "Arusha · The starting line", cat: "Landscapes" },
  { type: "photo", src: IMAGES.cultural, alt: "Local market", caption: "Moshi · Coffee cooperative", cat: "Culture" },
  { type: "photo", src: IMAGES.guests, alt: "Guests on safari", caption: "Serengeti · Family safari", cat: "Guests" },
  { type: "photo", src: IMAGES.tarangire, alt: "Tarangire river", caption: "Tarangire · River bend", cat: "Landscapes", span: "md:col-span-2" },
  { type: "photo", src: IMAGES.road, alt: "Winding road", caption: "The road north", cat: "Landscapes" },
  { type: "photo", src: img("photo-1509316785289-025f5b846b35", 1200), alt: "Giraffe and calf", caption: "Manyara · Family", cat: "Wildlife" },
  { type: "quote", text: "Karibu means welcome, and it means we mean it." },
  { type: "photo", src: img("photo-1516426122078-c23e76319801", 1200), alt: "Mountain view", caption: "Kilimanjaro · From the plains", cat: "Landscapes" },
];

const FILTERS = ["All", "Wildlife", "Landscapes", "Culture", "Our Fleet", "Guests"] as const;

function Gallery() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = ITEMS.filter((it) => filter === "All" || it.type === "quote" || (it.type === "photo" && it.cat === filter));
  const photos = filtered.filter((i) => i.type === "photo") as Extract<Item, { type: "photo" }>[];

  const openLightbox = (photoIdx: number) => setLightbox(photoIdx);
  const next = () => setLightbox((i) => (i === null ? 0 : (i + 1) % photos.length));
  const prev = () => setLightbox((i) => (i === null ? 0 : (i - 1 + photos.length) % photos.length));

  return (
    <>
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden text-white">
        <img src={IMAGES.giraffe} alt="Giraffe in Tanzania" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[color:var(--charcoal)]/55" />
        <div className="relative container-lodge h-full flex flex-col justify-end pb-16 pt-32">
          <p className="eyebrow !text-white/80">Field notebook</p>
          <SplitHeading as="h1" className="display-hero mt-3 !text-white" text="Moments From the Road" />
        </div>
      </section>

      <section className="py-16 bg-[color:var(--kilimanjaro-snow)]">
        <div className="container-lodge">
          <div className="flex flex-wrap gap-2 mb-10">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${filter === f ? "bg-[color:var(--trail-green)] text-white" : "border border-black/15 hover:border-[color:var(--forest-deep)]"}`}
              >
                {f}
              </button>
            ))}
          </div>

          <LayoutGroup>
            <motion.div layout className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-4">
              <AnimatePresence>
                {filtered.map((item, i) => {
                  if (item.type === "quote") {
                    return (
                      <motion.div
                        key={`q-${i}`}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="col-span-2 bg-[color:var(--savanna-sand)] rounded-2xl p-8 flex items-center"
                      >
                        <p className="font-display italic text-2xl md:text-3xl leading-snug">"{item.text}"</p>
                      </motion.div>
                    );
                  }
                  const photoIndex = photos.indexOf(item);
                  return (
                    <motion.button
                      key={item.src + i}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => openLightbox(photoIndex)}
                      className={`group relative overflow-hidden rounded-2xl ${item.span ?? ""}`}
                      data-cursor="View"
                    >
                      <img src={item.src} alt={item.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/85 to-transparent p-4 text-left">
                        <p className="text-[10px] uppercase tracking-widest text-white/80">{item.cat}</p>
                        <p className="text-white text-sm mt-1">{item.caption}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </div>
      </section>

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-[color:var(--charcoal)]/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setLightbox(null);
              if (e.key === "ArrowRight") next();
              if (e.key === "ArrowLeft") prev();
            }}
            tabIndex={-1}
          >
            <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} className="absolute top-6 right-6 text-white p-2" aria-label="Close"><X className="h-6 w-6" /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-6 top-1/2 -translate-y-1/2 text-white p-2" aria-label="Previous"><ChevronLeft className="h-8 w-8" /></button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-6 top-1/2 -translate-y-1/2 text-white p-2" aria-label="Next"><ChevronRight className="h-8 w-8" /></button>

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={photos[lightbox].src}
              alt={photos[lightbox].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/80 text-sm">
              <p className="uppercase tracking-widest text-xs mb-1">{photos[lightbox].cat}</p>
              <p>{photos[lightbox].caption}</p>
              <p className="mt-2 text-white/40 text-xs">{String(lightbox + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
