// Curated free Unsplash imagery for UrbanWay
export const img = (id: string, w = 1600, q = 80) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const IMAGES = {
  heroSavanna: img("photo-1523805009345-7448845a9e53", 2000),
  kilimanjaro: img("photo-1589308078059-be1415eab4c4", 1800),
  elephant: img("photo-1547471080-7cc2caa01a7e", 1400),
  giraffe: img("photo-1547721064-da6cfb341d50", 1400),
  lion: img("photo-1546182990-dffeafbe841d", 1400),
  zebra: img("photo-1534188753412-3e26d0d618d6", 1400),
  masai: img("photo-1489392191049-fc10c97e64b6", 1400),
  zanzibar: img("photo-1519046904884-53103b34b206", 1600),
  acacia: img("photo-1516426122078-c23e76319801", 1800),
  vehicle: img("photo-1516426122078-c23e76319801", 1400),
  city: img("photo-1580060839134-75a5edca2e99", 1600),
  road: img("photo-1502301103665-0b95cc738daf", 1600),
  ngorongoro: img("photo-1521651201144-634f700b36ef", 1400),
  serengetiDawn: img("photo-1547471080-7cc2caa01a7e", 1600),
  tarangire: img("photo-1493246507139-91e8fad9978e", 1400),
  cultural: img("photo-1571219774336-9bff6f11b4a5", 1400),
  balloon: img("photo-1516426122078-c23e76319801", 1400),
  fleet: img("photo-1533662565148-b8f2c2b7bd94", 1400),
  guests: img("photo-1523805009345-7448845a9e53", 1400),
  landscape1: img("photo-1547471080-7cc2caa01a7e", 1200),
  landscape2: img("photo-1516426122078-c23e76319801", 1200),
};
