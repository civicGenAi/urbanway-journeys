// UrbanWay Tours & Safari — trip catalog (mock data, no backend).
// One config to swap later.
import { IMAGES } from "./images";

export const CONFIG = {
  whatsapp: "+255700000000", // <-- replace with real number when ready
  tzsPerUsd: 2600, // static conversion for display
  supportEmail: "hello@urbanwaytours.co.tz",
};

export type AgeBand = "adult" | "youth" | "child" | "infant";
export const AGE_BANDS: {
  id: AgeBand;
  label: string;
  range: string;
  multiplier: number;
}[] = [
  { id: "adult", label: "Adult", range: "18+ years", multiplier: 1 },
  { id: "youth", label: "Youth", range: "13 to 17 years", multiplier: 0.75 },
  { id: "child", label: "Child", range: "5 to 12 years", multiplier: 0.5 },
  { id: "infant", label: "Infant", range: "0 to 4 years", multiplier: 0 },
];

export type Category = {
  slug: "day-trips" | "wildlife-safaris" | "airport-transfers";
  title: string;
  tagline: string;
  intro: string;
  hero: string;
  eyebrow: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "day-trips",
    title: "Day Trips & Cultural Tours",
    tagline: "Hot springs, waterfalls, wildlife encounters and a city market walk",
    intro:
      "Short journeys with big memories, all within easy reach of Arusha and Moshi. A hidden hot spring, a quiet waterfall trek, a morning hand-feeding giraffes, or a walk through the city's markets.",
    hero: IMAGES.galChemka1,
    eyebrow: "Half day & full day",
  },
  {
    slug: "wildlife-safaris",
    title: "Wildlife Safari Tours",
    tagline: "Ngorongoro, Tarangire, Manyara and Serengeti",
    intro:
      "Multi-day safaris through the parks that raised us, each one long enough to actually see the place, not just pass through it. Modern 4x4 vehicles with roof hatches, licensed guides, park fees included. Go shared to keep costs down, or private for a vehicle to yourselves.",
    hero: IMAGES.serengeti1,
    eyebrow: "Shared or private, 3 to 5 day safaris",
  },
  {
    slug: "airport-transfers",
    title: "Airport Transfers",
    tagline: "JRO, ARK and Zanzibar",
    intro:
      "Reliable, tracked pickups and drop offs across Tanzania. Meet and greet with a name board, chilled water and on board Wi-Fi.",
    hero: IMAGES.arushaToKili,
    eyebrow: "Meet & greet, tracked",
  },
];

export type Trip = {
  slug: string;
  category: Category["slug"];
  title: string;
  location: string;
  duration: string;
  shortDesc: string;
  longDesc: string;
  images: [string, string, string];
  activities: string[];
  included: string[];
  notIncluded: string[];
  pricePerPerson: number; // USD, shared/group rate, adult full price
  privatePricePerPerson: number; // USD, private/exclusive rate, adult full price
  priceNote?: string;
  groupMin?: number;
  groupMax?: number;
};

export const TRIPS: Trip[] = [
  // ---------------- DAY TRIPS ----------------
  {
    slug: "chemka-hot-springs",
    category: "day-trips",
    title: "Chemka Hot Springs",
    location: "Chemka, near Moshi",
    duration: "Half day, 5 hours",
    shortDesc:
      "A turquoise hot spring hidden in the palms outside Moshi. Swing in, float out, and let the current do the rest.",
    longDesc:
      "Tucked into a grove of palms below Kilimanjaro, Chemka's warm spring water stays a constant, clear turquoise year round. Swing from a rope into the deep end, float on an inner tube, or just sit at the edge with your feet in the current.",
    images: [IMAGES.galChemka1, IMAGES.galChemka2, IMAGES.galChemka3],
    activities: [
      "Swimming and floating in the springs",
      "Rope swing over the water",
      "Riverside relaxation",
      "Optional lunch at a nearby farm",
    ],
    included: [
      "Hotel pickup and drop off in Moshi or Arusha",
      "Entrance fees",
      "English speaking guide",
      "Bottled water",
    ],
    notIncluded: ["Lunch", "Tips for guide", "Travel insurance"],
    pricePerPerson: 150,
    privatePricePerPerson: 170,
    groupMin: 1,
    groupMax: 8,
  },
  {
    slug: "napuru-waterfall",
    category: "day-trips",
    title: "Napuru Waterfall",
    location: "Napuru, Kilimanjaro foothills",
    duration: "Half day, 5 hours",
    shortDesc:
      "Fewer crowds, same magic. A quieter waterfall trek through forest streams and volcanic rock.",
    longDesc:
      "A short hike through forest streams and volcanic rock leads to Napuru's waterfall, a quieter alternative to the better known falls nearby. Wade in the pools, take a quad bike ride through the surrounding trails, and cool off under the falls.",
    images: [IMAGES.galNapuru1, IMAGES.galNapuru3, IMAGES.galNapuru6],
    activities: [
      "Guided waterfall hike",
      "Swimming at the base of the falls",
      "Optional quad bike ride",
      "Forest stream walk",
    ],
    included: [
      "Hotel pickup and drop off",
      "Entrance fees",
      "English speaking guide",
    ],
    notIncluded: ["Quad bike rental", "Lunch", "Tips for guide"],
    pricePerPerson: 110,
    privatePricePerPerson: 130,
    groupMin: 1,
    groupMax: 8,
  },
  {
    slug: "serval-wildlife-encounter",
    category: "day-trips",
    title: "Serval Wildlife Encounter",
    location: "Wildlife lodge near Arusha",
    duration: "Half day, 4 hours",
    shortDesc:
      "Hand feed a giraffe, share a paddock with zebra, and meet servals and other residents up close.",
    longDesc:
      "A relaxed half day at a wildlife lodge just outside Arusha, home to giraffe, zebra, eland and resident servals. Walk right up to feed a giraffe at eye level, wander the paddocks, and finish with a lodge lunch overlooking the grounds.",
    images: [IMAGES.galGiraffe2, IMAGES.galGiraffe6, IMAGES.galGiraffe4],
    activities: [
      "Giraffe feeding up close",
      "Zebra and eland paddock walk",
      "Serval and resident wildlife viewing",
      "Optional lodge lunch",
    ],
    included: [
      "Hotel pickup and drop off in Arusha",
      "Entrance and feeding fees",
      "English speaking guide",
    ],
    notIncluded: ["Lunch (optional add-on)", "Tips for guide"],
    pricePerPerson: 260,
    privatePricePerPerson: 420,
    groupMin: 1,
    groupMax: 8,
  },
  {
    slug: "arusha-town-tour",
    category: "day-trips",
    title: "Arusha Town Tour",
    location: "Central Arusha",
    duration: "Half day, 4 hours",
    shortDesc:
      "Central market, Maasai craft stalls and the city's everyday rhythm, with a local guide who knows every stall owner by name.",
    longDesc:
      "Walk through Arusha's central market and craft stalls with a local guide, browsing Maasai beadwork, wood carving and kanga cloth. A relaxed introduction to the city before or after your safari, with stops chosen around what you're curious about.",
    images: [IMAGES.townTour1, IMAGES.townTour2, IMAGES.townTour3],
    activities: [
      "Central market walking tour",
      "Maasai craft and jewelry stalls",
      "Wood carving and kanga cloth shopping",
      "Local guide throughout",
    ],
    included: [
      "Hotel pickup and drop off",
      "Local English speaking guide",
      "Bottled water",
    ],
    notIncluded: ["Purchases", "Tips for guide"],
    pricePerPerson: 45,
    privatePricePerPerson: 60,
    groupMin: 1,
    groupMax: 8,
  },

  // ---------------- WILDLIFE SAFARIS ----------------
  {
    slug: "ngorongoro-crater-safari",
    category: "wildlife-safaris",
    title: "Ngorongoro Crater Safari",
    location: "Ngorongoro Conservation Area",
    duration: "3 days, 2 nights",
    shortDesc:
      "A proper multi-day safari inside the world's largest intact volcanic caldera, home to the densest population of lions in Africa.",
    longDesc:
      "Ngorongoro is close enough to reach comfortably, but the crater floor deserves more than a rushed day trip. Settle in near the rim, descend for a full day among lion prides, elephant bulls, hippo pools and the elusive black rhino, then a second day exploring the wider conservation area at an unhurried pace.",
    images: [IMAGES.ngorongoro1, IMAGES.ngorongoro2, IMAGES.ngorongoro3],
    activities: [
      "Full day crater floor game drive",
      "Black rhino and dense lion prides",
      "Flamingo shoreline viewing",
      "Picnic lunch on the crater rim",
    ],
    included: [
      "Hotel pickup and drop off in Arusha",
      "4x4 with roof hatch",
      "Licensed English speaking guide",
      "Crater and conservation fees",
      "2 nights accommodation, full board",
    ],
    notIncluded: ["Drinks", "Tips for guide", "Travel insurance"],
    pricePerPerson: 280,
    privatePricePerPerson: 750,
    groupMin: 2,
    groupMax: 6,
  },
  {
    slug: "tarangire-safari",
    category: "wildlife-safaris",
    title: "Tarangire National Park Safari",
    location: "Tarangire National Park",
    duration: "3 days, 2 nights",
    shortDesc:
      "Tanzania's elephant capital, given the time it deserves. Ancient baobabs, river herds, and some of the best off-season game viewing in the north.",
    longDesc:
      "Tarangire holds one of Africa's largest elephant populations, gathered along the river in the dry season. Over three unhurried days you'll cover far more ground than a single game drive allows, watching for lion, leopard and the park's famous tree climbing pythons between baobab studded plains.",
    images: [IMAGES.tarangire1, IMAGES.tarangire2, IMAGES.tarangire3],
    activities: [
      "Multiple game drives across the park",
      "Elephant herds along the Tarangire river",
      "Baobab photography stops",
      "Dik-dik and bird spotting with a guide",
    ],
    included: [
      "Hotel pickup and drop off",
      "4x4 with roof hatch",
      "Licensed English speaking guide",
      "Park entry fees",
      "2 nights accommodation, full board",
    ],
    notIncluded: ["Drinks", "Tips for guide", "Travel insurance"],
    pricePerPerson: 265,
    privatePricePerPerson: 430,
    groupMin: 2,
    groupMax: 6,
  },
  {
    slug: "lake-manyara-safari",
    category: "wildlife-safaris",
    title: "Lake Manyara National Park Safari",
    location: "Lake Manyara National Park",
    duration: "3 days, 2 nights",
    shortDesc:
      "Groundwater forest, a soda lake thick with flamingos, and the park's famous tree climbing lions.",
    longDesc:
      "A compact, richly varied park at the base of the Rift Valley escarpment, worth more than a single afternoon. Drive through dense groundwater forest thick with blue monkeys and baboons, out to the open shore where flamingos gather by the thousand, and along the buffalo herds at the water's edge.",
    images: [IMAGES.manyara1, IMAGES.manyara2, IMAGES.manyara3],
    activities: [
      "Groundwater forest game drive",
      "Flamingo shoreline viewing",
      "Buffalo herds at the lake edge",
      "Tree climbing lion search",
    ],
    included: [
      "Hotel pickup and drop off",
      "4x4 with roof hatch",
      "Licensed English speaking guide",
      "Park entry fees",
      "2 nights accommodation, full board",
    ],
    notIncluded: ["Drinks", "Tips for guide", "Travel insurance"],
    pricePerPerson: 260,
    privatePricePerPerson: 430,
    groupMin: 2,
    groupMax: 6,
  },
  {
    slug: "serengeti-safari",
    category: "wildlife-safaris",
    title: "Serengeti National Park Safari",
    location: "Serengeti National Park",
    duration: "5 days, 4 nights",
    shortDesc:
      "The classic Tanzanian circuit. Endless plains, the migration in season, and some of the best big cat sightings in Africa.",
    longDesc:
      "The Serengeti is the furthest of our parks from Arusha, so this one earns its five days. Open plains game drives among lion, leopard and cheetah, a chance at the river crossings during migration season, and sundowners on the plains with nothing but grass to the horizon.",
    images: [IMAGES.serengeti1, IMAGES.serengeti2, IMAGES.serengeti3],
    activities: [
      "Multiple days of open plains game drives",
      "Migration river crossings (seasonal)",
      "Leopard and big cat spotting",
      "Sundowners on the plains",
    ],
    included: [
      "Hotel pickup and drop off",
      "4x4 with roof hatch",
      "Licensed English speaking guide",
      "All park fees",
      "4 nights accommodation, full board",
    ],
    notIncluded: [
      "Drinks",
      "Tips for guide",
      "Travel insurance",
      "Optional balloon safari",
    ],
    pricePerPerson: 740,
    privatePricePerPerson: 1250,
    priceNote: "Private rate shown is midrange lodge/camp pricing.",
    groupMin: 2,
    groupMax: 6,
  },

  // ---------------- AIRPORT TRANSFERS ----------------
  {
    slug: "jro-arusha-transfer",
    category: "airport-transfers",
    title: "Kilimanjaro Airport (JRO) to Arusha",
    location: "JRO to Arusha hotels",
    duration: "About 1 hour 15 min",
    shortDesc:
      "Meet and greet at arrivals, direct transfer to any hotel in Arusha or Usa River.",
    longDesc:
      "We track your flight, so a delay does not cost you anything. Our driver waits inside arrivals with a name board, helps with luggage, offers chilled water and free Wi-Fi on board. Available 24 hours.",
    images: [IMAGES.kiliToArusha, IMAGES.road, IMAGES.city],
    activities: [
      "Meet and greet inside arrivals",
      "Direct transfer to your hotel",
      "Flight tracking included",
    ],
    included: [
      "Private air conditioned vehicle",
      "English speaking driver",
      "Bottled water and Wi-Fi",
      "60 minutes free waiting time",
    ],
    notIncluded: ["Tips", "Extra stops (per request)"],
    pricePerPerson: 55,
    privatePricePerPerson: 55,
    priceNote: "Price is per vehicle up to 4 passengers, not per person.",
    groupMin: 1,
    groupMax: 4,
  },
  {
    slug: "jro-moshi-transfer",
    category: "airport-transfers",
    title: "Kilimanjaro Airport (JRO) to Moshi",
    location: "JRO to Moshi hotels",
    duration: "About 45 min",
    shortDesc:
      "Fast, private transfer to any hotel in Moshi. Ideal for Kilimanjaro climbers arriving the night before.",
    longDesc:
      "The shortest of our airport routes. Straight to your Moshi hotel with a quiet, punctual driver who knows every gate on Lema and Sekou Toure roads.",
    images: [IMAGES.arushaToKili, IMAGES.kilimanjaro, IMAGES.road],
    activities: [
      "Meet and greet with name board",
      "Direct Moshi drop off",
    ],
    included: [
      "Private vehicle",
      "English speaking driver",
      "Water on board",
    ],
    notIncluded: ["Tips", "Late night surcharge after midnight"],
    pricePerPerson: 45,
    privatePricePerPerson: 45,
    priceNote: "Per vehicle up to 4 passengers.",
    groupMin: 1,
    groupMax: 4,
  },
  {
    slug: "zanzibar-airport-hotel",
    category: "airport-transfers",
    title: "Zanzibar Airport (ZNZ) to Stone Town or Nungwi",
    location: "ZNZ to your hotel",
    duration: "20 min (Stone Town) to 90 min (Nungwi)",
    shortDesc:
      "Our island partner meets you at Zanzibar arrivals for a smooth private transfer anywhere on the island.",
    longDesc:
      "Zanzibar arrivals can feel busy. Our local partner will be waiting with a name board, help with SIM cards and cash, and drop you at any hotel from Stone Town to Kendwa.",
    images: [IMAGES.zanzibar, IMAGES.quoteVipTransport, IMAGES.landscape2],
    activities: [
      "Meet and greet inside arrivals",
      "SIM card and cash advice",
      "Direct transfer to your hotel",
    ],
    included: [
      "Air conditioned vehicle",
      "Local driver",
      "Bottled water",
    ],
    notIncluded: ["Tips", "Ferry connections"],
    pricePerPerson: 65,
    privatePricePerPerson: 65,
    priceNote: "Per vehicle. Nungwi and Kendwa priced higher on request.",
    groupMin: 1,
    groupMax: 4,
  },
];

export function tripsInCategory(slug: Category["slug"]): Trip[] {
  return TRIPS.filter((t) => t.category === slug);
}

export function findTrip(slug: string): Trip | undefined {
  return TRIPS.find((t) => t.slug === slug);
}

export function findCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const COUNTRY_CODES: { code: string; label: string; flag: string }[] = [
  { code: "+255", label: "Tanzania", flag: "🇹🇿" },
  { code: "+254", label: "Kenya", flag: "🇰🇪" },
  { code: "+256", label: "Uganda", flag: "🇺🇬" },
  { code: "+250", label: "Rwanda", flag: "🇷🇼" },
  { code: "+27", label: "South Africa", flag: "🇿🇦" },
  { code: "+1", label: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", label: "Germany", flag: "🇩🇪" },
  { code: "+33", label: "France", flag: "🇫🇷" },
  { code: "+34", label: "Spain", flag: "🇪🇸" },
  { code: "+39", label: "Italy", flag: "🇮🇹" },
  { code: "+31", label: "Netherlands", flag: "🇳🇱" },
  { code: "+41", label: "Switzerland", flag: "🇨🇭" },
  { code: "+61", label: "Australia", flag: "🇦🇺" },
  { code: "+81", label: "Japan", flag: "🇯🇵" },
  { code: "+86", label: "China", flag: "🇨🇳" },
  { code: "+91", label: "India", flag: "🇮🇳" },
  { code: "+971", label: "United Arab Emirates", flag: "🇦🇪" },
];

export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatTzs(n: number): string {
  return (
    "TZS " +
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
      Math.round(n * CONFIG.tzsPerUsd),
    )
  );
}

export function buildWhatsAppUrl(message: string): string {
  const digits = CONFIG.whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
