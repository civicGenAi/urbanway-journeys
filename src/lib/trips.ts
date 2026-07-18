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
  slug: "day-trips" | "wildlife-safaris" | "airport-transfers" | "car-hire";
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
    tagline: "Waterfalls, coffee farms, Maasai bomas",
    intro:
      "Short journeys with big memories. Community owned experiences within reach of Arusha and Moshi, guided by the neighbours who grew up in them.",
    hero: IMAGES.masai,
    eyebrow: "Half day & full day",
  },
  {
    slug: "wildlife-safaris",
    title: "Wildlife Safari Tours",
    tagline: "Serengeti, Ngorongoro, Tarangire and beyond",
    intro:
      "Multi day expeditions through the parks that raised us. Modern 4x4 vehicles with roof hatches, licensed guides, park fees included.",
    hero: IMAGES.lion,
    eyebrow: "2 to 10 day itineraries",
  },
  {
    slug: "airport-transfers",
    title: "Airport Transfers",
    tagline: "JRO, ARK and Zanzibar",
    intro:
      "Reliable, tracked pickups and drop offs across Tanzania. Meet and greet with a name board, chilled water and on board Wi-Fi.",
    hero: IMAGES.fleet,
    eyebrow: "Meet & greet, tracked",
  },
  {
    slug: "car-hire",
    title: "Car Hire",
    tagline: "Land Cruisers and Rav4s, with or without a driver",
    intro:
      "Late model 4x4s and SUVs with full comprehensive insurance and nationwide breakdown cover. Self drive with 24/7 support, or add a driver.",
    hero: IMAGES.vehicle,
    eyebrow: "Daily & weekly rates",
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
  pricePerPerson: number; // USD, adult full price
  priceNote?: string;
  groupMin?: number;
  groupMax?: number;
};

export const TRIPS: Trip[] = [
  // ---------------- DAY TRIPS ----------------
  {
    slug: "materuni-waterfalls-coffee",
    category: "day-trips",
    title: "Materuni Waterfalls & Coffee Farm",
    location: "Materuni village, Moshi",
    duration: "Full day, 8 hours",
    shortDesc:
      "A rainforest trek to an 80 metre waterfall, followed by a hands-on coffee experience with a Chagga family.",
    longDesc:
      "Leave Arusha or Moshi in the morning, wind up the foothills of Kilimanjaro, then hike through banana and coffee plantations to the roaring Materuni falls. After a swim, join a Chagga family to roast, pound and brew coffee the traditional way, and share a home cooked lunch.",
    images: [IMAGES.masai, IMAGES.acacia, IMAGES.landscape2],
    activities: [
      "Guided 45 minute rainforest hike",
      "Swim in the waterfall pool",
      "Traditional coffee roasting and brewing",
      "Home cooked Chagga lunch",
    ],
    included: [
      "Hotel pickup and drop off in Arusha or Moshi",
      "English speaking local guide",
      "Village entrance fees",
      "Lunch and coffee tasting",
      "Bottled water",
    ],
    notIncluded: ["Personal expenses", "Tips for guides", "Travel insurance"],
    pricePerPerson: 95,
    groupMin: 1,
    groupMax: 8,
  },
  {
    slug: "lake-duluti-canoe",
    category: "day-trips",
    title: "Lake Duluti Canoe & Forest Walk",
    location: "Arusha region",
    duration: "Half day, 4 hours",
    shortDesc:
      "Quiet canoe paddle on a volcanic crater lake, followed by a guided walk through the surrounding rainforest reserve.",
    longDesc:
      "A gentle half day for slow travellers. Paddle across the mirror calm surface of Lake Duluti, spot kingfishers and monitor lizards, then continue on foot along the forest rim with a naturalist who reads every leaf and call.",
    images: [IMAGES.landscape1, IMAGES.acacia, IMAGES.giraffe],
    activities: [
      "Two person canoe on Lake Duluti",
      "Guided rainforest walk",
      "Bird watching (over 130 species recorded)",
    ],
    included: [
      "Round trip transport from Arusha",
      "Canoe, life jackets and paddles",
      "Naturalist guide",
      "Reserve entrance fees",
    ],
    notIncluded: ["Lunch", "Drinks", "Tips"],
    pricePerPerson: 65,
    groupMin: 1,
    groupMax: 10,
  },
  {
    slug: "maasai-boma-cultural",
    category: "day-trips",
    title: "Maasai Boma Cultural Immersion",
    location: "Mto wa Mbu",
    duration: "Full day, 9 hours",
    shortDesc:
      "Spend a real day inside a Maasai homestead. Not a performance, an invitation.",
    longDesc:
      "This is a genuine community owned experience. You will help herd cattle at sunrise, learn to make a fire the traditional way, walk with an elder to a sacred baobab, and share ugali and stew in the boma. All fees go directly to the community.",
    images: [IMAGES.masai, IMAGES.cultural, IMAGES.zebra],
    activities: [
      "Sunrise cattle walk",
      "Fire making and beadwork workshop",
      "Guided walk with a Maasai elder",
      "Community lunch",
    ],
    included: [
      "Transport from Arusha (about 2 hours each way)",
      "Community fees direct to the boma",
      "Translator and cultural guide",
      "Full lunch and tea",
    ],
    notIncluded: ["Alcoholic drinks", "Personal purchases", "Tips"],
    pricePerPerson: 120,
    groupMin: 2,
    groupMax: 8,
  },
  {
    slug: "arusha-city-food-tour",
    category: "day-trips",
    title: "Arusha Food & Markets Walking Tour",
    location: "Central Arusha",
    duration: "Half day, 5 hours",
    shortDesc:
      "Six neighbourhoods, seven tastings, one local historian. The Arusha most visitors miss.",
    longDesc:
      "Walk with a resident historian through the Central Market, Kaloleni back streets and the old colonial quarter. Taste chapati fresh off the pan, roasted maize, mishkaki, and finish with a proper espresso in a specialty coffee bar tucked above a tailor's shop.",
    images: [IMAGES.city, IMAGES.cultural, IMAGES.landscape2],
    activities: [
      "Central Market tour",
      "Seven street food tastings",
      "Coffee bar finale",
      "Kanga cloth shopping (optional)",
    ],
    included: [
      "Local historian guide",
      "All food and drink tastings",
      "Bottled water",
    ],
    notIncluded: ["Hotel transport (walking meeting point)", "Purchases", "Tips"],
    pricePerPerson: 55,
    groupMin: 1,
    groupMax: 8,
  },

  // ---------------- WILDLIFE SAFARIS ----------------
  {
    slug: "serengeti-classic-5-day",
    category: "wildlife-safaris",
    title: "Serengeti Classic, 5 Day Safari",
    location: "Serengeti, Ngorongoro, Lake Manyara",
    duration: "5 days, 4 nights",
    shortDesc:
      "The signature UrbanWay circuit. Three parks, two ecosystems, unhurried game drives and lodge nights under the stars.",
    longDesc:
      "Cross into the southern Serengeti in time for the afternoon light, spend two full days chasing the migration, drop into the Ngorongoro Crater for a full day game drive, and end at Lake Manyara. Small groups, private vehicle option available.",
    images: [IMAGES.lion, IMAGES.elephant, IMAGES.serengetiDawn],
    activities: [
      "Game drives in Serengeti",
      "Ngorongoro Crater full day",
      "Lake Manyara tree climbing lions",
      "Sundowners in the bush",
    ],
    included: [
      "Modern 4x4 with roof hatches",
      "Licensed English speaking guide",
      "All park and crater fees",
      "Full board lodge accommodation",
      "Airport transfer JRO or ARK",
    ],
    notIncluded: [
      "International flights",
      "Visas and insurance",
      "Optional balloon safari",
      "Tips for guide and camp staff",
    ],
    pricePerPerson: 1850,
    priceNote: "Shared group departure. Private safari from $2,450 pp.",
    groupMin: 2,
    groupMax: 6,
  },
  {
    slug: "tarangire-manyara-3-day",
    category: "wildlife-safaris",
    title: "Tarangire & Manyara, 3 Day Escape",
    location: "Tarangire, Lake Manyara",
    duration: "3 days, 2 nights",
    shortDesc:
      "A shorter loop for travellers with limited time. Elephants of Tarangire and flamingos of Manyara, back in Arusha by dinner on day three.",
    longDesc:
      "Perfect first safari. Big elephant herds in Tarangire, ancient baobabs on the ridge, then the pink flamingo shallows and forest edge of Lake Manyara. Ideal add on before or after Kilimanjaro or Zanzibar.",
    images: [IMAGES.elephant, IMAGES.tarangire, IMAGES.acacia],
    activities: [
      "Tarangire full day game drive",
      "Lake Manyara game drive",
      "Baobab photography stop",
      "Optional night drive (extra)",
    ],
    included: [
      "4x4 with pop up roof",
      "Licensed guide",
      "All park fees",
      "Mid range lodge, full board",
    ],
    notIncluded: ["Drinks", "Tips", "Optional night drive"],
    pricePerPerson: 995,
    groupMin: 2,
    groupMax: 6,
  },
  {
    slug: "great-migration-7-day",
    category: "wildlife-safaris",
    title: "Great Migration Photography, 7 Day",
    location: "Serengeti (seasonal)",
    duration: "7 days, 6 nights",
    shortDesc:
      "Chase the herds through the Serengeti with a photography focused guide, mobile tented camps in the right corner of the park each season.",
    longDesc:
      "We move our camp with the migration. December to March in the southern plains for calving, June to August in the western corridor, September to October at the Mara River crossings. Custom vehicles for photographers, bean bags provided.",
    images: [IMAGES.zebra, IMAGES.lion, IMAGES.serengetiDawn],
    activities: [
      "Six full days of game drives",
      "Mara River crossing (seasonal)",
      "Optional hot air balloon (extra)",
      "Bush breakfast and sundowners",
    ],
    included: [
      "Photographer friendly 4x4",
      "Specialist wildlife guide",
      "All park and concession fees",
      "Mobile tented camp, full board",
      "Bean bags and charging inverters",
    ],
    notIncluded: [
      "Balloon safari",
      "Camera equipment rental",
      "Tips and personal items",
    ],
    pricePerPerson: 3450,
    priceNote: "High season supplement applies July to October.",
    groupMin: 2,
    groupMax: 4,
  },
  {
    slug: "ngorongoro-highlands-2-day",
    category: "wildlife-safaris",
    title: "Ngorongoro Highlands, 2 Day",
    location: "Ngorongoro Crater",
    duration: "2 days, 1 night",
    shortDesc:
      "A tight, high value weekend in the crater. One night on the rim, one full day inside the caldera.",
    longDesc:
      "Arrive at the crater rim in time for sunset drinks, sleep at 2,300 metres with the Rift Valley below, then descend at first light for a full day inside the caldera. Densest population of lions in Africa, plus the elusive black rhino.",
    images: [IMAGES.ngorongoro, IMAGES.lion, IMAGES.landscape1],
    activities: [
      "Full day crater game drive",
      "Sunset viewpoint on the rim",
      "Picnic lunch inside the crater",
    ],
    included: [
      "4x4 with roof hatch",
      "Guide and driver",
      "Crater and conservation fees",
      "Rim lodge, full board",
    ],
    notIncluded: ["Drinks", "Tips", "Optional Maasai boma visit"],
    pricePerPerson: 780,
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
    images: [IMAGES.fleet, IMAGES.road, IMAGES.city],
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
    images: [IMAGES.fleet, IMAGES.kilimanjaro, IMAGES.road],
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
    priceNote: "Per vehicle up to 4 passengers.",
    groupMin: 1,
    groupMax: 4,
  },
  {
    slug: "arusha-zanzibar-onward",
    category: "airport-transfers",
    title: "Arusha to JRO for Zanzibar Onward",
    location: "Arusha to JRO with luggage handling",
    duration: "About 1 hour 15 min",
    shortDesc:
      "Post safari transfer with luggage help and safari dust discount. We know your check in time better than you do.",
    longDesc:
      "The natural next step after a safari. We coordinate with your lodge, load quickly, get you to JRO with time to spare, and can even hold a change of clean clothes for you in the vehicle.",
    images: [IMAGES.road, IMAGES.fleet, IMAGES.zanzibar],
    activities: [
      "Lodge to airport transfer",
      "Luggage handling",
      "Optional Cultural Heritage stop",
    ],
    included: [
      "Private vehicle",
      "Driver, water, Wi-Fi",
      "Timing coordinated with your flight",
    ],
    notIncluded: ["Onward flight", "Tips"],
    pricePerPerson: 55,
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
    images: [IMAGES.zanzibar, IMAGES.fleet, IMAGES.landscape2],
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
    priceNote: "Per vehicle. Nungwi and Kendwa priced higher on request.",
    groupMin: 1,
    groupMax: 4,
  },

  // ---------------- CAR HIRE ----------------
  {
    slug: "landcruiser-driver",
    category: "car-hire",
    title: "Land Cruiser 4x4 with Driver",
    location: "Nationwide",
    duration: "Daily rate",
    shortDesc:
      "Our safari spec Land Cruiser with a licensed driver guide. The vehicle we use for our own tours.",
    longDesc:
      "Roof hatches, dual battery, fridge, charging inverters, roof rack and full comprehensive insurance. Perfect for guests who want a professional driver rather than driving themselves.",
    images: [IMAGES.vehicle, IMAGES.fleet, IMAGES.road],
    activities: [
      "Airport pickup included on rentals over 5 days",
      "Any route, any park",
      "Driver accommodation coordinated by us",
    ],
    included: [
      "Vehicle and driver",
      "Full comprehensive insurance",
      "Fuel for first 100 km per day",
      "24/7 breakdown support",
    ],
    notIncluded: [
      "Park entry fees",
      "Additional fuel over allowance",
      "Driver tip (guideline provided)",
    ],
    pricePerPerson: 230,
    priceNote: "Per vehicle per day, up to 6 passengers.",
    groupMin: 1,
    groupMax: 6,
  },
  {
    slug: "rav4-selfdrive",
    category: "car-hire",
    title: "Toyota RAV4 Self Drive",
    location: "Arusha, Moshi, Dar es Salaam",
    duration: "Daily rate",
    shortDesc:
      "Late model RAV4 for confident self drive travellers. Automatic, air conditioned, insured.",
    longDesc:
      "Good for urban Tanzania, short intercity drives and lodge to lodge in areas with tarmac. Not intended for deep park roads. Minimum age 25, international driving permit required.",
    images: [IMAGES.vehicle, IMAGES.road, IMAGES.city],
    activities: [
      "Self drive anywhere on tarmac",
      "Airport delivery available",
      "Optional GPS and child seat",
    ],
    included: [
      "Full comprehensive insurance",
      "Unlimited km",
      "24/7 roadside assistance",
      "Second driver free",
    ],
    notIncluded: ["Fuel", "Traffic fines", "Fees for park entry"],
    pricePerPerson: 85,
    priceNote: "Per vehicle per day, 3 day minimum.",
    groupMin: 1,
    groupMax: 5,
  },
  {
    slug: "landcruiser-selfdrive-tent",
    category: "car-hire",
    title: "Land Cruiser Self Drive with Rooftop Tent",
    location: "Nationwide",
    duration: "Daily rate",
    shortDesc:
      "For overlanders. Diesel Land Cruiser, rooftop tent, fridge, camping kit for two.",
    longDesc:
      "Everything you need to camp your way around Tanzania. Two person rooftop tent, gas cooker, table and chairs, fridge, jerry cans, recovery kit. We hand it over fully briefed with route advice.",
    images: [IMAGES.vehicle, IMAGES.road, IMAGES.acacia],
    activities: [
      "Overland self drive",
      "Camping ready equipment",
      "Full route briefing on pickup",
    ],
    included: [
      "Rooftop tent for 2",
      "Camping kitchen and chairs",
      "Fridge and dual battery",
      "Comprehensive insurance",
    ],
    notIncluded: ["Fuel", "Campsite fees", "Park entry"],
    pricePerPerson: 175,
    priceNote: "Per vehicle per day, 5 day minimum.",
    groupMin: 1,
    groupMax: 2,
  },
  {
    slug: "minivan-groups",
    category: "car-hire",
    title: "Safari Minivan with Driver (Group)",
    location: "Nationwide",
    duration: "Daily rate",
    shortDesc:
      "Pop up roof minivan for groups of 5 to 7. Cost effective option for shared safaris and family tours.",
    longDesc:
      "Popular with student groups, larger families and community trips. Comfortable, air conditioned, and every seat has a window and a share of the pop up roof for game viewing.",
    images: [IMAGES.fleet, IMAGES.road, IMAGES.giraffe],
    activities: [
      "Group safari transport",
      "City tours and inter town transfers",
      "Pop up roof for game viewing",
    ],
    included: [
      "Vehicle and driver",
      "Comprehensive insurance",
      "Fuel for first 120 km per day",
    ],
    notIncluded: ["Park fees", "Extra fuel", "Tips"],
    pricePerPerson: 180,
    priceNote: "Per vehicle per day, up to 7 passengers.",
    groupMin: 1,
    groupMax: 7,
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
