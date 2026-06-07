const SITE_CONFIG = {
  phone: "48508014420",
  facebookUrl: "https://facebook.com/twojastrona",
  businessName: "Paterka",
};

const BOOKED_DATES = [
  "2026-02-20",
  "2026-02-21"
];

const TAG_LABELS = {
  cold: "na zimno",
  hot: "na ciepło",
  vege: "wege",
};

const PRODUCTS = [
  {
    id: 1,
    name: "Patera nr. 1",
    tags: ["cold"],
    serves: "4–6",
    price: 99,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg",
    available: true,
    popular: true
  },
  {
    id: 2,
    name: "Patera nr. 2",
    tags: ["cold"],
    serves: "6–8",
    price: 119,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg",
    available: true,
    popular: false
  },
  {
    id: 3,
    name: "Patera nr. 3",
    tags: ["cold"],
    serves: "4–6",
    price: 99,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg",
    available: true,
    popular: false
  },
  {
    id: 4,
    name: "Patera nr. 4",
    tags: ["cold"],
    serves: "6–8",
    price: 129,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg",
    available: true,
    popular: true
  },
  {
    id: 5,
    name: "Koryto nr. 1",
    tags: ["hot"],
    serves: "4–6",
    price: 99,
    note: "Klasyczne koryto, dla każdego.",
    img: "assets/patera1.jpg",
    available: true,
    popular: true
  },
];

const LOCAL_GALLERY = [
  {
    img: "assets/patera1.jpg",
    text: "Przykładowa patera na imprezę rodzinną",
    url: SITE_CONFIG.facebookUrl,
    date: "2026-01-01"
  },
  {
    img: "assets/patera1.jpg",
    text: "Koryto na ciepło — przykład realizacji",
    url: SITE_CONFIG.facebookUrl,
    date: "2026-01-02"
  },
  {
    img: "assets/patera1.jpg",
    text: "Patera na spotkanie firmowe",
    url: SITE_CONFIG.facebookUrl,
    date: "2026-01-03"
  }
];