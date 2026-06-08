const SITE_CONFIG = {
  phone: "48508014420",
  facebookUrl: "https://www.facebook.com/justyna.obara",
  businessName: "Paterka",
};

const BOOKED_DATES = [
  "2024-12-24",
  "2024-12-25",
  "2024-12-26",
  "2026-06-08",
];

const TAG_LABELS = {
  cold: "na zimno",
  hot: "na ciepło",
  vege: "wege",
  salad: "sałatki",
  sweet: "słodkie",
  plyta: "zimna płyta",
};

const PRODUCTS = [
    {
    id: 1,
    name: "Patera nr. 1",
    tags: ["cold"],
    serves: "2-3",
    price: 75,
    note: "Tortilla buraczkowa<br>\
     Tortilla szpinakowa<br>\
     Tortilla meksykańska<br>\
     Tortilla pieczarkowa<br>\
     4x Francuskie bułeczki",
    img: "assets/patery/patera1.jpg",
    available: true,
    popular: false,
  },
  {
    id: 2,
    name: "Patera nr. 2",
    tags: ["cold", "vege"],
    serves: "2-3",
    price: 70,
    note: "Tortilla czosnkowa<br>\
     Tortilla pomidorowa<br>\
     Tortilla pieczarkowa<br>\
     4x Bagietka pomidor<br>\
     4x Bagietka pieczarkowa",
    img: "assets/patery/patera2.jpg",
    available: true,
    popular: false,
  },
  {
    id: 3,
    name: "Patera nr. 3",
    tags: ["cold"],
    serves: "2-3",
    price: 70,
    note: "Tortilla chrzanowa<br>\
     Tortilla paprykowa<br>\
     Tortilla meksykańska<br>\
     4x róze francuskie",
    img: "assets/patery/patera3.jpg",
    available: true,
    popular: false,
  },
  {
    id: 4,
    name: "Patera nr. 4",
    tags: ["cold"],
    serves: "3-4",
    price: 105,
    note: "8x mini hambusie<br>\
    8x bagietka łosos<br>\
    4x bagietka pomidor<br>\
    4x bagietka pieczarka<br>\
    5x francuskie szpinaki<br>\
    5x francuski krupniok<br>\
    5x francuskie salami<br>\
    4x francuskie parówki",
    img: "assets/patery/patera4.jpg",
    available: true,
    popular: false,
  },
  {
    id: 5,
    name: "Patera nr. 5",
    tags: ["cold"],
    serves: "3-4",
    price: 105,
    note: "Tortilla pieczarkowa<br>\
    Tortilla meksykańska<br>\
    Tortilla buraczkowa<br>\
    Tortilla szpinakowa<br>\
    8x babeczki wytrawne<br>\
    6x babeczki francuskie",
    img: "assets/patery/patera5.jpg",
    available: true,
    popular: false,
  },
  {
    id: 6,
    name: "Patera nr. 6",
    tags: ["cold"],
    serves: "4-5",
    price: 105,
    note: "Tortilla meksykańska<br>\
    Tortilla pieczarkowa<br>\
    Tortilla chrzanowa<br>\
    Tortilla czosnkowa<br>\
    Tortilla paprykowa<br>\
    Tortilla pomidorowa<br>\
    3x francuskie szpinaki<br>\
    3x francuski krupniok<br>\
    3x francuskie salami<br>\
    4x francuskie parówki",
    img: "assets/patery/patera6.jpg",
    available: true,
    popular: false,
  },
  {
    id: 7,
    name: "Patera nr. 7",
    tags: ["cold"],
    serves: "6-8",
    price: 145,
    note: "10x mini hambusie<br>\
    4x pierozki pieczone<br>\
    8x paluchy pieczone<br>\
    8x bagietka łosos<br>\
    8x bagietka pieczarka<br>\
    8x bagietka pomidor<br>\
    4x róze francuskie<br>\
    4x francuskie parówki<br>",
    img: "assets/patery/patera7.jpg",
    available: true,
    popular: false,
  },
  {
    id: 8,
    name: "Patera nr. 8",
    tags: ["cold"],
    serves: "6–10",
    price: 145,
    note: "Tortilla meksykańska<br>\
    Tortilla pieczarkowa<br>\
    Tortilla chrzanowa<br>\
    Tortilla czosnkowa<br>\
    Tortilla paprykowa<br>\
    Tortilla pomidorowa<br>\
    Tortilla buraczkowa<br>\
    5x babeczki francuskie",
    img: "assets/patery/patera8.jpg",
    available: true,
    popular: false,
  },
  {
    id: 9,
    name: "Patera nr. 9",
    tags: ["cold"],
    serves: "6-8",
    price: 145,
    note: "Tortilla buraczkowa<br>\
    Tortilla szpinakowa<br>\
    Tortilla czosnkowa<br>\
    Tortilla pomidorowa<br>\
    10x mini hambusie<br>\
    4x babeczki wytrawne<br>\
    3x francuskie salami<br>\
    3x francuskie szpinaki<br>\
    3x francuski krupniok<br>\
    3x babeczki francuskie<br>\
    4x francuskie parówki",
    img: "assets/patery/patera9.jpg",
    available: true,
    popular: false,
  },
  {
    id: 10,
    name: "Patera nr. 10",
    tags: ["cold"],
    serves: "6–10",
    price: 160,
    note: "Tortilla meksykańska<br>\
    Tortilla pieczarkowa<br>\
    Tortilla chrzanowa<br>\
    Tortilla paprykowa<br>\
    Tortilla szpinakowa<br>\
    6x mini hambusie<br>\
    3x pierozki pieczone<br>\
    3x francuskie babeczki<br>\
    3x francuski krupniok<br>\
    3x francuskie róze<br>\
    4x francuskie parówki",
    img: "assets/patery/patera10.jpg",
    available: true,
    popular: false,
  },
  {
    id: 11,
    name: "Patera nr. 11",
    tags: ["cold"],
    serves: "2-3",
    price: 70,
    note: "8x paluchy pieczone<br>\
    4x mini hambusie<br>\
    4x bagietka pomidor<br>\
    4x bagietka pieczarka<br>\
    2x pierozki pieczone",
    img: "assets/patery/patera11.jpg",
    available: true,
    popular: false,
  },
  {
    id: 12,
    name: "Patera nr. 12",
    tags: ["cold"],
    serves: "2-3",
    price: 105,
    note: "Śledź w sosie koperkowym<br>\
    Śledź w sosie musztardowym<br>\
    Śledź w oleju z koperkiem<br>\
    6x bagietka łosos<br>\
    8x makrela na grzance<br>\
    6x koreczki śledziowe",
    img: "assets/patery/patera12.jpg",
    available: true,
    popular: false,
  },
  {
    id: 13,
    name: "Patera nr. 13",
    tags: ["plyta"],
    serves: "2-3",
    price: 75,
    note: "Klasyczna, dla każdego.",
    img: "assets/patery/patera13.jpg",
    available: true,
    popular: false,
  },
  {
    id: 14,
    name: "Patera nr. 14",
    tags: ["plyta"],
    serves: "3-4",
    price: 95,
    note: "Klasyczna, dla każdego.",
    img: "assets/patery/patera14.jpg",
    available: true,
    popular: false,
  },
  {
    id: 15,
    name: "Patera nr. 15",
    tags: ["plyta"],
    serves: "3-4",
    price: 80,
    note: "Klasyczna, dla każdego.",
    img: "assets/patery/patera15.jpg",
    available: true,
    popular: false,
  },
  {
    id: 16,
    name: "Patera nr. 16",
    tags: ["plyta"],
    serves: "6–8",
    price: 120,
    note: "Klasyczna, dla każdego.",
    img: "assets/patery/patera16.jpg",
    available: true,
    popular: false,
  },
  {
    id: 17,
    name: "Patera nr. 17",
    tags: ["plyta"],
    serves: "6-8",
    price: 100,
    note: "Klasyczna, dla każdego.",
    img: "assets/patery/patera17.jpg",
    available: true,
    popular: false,
  },
  {
    id: 18,
    name: "Patera nr. 18",
    tags: ["plyta"],
    serves: "6–10",
    price: 120,
    note: "Klasyczna, dla każdego.",
    img: "assets/patery/patera18.jpg",
    available: true,
    popular: false,
  },
  {
    id: 19,
    name: "Patera nr. 19",
    tags: ["plyta"],
    serves: "6-10",
    price: 120,
    note: "Klasyczna, dla każdego.",
    img: "assets/patery/patera19.jpg",
    available: true,
    popular: false,
  },
  {
    id: 20,
    name: "Patera nr. 20",
    tags: ["cold"],
    serves: "6-10",
    price: 145,
    note: "10x mini hambusie<br>\
    10x mini hot-dogi<br>\
    13x mini takosy<br>\
    8x paluchy pieczone<br>\
    2x sos",
    img: "assets/patery/patera20.jpg",
    available: true,
    popular: true,
  },
  {
    id: 21,
    name: "Patera nr. 21",
    tags: ["cold"],
    serves: "6-10",
    price: 100,
    note: "8x bułeczka z pasztetem<br>\
    8x bułeczka z tatarem<br>\
    8x bułeczka z naszym smalczykiem<br>\
    8x bułeczka z łososiem<br>\
    kabanosy wieprzowe<br>\
    ser warkocz",
    img: "assets/patery/patera21.jpg",
    available: true,
    popular: false,
  },
  {
    id: 22,
    name: "Patera nr. 22",
    tags: ["cold"],
    serves: "6–8",
    price: 100,
    note: "8x galaretka drobiowa<br>\
    8x galaretka wieprzowa",
    img: "assets/patery/patera22.jpg",
    available: true,
    popular: false,
  },
  {
    id: 23,
    name: "Patera nr. 23",
    tags: ["cold"],
    serves: "6-10",
    price: 200,
    note: "Tortilla paprykowa<br>\
    Tortilla czosnkowa<br>\
    21 plasterków wędliny<br>\
    3x galaretka drobiowa<br>\
    3x galaretka wieprzowa<br>\
    2x 200ml salatka gyros<br>\
    2x 200ml salatka musztardowy miód<br>\
    ser turek<br>\
    pasztet pieczony<br>\
    200g tataru<br>\
    ser w plastrach",
    img: "assets/patery/patera23.jpg",
    available: true,
    popular: false,
  },
  {
    id: 24,
    name: "Patera nr. 24",
    tags: ["cold"],
    serves: "6–10",
    price: 200,
    note: "8x bruschatta z burattą i pomidorami<br>\
    ser turek<br>\
    ser z ananasem<br>\
    ser z pomidorami<br>\
    kwasiory<br>\
    Tortilla buraczkowa<br>\
    Tortilla pomidorowa<br>\
    Trotilla czosnkowa<br>\
    2x 200ml sałatka grecka<br>\
    2x 200ml sałatka musztardowy miód",
    img: "assets/patery/patera24.jpg",
    available: true,
    popular: false,
  },
  {
    id: 25,
    name: "Patera nr. 25",
    tags: ["cold"],
    serves: "6–10",
    price: 180,
    note: "4x croissant zwyczajny<br>\
    4x croissant po grecku<br>\
    4x croissant z łososiem<br>\
    4x croissant z pomidorem<br>\
    10x paszteciki z kapustą<br>\
    3x francuzy z pomidorami<br>\
    3x francuzy szpinakowo-paprykowe<br>\
    3x francuzy z szynką i porem",
    img: "assets/patery/patera25.jpg",
    available: true,
    popular: false,
  },
    {
    id: 26,
    name: "Koryto Biesiadne",
    tags: ["hot"],
    serves: "8-10",
    price: 370,
    note: "1kg pieczona soczysta szynka wieprzowa w kształcie swinki<br>\
    0,5kg golonko wieprzowe<br>\
    porcja pasek zeberek<br>\
    3x krupniok<br>\
    1,2kg opiekane ziemniaki<br>\
    500ml kapusta zasmażana",
    img: "assets/koryta/biesiadne.jpg",
    available: true,
    popular: false,
  },
  {
    id: 27,
    name: "Koryto Sycącej Uczty",
    tags: ["hot"],
    serves: "10-12",
    price: 470,
    note: "1kg pieczona soczysta szynka wieprzowa w kształcie swinki<br>\
    0,5kg golonko wieprzowe<br>\
    porcja pasek zeberek<br>\
    3x krupniok<br>\
    1,2kg opiekane ziemniaki<br>\
    500ml kapusta zasmażana<br>\
    30x mix pierogów",
    img: "assets/koryta/sycaca_uczta.jpg",
    available: true,
    popular: false,
  },
  {
    id: 28,
    name: "Koryto Głodomorów",
    tags: ["hot"],
    serves: "8-10",
    price: 300,
    note: "6x zeberka<br>\
    6x kiełbasa<br>\
    6x krupniok<br>\
    6x pieczarka nadziewana<br>\
    3x kiełbasa biała<br>\
    2x bagietka<br>\
    1,2kg opiekane ziemniaki<br>\
    1000ml kapusta zasmażana",
    img: "assets/koryta/kortyo_glodomor.jpg",
    available: true,
    popular: false,
  },
  {
    id: 29,
    name: "Koryto Chłopskie",
    tags: ["hot"],
    serves: "8-10",
    price: 360,
    note: "3x golonko pieczone<br>\
    3x golonko gotowane<br>\
    12x zawijaniec drobiowy w boczku pieczony w sosie BBQ<br>\
    6x pieczarka nadziewana<br>\
    500ml kapusta zasmażana",
    img: "assets/koryta/chlopskie.jpg",
    available: true,
    popular: false,
  },
  {
    id: 30,
    name: "Koryto Mięsna Uczta Szefa",
    tags: ["hot"],
    serves: "8-12",
    price: 380,
    note: "2x schab z kością<br>\
    2x drobiowy panierowany<br>\
    4x nuggetsy drobiowe<br>\
    4x rolsy ze schaby z zurawiną<br>\
    2x donut wytrawny w marynacie musztardowo-miodowej<br>\
    4x wieprz na patyku w marynacie Ballantines<br>\
    2x schab pod pierzynką<br>\
    2x warkocz wieprzowy w marynacie meksykańskiej<br>\
    2x jabłko faszerowane krupniokiem",
    img: "assets/koryta/miesna_uczta.jpg",
    available: true,
    popular: false,
  },
  {
    id: 31,
    name: "Koryto Latające Skrzydło",
    tags: ["hot"],
    serves: "6-10",
    price: 150,
    note: "20x skrzydełka w marynacie słodko-pikantnej<br>\
    1kg frytki zakręcone",
    img: "assets/koryta/skrzydelka.jpg",
    available: true,
    popular: false,
  },
  {
    id: 32,
    name: "Koryto Słodka Ptaszyna",
    tags: ["hot"],
    serves: "4–6",
    price: 130,
    note: "4x pierw zurawinie z serem feta i orzechami<br>\
    200g ryz gotowany",
    img: "assets/koryta/slodka_ptaszyna.jpg",
    available: true,
    popular: false,
  },
  {
    id: 33,
    name: "Koryto Śląska Uczta",
    tags: ["hot"],
    serves: "6-8",
    price: 200,
    note: "800g polędwiczki wieprzowe w sosie z leśnych grzybów<br>\
    40x kluski śląskie",
    img: "assets/koryta/slaska_uczta.jpg",
    available: true,
    popular: false,
  },
  {
    id: 34,
    name: "Wegetariańskie",
    tags: ["hot"],
    serves: "2",
    price: 85,
    note: "1x papryka faszerowana<br>\
    8x pieczarka faszerowana<br>\
    1x camembert panierowany",
    img: "assets/koryta/wege.jpg",
    available: true,
    popular: false,
  },
  {
    id: 35,
    name: "Paterkowa Świnka",
    tags: ["hot"],
    serves: "6-8",
    price: 170,
    note: "1kg pieczona soczysta szynka wieprzowa w kształcie swinki<br>\
    0,8kg opiekane ziemniaki<br>\
    porcja chrzanu<br>\
    porcja musztardy",
    img: "assets/koryta/paterkowa_swinka.jpg",
    available: true,
    popular: false,
  },
  {
    id: 36,
    name: "Paterkowy Wieprz",
    tags: ["hot"],
    serves: "15-20",
    price: 400,
    note: "3kg pieczona soczysta szynka wieprzowa w kształcie swinki<br>\
    1,6 kg opiekane ziemniaki<br>\
    porcja chrzanu<br>\
    porcja musztardy",
    img: "assets/koryta/paterkowa_swinka.jpg",
    available: true,
    popular: false,
  },
  {
    id: 37,
    name: "Drobiowy Półmisek",
    tags: ["hot"],
    serves: "4-8",
    price: 110,
    note: "4x kotlet panierowany<br>\
    4x grillowane kotleciki<br>\
    8x nuggetsy",
    img: "assets/koryta/drobiowy_polmisek.jpg",
    available: true,
    popular: false,
  },
  {
    id: 38,
    name: "Drobiowy Półmisek z kulkami",
    tags: ["hot"],
    serves: "4-8",
    price: 130,
    note: "4x kotlet panierowany<br>\
    4x grillowane kotleciki<br>\
    8x nuggetsy<br>\
    500g kulki opiekane",
    img: "assets/koryta/drobiowy_kuilki.jpg",
    available: true,
    popular: false,
  },
  {
    id: 39,
    name: "Pierogi domowej roboty",
    tags: ["hot"],
    serves: "",
    price: 3,
    note: "Sprzedawane na sztuki, różne rodzaje do wyboru<br>\
    ruskie<br>\
    z mięsem<br>\
    z kapustą i grzybami",
    img: "assets/koryta/pierogi.jpg",
    available: true,
    popular: false,
  },
  {
    id: 40,
    name: "Sałatki domowej roboty 500ml",
    tags: ["salad"],
    serves: "",
    price: 25,
    note: "musztardowy miód<br>\
    grecka<br>\
    gyros<br>\
    kapusta zasmażana na cieplo z boczkiem",
    img: "assets/salatki/salatki.jpg",
    available: true,
    popular: false,
  },

  {
    id: 41,
    name: "Sałatki domowej roboty 1l",
    tags: ["salad"],
    serves: "",
    price: 50,
    note: "musztardowy miód<br>\
    grecka<br>\
    gyros<br>\
    kapusta zasmażana na cieplo z boczkiem",
    img: "assets/salatki/salatki.jpg",
    available: true,
    popular: false,
  },

  {
    id: 42,
    name: "Smalec 200ml",
    tags: ["plyta"],
    serves: "",
    price: 15,
    note: "z boczkiem cebulka i jabłkiem wypalany na ogniu",
    img: "assets/salatki/smalec.jpg",
    available: true,
    popular: false,
  },
];

const LOCAL_GALLERY = [
  {
    img: "assets/patera1.jpg",
    text: "Przykładowa patera na imprezę rodzinną",
    url: SITE_CONFIG.facebookUrl,
    date: "2026-01-01",
  },
  {
    img: "assets/patera1.jpg",
    text: "Koryto na ciepło — przykład realizacji",
    url: SITE_CONFIG.facebookUrl,
    date: "2026-01-02",
  },
  {
    img: "assets/patera1.jpg",
    text: "Patera na spotkanie firmowe",
    url: SITE_CONFIG.facebookUrl,
    date: "2026-01-03",
  },
];
