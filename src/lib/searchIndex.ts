import { TRIPS, CATEGORIES, type Category } from "./trips";

type StaticPage = "/" | "/services" | "/gallery" | "/reviews" | "/bookings";

export type SearchResult =
  | { kind: "trip"; slug: string; title: string; subtitle: string }
  | { kind: "category"; slug: Category["slug"]; title: string; subtitle: string }
  | { kind: "page"; to: StaticPage; title: string; subtitle: string };

const PAGES: { kind: "page"; to: StaticPage; title: string; subtitle: string }[] = [
  { kind: "page", to: "/", title: "Home", subtitle: "UrbanWay Tours & Safari" },
  { kind: "page", to: "/services", title: "All services", subtitle: "Browse the full catalog" },
  { kind: "page", to: "/gallery", title: "Gallery", subtitle: "Photos from the road" },
  { kind: "page", to: "/reviews", title: "Reviews", subtitle: "Stories from past guests" },
  { kind: "page", to: "/bookings", title: "Plan With Us", subtitle: "Not sure yet? Get a custom plan" },
];

const INDEX: SearchResult[] = [
  ...TRIPS.map((t) => ({
    kind: "trip" as const,
    slug: t.slug,
    title: t.title,
    subtitle: `${t.location} · ${t.duration}`,
  })),
  ...CATEGORIES.map((c) => ({
    kind: "category" as const,
    slug: c.slug,
    title: c.title,
    subtitle: c.tagline,
  })),
  ...PAGES,
];

export function searchSite(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return INDEX.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(q)).slice(0, 8);
}
