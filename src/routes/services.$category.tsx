import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { Reveal, SplitHeading } from "../components/Reveal";
import {
  CATEGORIES,
  findCategory,
  tripsInCategory,
  formatUsd,
  formatTzs,
} from "../lib/trips";

export const Route = createFileRoute("/services/$category")({
  head: ({ params }) => {
    const cat = findCategory(params.category);
    const title = cat
      ? `${cat.title} in Tanzania | UrbanWay Tours & Safari`
      : "Not found | UrbanWay";
    const desc = cat?.intro ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
      links: [{ rel: "canonical", href: `/services/${params.category}` }],
    };
  },
  loader: ({ params }) => {
    const cat = findCategory(params.category);
    if (!cat) throw notFound();
    return { category: cat };
  },
  notFoundComponent: NotFoundInner,
  component: CategoryPage,
});

function NotFoundInner() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-24 container-lodge text-center">
      <div>
        <p className="eyebrow">Not found</p>
        <h1 className="display-section mt-3">This category doesn't exist</h1>
        <Link to="/services" className="btn-primary mt-8 inline-flex">
          See all services
        </Link>
      </div>
    </div>
  );
}

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const trips = tripsInCategory(category.slug);

  return (
    <>
      <section className="relative h-[62vh] min-h-[440px] overflow-hidden text-white">
        <img
          src={category.hero}
          alt={category.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[color:var(--charcoal)]/60" />
        <div className="relative container-lodge h-full flex flex-col justify-end pb-16 pt-32">
          <nav className="text-white/70 text-sm mb-6 flex gap-2 items-center">
            <Link to="/services" className="hover:text-white">Services</Link>
            <span>/</span>
            <span className="text-white">{category.title}</span>
          </nav>
          <p className="eyebrow !text-white/80">{category.eyebrow}</p>
          <SplitHeading
            as="h1"
            className="display-hero mt-4 max-w-4xl !text-white"
            text={category.title}
          />
          <Reveal
            delay={0.3}
            className="mt-6 max-w-2xl text-lg text-white/85 leading-relaxed"
          >
            {category.intro}
          </Reveal>
        </div>
      </section>

      <section className="bg-[color:var(--kilimanjaro-snow)] py-24 md:py-32">
        <div className="container-lodge">
          <div className="flex items-end justify-between mb-14 gap-6 flex-wrap">
            <div>
              <p className="eyebrow">Available options</p>
              <h2 className="display-section mt-3">
                {trips.length} trips in this category
              </h2>
            </div>
            <p className="max-w-sm text-[color:var(--charcoal)]/70">
              Every trip below can be customised. Pick a starting point, then
              tell us how you want to travel.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {trips.map((t, i) => (
              <Reveal
                key={t.slug}
                delay={i * 0.08}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(23,24,26,0.06)] flex flex-col"
              >
                <Link
                  to="/trips/$slug"
                  params={{ slug: t.slug }}
                  className="block"
                  data-cursor="View"
                >
                  <div className="aspect-[16/10] img-treat">
                    <img src={t.images[0]} alt={t.title} />
                  </div>
                </Link>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-[color:var(--charcoal)]/50">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {t.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {t.duration}
                    </span>
                  </div>
                  <h3 className="font-display text-3xl mt-4">
                    <Link
                      to="/trips/$slug"
                      params={{ slug: t.slug }}
                      className="link-slide"
                    >
                      {t.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-[color:var(--charcoal)]/70 flex-1">
                    {t.shortDesc}
                  </p>
                  <div className="mt-6 pt-6 border-t border-black/8 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[color:var(--charcoal)]/50">
                        From
                      </p>
                      <p className="font-display text-2xl mt-1">
                        {formatUsd(t.pricePerPerson)}
                      </p>
                      <p className="text-xs text-[color:var(--charcoal)]/60">
                        {formatTzs(t.pricePerPerson)}
                      </p>
                    </div>
                    <Link
                      to="/trips/$slug"
                      params={{ slug: t.slug }}
                      className="btn-primary text-sm py-3 px-5"
                      data-cursor="Book"
                    >
                      View & Book <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[color:var(--savanna-sand)] py-24">
        <div className="container-lodge">
          <p className="eyebrow">Explore more</p>
          <h2 className="display-section mt-3 mb-12 max-w-2xl">
            Other ways to travel with UrbanWay
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link
                key={c.slug}
                to="/services/$category"
                params={{ category: c.slug }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
                data-cursor="View"
              >
                <img
                  src={c.hero}
                  alt={c.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <p className="eyebrow !text-white/70">{c.eyebrow}</p>
                  <h3 className="font-display text-2xl mt-2">{c.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
