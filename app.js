/* ============================================================
   HelpMeFind — student stays near EHL
   Single-file app: data, rendering, search/filter, modals.
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
    /* amenity icons */
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
  };
  const icon = (name) => svg(ICONS[name] || ICONS.check);
  const star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6.1 6.6.7-5 4.5 1.4 6.5L12 17.6 6.1 20.8l1.4-6.5-5-4.5 6.6-.7z"/></svg>';
  const heartSvg = '<svg viewBox="0 0 24 24"><path class="heart" d="M12 21s-7.5-4.7-10-9.3C.8 9 2 5.5 5.2 5.5c2 0 3.2 1.1 3.8 2.2.6-1.1 1.8-2.2 3.8-2.2 3.2 0 4.4 3.5 3.2 6.2C18.5 16.3 12 21 12 21z"/></svg>';
  const houseGhost = svg('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/>', { sw: 1.4 });

  /* ---------- placeholder image gradients ---------- */
  const GRADS = [
    "linear-gradient(135deg,#FFD9C0,#FFB199)",
    "linear-gradient(135deg,#C2E9FB,#A1C4FD)",
    "linear-gradient(135deg,#FBC2EB,#A18CD1)",
    "linear-gradient(135deg,#D4FC79,#96E6A1)",
    "linear-gradient(135deg,#FFF1EB,#ACE0F9)",
    "linear-gradient(135deg,#FDCBF1,#C3A6E6)",
    "linear-gradient(135deg,#FAD0C4,#FF9A9E)",
    "linear-gradient(135deg,#A8EDEA,#FED6E3)",
  ];
  const gradFor = (n) => GRADS[Math.abs(n) % GRADS.length];
  // curated interior/apartment stock photos (Unsplash). Used as fake listing pics for now.
  const UNSPLASH = [
    "1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1560448204-e02f11c3d0e2",
    "1493809842364-78817add7ffb", "1505693416388-ac5ce068fe85", "1484154218962-a197022b5858",
    "1556912173-3bb406ef7e77", "1540518614846-7eded433c457", "1554995207-c18c203602cb",
    "1493663284031-b7e3aefcae8e", "1567767292278-a4f21aa2d36e", "1522771739844-6a9f6d5f14af",
    "1502005229762-cf1b2da7c5d6", "1586023492125-27b2c045efd7", "1598928506311-c55ded91a20c",
    "1583847268964-b28dc8f51f92", "1505691938895-1758d7feb511", "1556228453-efd6c1ff04f6",
  ];
  // Image with graceful fallback chain: Unsplash photo -> Picsum -> soft gradient (offline).
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

  /* ---------- listings ---------- */
  const TYPE_LABEL = { rent: "Rent", sublease: "Sublease", flatshare: "Flatshare" };
  const KIND_LABEL = { room: "Private room", studio: "Studio", apartment: "Whole apartment" };

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
    { id: 12, area: "Chailly", city: "Lausanne", type: "flatshare", kind: "room", rooms: "Room in 4.5", price: 880, beds: 1, baths: 2, guests: 1, rating: 4.83, reviews: 41, minutes: 18, transit: "Bus 6 / 8", fav: true, from: "2026-08-20", to: null, host: { name: "Tom", initials: "T", student: true, since: 2024 }, cats: ["shared", "furnished", "quiet", "pet"], amenities: ["wifi", "furnished", "wash", "dish", "kitchen", "balcony", "desk"], desc: "Room in a beautiful Chailly flat with a south-facing balcony and two bathrooms. Quiet, green neighbourhood but quick bus into the centre. Cat already in residence 🐈." },
    { id: 13, area: "Montreux", city: "Riviera", type: "rent", kind: "apartment", rooms: "2.5 rooms", price: 1740, beds: 2, baths: 1, guests: 3, rating: 4.93, reviews: 49, minutes: 38, transit: "Direct train to Lausanne", fav: false, from: "2026-08-01", to: null, host: { name: "Riviera Estates", initials: "RE", student: false, since: 2016 }, cats: ["lake", "whole", "furnished", "quiet"], amenities: ["wifi", "furnished", "lake", "wash", "dish", "kitchen", "balcony", "parking", "elevator", "bath"], desc: "Elegant apartment on the Montreux lakefront, walking distance to the Jazz Festival venues. A longer but scenic train commute. Share it and split the view." },
    { id: 14, area: "Le Mont-sur-Lausanne", city: "Lausanne", type: "rent", kind: "studio", rooms: "1.5 rooms", price: 1240, beds: 1, baths: 1, guests: 2, rating: 4.81, reviews: 30, minutes: 12, transit: "Bus 8 / 60", fav: false, from: "2026-09-01", to: null, host: { name: "Dubois SA", initials: "DS", student: false, since: 2019 }, cats: ["campus", "studio", "furnished", "transit", "quiet", "new"], amenities: ["wifi", "furnished", "wash", "kitchen", "desk", "balcony", "heat"], desc: "New studio in Le Mont, one of the closest calm suburbs to EHL. Furnished with a comfy study setup and a small balcony. Quick bus links to campus and town." },
    { id: 15, area: "Lausanne Flon", city: "Lausanne", type: "sublease", kind: "room", rooms: "Room in 3.5", price: 990, beds: 1, baths: 1, guests: 1, rating: 4.74, reviews: 25, minutes: 25, transit: "All metro lines at Flon", fav: false, from: "2026-07-01", to: "2026-09-30", host: { name: "Ines", initials: "I", student: true, since: 2024 }, cats: ["shared", "transit", "short", "furnished"], amenities: ["wifi", "furnished", "wash", "kitchen", "elevator"], desc: "Summer sublet in the heart of Flon — bars, gym and every metro line at your door. Perfect for a summer internship in Lausanne. Three-person flat, fully furnished." },
    { id: 16, area: "Belmont-sur-Lausanne", city: "Lausanne", type: "flatshare", kind: "room", rooms: "Room in 5.5", price: 810, beds: 1, baths: 2, guests: 1, rating: 4.69, reviews: 31, minutes: 14, transit: "Bus 47 to campus", fav: false, from: "2026-09-01", to: null, host: { name: "Gabriel", initials: "G", student: true, since: 2023 }, cats: ["campus", "shared", "budget", "quiet", "pet"], amenities: ["wifi", "furnished", "wash", "dish", "kitchen", "bike", "parking", "balcony"], desc: "Big room in a house-share in Belmont, close to EHL and surrounded by fields. Garden, BBQ, parking and bikes. Five easy-going students, dog-friendly home." },
  ];

  /* ---------- state ---------- */
  const FAV_KEY = "hmf_favs";
  const loadFavs = () => { try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); } catch { return new Set(); } };
  const state = {
    type: "any",
    category: "all",
    where: "",
    kind: "any",
    from: "",
    to: "",
    sort: "recommended",
    maxPrice: null,
    favs: loadFavs(),
  };

  /* ---------- DOM refs ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const grid = $("#grid");
  const catsEl = $("#cats");
  const modalRoot = $("#modalRoot");
  const toastEl = $("#toast");
  const fmt = (n) => "CHF " + n.toLocaleString("de-CH");

  /* ---------- toast ---------- */
  let toastT;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add("show"));
    clearTimeout(toastT);
    toastT = setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => (toastEl.hidden = true), 280);
    }, 3000);
  };

  /* ---------- categories render ---------- */
  function renderCats() {
    catsEl.innerHTML = CATS.map(
      (c) =>
        `<button class="cat ${state.category === c.id ? "is-active" : ""}" data-cat="${c.id}">${icon(c.icon)}<span>${c.label}</span></button>`
    ).join("");
  }
  catsEl.addEventListener("click", (e) => {
    const b = e.target.closest(".cat");
    if (!b) return;
    state.category = b.dataset.cat;
    renderCats();
    render();
  });

  /* ---------- filtering + sorting ---------- */
  function filtered() {
    const w = state.where.trim().toLowerCase();
    let out = LISTINGS.filter((l) => {
      if (state.type !== "any" && l.type !== state.type) return false;
      if (state.kind !== "any" && l.kind !== state.kind) return false;
      if (state.category !== "all" && !l.cats.includes(state.category)) return false;
      if (state.maxPrice && l.price > state.maxPrice) return false;
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
      if (a._new && !b._new) return -1; // freshly-listed places pin to the top
      if (!a._new && b._new) return 1;
      if (s === "price-asc") return a.price - b.price;
      if (s === "price-desc") return b.price - a.price;
      if (s === "closest") return a.minutes - b.minutes;
      if (s === "rating") return b.rating - a.rating || b.reviews - a.reviews;
      return b.rating * Math.log(b.reviews + 1) - a.rating * Math.log(a.reviews + 1); // recommended
    });
    return out;
  }

  /* ---------- card ---------- */
  function cardHTML(l) {
    const fav = state.favs.has(l.id);
    const n = 3; // slides per card
    const slides = Array.from({ length: n }, (_, i) => `<div class="slide">${photo(l.id, i + 1)}</div>`).join("");
    const dots = Array.from({ length: n }, (_, i) => `<i class="${i === 0 ? "on" : ""}"></i>`).join("");
    return `
    <article class="card" data-id="${l.id}">
      <div class="card-media" data-idx="0">
        ${l.fav ? '<span class="card-badge">Student favourite</span>' : ""}
        <button class="card-fav ${fav ? "is-fav" : ""}" data-fav="${l.id}" aria-label="Save">${heartSvg}</button>
        <span class="card-type">${TYPE_LABEL[l.type]}</span>
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
        <div class="card-sub dist">${svg('<path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Z"/><circle cx="12" cy="11" r="2"/>', { sw: 1.5 })} ${l.minutes} min to EHL · ${l.transit}</div>
        <div class="card-price"><b>${fmt(l.price)}</b> <span class="per">/ month</span></div>
      </div>
    </article>`;
  }

  function render() {
    const list = filtered();
    const empty = $("#empty");
    if (!list.length) {
      grid.innerHTML = "";
      empty.hidden = false;
    } else {
      empty.hidden = true;
      grid.innerHTML = list.map(cardHTML).join("");
    }
    const label = state.category !== "all" ? CATS.find((c) => c.id === state.category).label.toLowerCase() : "";
    $("#resultCount").textContent =
      `${list.length} ${list.length === 1 ? "stay" : "stays"}${label && label !== "all" ? " · " + label : ""} near EHL`;
  }

  /* ---------- carousel + fav + open (event delegation) ---------- */
  grid.addEventListener("click", (e) => {
    const favBtn = e.target.closest("[data-fav]");
    if (favBtn) {
      e.stopPropagation();
      const id = +favBtn.dataset.fav;
      if (state.favs.has(id)) state.favs.delete(id);
      else { state.favs.add(id); }
      favBtn.classList.toggle("is-fav");
      localStorage.setItem(FAV_KEY, JSON.stringify([...state.favs]));
      return;
    }
    const cz = e.target.closest("[data-cz]");
    if (cz) {
      e.stopPropagation();
      const media = cz.closest(".card-media");
      const car = $(".card-carousel", media);
      const total = car.children.length;
      let idx = +media.dataset.idx;
      idx += cz.dataset.cz === "next" ? 1 : -1;
      idx = Math.max(0, Math.min(total - 1, idx));
      media.dataset.idx = idx;
      car.style.transform = `translateX(-${idx * 100}%)`;
      $(".cz-btn.prev", media).disabled = idx === 0;
      $(".cz-btn.next", media).disabled = idx === total - 1;
      [...$(".dots", media).children].forEach((d, i) => d.classList.toggle("on", i === idx));
      return;
    }
    const card = e.target.closest(".card");
    if (card) openModal(+card.dataset.id);
  });

  /* ---------- detail modal ---------- */
  const AMEN_LABEL = {
    wifi: "Fast wifi", furnished: "Fully furnished", wash: "Washing machine", dish: "Dishwasher",
    kitchen: "Equipped kitchen", desk: "Dedicated desk", bath: "Private bathroom", balcony: "Balcony",
    lake: "Lake view", bike: "Bike storage", heat: "Heating incl.", parking: "Parking", elevator: "Lift",
  };

  function openModal(id) {
    const l = LISTINGS.find((x) => x.id === id);
    if (!l) return;
    const fav = state.favs.has(id);
    const deposit = l.price * 2;
    const fee = 0; // HelpMeFind takes no booking fee — nice selling point
    const gallery = Array.from({ length: 5 }, (_, i) => `<div class="g">${photo(l.id, i + 1, 800, 700)}</div>`).join("");
    const amens = l.amenities.map((a) => `<div class="amen">${icon(a)}<span>${AMEN_LABEL[a] || a}</span></div>`).join("");
    const term = l.to
      ? `Available ${fmtDate(l.from)} – ${fmtDate(l.to)}`
      : `Available from ${fmtDate(l.from)}`;

    modalRoot.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="${l.area} listing">
      <div class="modal-top">
        <button class="modal-x" data-close aria-label="Close">${svg('<path d="M6 6l12 12M18 6 6 18"/>', { sw: 2 })}</button>
        <div class="modal-actions">
          <button class="modal-share" data-share>${svg('<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>', { sw: 1.8 })} Share</button>
          <button class="modal-share" data-fav2="${l.id}">${svg('<path d="M12 21s-7-5-9.5-9C.8 9 2 5.7 5 5.7c1.9 0 3.1 1.1 3.7 2.2.6-1.1 1.8-2.2 3.7-2.2 3 0 4.2 3.3 2.5 6.3C19 16 12 21 12 21Z"/>', { sw: 1.8, fill: fav ? "var(--rausch)" : "none" })} ${fav ? "Saved" : "Save"}</button>
        </div>
      </div>
      <div class="modal-body">
        <h1 class="modal-h1">${l.area}, ${l.city}</h1>
        <div class="modal-meta">
          <span class="star">${l.reviews ? star + " " + l.rating.toFixed(2) : "✦ New"}</span>
          <span class="sep">·</span>
          <a href="#">${l.reviews ? l.reviews + " reviews" : "No reviews yet"}</a>
          <span class="sep">·</span>
          <span>${l.minutes} min to EHL</span>
          <span class="sep">·</span>
          <span>${TYPE_LABEL[l.type]} · ${l.rooms}</span>
        </div>

        <div class="gallery">${gallery}</div>

        <div class="modal-grid">
          <div class="mc-left">
            <h3>${KIND_LABEL[l.kind]} hosted by ${l.host.name}</h3>
            <p class="card-sub">${l.guests} guest${l.guests > 1 ? "s" : ""} · ${l.beds} bed · ${l.baths} bath · ${l.rooms}</p>

            <div class="mc-host">
              <span class="h-av">${l.host.initials}</span>
              <div>
                <div class="h-name">Hosted by ${l.host.name}</div>
                <div class="h-sub">${l.host.student ? "EHL student · " : "Professional host · "}on HelpMeFind since ${l.host.since}</div>
              </div>
              ${l.host.student ? `<span class="verified" style="margin-left:auto">${icon("check")} EHL verified</span>` : ""}
            </div>

            <div class="feat">
              <div class="f">${icon("campus")}<div><b>Close to campus</b><p>${l.transit}</p></div></div>
              <div class="f">${icon("short")}<div><b>${l.to ? "Fixed term" : "Long term"}</b><p>${term}</p></div></div>
              <div class="f">${icon(l.type === "flatshare" ? "shared" : "studio")}<div><b>${TYPE_LABEL[l.type]}</b><p>${l.type === "flatshare" ? "Shared flat" : l.type === "sublease" ? "Temporary sublet" : "Direct rental"}</p></div></div>
            </div>

            <div class="mc-desc">${l.desc}</div>

            <h3 class="amen-title">What this place offers</h3>
            <div class="amens">${amens}</div>

            <div class="mc-map">
              <h3 class="amen-title">Where you'll be</h3>
              <div class="map">
                <div class="road" style="top:42%;left:0;right:0;height:10px"></div>
                <div class="road" style="left:58%;top:0;bottom:0;width:10px"></div>
                <div class="road" style="top:70%;left:0;right:0;height:6px"></div>
                <div class="campus">EHL</div>
                <div class="pin">${svg('<path d="M12 2C7.6 2 4 5.6 4 10c0 5.4 6.6 11.4 7.3 12.1.4.4 1 .4 1.4 0C13.4 21.4 20 15.4 20 10c0-4.4-3.6-8-8-8Z" fill="currentColor" stroke="#fff"/><circle cx="12" cy="10" r="2.6" fill="#fff" stroke="none"/>', {})}</div>
              </div>
              <p class="card-sub" style="margin-top:10px">${l.area}, ${l.city} · exact address shared after you connect with the host.</p>
            </div>
          </div>

          <aside class="book">
            <div class="book-price">${fmt(l.price)} <span>/ month</span></div>
            <div class="book-rate">${l.reviews ? star + " " + l.rating.toFixed(2) + " · " + l.reviews + " reviews" : "✦ New listing"}</div>
            <div class="book-fields">
              <div class="bf-row">
                <div class="bf"><label>Move in</label><input type="date" value="${l.from}" data-bf="from"></div>
                <div class="bf"><label>Move out</label><input type="date" value="${l.to || ""}" data-bf="to"></div>
              </div>
              <div class="bf-row"><div class="bf" style="flex:1 1 100%"><label>Looking as</label><select data-bf="who"><option>Tenant</option><option>Couple</option><option>Student</option></select></div></div>
            </div>
            <button class="book-btn" data-request="${l.id}">Request to view</button>
            <p class="book-hint">No booking fees · You won't be charged yet</p>
            <div class="book-break">
              <div class="br"><span>First month's rent</span><span>${fmt(l.price)}</span></div>
              <div class="br"><span>Deposit (2 months)</span><span>${fmt(deposit)}</span></div>
              <div class="br"><span>HelpMeFind fee</span><span>${fmt(fee)}</span></div>
              <div class="total"><span>Due at move-in</span><span>${fmt(l.price + deposit)}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>`;
    openOverlay();
  }

  /* ---------- overlay helpers ---------- */
  function openOverlay() {
    modalRoot.hidden = false;
    document.body.style.overflow = "hidden";
    modalRoot.scrollTop = 0;
  }
  function closeOverlay() {
    modalRoot.hidden = true;
    modalRoot.innerHTML = "";
    document.body.style.overflow = "";
  }
  modalRoot.addEventListener("click", (e) => {
    if (e.target === modalRoot || e.target.closest("[data-close]")) return closeOverlay();
    if (e.target.closest("[data-share]")) return toast("Listing link copied to clipboard (demo)");
    const f2 = e.target.closest("[data-fav2]");
    if (f2) {
      const id = +f2.dataset.fav2;
      if (state.favs.has(id)) state.favs.delete(id); else state.favs.add(id);
      localStorage.setItem(FAV_KEY, JSON.stringify([...state.favs]));
      openModal(id); // re-render save state
      render();
      return;
    }
    const req = e.target.closest("[data-request]");
    if (req) {
      const l = LISTINGS.find((x) => x.id === +req.dataset.request);
      toast(`Request sent to ${l.host.name}! They'll reply by email (demo).`);
      closeOverlay();
    }
    const sub = e.target.closest("[data-submit]");
    if (sub) handleSheetSubmit(sub.dataset.submit, e);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalRoot.hidden) closeOverlay();
  });

  function fmtDate(s) {
    if (!s) return "";
    const [y, m, d] = s.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${+d} ${months[+m - 1]} ${y}`;
  }

  /* ---------- search / type / sort wiring ---------- */
  $("#searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    state.where = $("#qWhere").value;
    state.from = $("#qFrom").value;
    state.to = $("#qTo").value;
    state.kind = $("#qWho").value;
    render();
    window.scrollTo({ top: $(".cats-row").offsetTop - 70, behavior: "smooth" });
  });

  $("#typeToggle").addEventListener("click", (e) => {
    const b = e.target.closest(".type-pill");
    if (!b) return;
    [...e.currentTarget.children].forEach((p) => p.classList.toggle("is-active", p === b));
    state.type = b.dataset.type;
    render();
  });

  $("#sortSel").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  $("#clearAll").addEventListener("click", () => {
    Object.assign(state, { type: "any", category: "all", where: "", kind: "any", from: "", to: "", maxPrice: null });
    $("#qWhere").value = ""; $("#qFrom").value = ""; $("#qTo").value = ""; $("#qWho").value = "any"; $("#sortSel").value = "recommended";
    state.sort = "recommended";
    [...$("#typeToggle").children].forEach((p, i) => p.classList.toggle("is-active", i === 0));
    renderCats();
    render();
  });

  /* ---------- category scroll buttons ---------- */
  const updateCatArrows = () => {
    $("#catLeft").hidden = catsEl.scrollLeft < 10;
    $("#catRight").hidden = catsEl.scrollLeft > catsEl.scrollWidth - catsEl.clientWidth - 10;
  };
  $("#catLeft").addEventListener("click", () => { catsEl.scrollBy({ left: -240, behavior: "smooth" }); });
  $("#catRight").addEventListener("click", () => { catsEl.scrollBy({ left: 240, behavior: "smooth" }); });
  catsEl.addEventListener("scroll", updateCatArrows);

  /* ---------- header scroll state + mini search ---------- */
  const hdr = $("#hdr");
  window.addEventListener("scroll", () => hdr.classList.toggle("scrolled", window.scrollY > 24), { passive: true });
  $("#miniSearch").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- profile menu ---------- */
  const menu = $("#profileMenu");
  $("#profileBtn").addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
  document.addEventListener("click", () => (menu.hidden = true));
  menu.addEventListener("click", (e) => {
    const it = e.target.closest("[data-action]");
    if (!it) return;
    handleAction(it.dataset.action);
  });
  $("#globeBtn").addEventListener("click", () => toast("Language: English · Currency: CHF (demo)"));
  document.body.addEventListener("click", (e) => {
    const a = e.target.closest("[data-action]");
    if (a && !a.closest("#profileMenu")) { e.preventDefault(); handleAction(a.dataset.action); }
  });
  $("#hostLink").addEventListener("click", (e) => { e.preventDefault(); handleAction("host"); });

  function handleAction(a) {
    menu.hidden = true;
    if (a === "host") return openHostSheet();
    if (a === "login" || a === "signup") return openAuthSheet(a);
    if (a === "favs") {
      const n = state.favs.size;
      toast(n ? `You have ${n} saved stay${n > 1 ? "s" : ""} ❤` : "Tap the heart on a listing to save it");
      return;
    }
    if (a === "help") return toast("Help Centre coming soon (demo)");
  }

  /* ---------- sheets (host / auth) ---------- */
  function sheet(html) {
    modalRoot.innerHTML = `<div class="modal sheet"><div class="modal-top"><button class="modal-x" data-close>${svg('<path d="M6 6l12 12M18 6 6 18"/>', { sw: 2 })}</button><h2></h2><span style="width:34px"></span></div><div class="modal-body">${html}</div></div>`;
    openOverlay();
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

  function handleSheetSubmit(kind, e) {
    if (kind === "host") {
      const f = $("#hostForm");
      if (!f.reportValidity()) return;
      const d = Object.fromEntries(new FormData(f));
      const id = Math.max(...LISTINGS.map((l) => l.id)) + 1;
      LISTINGS.unshift({
        id,
        _new: true,
        area: d.area, city: d.city || "Lausanne",
        type: d.type, kind: d.kind,
        rooms: d.kind === "room" ? "Room in shared flat" : d.kind === "studio" ? "1.5 rooms" : "2.5 rooms",
        price: +d.price, beds: 1, baths: 1, guests: d.kind === "apartment" ? 3 : 1,
        rating: 5.0, reviews: 0, minutes: +d.minutes || 15,
        transit: "Near campus", fav: false, from: d.from || "2026-09-01", to: null,
        host: { name: d.host, initials: d.host.slice(0, 1).toUpperCase(), student: true, since: 2026 },
        cats: ["new", d.kind === "studio" ? "studio" : d.kind === "apartment" ? "whole" : "shared", (+d.price < 900 ? "budget" : "furnished")],
        amenities: ["wifi", "furnished", "wash", "kitchen", "desk"],
        desc: d.desc || "A great student-friendly place near EHL.",
      });
      closeOverlay();
      Object.assign(state, { type: "any", category: "all", sort: "recommended" });
      [...$("#typeToggle").children].forEach((p, i) => p.classList.toggle("is-active", i === 0));
      $("#sortSel").value = "recommended";
      renderCats();
      render();
      window.scrollTo({ top: $(".cats-row").offsetTop - 70, behavior: "smooth" });
      toast("🎉 Your listing is live — it's at the top of the page!");
      return;
    }
    if (kind === "login" || kind === "signup") {
      const f = $("#authForm");
      if (!f.reportValidity()) return;
      closeOverlay();
      toast(kind === "signup" ? "Welcome to HelpMeFind! 🎓 (demo)" : "Logged in (demo)");
    }
  }

  /* ---------- newsletter ---------- */
  $("#newsForm").addEventListener("submit", (e) => { e.preventDefault(); e.target.reset(); toast("You're on the list — new rooms incoming ✉️"); });
  $("#filtersBtn").addEventListener("click", openFiltersSheet);

  function openFiltersSheet() {
    sheet(`
      <h1 class="modal-h1">Filters</h1>
      <p class="lede">Narrow down to your perfect student stay.</p>
      <form id="filtForm">
        <div class="field">
          <label>Max budget: <b id="priceOut">${state.maxPrice ? fmt(state.maxPrice) : "Any"}</b> / month</label>
          <input name="price" type="range" min="600" max="2000" step="50" value="${state.maxPrice || 2000}" style="width:100%" oninput="document.getElementById('priceOut').textContent = this.value>=2000?'Any':'CHF '+(+this.value).toLocaleString('de-CH')">
        </div>
        <div class="field"><label>Place type</label>
          <select name="kind">
            <option value="any"${state.kind === "any" ? " selected" : ""}>Any</option>
            <option value="room"${state.kind === "room" ? " selected" : ""}>Private room</option>
            <option value="studio"${state.kind === "studio" ? " selected" : ""}>Studio</option>
            <option value="apartment"${state.kind === "apartment" ? " selected" : ""}>Whole apartment</option>
          </select>
        </div>
        <button class="primary-btn" data-submit="filters" type="button">Show stays</button>
      </form>`);
  }

  // hook filters submit into the same delegated handler
  const _origSheetSubmit = handleSheetSubmit;
  handleSheetSubmit = function (kind, e) {
    if (kind === "filters") {
      const f = $("#filtForm");
      const d = Object.fromEntries(new FormData(f));
      state.maxPrice = +d.price >= 2000 ? null : +d.price;
      state.kind = d.kind;
      $("#qWho").value = d.kind;
      closeOverlay();
      render();
      return;
    }
    return _origSheetSubmit(kind, e);
  };

  /* ---------- init ---------- */
  renderCats();
  render();
  updateCatArrows();
})();
