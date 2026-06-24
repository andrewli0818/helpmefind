/* ============================================================
   HelpMeFind — student housing near EHL
   Front-end demo: views/navigation, real maps (Leaflet/OSM),
   curated home, saved + viewing-request flows.
   ============================================================ */
(() => {
  "use strict";

  /* ---------- tiny SVG helpers ---------- */
  const svg = (p, o = {}) =>
    `<svg viewBox="0 0 24 24" fill="${o.fill || "none"}" stroke="${o.stroke || "currentColor"}" stroke-width="${o.sw || 1.7}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

  const ICONS = {
    campus: '<path d="M2.5 8.5 12 4l9.5 4.5L12 13 2.5 8.5Z"/><path d="M6.5 10.5v4.2c0 1.3 2.5 2.8 5.5 2.8s5.5-1.5 5.5-2.8v-4.2"/><path d="M21.5 8.5v5"/>',
    studio: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/><path d="M10 20v-5h4v5"/>',
    shared: '<circle cx="8" cy="9" r="2.6"/><circle cx="16.5" cy="10" r="2.2"/><path d="M3 19c0-2.8 2.2-4.5 5-4.5s5 1.7 5 4.5"/><path d="M14.5 19c0-2 1-3.6 3-3.6 1.8 0 3 1.2 3 3"/>',
    furnished: '<path d="M4 11V8.5C4 7 5 6 6.5 6h11C19 6 20 7 20 8.5V11"/><path d="M3 11c1.4 0 2 .9 2 2.2V16h14v-2.8c0-1.3.6-2.2 2-2.2"/><path d="M5 18v1.5M19 18v1.5"/><path d="M3 16h18"/>',
    short: '<circle cx="12" cy="12" r="8.2"/><path d="M12 7.5V12l3 2"/>',
    lake: '<path d="M3 15c2-1.5 3.5-1.5 5.5 0s3.5 1.5 5.5 0 3.5-1.5 5.5 0"/><path d="M3 19c2-1.5 3.5-1.5 5.5 0s3.5 1.5 5.5 0 3.5-1.5 5.5 0"/><circle cx="16.5" cy="7" r="2.3"/>',
    budget: '<path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5 3.5 16.5Z"/><path d="M12 11.5c-1.4 0-2.2.6-2.2 1.5s.8 1.3 2.2 1.5 2.2.6 2.2 1.5-.8 1.5-2.2 1.5"/><path d="M12 9.5v8"/>',
    transit: '<rect x="6" y="4" width="12" height="13" rx="2.5"/><path d="M6 13h12"/><circle cx="9" cy="15.5" r=".4"/><circle cx="15" cy="15.5" r=".4"/><path d="M8.5 20.5 10 17M15.5 20.5 14 17"/>',
    pet: '<ellipse cx="6.5" cy="11" rx="1.6" ry="2.1"/><ellipse cx="17.5" cy="11" rx="1.6" ry="2.1"/><ellipse cx="10" cy="7.5" rx="1.6" ry="2.1"/><ellipse cx="14" cy="7.5" rx="1.6" ry="2.1"/><path d="M12 12.5c-2.4 0-4.5 1.8-4.5 4 0 1.6 1.3 2.4 2.6 2.4 1 0 1.3-.5 1.9-.5s.9.5 1.9.5c1.3 0 2.6-.8 2.6-2.4 0-2.2-2.1-4-4.5-4Z"/>',
    new: '<path d="M12 3.5 13.9 9 19.5 9.2 15.2 12.8 16.6 18.4 12 15.2 7.4 18.4 8.8 12.8 4.5 9.2 10.1 9Z"/>',
    whole: '<rect x="4.5" y="3.5" width="15" height="17" rx="1.5"/><path d="M8 7h2.5M13.5 7H16M8 11h2.5M13.5 11H16M8 15h2.5M13.5 15H16"/><path d="M10.5 20.5v-3h3v3"/>',
    quiet: '<path d="M11 5 6.5 8.5H3.5v7h3L11 19V5Z"/><path d="M15.5 9.5a4 4 0 0 1 0 5M18 7a7.5 7.5 0 0 1 0 10"/>',
    wifi: '<path d="M5 12.5a10 10 0 0 1 14 0M7.7 15.5a6 6 0 0 1 8.6 0M10.5 18.4a2 2 0 0 1 3 0"/><circle cx="12" cy="20" r=".6" fill="currentColor"/>',
    wash: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><circle cx="12" cy="13" r="4"/><circle cx="8" cy="6.5" r=".5" fill="currentColor"/><circle cx="10" cy="6.5" r=".5" fill="currentColor"/>',
    dish: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/><circle cx="7" cy="6.5" r=".4" fill="currentColor"/><path d="M12 12v5"/>',
    balcony: '<path d="M5 11h14v9H5z"/><path d="M5 14h14M9 11v9M15 11v9"/><path d="M8 11V5a4 4 0 0 1 8 0v6"/>',
    desk: '<path d="M3 7h18"/><path d="M5 7v12M19 7v12"/><rect x="8" y="10" width="8" height="4" rx="1"/>',
    bath: '<path d="M4 13h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3Z"/><path d="M6 13V6.5A2.5 2.5 0 0 1 8.5 4 2.5 2.5 0 0 1 11 6"/><path d="M9 6.5h2.5"/>',
    bike: '<circle cx="6" cy="16" r="3.2"/><circle cx="18" cy="16" r="3.2"/><path d="M6 16 10 8h4l2.5 8M9 8h5"/>',
    heat: '<path d="M9 4c1.5 2-1 4 .5 6M14 4c1.5 2-1 4 .5 6"/><path d="M6 12h12v4a6 6 0 0 1-12 0v-4Z"/>',
    kitchen: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M5 11h14"/><path d="M8.5 6v2M15.5 6v2"/>',
    parking: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9.5 16V8h3a2.5 2.5 0 0 1 0 5h-3"/>',
    elevator: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M12 3.5v17"/><path d="M9 9l-1.3 1.6h2.6L9 9ZM15 15l1.3-1.6h-2.6L15 15Z" fill="currentColor" stroke="none"/>',
    check: '<path d="M5 12.5 10 17l9-10"/>',
    pin: '<path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Z"/><circle cx="12" cy="11" r="2"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  };
  const LB_N = 8;
  const icon = (name) => svg(ICONS[name] || ICONS.check);
  const star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-5 4.5 1.4 6.5L12 17.6 6.1 20.8l1.4-6.5-5-4.5 6.6-.7z"/></svg>';
  const heartSvg = '<svg viewBox="0 0 24 24"><path class="heart" d="M12 21s-7.5-4.7-10-9.3C.8 9 2 5.5 5.2 5.5c2 0 3.2 1.1 3.8 2.2.6-1.1 1.8-2.2 3.8-2.2 3.2 0 4.4 3.5 3.2 6.2C18.5 16.3 12 21 12 21z"/></svg>';
  const houseGhost = svg('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/>', { sw: 1.4 });

  /* ---------- placeholder photos ---------- */
  const GRADS = [
    "linear-gradient(135deg,#FFE0B2,#FFCC80)", "linear-gradient(135deg,#FFE9C7,#FFD59E)",
    "linear-gradient(135deg,#FDE7C8,#F7C77E)", "linear-gradient(135deg,#FFF1D6,#FFD79A)",
    "linear-gradient(135deg,#FCE3C0,#F6B868)", "linear-gradient(135deg,#FFEAD0,#FFC98A)",
    "linear-gradient(135deg,#FBE2B6,#EFAF63)", "linear-gradient(135deg,#FFEEDB,#FFCF99)",
  ];
  const gradFor = (n) => GRADS[Math.abs(n) % GRADS.length];
  const UNSPLASH = [
    "1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1560448204-e02f11c3d0e2",
    "1493809842364-78817add7ffb", "1505693416388-ac5ce068fe85", "1484154218962-a197022b5858",
    "1556912173-3bb406ef7e77", "1540518614846-7eded433c457", "1554995207-c18c203602cb",
    "1493663284031-b7e3aefcae8e", "1567767292278-a4f21aa2d36e", "1522771739844-6a9f6d5f14af",
    "1502005229762-cf1b2da7c5d6", "1586023492125-27b2c045efd7", "1598928506311-c55ded91a20c",
    "1583847268964-b28dc8f51f92", "1505691938895-1758d7feb511", "1556228453-efd6c1ff04f6",
  ];
  const photo = (id, i, w = 640, h = 600) => {
    const u = UNSPLASH[(id * 3 + i) % UNSPLASH.length];
    const us = `https://images.unsplash.com/photo-${u}?auto=format&fit=crop&w=${w}&q=70`;
    const ps = `https://picsum.photos/seed/hmf${id}-${i}/${w}/${h}`;
    const ghost = houseGhost.replace("<svg", '<svg class="ph-ico"');
    return `<div class="ph" style="background:${gradFor(id + i)}">${ghost}<img loading="lazy" alt="" src="${us}" data-ps="${ps}" onerror="if(this.dataset.ps){this.src=this.dataset.ps;this.dataset.ps='';}else{this.remove();}"></div>`;
  };

  /* ---------- categories ---------- */
  const CATS = [
    { id: "all", label: "All", icon: "studio" },
    { id: "campus", label: "Near campus", icon: "campus" },
    { id: "studio", label: "Studios", icon: "studio" },
    { id: "shared", label: "Shared flats", icon: "shared" },
    { id: "furnished", label: "Furnished", icon: "furnished" },
    { id: "lake", label: "Lake view", icon: "lake" },
    { id: "short", label: "Short-term", icon: "short" },
    { id: "budget", label: "Budget", icon: "budget" },
    { id: "transit", label: "On a bus/metro line", icon: "transit" },
    { id: "whole", label: "Whole apartments", icon: "whole" },
    { id: "pet", label: "Pet-friendly", icon: "pet" },
    { id: "quiet", label: "Quiet area", icon: "quiet" },
    { id: "new", label: "New", icon: "new" },
  ];

  const TYPE_LABEL = { rent: "Rent", sublease: "Sublease", flatshare: "Flatshare" };
  const KIND_LABEL = { room: "Private room", studio: "Studio", apartment: "Whole apartment" };

  /* ---------- listings ---------- */
  let LISTINGS = [
    { id: 1, area: "Épalinges", city: "Lausanne", type: "rent", kind: "studio", rooms: "1.5 rooms", price: 1290, beds: 1, baths: 1, guests: 2, rating: 4.92, reviews: 64, minutes: 8, transit: "Bus 64 to campus", fav: true, from: "2026-08-01", to: null, host: { name: "Verdi Immobilier", initials: "VI", student: false, since: 2019 }, cats: ["campus", "studio", "furnished", "transit", "new"], amenities: ["wifi", "furnished", "wash", "kitchen", "desk", "heat", "bath", "elevator"], desc: "Bright, fully furnished studio a short bus ride from EHL. Renovated kitchenette, fast fibre wifi and a study nook by the window. Ideal for a focused semester." },
    { id: 2, area: "Le Chalet-à-Gobet", city: "Lausanne", type: "flatshare", kind: "room", rooms: "Room in 4.5", price: 920, beds: 1, baths: 1, guests: 1, rating: 4.78, reviews: 38, minutes: 4, transit: "5 min walk to campus", fav: true, from: "2026-09-01", to: null, host: { name: "Léa", initials: "L", student: true, since: 2025 }, cats: ["campus", "shared", "furnished", "quiet"], amenities: ["wifi", "furnished", "wash", "dish", "kitchen", "bike", "desk"], desc: "Private room in a friendly 4-person EHL flat, literally next to campus. Big shared kitchen, balcony and a garden. Two current flatmates are 2nd-year BOSC students." },
    { id: 3, area: "Ouchy", city: "Lausanne", type: "sublease", kind: "studio", rooms: "1.5 rooms", price: 1450, beds: 1, baths: 1, guests: 2, rating: 4.97, reviews: 51, minutes: 22, transit: "M2 metro + bus", fav: true, from: "2026-07-15", to: "2026-12-20", host: { name: "Maxime", initials: "M", student: true, since: 2024 }, cats: ["lake", "studio", "furnished", "transit", "short"], amenities: ["wifi", "furnished", "lake", "wash", "kitchen", "balcony", "bath"], desc: "Subletting my lakeside studio in Ouchy while I'm on internship. Wake up to Lac Léman and the Alps. Steps from the M2, with a 22-minute ride up to EHL." },
    { id: 4, area: "Renens", city: "Lausanne", type: "flatshare", kind: "room", rooms: "Room in 3.5", price: 760, beds: 1, baths: 1, guests: 1, rating: 4.61, reviews: 27, minutes: 28, transit: "M1 metro", fav: false, from: "2026-08-15", to: null, host: { name: "Sofia", initials: "S", student: true, since: 2023 }, cats: ["shared", "budget", "transit"], amenities: ["wifi", "wash", "kitchen", "bike", "heat"], desc: "Affordable room in a relaxed student flat near Renens station. Easy M1 connection across town. Great if you want to keep rent low and meet people." },
    { id: 5, area: "Pully", city: "Lausanne", type: "rent", kind: "apartment", rooms: "2.5 rooms", price: 1980, beds: 2, baths: 1, guests: 3, rating: 4.89, reviews: 42, minutes: 24, transit: "Train + bus", fav: false, from: "2026-09-01", to: null, host: { name: "Régie de la Côte", initials: "RC", student: false, since: 2015 }, cats: ["lake", "whole", "furnished", "quiet"], amenities: ["wifi", "furnished", "lake", "wash", "dish", "kitchen", "balcony", "parking", "bath"], desc: "Spacious 2.5-room apartment in leafy Pully — perfect to share with a flatmate. Lake glimpses from the balcony, parking included, quiet residential street." },
    { id: 6, area: "Lausanne Centre", city: "Lausanne", type: "sublease", kind: "room", rooms: "Room in 5.5", price: 850, beds: 1, baths: 2, guests: 1, rating: 4.7, reviews: 33, minutes: 26, transit: "M2 to Croisettes + bus", fav: false, from: "2026-07-01", to: "2027-01-31", host: { name: "Noah", initials: "N", student: true, since: 2024 }, cats: ["shared", "budget", "transit", "short"], amenities: ["wifi", "furnished", "wash", "dish", "kitchen", "heat"], desc: "Central room to sublet for the autumn semester, right by Flon nightlife and all the metro lines. Five-person flat, mixed EHL & UNIL crowd. Furnished and ready." },
    { id: 7, area: "Lutry", city: "Lausanne", type: "rent", kind: "studio", rooms: "1.5 rooms", price: 1620, beds: 1, baths: 1, guests: 2, rating: 4.95, reviews: 58, minutes: 30, transit: "Train to Lausanne + bus", fav: true, from: "2026-08-01", to: null, host: { name: "Famille Brun", initials: "FB", student: false, since: 2018 }, cats: ["lake", "studio", "furnished", "quiet", "pet"], amenities: ["wifi", "furnished", "lake", "wash", "kitchen", "balcony", "parking", "heat", "bath"], desc: "Charming studio in the vineyards of Lutry with a full-on lake view. Pets welcome. A calm, scenic base — worth the slightly longer commute for the sunsets." },
    { id: 8, area: "Prilly", city: "Lausanne", type: "flatshare", kind: "room", rooms: "Room in 4.5", price: 720, beds: 1, baths: 1, guests: 1, rating: 4.55, reviews: 19, minutes: 27, transit: "Bus + M1", fav: false, from: "2026-09-15", to: null, host: { name: "Amira", initials: "A", student: true, since: 2025 }, cats: ["shared", "budget", "transit"], amenities: ["wifi", "wash", "kitchen", "bike", "heat"], desc: "Budget-friendly room in a sporty student house in Prilly. Bike storage, table tennis in the basement, very chill flatmates. Bills included in the rent." },
    { id: 9, area: "Épalinges", city: "Lausanne", type: "rent", kind: "studio", rooms: "1.5 rooms", price: 1350, beds: 1, baths: 1, guests: 2, rating: 4.88, reviews: 47, minutes: 9, transit: "Bus 64 / M2 Croisettes", fav: false, from: "2026-08-01", to: null, host: { name: "Helvetia Living", initials: "HL", student: false, since: 2020 }, cats: ["campus", "studio", "furnished", "transit", "new"], amenities: ["wifi", "furnished", "wash", "dish", "kitchen", "desk", "elevator", "bath"], desc: "Modern studio in a new Épalinges building, minutes from EHL by bus. In-unit laundry, dishwasher and a proper desk. Move-in ready for the new academic year." },
    { id: 10, area: "Vevey", city: "Riviera", type: "sublease", kind: "apartment", rooms: "2.5 rooms", price: 1380, beds: 2, baths: 1, guests: 3, rating: 4.91, reviews: 36, minutes: 35, transit: "Direct train to Lausanne", fav: false, from: "2026-07-10", to: "2026-12-31", host: { name: "Chloé", initials: "C", student: true, since: 2023 }, cats: ["lake", "whole", "furnished", "short"], amenities: ["wifi", "furnished", "lake", "wash", "dish", "kitchen", "balcony", "bath"], desc: "Subletting our bright 2.5 in Vevey for one semester — lake and Chaplin statue around the corner. Direct trains to Lausanne. Best shared between two friends." },
    { id: 11, area: "Crissier", city: "Lausanne", type: "rent", kind: "studio", rooms: "1.5 rooms", price: 1150, beds: 1, baths: 1, guests: 1, rating: 4.66, reviews: 22, minutes: 25, transit: "Bus + M1", fav: false, from: "2026-09-01", to: null, host: { name: "Gérance Léman", initials: "GL", student: false, since: 2017 }, cats: ["studio", "budget", "transit", "furnished"], amenities: ["wifi", "furnished", "wash", "kitchen", "parking", "heat"], desc: "Practical, well-priced studio near the big shopping centres in Crissier. Parking available, supermarket downstairs. Solid value for a no-fuss semester." },
    { id: 12, area: "Chailly", city: "Lausanne", type: "flatshare", kind: "room", rooms: "Room in 4.5", price: 880, beds: 1, baths: 2, guests: 1, rating: 4.83, reviews: 41, minutes: 18, transit: "Bus 6 / 8", fav: true, from: "2026-08-20", to: null, host: { name: "Tom", initials: "T", student: true, since: 2024 }, cats: ["shared", "furnished", "quiet", "pet"], amenities: ["wifi", "furnished", "wash", "dish", "kitchen", "balcony", "desk"], desc: "Room in a beautiful Chailly flat with a south-facing balcony and two bathrooms. Quiet, green neighbourhood but quick bus into the centre. Cat already in residence." },
    { id: 13, area: "Montreux", city: "Riviera", type: "rent", kind: "apartment", rooms: "2.5 rooms", price: 1740, beds: 2, baths: 1, guests: 3, rating: 4.93, reviews: 49, minutes: 38, transit: "Direct train to Lausanne", fav: false, from: "2026-08-01", to: null, host: { name: "Riviera Estates", initials: "RE", student: false, since: 2016 }, cats: ["lake", "whole", "furnished", "quiet"], amenities: ["wifi", "furnished", "lake", "wash", "dish", "kitchen", "balcony", "parking", "elevator", "bath"], desc: "Elegant apartment on the Montreux lakefront, walking distance to the Jazz Festival venues. A longer but scenic train commute. Share it and split the view." },
    { id: 14, area: "Le Mont-sur-Lausanne", city: "Lausanne", type: "rent", kind: "studio", rooms: "1.5 rooms", price: 1240, beds: 1, baths: 1, guests: 2, rating: 4.81, reviews: 30, minutes: 12, transit: "Bus 8 / 60", fav: false, from: "2026-09-01", to: null, host: { name: "Dubois SA", initials: "DS", student: false, since: 2019 }, cats: ["campus", "studio", "furnished", "transit", "quiet", "new"], amenities: ["wifi", "furnished", "wash", "kitchen", "desk", "balcony", "heat"], desc: "New studio in Le Mont, one of the closest calm suburbs to EHL. Furnished with a comfy study setup and a small balcony. Quick bus links to campus and town." },
    { id: 15, area: "Lausanne Flon", city: "Lausanne", type: "sublease", kind: "room", rooms: "Room in 3.5", price: 990, beds: 1, baths: 1, guests: 1, rating: 4.74, reviews: 25, minutes: 25, transit: "All metro lines at Flon", fav: false, from: "2026-07-01", to: "2026-09-30", host: { name: "Ines", initials: "I", student: true, since: 2024 }, cats: ["shared", "transit", "short", "furnished"], amenities: ["wifi", "furnished", "wash", "kitchen", "elevator"], desc: "Summer sublet in the heart of Flon — bars, gym and every metro line at your door. Perfect for a summer internship in Lausanne. Three-person flat, fully furnished." },
    { id: 16, area: "Belmont-sur-Lausanne", city: "Lausanne", type: "flatshare", kind: "room", rooms: "Room in 5.5", price: 810, beds: 1, baths: 2, guests: 1, rating: 4.69, reviews: 31, minutes: 14, transit: "Bus 47 to campus", fav: false, from: "2026-09-01", to: null, host: { name: "Gabriel", initials: "G", student: true, since: 2023 }, cats: ["campus", "shared", "budget", "quiet", "pet"], amenities: ["wifi", "furnished", "wash", "dish", "kitchen", "bike", "parking", "balcony"], desc: "Big room in a house-share in Belmont, close to EHL and surrounded by fields. Garden, BBQ, parking and bikes. Five easy-going students, dog-friendly home." },
  ];

  /* ---------- geo ---------- */
  const EHL = { lat: 46.5527, lng: 6.6796 };
  const COORDS = {
    "Épalinges": [46.5556, 6.6694], "Le Chalet-à-Gobet": [46.5685, 6.6840], "Ouchy": [46.5070, 6.6260],
    "Renens": [46.5390, 6.5870], "Pully": [46.5100, 6.6610], "Lausanne Centre": [46.5197, 6.6323],
    "Lutry": [46.5030, 6.6870], "Prilly": [46.5350, 6.6030], "Vevey": [46.4628, 6.8419],
    "Crissier": [46.5500, 6.5790], "Chailly": [46.5230, 6.6520], "Montreux": [46.4312, 6.9107],
    "Le Mont-sur-Lausanne": [46.5560, 6.6370], "Lausanne Flon": [46.5210, 6.6300], "Belmont-sur-Lausanne": [46.5170, 6.6700],
  };
  const setCoords = (l) => { const c = COORDS[l.area]; if (c) { l.lat = c[0]; l.lng = c[1]; } else { l.lat = EHL.lat + (((l.id * 7) % 9) - 4) / 120; l.lng = EHL.lng + (((l.id * 5) % 9) - 4) / 120; } };
  LISTINGS.forEach(setCoords);

  /* ---------- state ---------- */
  const FAV_KEY = "hmf_favs", REQ_KEY = "hmf_reqs", SRCH_KEY = "hmf_searches";
  const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || []; } catch { return []; } };
  const state = {
    view: "home",      // home | results | saved | requests
    layout: "list",    // list | map  (within results/saved)
    type: "any", category: "all", where: "", kind: "any", from: "", to: "",
    sort: "recommended", maxPrice: null, maxMinutes: null, amen: new Set(), hood: null,
    favs: new Set(load(FAV_KEY)),
    requests: load(REQ_KEY),
    searches: load(SRCH_KEY),
    compare: new Set(),
  };
  const saveFavs = () => localStorage.setItem(FAV_KEY, JSON.stringify([...state.favs]));
  const saveReqs = () => localStorage.setItem(REQ_KEY, JSON.stringify(state.requests));

  /* ---------- DOM ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const show = (sel, cond) => { const el = $(sel); if (el) el.hidden = !cond; };
  const mainEl = $("#main");
  const catsEl = $("#cats");
  const modalRoot = $("#modalRoot");
  const toastEl = $("#toast");
  const fmt = (n) => "CHF " + n.toLocaleString("de-CH");
  const fmtShort = (n) => n.toLocaleString("de-CH");
  const byRec = (a, b) => (b._new ? 1 : 0) - (a._new ? 1 : 0) || b.rating * Math.log(b.reviews + 2) - a.rating * Math.log(a.reviews + 2);

  /* ---------- toast ---------- */
  let toastT;
  const toast = (msg) => {
    toastEl.textContent = msg; toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastT);
    toastT = setTimeout(() => { toastEl.classList.remove("show"); setTimeout(() => (toastEl.hidden = true), 280); }, 3200);
  };

  /* ---------- categories ---------- */
  function renderCats() {
    catsEl.innerHTML = CATS.map(
      (c) => `<button class="cat ${state.category === c.id ? "is-active" : ""}" data-cat="${c.id}">${icon(c.icon)}<span>${c.label}</span></button>`
    ).join("");
  }
  catsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".cat"); if (!b) return;
    state.category = b.dataset.cat; route();
  });

  /* ---------- filtering ---------- */
  function filtered() {
    const w = state.where.trim().toLowerCase();
    let out = LISTINGS.filter((l) => {
      if (state.type !== "any" && l.type !== state.type) return false;
      if (state.kind !== "any" && l.kind !== state.kind) return false;
      if (state.category !== "all" && !l.cats.includes(state.category)) return false;
      if (state.maxPrice && l.price > state.maxPrice) return false;
      if (state.maxMinutes && l.minutes > state.maxMinutes) return false;
      if (state.hood && !state.hood.areas.has(l.area)) return false;
      if (state.amen.size && ![...state.amen].every((a) => l.amenities.includes(a))) return false;
      if (w) {
        const hay = `${l.area} ${l.city} ${l.transit} ${KIND_LABEL[l.kind]} ${TYPE_LABEL[l.type]}`.toLowerCase();
        if (!hay.includes(w)) return false;
      }
      if (state.from && l.from > state.from) return false;
      if (state.to && l.to && l.to < state.to) return false;
      return true;
    });
    const s = state.sort;
    out.sort((a, b) => {
      if (a._new && !b._new) return -1;
      if (!a._new && b._new) return 1;
      if (s === "price-asc") return a.price - b.price;
      if (s === "price-desc") return b.price - a.price;
      if (s === "closest") return a.minutes - b.minutes;
      if (s === "rating") return b.rating - a.rating || b.reviews - a.reviews;
      return byRec(a, b);
    });
    return out;
  }
  const hasActiveFilter = () =>
    state.category !== "all" || state.type !== "any" || state.kind !== "any" || !!state.where || !!state.from || !!state.to || state.maxPrice != null || state.maxMinutes != null || state.amen.size > 0 || state.hood != null;
  const currentList = () => state.view === "saved" ? LISTINGS.filter((l) => state.favs.has(l.id)) : filtered();

  /* ---------- price insight ---------- */
  function priceInsight(l) {
    const peers = LISTINGS.filter((x) => x.kind === l.kind);
    if (peers.length < 3) return null;
    const avg = peers.reduce((s, x) => s + x.price, 0) / peers.length;
    const diff = (avg - l.price) / avg;
    if (diff >= 0.12) return { label: "Great price", pct: Math.round(diff * 100) };
    if (diff >= 0.05) return { label: "Good price", pct: Math.round(diff * 100) };
    return null;
  }

  /* ---------- card ---------- */
  function cardHTML(l) {
    const fav = state.favs.has(l.id);
    const ins = priceInsight(l);
    const n = 3;
    const slides = Array.from({ length: n }, (_, i) => `<div class="slide">${photo(l.id, i + 1)}</div>`).join("");
    const dots = Array.from({ length: n }, (_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("");
    return `
    <article class="card" data-id="${l.id}">
      <div class="card-media" data-idx="0">
        ${l.fav ? '<span class="card-badge">Student favourite</span>' : ""}
        <button class="card-fav ${fav ? "is-fav" : ""}" data-fav="${l.id}" aria-label="Save">${heartSvg}</button>
        <span class="card-type">${TYPE_LABEL[l.type]}</span>
        <button class="card-cmp ${state.compare.has(l.id) ? "on" : ""}" data-cmp="${l.id}">${state.compare.has(l.id) ? "✓ Comparing" : "⇄ Compare"}</button>
        <div class="card-carousel">${slides}</div>
        <button class="cz-btn prev" data-cz="prev" disabled aria-label="Previous photo"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>
        <button class="cz-btn next" data-cz="next" aria-label="Next photo"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>
        <div class="dots">${dots}</div>
      </div>
      <div class="card-body">
        <div class="card-row">
          <span class="card-title">${l.area}, ${l.city}</span>
          <span class="card-rating">${l.reviews ? star + l.rating.toFixed(2) : "New"}</span>
        </div>
        <div class="card-sub">${l.rooms} · ${KIND_LABEL[l.kind]}</div>
        <div class="card-sub dist">${icon("pin")} ${l.minutes} min to EHL · ${l.transit}</div>
        <div class="card-price"><b>${fmt(l.price)}</b> <span class="per">/ month</span>${ins ? `<span class="deal">${ins.label}</span>` : ""}</div>
      </div>
    </article>`;
  }

  /* ---------- neighbourhood guides ---------- */
  const HOODS = [
    { id: "epalinges", name: "Épalinges", emoji: "🌳", areas: ["Épalinges"], commute: "8 min to EHL", rent: "CHF 1,200–1,400", center: [46.5556, 6.6694], blurb: "The closest residential hub to campus — quiet, leafy and a quick bus 64 up to EHL. The default pick for students who want calm and a short commute." },
    { id: "campus", name: "Le Chalet-à-Gobet & around", emoji: "🌲", areas: ["Le Chalet-à-Gobet", "Belmont-sur-Lausanne", "Le Mont-sur-Lausanne"], commute: "4–14 min to EHL", rent: "CHF 800–1,250", center: [46.565, 6.68], blurb: "Right at EHL's doorstep, ringed by forest and trails. Mostly shared student flats — roll out of bed and walk to class." },
    { id: "ouchy", name: "Ouchy & the lakefront", emoji: "⛵", areas: ["Ouchy", "Pully", "Lutry"], commute: "22–30 min to EHL", rent: "CHF 1,400–1,650", center: [46.506, 6.645], blurb: "Lausanne's lakeside. Wake up to Lac Léman, walk the promenade, hop the M2. Pricier and a longer ride, but hard to beat for the views." },
    { id: "centre", name: "Centre & Flon", emoji: "🌃", areas: ["Lausanne Centre", "Lausanne Flon"], commute: "25 min to EHL", rent: "CHF 850–1,000", center: [46.5205, 6.631], blurb: "The heart of the action — bars, gym and every metro line at your door. The most social base, with a longer commute as the trade-off." },
    { id: "west", name: "West side (M1)", emoji: "🚇", areas: ["Renens", "Prilly", "Crissier"], commute: "25–28 min to EHL", rent: "CHF 700–1,150", center: [46.54, 6.59], blurb: "The budget-friendly, well-connected west. The M1 metro links it all and rents are the best value in town — popular with first-years." },
    { id: "riviera", name: "Riviera · Vevey & Montreux", emoji: "🍇", areas: ["Vevey", "Montreux"], commute: "35–38 min to EHL", rent: "CHF 1,380–1,740", center: [46.45, 6.87], blurb: "The scenic stretch toward Montreux. A longer but beautiful train commute, lakefront living, and more space for your money." },
  ];
  function hoodCard(h) {
    const items = LISTINGS.filter((l) => h.areas.includes(l.area)), rep = items[0];
    return `<button class="hood-card" data-hood="${h.id}">
      <div class="hood-card-img">${photo(rep ? rep.id : 0, 2, 240, 240)}</div>
      <div class="hood-card-b"><b>${h.emoji} ${h.name}</b><p>${h.blurb}</p>
        <div class="hood-meta"><span>${icon("campus")} ${h.commute}</span><span>${items.length} place${items.length !== 1 ? "s" : ""}</span></div>
      </div>
    </button>`;
  }

  /* ---------- curated home ---------- */
  const SECTIONS = [
    { title: "📍 Closest to campus", sub: "A quick walk or one bus to EHL", filter: (l) => l.minutes <= 15, sort: (a, b) => a.minutes - b.minutes, seeall: { category: "campus" } },
    { title: "🔁 Fresh subleases", sub: "Take over a room for a semester abroad", filter: (l) => l.type === "sublease", sort: byRec, seeall: { type: "sublease" } },
    { title: "👥 Flatshares looking for a flatmate", sub: "Move in with other students", filter: (l) => l.type === "flatshare", sort: byRec, seeall: { type: "flatshare" } },
    { title: "💸 Budget rooms under CHF 900", sub: "Easy on the student wallet", filter: (l) => l.price < 900, sort: (a, b) => a.price - b.price, seeall: { category: "budget" } },
    { title: "🌅 Lake views", sub: "Wake up to Lac Léman", filter: (l) => l.cats.includes("lake"), sort: byRec, seeall: { category: "lake" } },
  ];
  function renderHome() {
    const rows = SECTIONS.map((sec) => {
      const items = LISTINGS.filter(sec.filter).sort(sec.sort).slice(0, 8);
      if (!items.length) return "";
      return `<section class="row-sec">
        <div class="row-head">
          <div><h2>${sec.title}</h2><p>${sec.sub}</p></div>
          <button class="see-all" data-seeall='${JSON.stringify(sec.seeall)}'>See all →</button>
        </div>
        <div class="row">${items.map(cardHTML).join("")}</div>
      </section>`;
    }).join("");
    const hoods = `<section class="hood-sec">
      <div class="row-head"><div><h2>🗺️ Explore Lausanne by neighbourhood</h2><p>Where EHL students actually live — and how far it really is from campus.</p></div></div>
      <div class="hood-grid">${HOODS.map(hoodCard).join("")}</div>
    </section>`;
    const savedSec = state.searches.length ? `<section class="ss-sec">
      <div class="row-head"><div><h2>🔔 Your saved searches</h2><p>Pick up where you left off — tap to run a search again.</p></div></div>
      <div class="ss-list">${state.searches.map((s) => `<button class="ss-chip" data-ss="${s.id}"><span>${s.name}</span><i data-ssrm="${s.id}" aria-label="Remove">✕</i></button>`).join("")}</div>
    </section>` : "";
    $("#homeSections").innerHTML = savedSec + rows + hoods;
  }

  /* ---------- requests ---------- */
  function renderRequests() {
    const wrap = $("#requestsList");
    $("#viewTitle").textContent = "Your viewing requests";
    $("#viewSub").textContent = state.requests.length ? `${state.requests.length} request${state.requests.length > 1 ? "s" : ""} sent — hosts reply by email` : "";
    if (!state.requests.length) {
      wrap.innerHTML = `<div class="reqs-empty"><div class="reqs-empty-ic">${icon("check")}</div><h3>No viewing requests yet</h3><p>When you ask to view a place, it shows up here so you can keep track of who you've contacted.</p><button class="btn-outline" data-go="home">Browse stays</button></div>`;
      return;
    }
    wrap.innerHTML = state.requests.map((r) => {
      const l = LISTINGS.find((x) => x.id === r.id); if (!l) return "";
      return `<div class="req-row" data-open="${l.id}">
        <div class="req-thumb">${photo(l.id, 1, 220, 200)}</div>
        <div class="req-info">
          <b>${l.area}, ${l.city}</b>
          <span>${TYPE_LABEL[l.type]} · ${l.rooms} · ${fmt(l.price)}/mo</span>
          <span class="req-meta">Move-in ${fmtDate(r.from)}${r.who ? " · as " + r.who : ""} · sent to ${l.host.name}</span>
        </div>
        <div class="req-status">Requested</div>
      </div>`;
    }).join("");
  }

  /* ---------- map (Leaflet / OpenStreetMap) ---------- */
  const TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const ATTR = '&copy; OpenStreetMap';
  const campusDiv = () => L.divIcon({ className: "", html: '<div class="map-campus">🎓 EHL</div>', iconSize: [62, 26], iconAnchor: [31, 13] });
  const priceDiv = (l) => L.divIcon({ className: "", html: `<div class="map-pin${state.favs.has(l.id) ? " fav" : ""}">${fmtShort(l.price)}</div>`, iconSize: [56, 26], iconAnchor: [28, 26] });
  const mapPopup = (l) => `<div class="map-pop">
      <div class="map-pop-img">${photo(l.id, 1, 260, 150)}</div>
      <div class="map-pop-b"><b>${l.area}, ${l.city}</b>
        <span>${TYPE_LABEL[l.type]} · ${l.rooms}</span>
        <span class="map-pop-price">${fmt(l.price)}/mo · ${l.reviews ? "★ " + l.rating.toFixed(2) : "New"}</span>
        <button class="map-pop-btn" onclick="HMF.open(${l.id})">View details</button>
      </div></div>`;

  let browseMap = null, detailMap = null;
  function renderMap(list) {
    const host = $("#browseMap");
    if (!window.L) { host.innerHTML = '<div class="map-fallback">🗺️ The map needs an internet connection — it works on the live site.</div>'; return; }
    if (browseMap) { browseMap.remove(); browseMap = null; }
    host.innerHTML = "";
    browseMap = L.map(host, { scrollWheelZoom: false }).setView([EHL.lat, EHL.lng], 12);
    L.tileLayer(TILES, { maxZoom: 19, attribution: ATTR }).addTo(browseMap);
    L.marker([EHL.lat, EHL.lng], { icon: campusDiv(), zIndexOffset: 1000 }).addTo(browseMap).bindPopup("<b>🎓 EHL Campus</b>");
    const pts = [[EHL.lat, EHL.lng]];
    list.forEach((l) => { if (l.lat == null) return; L.marker([l.lat, l.lng], { icon: priceDiv(l) }).addTo(browseMap).bindPopup(mapPopup(l), { maxWidth: 260, minWidth: 240 }); pts.push([l.lat, l.lng]); });
    if (pts.length > 1) browseMap.fitBounds(pts, { padding: [55, 55] });
    setTimeout(() => browseMap && browseMap.invalidateSize(), 90);
  }
  function initDetailMap(l) {
    const host = document.getElementById("detailMap"); if (!host) return;
    if (!window.L || l.lat == null) { host.innerHTML = `<div class="map-fallback">Approximate area: ${l.area}, ${l.city}.</div>`; return; }
    if (detailMap) { detailMap.remove(); detailMap = null; }
    detailMap = L.map(host, { scrollWheelZoom: false }).setView([l.lat, l.lng], 14);
    L.tileLayer(TILES, { maxZoom: 19, attribution: ATTR }).addTo(detailMap);
    L.circle([l.lat, l.lng], { radius: 380, color: "#F59E0B", weight: 2, fillColor: "#F59E0B", fillOpacity: .22 }).addTo(detailMap);
    L.marker([EHL.lat, EHL.lng], { icon: campusDiv() }).addTo(detailMap).bindPopup("🎓 EHL Campus");
    try { detailMap.fitBounds([[l.lat, l.lng], [EHL.lat, EHL.lng]], { padding: [45, 45], maxZoom: 14 }); } catch (e) {}
    setTimeout(() => detailMap && detailMap.invalidateSize(), 130);
  }
  let hoodMap = null;
  function initHoodMap(h, items) {
    const host = document.getElementById("hoodMap"); if (!host) return;
    if (!window.L) { host.innerHTML = '<div class="map-fallback">🗺️ Map needs internet — works on the live site.</div>'; return; }
    if (hoodMap) { hoodMap.remove(); hoodMap = null; }
    hoodMap = L.map(host, { scrollWheelZoom: false }).setView(h.center, 13);
    L.tileLayer(TILES, { maxZoom: 19, attribution: ATTR }).addTo(hoodMap);
    L.marker([EHL.lat, EHL.lng], { icon: campusDiv(), zIndexOffset: 1000 }).addTo(hoodMap).bindPopup("<b>🎓 EHL Campus</b>");
    const pts = [[EHL.lat, EHL.lng]];
    items.forEach((l) => { if (l.lat == null) return; L.marker([l.lat, l.lng], { icon: priceDiv(l) }).addTo(hoodMap).bindPopup(mapPopup(l), { maxWidth: 260, minWidth: 240 }); pts.push([l.lat, l.lng]); });
    if (pts.length > 1) hoodMap.fitBounds(pts, { padding: [45, 45] });
    setTimeout(() => hoodMap && hoodMap.invalidateSize(), 130);
  }
  function openHoodGuide(id) {
    const h = HOODS.find((x) => x.id === id); if (!h) return;
    const items = LISTINGS.filter((l) => h.areas.includes(l.area));
    sheet(`
      <h1 class="modal-h1">${h.emoji} ${h.name}</h1>
      <p class="lede">${h.blurb}</p>
      <div class="hood-stats">
        <div><b>${h.commute}</b><span>Commute to EHL</span></div>
        <div><b>${h.rent}</b><span>Typical rent / mo</span></div>
        <div><b>${items.length}</b><span>Places listed</span></div>
      </div>
      <div id="hoodMap" class="detail-map" style="height:250px;margin:18px 0 6px"></div>
      <button class="primary-btn" data-hoodgo="${h.id}">Browse ${items.length} place${items.length !== 1 ? "s" : ""} in ${h.name}</button>`);
    initHoodMap(h, items);
  }
  function applyHood(h) {
    resetFilters();
    state.hood = { id: h.id, label: h.name, areas: new Set(h.areas) };
    state.view = "results"; render(); scrollToContent();
  }

  /* ---------- chrome / view switching ---------- */
  function setChrome() {
    const v = state.view, isList = (v === "results" || v === "saved");
    const showMap = isList && state.layout === "map";
    show("#hero", v === "home");
    show("#how", v === "home");
    show("#homeSections", v === "home");
    show("#viewHead", v === "saved" || v === "requests");
    show("#resultsBar", isList);
    show("#requestsList", v === "requests");
    show("#mapView", showMap);
    show("#grid", isList && !showMap);
    document.querySelectorAll("#viewToggle [data-vt]").forEach((b) => b.classList.toggle("is-active", b.dataset.vt === state.layout));
  }
  function syncControls() {
    document.querySelectorAll("#typeToggle .type-pill").forEach((p) => p.classList.toggle("is-active", p.dataset.type === state.type));
    $("#sortSel").value = state.sort; $("#qWho").value = state.kind;
    $("#qWhere").value = state.where; $("#qFrom").value = state.from; $("#qTo").value = state.to;
    showWhen();
  }
  function updateResultCount(list) {
    if (state.view === "saved") {
      $("#viewTitle").textContent = "Saved stays";
      $("#viewSub").textContent = list.length ? `${list.length} place${list.length > 1 ? "s" : ""} you've kept` : "";
      $("#resultCount").textContent = `${list.length} saved`;
      return;
    }
    const cat = state.category !== "all" ? " · " + CATS.find((c) => c.id === state.category).label.toLowerCase() : "";
    const ty = state.type !== "any" ? " · " + TYPE_LABEL[state.type].toLowerCase() : "";
    const hd = state.hood ? ` in ${state.hood.label}` : " near EHL";
    $("#resultCount").textContent = `${list.length} ${list.length === 1 ? "stay" : "stays"}${cat}${ty}${hd}`;
  }
  function showEmpty(mode) {
    $("#grid").innerHTML = "";
    const e = $("#empty"); e.hidden = false;
    if (mode === "saved") {
      $("#emptyTitle").textContent = "No saved stays yet";
      $("#emptyMsg").textContent = "Tap the ♥ on any listing to keep it here for later.";
      $("#clearAll").textContent = "Browse all stays";
    } else {
      $("#emptyTitle").textContent = "No stays match your search";
      $("#emptyMsg").textContent = "Try clearing some filters or widening your dates.";
      $("#clearAll").textContent = "Clear all filters";
    }
  }

  /* ---------- active filter chips ---------- */
  function renderChips() {
    const c = $("#filterChips");
    if (state.view !== "results") { c.hidden = true; c.innerHTML = ""; return; }
    const chips = [];
    if (state.type !== "any") chips.push(["type", TYPE_LABEL[state.type]]);
    if (state.kind !== "any") chips.push(["kind", KIND_LABEL[state.kind]]);
    if (state.category !== "all") chips.push(["category", CATS.find((x) => x.id === state.category).label]);
    if (state.hood) chips.push(["hood", `📍 ${state.hood.label}`]);
    if (state.where) chips.push(["where", `“${state.where}”`]);
    if (state.maxPrice) chips.push(["maxPrice", `≤ ${fmt(state.maxPrice)}`]);
    if (state.maxMinutes) chips.push(["maxMinutes", `≤ ${state.maxMinutes} min to EHL`]);
    if (state.from) chips.push(["from", `from ${fmtDate(state.from)}`]);
    if (state.to) chips.push(["to", `until ${fmtDate(state.to)}`]);
    state.amen.forEach((a) => chips.push(["amen:" + a, AMEN_LABEL[a] || a]));
    if (!chips.length) { c.hidden = true; c.innerHTML = ""; return; }
    c.hidden = false;
    c.innerHTML = chips.map(([k, lab]) => `<button class="fchip" data-rm="${k}">${lab}<span aria-hidden="true">✕</span></button>`).join("") + `<button class="fchip clear" data-rm="all">Clear all</button>`;
  }
  function removeFilter(k) {
    if (k === "all") { resetFilters(); route(); return; }
    if (k.indexOf("amen:") === 0) state.amen.delete(k.slice(5));
    else if (k === "type") state.type = "any";
    else if (k === "kind") state.kind = "any";
    else if (k === "category") state.category = "all";
    else if (k === "hood") state.hood = null;
    else if (k === "where") state.where = "";
    else if (k === "maxPrice") state.maxPrice = null;
    else if (k === "maxMinutes") state.maxMinutes = null;
    else if (k === "from") state.from = "";
    else if (k === "to") state.to = "";
    route();
  }
  function updateBotnav() {
    let active = ({ home: "home", results: "home", saved: "saved", requests: "requests" })[state.view] || "home";
    if (state.view === "results" && state.layout === "map") active = "map";
    document.querySelectorAll("#botnav [data-bn]").forEach((b) => b.classList.toggle("is-active", b.dataset.bn === active));
  }

  function render() {
    renderCats(); setChrome(); syncControls(); renderChips(); updateBotnav(); updateSavedCount();
    if (state.view === "home") { renderHome(); $("#empty").hidden = true; return; }
    if (state.view === "requests") { renderRequests(); $("#empty").hidden = true; return; }
    const list = currentList();
    updateResultCount(list);
    if (state.layout === "map") { $("#empty").hidden = true; renderMap(list); return; }
    if (!list.length) { showEmpty(state.view === "saved" ? "saved" : "results"); }
    else { $("#empty").hidden = true; $("#grid").innerHTML = list.map(cardHTML).join(""); }
  }

  /* ---------- navigation ---------- */
  function resetFilters() {
    Object.assign(state, { type: "any", category: "all", where: "", kind: "any", from: "", to: "", maxPrice: null, maxMinutes: null, amen: new Set(), hood: null, sort: "recommended", layout: "list" });
  }
  function scrollToContent() {
    if (state.view === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const cats = $(".cats-row"); const y = cats.getBoundingClientRect().top + window.scrollY - 62;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }
  function route(scroll = true) { state.view = hasActiveFilter() ? "results" : "home"; render(); if (scroll) scrollToContent(); }
  function goHome() { resetFilters(); state.view = "home"; render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function goSaved() { state.layout = "list"; state.view = "saved"; render(); scrollToContent(); }
  function goRequests() { state.view = "requests"; render(); scrollToContent(); }
  function goHow() { resetFilters(); state.view = "home"; render(); const el = $("#how"); if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 30); }
  function nav(t) { t === "saved" ? goSaved() : t === "requests" ? goRequests() : goHome(); }

  function applySeeAll(f) { resetFilters(); if (f.category) state.category = f.category; if (f.type) state.type = f.type; state.view = "results"; render(); scrollToContent(); }
  function applyTerm(term) {
    resetFilters();
    if (term === "autumn") state.from = "2026-09-01";
    else if (term === "spring") state.from = "2027-02-01";
    else if (term === "summer") { state.type = "sublease"; state.from = "2026-07-01"; state.to = "2026-09-30"; }
    state.view = "results"; render(); scrollToContent();
  }

  /* ---------- carousel + fav ---------- */
  function doCz(cz) {
    const media = cz.closest(".card-media"); const car = $(".card-carousel", media);
    const total = car.children.length; let idx = +media.dataset.idx;
    idx = Math.max(0, Math.min(total - 1, idx + (cz.dataset.cz === "next" ? 1 : -1)));
    media.dataset.idx = idx; car.style.transform = `translateX(-${idx * 100}%)`;
    $(".cz-btn.prev", media).disabled = idx === 0;
    $(".cz-btn.next", media).disabled = idx === total - 1;
    [...$(".dots", media).children].forEach((d, i) => d.classList.toggle("on", i === idx));
  }
  function toggleFav(id) {
    if (state.favs.has(id)) state.favs.delete(id); else state.favs.add(id);
    saveFavs();
    if (state.view === "saved") render();
    else document.querySelectorAll(`[data-fav="${id}"]`).forEach((b) => b.classList.toggle("is-fav", state.favs.has(id)));
    updateSavedCount();
  }
  function updateSavedCount() {
    const n = state.favs.size, c = $("#savedCount");
    c.textContent = n; c.hidden = n === 0;
    $("#savedBtn").classList.toggle("has", n > 0);
  }

  /* ---------- compare ---------- */
  const cmpTray = $("#cmpTray");
  function toggleCompare(id) {
    if (state.compare.has(id)) state.compare.delete(id);
    else { if (state.compare.size >= 3) { toast("Compare up to 3 places at a time"); return; } state.compare.add(id); }
    document.querySelectorAll(`[data-cmp="${id}"]`).forEach((b) => { const on = state.compare.has(id); b.classList.toggle("on", on); b.textContent = on ? "✓ Comparing" : "⇄ Compare"; });
    renderTray();
  }
  function renderTray() {
    const ids = [...state.compare];
    if (!ids.length) { cmpTray.hidden = true; return; }
    cmpTray.hidden = false;
    $("#cmpCount").textContent = ids.length;
    $("#cmpThumbs").innerHTML = ids.map((id) => { const l = LISTINGS.find((x) => x.id === id); return `<div class="cmp-thumb" data-cmprm="${id}"><div class="cmp-thumb-img">${photo(id, 1, 120, 100)}</div><span>${l.area}</span><i>✕</i></div>`; }).join("");
  }
  const CMP_ROWS = [
    ["Rent", (l) => fmt(l.price) + " /mo", "price"],
    ["Type", (l) => TYPE_LABEL[l.type]],
    ["Place", (l) => KIND_LABEL[l.kind]],
    ["To EHL", (l) => `${l.minutes} min · ${l.transit}`, "min"],
    ["Deposit", (l) => fmt(l.price * 2)],
    ["Rooms", (l) => l.rooms],
    ["Rating", (l) => (l.reviews ? `★ ${l.rating.toFixed(2)} (${l.reviews})` : "New")],
    ["Furnished", (l) => (l.amenities.includes("furnished") ? "Yes" : "—")],
    ["Lake view", (l) => (l.amenities.includes("lake") ? "Yes" : "—")],
    ["Available", (l) => fmtDate(l.from)],
  ];
  function openCompare() {
    const items = [...state.compare].map((id) => LISTINGS.find((l) => l.id === id)).filter(Boolean);
    if (items.length < 2) { toast("Pick at least 2 places to compare"); return; }
    const minP = Math.min(...items.map((l) => l.price)), minM = Math.min(...items.map((l) => l.minutes));
    const head = `<div class="cmp-cell cmp-corner">${items.length} places</div>` + items.map((l) => `<div class="cmp-cell cmp-head"><div class="cmp-photo" data-open="${l.id}">${photo(l.id, 1, 320, 220)}</div><b>${l.area}</b><span>${l.city}</span><button class="cmp-view" data-open="${l.id}">View</button></div>`).join("");
    const rows = CMP_ROWS.map(([label, fn, best]) => `<div class="cmp-cell cmp-label">${label}</div>` + items.map((l) => {
      const hi = (best === "price" && l.price === minP) || (best === "min" && l.minutes === minM);
      return `<div class="cmp-cell${hi ? " cmp-best" : ""}">${fn(l)}${hi ? ' <span class="cmp-badge">best</span>' : ""}</div>`;
    }).join("")).join("");
    modalRoot.innerHTML = `<div class="modal cmp-modal"><div class="modal-top"><button class="modal-x" data-close>${svg('<path d="M6 6l12 12M18 6 6 18"/>', { sw: 2 })}</button><h2>Compare stays</h2><span style="width:34px"></span></div>
      <div class="modal-body"><div class="cmp-scroll"><div class="cmp-grid" style="grid-template-columns:118px repeat(${items.length},minmax(150px,1fr))">${head}${rows}</div></div></div></div>`;
    openOverlay();
  }

  /* ---------- saved searches ---------- */
  const saveSearches = () => localStorage.setItem(SRCH_KEY, JSON.stringify(state.searches));
  function describeFilters() {
    const p = [];
    if (state.type !== "any") p.push(TYPE_LABEL[state.type]);
    if (state.kind !== "any") p.push(KIND_LABEL[state.kind]);
    if (state.hood) p.push(state.hood.label);
    if (state.category !== "all") p.push(CATS.find((c) => c.id === state.category).label);
    if (state.where) p.push(`“${state.where}”`);
    if (state.maxPrice) p.push(`≤ ${fmt(state.maxPrice)}`);
    if (state.maxMinutes) p.push(`≤ ${state.maxMinutes} min`);
    state.amen.forEach((a) => p.push(AMEN_LABEL[a] || a));
    if (state.from || state.to) p.push(state.from && state.to ? `${fmtDate(state.from)}–${fmtDate(state.to)}` : state.from ? `from ${fmtDate(state.from)}` : `until ${fmtDate(state.to)}`);
    return p.length ? p.join(" · ") : "All stays near EHL";
  }
  function saveCurrentSearch() {
    const name = describeFilters();
    if (state.searches.some((s) => s.name === name)) { toast("That search is already saved 🔔"); return; }
    state.searches.unshift({
      id: "s" + Date.now(), name,
      f: { type: state.type, category: state.category, where: state.where, kind: state.kind, from: state.from, to: state.to, maxPrice: state.maxPrice, maxMinutes: state.maxMinutes, amen: [...state.amen], hood: state.hood ? { id: state.hood.id, label: state.hood.label, areas: [...state.hood.areas] } : null, sort: state.sort },
    });
    saveSearches();
    toast("🔔 Search saved — find it on your home page");
  }
  function applySavedSearch(id) {
    const s = state.searches.find((x) => x.id === id); if (!s) return;
    resetFilters();
    Object.assign(state, { type: s.f.type, category: s.f.category, where: s.f.where, kind: s.f.kind, from: s.f.from, to: s.f.to, maxPrice: s.f.maxPrice, maxMinutes: s.f.maxMinutes, sort: s.f.sort || "recommended", amen: new Set(s.f.amen || []) });
    state.hood = s.f.hood ? { id: s.f.hood.id, label: s.f.hood.label, areas: new Set(s.f.hood.areas) } : null;
    state.view = "results"; render(); scrollToContent();
  }
  function removeSavedSearch(id) { state.searches = state.searches.filter((x) => x.id !== id); saveSearches(); render(); }

  /* ---------- main delegation ---------- */
  mainEl.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]"); if (fav) { e.stopPropagation(); toggleFav(+fav.dataset.fav); return; }
    const cz = e.target.closest("[data-cz]"); if (cz) { e.stopPropagation(); doCz(cz); return; }
    const cmp = e.target.closest("[data-cmp]"); if (cmp) { e.stopPropagation(); toggleCompare(+cmp.dataset.cmp); return; }
    const rm = e.target.closest("[data-rm]"); if (rm) { removeFilter(rm.dataset.rm); return; }
    const hc = e.target.closest(".hchip"); if (hc) { applyTerm(hc.dataset.term); return; }
    const sa = e.target.closest("[data-seeall]"); if (sa) { applySeeAll(JSON.parse(sa.dataset.seeall)); return; }
    const hood = e.target.closest("[data-hood]"); if (hood) { openHoodGuide(hood.dataset.hood); return; }
    const ssrm = e.target.closest("[data-ssrm]"); if (ssrm) { e.stopPropagation(); removeSavedSearch(ssrm.dataset.ssrm); return; }
    const ss = e.target.closest("[data-ss]"); if (ss) { applySavedSearch(ss.dataset.ss); return; }
    const go = e.target.closest("[data-go]"); if (go) { nav(go.dataset.go); return; }
    const op = e.target.closest("[data-open]"); if (op) { openModal(+op.dataset.open); return; }
    const card = e.target.closest(".card"); if (card) openModal(+card.dataset.id);
  });

  /* ---------- detail modal ---------- */
  const AMEN_LABEL = {
    wifi: "Fast wifi", furnished: "Fully furnished", wash: "Washing machine", dish: "Dishwasher",
    kitchen: "Equipped kitchen", desk: "Dedicated desk", bath: "Private bathroom", balcony: "Balcony",
    lake: "Lake view", bike: "Bike storage", heat: "Heating incl.", parking: "Parking", elevator: "Lift",
  };
  const FLATMATES = [
    ["A", "Anaïs", "2nd year · BOSC"], ["M", "Marc", "3rd year · MIH"], ["S", "Sara", "1st year · BOSC"],
    ["L", "Luca", "Exchange · hospitality"], ["E", "Emma", "Master · F&B"], ["J", "Jonas", "2nd year · BOSC"],
  ];
  function flatmatesHTML(l) {
    const k = (l.id * 2) % FLATMATES.length, count = 2 + (l.id % 2);
    let out = "";
    for (let i = 0; i < count; i++) { const f = FLATMATES[(k + i) % FLATMATES.length]; out += `<div class="fm"><span class="fm-av">${f[0]}</span><div><b>${f[1]}</b><p>${f[2]}</p></div></div>`; }
    return out;
  }
  const REVIEWERS = [["Camille", "BOSC ’25"], ["Liam", "MIH ’24"], ["Sofia", "BOSC ’26"], ["Noah", "Master ’24"], ["Yuki", "Exchange"], ["Elena", "BOSC ’25"], ["Tom", "MIH ’25"], ["Aïcha", "BOSC ’26"]];
  const REVIEW_TXT = [
    "Super close to campus and the host replied within minutes. Room was exactly like the photos.",
    "Great value for the area and lovely flatmates — the bus to EHL stops right outside.",
    "Clean, quiet and perfect for studying. Would happily stay again next semester.",
    "Short commute and close to everything. The host was really flexible on my move-in dates.",
    "Bright room, fast wifi and bills already sorted. Ideal for an internship semester.",
    "Easiest housing search I've had at EHL — and no agency fees made a real difference.",
  ];
  const REV_CATS = ["Cleanliness", "Location", "Value", "Host"];
  const MONTHS_S = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  function reviewsHTML(l) {
    if (!l.reviews) return `<div class="rev-empty">${icon("new")}<span>New listing — no reviews yet. Be the first to stay here.</span></div>`;
    const bars = REV_CATS.map((c, i) => {
      const v = Math.max(4.2, Math.min(5, l.rating + (((l.id * (i + 1)) % 5) - 2) / 20));
      return `<div class="rev-bar"><span>${c}</span><div class="rev-track"><i style="width:${(v / 5) * 100}%"></i></div><b>${v.toFixed(1)}</b></div>`;
    }).join("");
    const k = l.id % REVIEWERS.length, t = l.id % REVIEW_TXT.length;
    let cards = "";
    for (let i = 0; i < 3; i++) {
      const r = REVIEWERS[(k + i * 3) % REVIEWERS.length], txt = REVIEW_TXT[(t + i) % REVIEW_TXT.length];
      cards += `<div class="rev"><div class="rev-top"><span class="rev-av">${r[0][0]}</span><div><b>${r[0]}</b><p>${r[1]} · ${MONTHS_S[(l.id + i) % 6]} 2026</p></div></div><div class="rev-stars">${star.repeat(5)}</div><p class="rev-txt">${txt}</p></div>`;
    }
    return `<div class="rev-head"><span class="rev-score">${star} ${l.rating.toFixed(2)}</span><span class="sep">·</span><span>${l.reviews} student reviews</span></div><div class="rev-bars">${bars}</div><div class="rev-list">${cards}</div>`;
  }
  function related(l) {
    const pool = [
      ...LISTINGS.filter((x) => x.id !== l.id && x.area === l.area),
      ...LISTINGS.filter((x) => x.id !== l.id && x.area !== l.area && x.type === l.type),
      ...LISTINGS.filter((x) => x.id !== l.id),
    ];
    const seen = new Set(), out = [];
    for (const x of pool) { if (out.length >= 4) break; if (!seen.has(x.id)) { seen.add(x.id); out.push(x); } }
    return out;
  }
  function simCard(l) {
    return `<button class="sim-card" data-open="${l.id}">
      <div class="sim-img">${photo(l.id, 1, 320, 240)}</div>
      <div class="sim-b">
        <div class="sim-row"><b>${l.area}, ${l.city}</b><span class="sim-rate">${l.reviews ? "★ " + l.rating.toFixed(2) : "New"}</span></div>
        <p>${TYPE_LABEL[l.type]} · ${l.minutes} min to EHL</p>
        <p class="sim-price"><b>${fmt(l.price)}</b> / month</p>
      </div>
    </button>`;
  }
  function gtkHTML(l) {
    const rows = [
      ["Lease", l.to ? "Sublet until " + fmtDate(l.to) : "From 6 months / 1 semester"],
      ["Deposit", fmt(l.price * 2) + " (≈ 2 months)"],
      ["Bills", l.type === "flatshare" ? "Usually shared & included" : "Not included (~CHF 120/mo)"],
      ["Furnished", l.amenities.includes("furnished") ? "Yes — move-in ready" : "Unfurnished"],
      ["Available", fmtDate(l.from)],
      ["Best for", l.guests > 1 ? l.guests + " people / sharing" : "1 student"],
    ];
    return rows.map((r) => `<div class="gtk-item"><b>${r[0]}</b><p>${r[1]}</p></div>`).join("");
  }

  function openModal(id, fromPop) {
    const l = LISTINGS.find((x) => x.id === id); if (!l) return;
    const fav = state.favs.has(id);
    const ins = priceInsight(l);
    const deposit = l.price * 2;
    const gallery = Array.from({ length: 5 }, (_, i) => `<div class="g" data-gp="${i}">${photo(l.id, i + 1, 800, 700)}</div>`).join("");
    const amens = l.amenities.map((a) => `<div class="amen">${icon(a)}<span>${AMEN_LABEL[a] || a}</span></div>`).join("");
    const term = l.to ? `Available ${fmtDate(l.from)} – ${fmtDate(l.to)}` : `Available from ${fmtDate(l.from)}`;
    const rating = l.reviews ? `<span class="star">${star} ${l.rating.toFixed(2)}</span><span class="sep">·</span><a href="#">${l.reviews} reviews</a>` : `<span class="star">✦ New listing</span>`;

    modalRoot.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${l.area} listing">
      <div class="modal-top">
        <button class="modal-x" data-close aria-label="Close">${svg('<path d="M6 6l12 12M18 6 6 18"/>', { sw: 2 })}</button>
        <div class="modal-actions">
          <button class="modal-share" data-share>${svg('<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>', { sw: 1.8 })} Share</button>
          <button class="modal-share" data-fav2="${l.id}">${svg('<path d="M12 21s-7-5-9.5-9C.8 9 2 5.7 5 5.7c1.9 0 3.1 1.1 3.7 2.2.6-1.1 1.8-2.2 3.7-2.2 3 0 4.2 3.3 2.5 6.3C19 16 12 21 12 21Z"/>', { sw: 1.8, fill: fav ? "var(--brand)" : "none" })} ${fav ? "Saved" : "Save"}</button>
        </div>
      </div>
      <div class="modal-body">
        <h1 class="modal-h1">${l.area}, ${l.city}</h1>
        <div class="modal-meta">${rating}<span class="sep">·</span><span>${l.minutes} min to EHL</span><span class="sep">·</span><span>${TYPE_LABEL[l.type]} · ${l.rooms}</span></div>
        <div class="gallery">${gallery}<button class="gallery-all" data-gp="0">${icon("grid")} Show all ${LB_N} photos</button></div>
        <div class="modal-grid">
          <div class="mc-left">
            <h3>${KIND_LABEL[l.kind]} hosted by ${l.host.name}</h3>
            <p class="card-sub">${l.guests} guest${l.guests > 1 ? "s" : ""} · ${l.beds} bed · ${l.baths} bath · ${l.rooms}</p>
            <div class="mc-host">
              <span class="h-av">${l.host.initials}</span>
              <div><div class="h-name">Hosted by ${l.host.name}</div><div class="h-sub">${l.host.student ? "EHL student · " : "Professional host · "}on HelpMeFind since ${l.host.since}</div></div>
              ${l.host.student ? `<span class="verified" style="margin-left:auto">${icon("check")} EHL verified</span>` : ""}
            </div>
            <div class="feat">
              <div class="f">${icon("campus")}<div><b>Close to campus</b><p>${l.transit}</p></div></div>
              <div class="f">${icon("short")}<div><b>${l.to ? "Fixed term" : "Long term"}</b><p>${term}</p></div></div>
              <div class="f">${icon(l.type === "flatshare" ? "shared" : "studio")}<div><b>${TYPE_LABEL[l.type]}</b><p>${l.type === "flatshare" ? "Shared flat" : l.type === "sublease" ? "Temporary sublet" : "Direct rental"}</p></div></div>
            </div>
            <div class="mc-desc">${l.desc}</div>
            ${l.type === "flatshare" ? `<div class="flatmates"><h3 class="amen-title">Your future flatmates</h3><div class="fm-list">${flatmatesHTML(l)}</div></div>` : ""}
            <h3 class="amen-title">What this place offers</h3>
            <div class="amens">${amens}</div>
            <h3 class="amen-title">Good to know</h3>
            <div class="gtk">${gtkHTML(l)}</div>
            <h3 class="amen-title">${l.reviews ? "Student reviews" : "Reviews"}</h3>
            <div class="reviews">${reviewsHTML(l)}</div>
            <div class="mc-map">
              <h3 class="amen-title">Where you'll be</h3>
              <div id="detailMap" class="detail-map"></div>
              <p class="card-sub" style="margin-top:10px">${l.area}, ${l.city} · ${l.minutes} min to EHL (${l.transit}). Exact address shared once you connect with the host.</p>
            </div>
          </div>
          <aside class="book">
            <div class="book-price">${fmt(l.price)} <span>/ month</span></div>
            ${ins ? `<div class="deal-note">💸 ${ins.label} · about ${ins.pct}% below similar ${KIND_LABEL[l.kind].toLowerCase()}s near EHL</div>` : ""}
            <div class="book-rate">${l.reviews ? star + " " + l.rating.toFixed(2) + " · " + l.reviews + " reviews" : "✦ New listing"}</div>
            <div class="book-fields">
              <div class="bf-row">
                <div class="bf"><label>Move in</label><input type="date" value="${l.from}" data-bf="from"></div>
                <div class="bf"><label>Move out</label><input type="date" value="${l.to || ""}" data-bf="to"></div>
              </div>
              <div class="bf-row"><div class="bf" style="flex:1 1 100%"><label>Looking as</label><select data-bf="who"><option>A tenant</option><option>A couple</option><option>An EHL student</option></select></div></div>
            </div>
            <button class="book-btn" data-request="${l.id}">Request to view</button>
            <p class="book-hint">No booking fees · You won't be charged — you arrange the visit directly</p>
            <div class="book-break">
              <div class="br"><span>First month's rent</span><span>${fmt(l.price)}</span></div>
              <div class="br"><span>Deposit (≈ 2 months)</span><span>${fmt(deposit)}</span></div>
              <div class="br"><span>HelpMeFind fee</span><span>CHF 0</span></div>
              <div class="total"><span>Due at move-in</span><span>${fmt(l.price + deposit)}</span></div>
            </div>
          </aside>
        </div>
        <div class="similar"><h3 class="amen-title">Similar places near campus</h3><div class="sim-grid">${related(l).map(simCard).join("")}</div></div>
      </div>
      <div class="book-sticky"><div class="bs-price"><b>${fmt(l.price)}</b> / month <span>${l.reviews ? "★ " + l.rating.toFixed(2) : "✦ New"}</span></div><button class="book-btn" data-request="${l.id}">Request to view</button></div>
    </div>`;
    openOverlay();
    initDetailMap(l);
    openStayId = id;
    document.title = `${l.area}, ${l.city} · HelpMeFind`;
    if (!fromPop) { history.pushState({ stay: id }, "", `${location.pathname}?stay=${id}`); pushedStay = true; }
  }

  /* ---------- overlay + shareable listing URLs ---------- */
  const SITE_TITLE = "HelpMeFind — Student stays near EHL";
  const getStayParam = () => new URLSearchParams(location.search).get("stay");
  let openStayId = null, pushedStay = false;
  function openOverlay() { modalRoot.hidden = false; document.body.style.overflow = "hidden"; document.body.classList.add("ov"); modalRoot.scrollTop = 0; setTimeout(() => { const x = modalRoot.querySelector("[data-close]"); if (x) x.focus(); }, 30); }
  function closeOverlay(fromPop) {
    if (detailMap) { detailMap.remove(); detailMap = null; }
    if (hoodMap) { hoodMap.remove(); hoodMap = null; }
    modalRoot.hidden = true; modalRoot.innerHTML = ""; document.body.style.overflow = ""; document.body.classList.remove("ov");
    document.title = SITE_TITLE;
    const wasStay = openStayId; openStayId = null;
    if (!fromPop && wasStay != null) {
      if (pushedStay) { pushedStay = false; history.back(); }
      else if (getStayParam()) history.replaceState({}, "", location.pathname);
    }
  }
  window.addEventListener("popstate", () => {
    const id = getStayParam();
    if (id) { if (+id !== openStayId) openModal(+id, true); }
    else if (openStayId != null) closeOverlay(true);
  });

  /* ---------- photo lightbox ---------- */
  let lbId = null, lbIdx = 0;
  const lightbox = $("#lightbox");
  function openLightbox(id, idx) {
    if (id == null) return;
    lbId = id; lbIdx = idx || 0;
    lightbox.innerHTML = `<button class="lb-x" data-lbclose aria-label="Close">${svg('<path d="M6 6l12 12M18 6 6 18"/>', { sw: 2 })}</button>
      <button class="lb-nav prev" data-lbnav="-1" aria-label="Previous">${svg('<path d="M15 5l-7 7 7 7"/>', { sw: 2.2 })}</button>
      <div class="lb-stage" id="lbStage"></div>
      <button class="lb-nav next" data-lbnav="1" aria-label="Next">${svg('<path d="M9 5l7 7-7 7"/>', { sw: 2.2 })}</button>
      <div class="lb-count" id="lbCount"></div>`;
    lightbox.hidden = false; document.body.style.overflow = "hidden"; document.body.classList.add("lb-open");
    paintLb();
  }
  function paintLb() { $("#lbStage").innerHTML = photo(lbId, (lbIdx % LB_N) + 1, 1280, 960); $("#lbCount").textContent = `${lbIdx + 1} / ${LB_N}`; }
  function lbNav(d) { lbIdx = (lbIdx + d + LB_N) % LB_N; paintLb(); }
  function closeLightbox() { lightbox.hidden = true; lightbox.innerHTML = ""; document.body.classList.remove("lb-open"); if (modalRoot.hidden) document.body.style.overflow = ""; }
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.closest("[data-lbclose]")) return closeLightbox();
    const n = e.target.closest("[data-lbnav]"); if (n) lbNav(+n.dataset.lbnav);
  });
  modalRoot.addEventListener("click", (e) => {
    if (e.target === modalRoot || e.target.closest("[data-close]")) return closeOverlay();
    if (e.target.closest("[data-share]")) return toast("Listing link copied to clipboard (demo)");
    const f2 = e.target.closest("[data-fav2]");
    if (f2) { toggleFav(+f2.dataset.fav2); openModal(+f2.dataset.fav2); return; }
    const req = e.target.closest("[data-request]"); if (req) return openRequestForm(+req.dataset.request);
    const gp = e.target.closest("[data-gp]"); if (gp) return openLightbox(openStayId, +gp.dataset.gp);
    const op = e.target.closest("[data-open]"); if (op) return openModal(+op.dataset.open);
    const hg = e.target.closest("[data-hoodgo]"); if (hg) { const h = HOODS.find((x) => x.id === hg.dataset.hoodgo); closeOverlay(); applyHood(h); return; }
    const go = e.target.closest("[data-go]"); if (go) { closeOverlay(); nav(go.dataset.go); return; }
    const sub = e.target.closest("[data-submit]"); if (sub) handleSheetSubmit(sub.dataset.submit, e);
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.hidden) { if (e.key === "Escape") closeLightbox(); else if (e.key === "ArrowLeft") lbNav(-1); else if (e.key === "ArrowRight") lbNav(1); return; }
    if (e.key === "Escape" && !modalRoot.hidden) closeOverlay();
  });

  function fmtDate(s) {
    if (!s) return "—";
    const [y, m, d] = s.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${+d} ${months[+m - 1]} ${y}`;
  }

  /* ---------- viewing-request flow ---------- */
  let reqListingId = null;
  function openRequestForm(id) {
    const l = LISTINGS.find((x) => x.id === id); if (!l) return;
    reqListingId = id;
    const fromEl = document.querySelector('[data-bf="from"]');
    const from = fromEl && fromEl.value ? fromEl.value : l.from;
    const fname = l.host.name.split(" ")[0];
    sheet(`
      <h1 class="modal-h1">Request a viewing</h1>
      <p class="lede">Send ${l.host.name} a quick intro — ${l.host.student ? "they're an EHL student too" : "the host"} and usually reply within a day. No fees, no commitment.</p>
      <form id="reqForm">
        <div class="field-row">
          <div class="field"><label>Preferred move-in</label><input name="from" type="date" value="${from}"></div>
          <div class="field"><label>You are</label><select name="who">
            <option>1st-year BOSC</option><option>2nd-year BOSC</option><option>3rd/4th-year BOSC</option><option>Master student</option><option>Exchange student</option><option>EHL staff</option>
          </select></div>
        </div>
        <div class="field"><label>Intro message to ${fname}</label><textarea name="msg" rows="4">Hi ${fname}, I'm an EHL student looking for a place near campus for ${l.to ? "the semester" : "the year"}. Your ${KIND_LABEL[l.kind].toLowerCase()} in ${l.area} looks great — could we arrange a viewing? Thanks!</textarea></div>
        <button class="primary-btn" data-submit="request" type="button">Send viewing request</button>
        <p class="book-hint">No booking fees · You arrange the visit directly with ${l.host.name}</p>
      </form>`);
  }
  function showRequestConfirm(l) {
    sheet(`<div class="confirm">
      <div class="confirm-ic">${icon("check")}</div>
      <h1 class="modal-h1">Viewing requested 🎉</h1>
      <p class="lede">Your intro has been sent to <b>${l.host.name}</b> about <b>${l.area}</b>. ${l.host.student ? "They" : "The host"} usually reply within a day. There are no fees — you arrange the visit and lease directly.</p>
      <button class="primary-btn" data-go="requests">See my viewing requests</button>
      <button class="ghost-btn" data-close>Keep browsing</button>
    </div>`);
  }

  /* ---------- search + "When" picker ---------- */
  const whenPop = $("#whenPop"), whenBtn = $("#whenBtn");
  const WHEN_PRESETS = {
    autumn: { from: "2026-09-01", to: "", label: "Autumn ’26" },
    spring: { from: "2027-02-01", to: "", label: "Spring ’27" },
    summer: { from: "2026-07-01", to: "2026-09-30", label: "Summer sublet" },
    any: { from: "", to: "", label: "Any time" },
  };
  function showWhen() {
    const f = state.from, t = state.to;
    const preset = Object.values(WHEN_PRESETS).find((p) => p.from === f && p.to === t && p.label !== "Any time");
    let label = "Any time";
    if (preset) label = preset.label;
    else if (f && t) label = `${fmtDate(f)} – ${fmtDate(t)}`;
    else if (f) label = `From ${fmtDate(f)}`;
    else if (t) label = `Until ${fmtDate(t)}`;
    whenBtn.textContent = label;
    whenBtn.classList.toggle("set", label !== "Any time");
  }
  const closeWhen = () => { whenPop.hidden = true; whenBtn.classList.remove("open"); };
  function applySearch() {
    state.where = $("#qWhere").value; state.from = $("#qFrom").value; state.to = $("#qTo").value; state.kind = $("#qWho").value;
    route();
  }
  whenBtn.addEventListener("click", (e) => { e.stopPropagation(); whenPop.hidden = !whenPop.hidden; whenBtn.classList.toggle("open", !whenPop.hidden); });
  whenPop.addEventListener("click", (e) => {
    e.stopPropagation();
    const p = e.target.closest("[data-when]");
    if (p) { const w = WHEN_PRESETS[p.dataset.when]; $("#qFrom").value = w.from; $("#qTo").value = w.to; state.from = w.from; state.to = w.to; showWhen(); closeWhen(); applySearch(); return; }
    if (e.target.closest("#whenApply")) { state.from = $("#qFrom").value; state.to = $("#qTo").value; showWhen(); closeWhen(); applySearch(); }
  });
  document.addEventListener("click", closeWhen);
  $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); closeWhen(); applySearch(); });
  $("#typeToggle").addEventListener("click", (e) => { const b = e.target.closest(".type-pill"); if (!b) return; state.type = b.dataset.type; route(); });
  $("#sortSel").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#viewToggle").addEventListener("click", (e) => { const b = e.target.closest("[data-vt]"); if (!b) return; state.layout = b.dataset.vt; render(); });
  $("#clearAll").addEventListener("click", goHome);
  $("#backHome").addEventListener("click", goHome);
  $("#saveSearch").addEventListener("click", saveCurrentSearch);

  /* ---------- category scroll ---------- */
  const updateCatArrows = () => {
    $("#catLeft").hidden = catsEl.scrollLeft < 10;
    $("#catRight").hidden = catsEl.scrollLeft > catsEl.scrollWidth - catsEl.clientWidth - 10;
  };
  $("#catLeft").addEventListener("click", () => catsEl.scrollBy({ left: -260, behavior: "smooth" }));
  $("#catRight").addEventListener("click", () => catsEl.scrollBy({ left: 260, behavior: "smooth" }));
  catsEl.addEventListener("scroll", updateCatArrows);

  /* ---------- header ---------- */
  const hdr = $("#hdr");
  window.addEventListener("scroll", () => hdr.classList.toggle("scrolled", window.scrollY > 24), { passive: true });
  $("#miniSearch").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $(".logo").addEventListener("click", (e) => { e.preventDefault(); goHome(); });
  $("#savedBtn").addEventListener("click", goSaved);
  $("#globeBtn").addEventListener("click", () => toast("Language: English · Currency: CHF (demo)"));
  $("#themeBtn").addEventListener("click", () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    if (dark) document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", "dark");
    try { localStorage.setItem("hmf_theme", dark ? "light" : "dark"); } catch (e) {}
  });
  $("#botnav").addEventListener("click", (e) => {
    const b = e.target.closest("[data-bn]"); if (!b) return;
    const t = b.dataset.bn;
    if (t === "home") goHome();
    else if (t === "map") { resetFilters(); state.view = "results"; state.layout = "map"; render(); scrollToContent(); }
    else if (t === "saved") goSaved();
    else if (t === "requests") goRequests();
  });
  $("#cmpGo").addEventListener("click", openCompare);
  $("#cmpClear").addEventListener("click", () => { state.compare.clear(); document.querySelectorAll("[data-cmp].on").forEach((b) => { b.classList.remove("on"); b.textContent = "⇄ Compare"; }); renderTray(); });
  cmpTray.addEventListener("click", (e) => { const t = e.target.closest("[data-cmprm]"); if (t) toggleCompare(+t.dataset.cmprm); });

  /* ---------- profile menu ---------- */
  const menu = $("#profileMenu");
  $("#profileBtn").addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
  document.addEventListener("click", () => (menu.hidden = true));
  menu.addEventListener("click", (e) => { const it = e.target.closest("[data-action]"); if (it) handleAction(it.dataset.action); });
  $("#hostLink").addEventListener("click", (e) => { e.preventDefault(); handleAction("host"); });
  document.querySelector(".footer").addEventListener("click", (e) => { const a = e.target.closest("[data-action]"); if (a) { e.preventDefault(); handleAction(a.dataset.action); } });

  function handleAction(a) {
    menu.hidden = true;
    switch (a) {
      case "host": return openHostSheet();
      case "login": case "signup": return openAuthSheet(a);
      case "saved": return goSaved();
      case "requests": return goRequests();
      case "how": return goHow();
      case "about": return openAboutSheet();
      case "help": return toast("Help Centre — this is a design demo 🙂");
      case "safety": return toast("Safety & trust info coming soon (demo)");
      case "report": return toast("Thanks — listing reports will be available soon (demo)");
      case "family": return toast("HelpMeFind is part of the HelpMe family ✨ (demo)");
      default: return toast("🚧 Coming soon — this is a design demo");
    }
  }

  /* ---------- sheets ---------- */
  function sheet(html) {
    modalRoot.innerHTML = `<div class="modal sheet"><div class="modal-top"><button class="modal-x" data-close>${svg('<path d="M6 6l12 12M18 6 6 18"/>', { sw: 2 })}</button><h2></h2><span style="width:34px"></span></div><div class="modal-body">${html}</div></div>`;
    openOverlay();
  }
  function openAboutSheet() {
    sheet(`<h1 class="modal-h1">About HelpMeFind</h1>
      <p class="lede">HelpMeFind is a student-run housing marketplace for the EHL community in Lausanne. We connect students looking for a place with students and landlords who have one — to rent, sublease for a semester abroad, or share.</p>
      <div class="about-points">
        <div class="ap">${icon("campus")}<div><b>Campus-first</b><p>Every listing shows how far it really is from EHL and how to get there.</p></div></div>
        <div class="ap">${icon("budget")}<div><b>Zero booking fees</b><p>We never take a cut. You deal directly with the student or landlord.</p></div></div>
        <div class="ap">${icon("check")}<div><b>EHL-verified</b><p>Student hosts are verified so you know who you're talking to.</p></div></div>
      </div>
      <button class="primary-btn" data-go="home">Start searching</button>`);
  }
  function openHostSheet() {
    sheet(`
      <h1 class="modal-h1">List your place</h1>
      <p class="lede">Got a room, studio or sublet near EHL? Add it in under a minute — it appears instantly on the homepage.</p>
      <form id="hostForm">
        <div class="field"><label>Title / neighbourhood</label><input name="area" required placeholder="e.g. Bright room in Épalinges"></div>
        <div class="field-row">
          <div class="field"><label>City / area</label><input name="city" value="Lausanne" required></div>
          <div class="field"><label>Rent (CHF / month)</label><input name="price" type="number" min="100" required placeholder="950"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Listing type</label><select name="type"><option value="rent">Rent</option><option value="sublease">Sublease</option><option value="flatshare">Flatshare</option></select></div>
          <div class="field"><label>Place type</label><select name="kind"><option value="room">Private room</option><option value="studio">Studio</option><option value="apartment">Whole apartment</option></select></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Minutes to EHL</label><input name="minutes" type="number" min="1" value="15"></div>
          <div class="field"><label>Available from</label><input name="from" type="date" value="2026-09-01"></div>
        </div>
        <div class="field"><label>Description</label><textarea name="desc" placeholder="Tell students what makes your place great…"></textarea></div>
        <div class="field"><label>Your name</label><input name="host" required placeholder="e.g. Andrew"></div>
        <button class="primary-btn" data-submit="host" type="button">Publish listing</button>
      </form>`);
  }
  function openAuthSheet(mode) {
    const isSignup = mode === "signup";
    sheet(`
      <h1 class="modal-h1">${isSignup ? "Sign up" : "Log in"}</h1>
      <p class="lede">${isSignup ? "Join HelpMeFind to save stays and contact hosts." : "Welcome back to HelpMeFind."}</p>
      <button class="social-btn">${svg('<path d="M21 12.2c0-.6-.1-1.2-.2-1.8H12v3.5h5.1a4.4 4.4 0 0 1-1.9 2.9v2.4h3.1A9.3 9.3 0 0 0 21 12.2Z" fill="#4285F4" stroke="none"/><path d="M12 21c2.6 0 4.8-.9 6.3-2.3l-3.1-2.4c-.9.6-2 .9-3.2.9-2.5 0-4.6-1.7-5.3-3.9H3.5v2.5A9.5 9.5 0 0 0 12 21Z" fill="#34A853" stroke="none"/><path d="M6.7 13.3a5.7 5.7 0 0 1 0-3.6V7.2H3.5a9.5 9.5 0 0 0 0 8.6l3.2-2.5Z" fill="#FBBC05" stroke="none"/><path d="M12 6.6c1.4 0 2.6.5 3.6 1.4l2.7-2.7A9.5 9.5 0 0 0 3.5 7.2l3.2 2.5C7.4 8.3 9.5 6.6 12 6.6Z" fill="#EA4335" stroke="none"/>')} Continue with Google</button>
      <div class="divider">or</div>
      <form id="authForm">
        ${isSignup ? '<div class="field"><label>Full name</label><input name="name" required placeholder="Andrew Li"></div>' : ""}
        <div class="field"><label>Email</label><input name="email" type="email" required placeholder="you@ehl.ch"></div>
        <div class="field"><label>Password</label><input name="pw" type="password" required placeholder="••••••••"></div>
        <button class="primary-btn" data-submit="${mode}" type="button">${isSignup ? "Create account" : "Log in"}</button>
      </form>`);
  }
  function filtersCount(form) {
    const p = +form.price.value, m = +form.mins.value, k = form.kind.value;
    const amen = [...form.querySelectorAll('input[name="amen"]:checked')].map((c) => c.value);
    return LISTINGS.filter((l) => {
      if (k !== "any" && l.kind !== k) return false;
      if (p < 2000 && l.price > p) return false;
      if (m < 40 && l.minutes > m) return false;
      if (amen.length && !amen.every((a) => l.amenities.includes(a))) return false;
      return true;
    }).length;
  }
  function openFiltersSheet() {
    const A = [["furnished", "Furnished"], ["wifi", "Fast wifi"], ["wash", "Washing machine"], ["dish", "Dishwasher"], ["bath", "Private bathroom"], ["lake", "Lake view"], ["parking", "Parking"], ["bike", "Bike storage"]];
    sheet(`
      <h1 class="modal-h1">Filters</h1>
      <p class="lede">Dial in your perfect student stay near EHL.</p>
      <form id="filtForm">
        <div class="field"><label>Place type</label>
          <select name="kind">
            <option value="any"${state.kind === "any" ? " selected" : ""}>Any place</option>
            <option value="room"${state.kind === "room" ? " selected" : ""}>Private room</option>
            <option value="studio"${state.kind === "studio" ? " selected" : ""}>Studio</option>
            <option value="apartment"${state.kind === "apartment" ? " selected" : ""}>Whole apartment</option>
          </select>
        </div>
        <div class="field"><label>Max rent: <b id="pOut"></b> / month</label>
          <input name="price" type="range" min="600" max="2000" step="50" value="${state.maxPrice || 2000}"></div>
        <div class="field"><label>Max time to EHL: <b id="mOut"></b></label>
          <input name="mins" type="range" min="5" max="40" step="1" value="${state.maxMinutes || 40}"></div>
        <div class="field"><label>Must have</label>
          <div class="amen-grid">${A.map(([v, lab]) => `<label class="amen-check"><input type="checkbox" name="amen" value="${v}" ${state.amen.has(v) ? "checked" : ""}><span>${lab}</span></label>`).join("")}</div>
        </div>
        <div class="filt-actions">
          <button type="button" class="ghost-btn" id="filtClear">Clear all</button>
          <button class="primary-btn" data-submit="filters" type="button" id="filtApply">Show stays</button>
        </div>
      </form>`);
    const form = $("#filtForm");
    const upd = () => {
      const p = +form.price.value, m = +form.mins.value;
      $("#pOut").textContent = p >= 2000 ? "Any" : fmt(p);
      $("#mOut").textContent = m >= 40 ? "Any" : m + " min";
      $("#filtApply").textContent = `Show ${filtersCount(form)} stays`;
    };
    form.addEventListener("input", upd); upd();
    $("#filtClear").addEventListener("click", () => {
      form.kind.value = "any"; form.price.value = 2000; form.mins.value = 40;
      form.querySelectorAll('input[name="amen"]').forEach((c) => (c.checked = false)); upd();
    });
  }
  $("#filtersBtn").addEventListener("click", openFiltersSheet);

  function handleSheetSubmit(kind) {
    if (kind === "request") {
      const f = $("#reqForm"); if (!f.reportValidity()) return;
      const d = Object.fromEntries(new FormData(f));
      const l = LISTINGS.find((x) => x.id === reqListingId); if (!l) return;
      const existing = state.requests.find((r) => r.id === reqListingId);
      if (existing) Object.assign(existing, { from: d.from || l.from, who: d.who, msg: d.msg });
      else state.requests.unshift({ id: reqListingId, from: d.from || l.from, who: d.who, msg: d.msg });
      saveReqs(); updateSavedCount();
      showRequestConfirm(l);
      return;
    }
    if (kind === "filters") {
      const form = $("#filtForm");
      state.kind = form.kind.value;
      state.maxPrice = +form.price.value >= 2000 ? null : +form.price.value;
      state.maxMinutes = +form.mins.value >= 40 ? null : +form.mins.value;
      state.amen = new Set([...form.querySelectorAll('input[name="amen"]:checked')].map((c) => c.value));
      closeOverlay(); route(); return;
    }
    if (kind === "host") {
      const f = $("#hostForm"); if (!f.reportValidity()) return;
      const d = Object.fromEntries(new FormData(f));
      const id = Math.max(...LISTINGS.map((l) => l.id)) + 1;
      const nl = {
        id, _new: true, area: d.area, city: d.city || "Lausanne", type: d.type, kind: d.kind,
        rooms: d.kind === "room" ? "Room in shared flat" : d.kind === "studio" ? "1.5 rooms" : "2.5 rooms",
        price: +d.price, beds: 1, baths: 1, guests: d.kind === "apartment" ? 3 : 1,
        rating: 5.0, reviews: 0, minutes: +d.minutes || 15, transit: "Near campus", fav: false,
        from: d.from || "2026-09-01", to: null,
        host: { name: d.host, initials: d.host.slice(0, 1).toUpperCase(), student: true, since: 2026 },
        cats: ["new", d.kind === "studio" ? "studio" : d.kind === "apartment" ? "whole" : "shared", (+d.price < 900 ? "budget" : "furnished")],
        amenities: ["wifi", "furnished", "wash", "kitchen", "desk"],
        desc: d.desc || "A great student-friendly place near EHL.",
      };
      setCoords(nl); LISTINGS.unshift(nl);
      closeOverlay();
      resetFilters(); state.view = "results"; render(); scrollToContent();
      toast("🎉 Your listing is live — it's at the top of the results!");
      return;
    }
    if (kind === "login" || kind === "signup") {
      if (!$("#authForm").reportValidity()) return;
      closeOverlay();
      toast(kind === "signup" ? "Welcome to HelpMeFind! 🎓 (demo)" : "Logged in (demo)");
    }
  }

  /* ---------- newsletter ---------- */
  $("#newsForm").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("You're on the list — new rooms incoming ✉️"); });

  /* ---------- expose for map popups ---------- */
  window.HMF = { open: openModal };

  /* ---------- init ---------- */
  { const opts = [...new Set(["Near campus", ...HOODS.map((h) => h.name), ...LISTINGS.map((l) => l.area), ...LISTINGS.map((l) => l.city)])]; $("#whereList").innerHTML = opts.map((o) => `<option value="${o}">`).join(""); }
  render();
  updateCatArrows();
  { const sid = getStayParam(); if (sid && LISTINGS.some((l) => l.id === +sid)) openModal(+sid, true); }
})();
