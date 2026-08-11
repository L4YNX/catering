/*
  ============================================================================
  MAPA PLIKU app.js — LOGIKA I INTERAKCJE STRONY
  ============================================================================
  Ten plik łączy dane z data.js z elementami index.html. Generuje produkty,
  obsługuje filtrowanie, koszyk, panel zamówienia i wiadomość WhatsApp.

  Użyj ⌘ + F i wyszukaj:
  [JS-00] Główny przełącznik zamówień
  [JS-01] Podstawowe narzędzia i połączenie z HTML
  [JS-02] Stan strony oraz localStorage
  [JS-03] Tworzenie kart i renderowanie katalogu
  [JS-04] Filtry i wyszukiwarka
  [JS-05] Koszyk, ilości i suma
  [JS-06] Terminy i tekst wiadomości WhatsApp
  [JS-07] Kliknięcia: dodawanie, usuwanie i wybór wariantów
  [JS-08] Panel zamówienia i menu mobilne
  [JS-09] Odbiór, dowóz i checklista
  [JS-10] Galeria
  [JS-11] Godziny i Najpopularniejsze
  [JS-12] Kontakt oraz drobne ułatwienia nawigacji
  [JS-13] Uruchomienie strony

  Zanim zmienisz nazwę id lub klasy, wyszukaj ją w całym projekcie. Wiele nazw
  jest wspólnych dla HTML, CSS i JavaScriptu.
  ============================================================================
*/

// ====== [JS-01] PODSTAWOWE NARZĘDZIA ======
const $ = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
function money(n){ return `${n} zł`; }

// Ustawienia są pobierane z data.js. Tam zmieniaj telefon i terminy.
const WA_NUMBER = SITE_CONFIG.phone; // numer z data.js, bez + i bez spacji
const BOOKED = BOOKED_DATES; // zajęte terminy z data.js

/*
  ============================================================================
  [JS-00] GŁÓWNY PRZEŁĄCZNIK ZAMÓWIEŃ
  ============================================================================
  true  = klienci mogą dodawać produkty i wysyłać zamówienie przez WhatsApp,
  false = cały mechanizm zamawiania jest wyłączony.

  Po ustawieniu false strona nadal pokazuje menu, ceny, galerię i kontakt, ale:
  - przyciski „Dodaj” są nieaktywne,
  - nie można otworzyć panelu zamówienia,
  - nie można skopiować ani wysłać treści zamówienia przez WhatsApp.

  To jest blokada interfejsu statycznej strony. Nie zastępuje blokady serwerowej,
  ale ta witryna nie wysyła zamówień do żadnego serwera — otwiera tylko WhatsApp.
  ============================================================================
*/
const ORDERS_ENABLED = false;
const ORDERS_DISABLED_MESSAGE = "Zamawianie przez stronę jest na razie niedostępne. Zapraszam do kontaktu przez Facebooka lub WhatsApp :)";

/*
  [JS-01] POŁĄCZENIE Z ELEMENTAMI HTML
  Stałe poniżej przechowują znalezione elementy strony. Znak ?. oznacza:
  "wykonaj tylko wtedy, gdy element istnieje", dzięki czemu brak jednego
  elementu nie zatrzyma całej strony.
*/
const yearEl = $("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const grids = {
  cold:  $("gridCold"),
  hot:   $("gridHot"),
  vege:  $("gridVege"),
  salad: $("gridSalad"),
  sweet: $("gridSweet"),
  plyta: $("gridPlyta"),
};

const counters = {
  cold:  $("countCold"),
  hot:   $("countHot"),
  vege:  $("countVege"),
  salad: $("countSalad"),
  sweet: $("countSweet"),
  plyta: $("countPlyta"),
};

const accDetails = {
  cold:  grids.cold?.closest("details") ?? null,
  hot:   grids.hot?.closest("details") ?? null,
  vege:  grids.vege?.closest("details") ?? null,
  sweet: grids.sweet?.closest("details") ?? null,
  salad: grids.salad?.closest("details") ?? null,
  plyta: grids.plyta?.closest("details") ?? null,
};

const q = $("q");
const segBtns = $$(".seg__btn");

const panel = $("panel");
const items = $("items");

const dateEl    = $("date");
const timeHourEl = $("timeHour");
const timeMinEl  = $("timeMin");
const warnEl    = $("dateWarn");
const waBtn  = $("wa");
const copyBtn = $("copy");
const whereEl = $("where");

/*
  ============================================================================
  [JS-02] STAN STRONY I ZAPIS KOSZYKA
  ============================================================================
  active przechowuje aktualny filtr, a cart jest mapą: produkt -> ilość.
  localStorage zachowuje sam koszyk po odświeżeniu. Dane klienta, adres i uwagi
  nie są zapisywane. Zmiana CART_STORAGE_KEY tworzy nowy, pusty koszyk.
*/
let active = "all";
let cart = new Map(); // key -> qty  (key: "id" lub "id:rozmiar")
const CART_STORAGE_KEY = "paterka-cart-v1";
let cartRestored = false;

function cartKey(id, sizeLabel, flavor){
  // klucz: "id|rozmiar|smak" (puste pola dozwolone)
  return [id, sizeLabel || "", flavor || ""].join("|");
}

function resolveCartItem(key){
  let id, sizeLabel = null, flavor = null;
  if(key.includes("|")){
    const parts = key.split("|");
    id = Number(parts[0]);
    sizeLabel = parts[1] || null;
    flavor = parts[2] || null;
  } else {
    // zgodność wstecz ze starym formatem "id:rozmiar"
    const colonIdx = key.indexOf(":");
    id = Number(colonIdx >= 0 ? key.slice(0, colonIdx) : key);
    sizeLabel = colonIdx >= 0 ? key.slice(colonIdx + 1) : null;
  }
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return null;

  let price = p.price, serves = p.serves || "";
  if(sizeLabel && p.sizes){
    const sz = p.sizes.find(s => s.label === sizeLabel);
    price = sz?.price ?? 0;
    serves = sz?.serves ?? "";
  }
  return { p, sizeLabel, flavor, price, serves };
}

// W localStorage zapisujemy wyłącznie identyfikatory produktów i ilości.
// Nie zapisujemy adresu, uwag ani innych danych klienta.
function restoreCart(){
  if(cartRestored) return;
  cartRestored = true;

  try{
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if(!Array.isArray(saved)) return;

    cart = new Map(saved.filter(entry => {
      if(!Array.isArray(entry) || entry.length !== 2) return false;
      const [key, qty] = entry;
      return typeof key === "string" && Number.isInteger(qty) && qty > 0 && resolveCartItem(key);
    }));
  }catch{
    // Uszkodzony lub zablokowany localStorage nie może zepsuć strony.
    cart = new Map();
  }
}

function saveCart(){
  try{
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(Array.from(cart.entries())));
  }catch{
    // Tryb prywatny może blokować zapis — koszyk nadal działa w pamięci strony.
  }
}

function total(){
  let sum = 0;
  for(const [key, qty] of cart.entries()){
    const item = resolveCartItem(key);
    if(item) sum += item.price * qty;
  }
  return sum;
}

/*
  ============================================================================
  [JS-03] TWORZENIE POJEDYNCZEJ KARTY PRODUKTU
  ============================================================================
  cardHTML() dostaje jeden obiekt z PRODUCTS i zwraca tekst HTML karty.
  Rozmiary, smaki oraz pole ilości pojawiają się automatycznie, jeśli produkt
  ma pola sizes, flavors lub qtyInput. loading="lazy" ogranicza pobieranie
  zdjęć znajdujących się daleko poza ekranem.
*/
function cardHTML(p){
  const typeLabel = TAG_LABELS[p.tags[0]] || p.tags[0];
  // loading="lazy" działa na <img>, ale nie na CSS background-image.
  const photo = p.img
    ? `<img class="thumb__img" src="${p.img}" alt="${escapeHTML(p.name)}" loading="lazy" decoding="async" width="800" height="600">`
    : "";
  const pills = p.tags.map(t => TAG_LABELS[t]).filter(Boolean).map(lbl => `<span class="pill">${lbl}</span>`).join("");
  const addDisabled = ORDERS_ENABLED
    ? ""
    : `disabled aria-disabled="true" title="${escapeHTML(ORDERS_DISABLED_MESSAGE)}"`;
  const addLabel = ORDERS_ENABLED ? "Dodaj" : "Zamawianie niedostępne";

  // Produkt konfigurowalny: wybór smaku/rozmiaru i/lub własny wpis
  const hasSizes   = p.sizes   && p.sizes.length   > 0;
  const hasFlavors = p.flavors && p.flavors.length > 0;
  const hasQty     = !!p.qtyInput;
  if(hasSizes || hasFlavors || hasQty){
    const startPrice = hasSizes ? p.sizes[0].price : p.price;

    const sizeOptions = hasSizes ? p.sizes.map(s =>
      `<option value="${s.label}" data-price="${s.price}">${s.label} — ${money(s.price)}</option>`
    ).join("") : "";

    const flavorOptions = hasFlavors ? p.flavors.map(f =>
      `<option value="${f}">${f}</option>`
    ).join("") : "";

    const flavorSelect = hasFlavors
      ? `<label class="optField"><span class="optLabel">Smak</span>
           <select class="flavorSelect" data-product-id="${p.id}">${flavorOptions}</select></label>`
      : "";

    const sizeSelect = hasSizes
      ? `<label class="optField"><span class="optLabel">Rozmiar</span>
           <select class="sizeSelect" data-product-id="${p.id}">${sizeOptions}</select></label>`
      : "";

    const qtyField = hasQty
      ? `<label class="optField optField--qty"><span class="optLabel">Ilość (szt.)</span>
           <input type="number" class="qtyInput" data-product-id="${p.id}"
                  value="1" min="1" step="1" inputmode="numeric"></label>`
      : "";

    return `
      <article class="card" data-card-id="${p.id}">
        <div class="thumb thumb--photo">
          ${photo}
          <span class="pTag">${typeLabel}</span>
        </div>
        <div class="cardBody">
          <div class="titleRow">
            <strong>${p.name}</strong>
            <span class="price2 sizePrice">${money(startPrice)}</span>
          </div>
          <div class="sub">${p.note}</div>
          ${pills ? `<div class="metaRow">${pills}</div>` : ""}
          <div class="optRow">
            ${flavorSelect}
            ${sizeSelect}
            ${qtyField}
          </div>
          <div class="buyRow">
            <span></span>
            <button class="add" data-add="${p.id}" data-sized="1" ${addDisabled}>${addLabel}</button>
          </div>
        </div>
      </article>
    `;
  }

  // Zwykły produkt
  return `
    <article class="card" data-card-id="${p.id}">
      <div class="thumb thumb--photo">
        ${photo}
        <span class="pTag">${typeLabel}</span>
        ${p.serves ? `<span class="pTag">dla ${p.serves}</span>` : ""}
      </div>
      <div class="cardBody">
        <div class="titleRow">
          <strong>${p.name}</strong>
          <span class="price2">${money(p.price)}</span>
        </div>
        <div class="sub">${p.note}</div>
        ${pills ? `<div class="metaRow">${pills}</div>` : ""}
        <div class="buyRow">
          <span></span>
          <button class="add" data-add="${p.id}" ${addDisabled}>${addLabel}</button>
        </div>
      </div>
    </article>
  `;
}

/*
  ============================================================================
  [JS-03] RENDEROWANIE CAŁEGO KATALOGU
  ============================================================================
  render() filtruje PRODUCTS według wyszukiwanej nazwy i wybranego tagu,
  następnie wstawia karty do odpowiednich #grid... z index.html.
*/
function render(){
  const term = (q?.value || "").trim().toLowerCase();

  const baseList = PRODUCTS.filter(p => p.available !== false).filter(p => {
    const okQ = !term || p.name.toLowerCase().includes(term);
    const okF = active === "all" || p.tags.includes(active);
    return okQ && okF;
  });

  function fill(key, filterFn){
    const grid = grids[key];
    const counter = counters[key];
    const det = accDetails[key];
    const filterBtn = segBtns.find(b => b.dataset.filter === key);

    const totalInCategory = PRODUCTS.filter(p => p.available !== false).filter(filterFn).length;
    const hidden = totalInCategory === 0;
    if (det) det.style.display = hidden ? "none" : "";
    if (filterBtn) filterBtn.style.display = hidden ? "none" : "";
    if (hidden) return;

    const list = baseList.filter(filterFn);
    if (grid) grid.innerHTML = list.map(cardHTML).join("") || `<div class="muted">Brak pozycji.</div>`;
    if (counter) counter.textContent = `(${list.length})`;
  }

  fill("cold", p => p.tags.includes("cold") && !p.tags.includes("hot"));
  fill("hot",  p => p.tags.includes("hot"));
  fill("vege", p => p.tags.includes("vege"));
  fill("salad", p => p.tags.includes("salad"));
  fill("sweet", p => p.tags.includes("sweet"));
  fill("plyta", p => p.tags.includes("plyta"));

  // otwieranie sekcji zależnie od filtra
  if (active === "all"){
    Object.values(accDetails).forEach(d => { if(d) d.open = true; });
  } else {
    Object.entries(accDetails).forEach(([k, d]) => {
      if(!d) return;
      d.open = (k === active);
    });
  }
}

/* [JS-04] FILTRY — ustawia aktywny tag i ponownie renderuje katalog. */
function setFilter(filter){
  active = filter;
  segBtns.forEach(b => b.classList.toggle("is-active", b.dataset.filter === filter));
  render();
}

/*
  ============================================================================
  [JS-05] WIDOK KOSZYKA, ILOŚCI I SUMA
  ============================================================================
  updateUI() jest centralną funkcją koszyka. Po każdej zmianie zapisuje koszyk,
  aktualizuje licznik, sumę, listę pozycji i ponownie uruchamia walidację.
*/
function bumpCount(){
  const c = $("count");
  if(!c) return;
  c.classList.remove("count--bump");
  void c.offsetWidth; // restart animacji
  c.classList.add("count--bump");
}

function updateUI(){
  saveCart();
  const count = Array.from(cart.values()).reduce((a,b)=>a+b,0);

  const countEl = $("count");
  if (countEl) countEl.textContent = count;

  const totalEl = $("total");
  if (totalEl) totalEl.textContent = money(total());

  validateForm();

  if(!items) return;

  if(cart.size === 0){
    items.innerHTML = `<div class="muted">Koszyk pusty. Dodaj patery z katalogu.</div>`;
    validateForm();
    return;
  }

  const itemsHTML = Array.from(cart.entries()).map(([key, qty]) => {
    const item = resolveCartItem(key);
    if(!item) return "";
    const { p, sizeLabel, flavor, price, serves } = item;
    const opts = [flavor, sizeLabel].filter(Boolean).join(", ");
    const name = opts ? `${p.name} <span class="muted">(${opts})</span>` : p.name;
    const servesText = serves ? ` • dla ${serves}` : "";
    return `
      <div class="lineItem">
        <div>
          <strong>${name}</strong>
          <div class="muted tiny">${money(price)} / szt.${servesText}</div>
        </div>
        <div class="qty">
          <button data-dec="${key}">−</button>
          <span>${qty}</span>
          <button data-inc="${key}">+</button>
        </div>
      </div>
    `;
  }).join("");

  // Pozycja transportu — tylko przy dowozie, bez ceny
  const transportHTML = deliveryMode === "dowoz" ? `
      <div class="lineItem lineItem--info">
        <div>
          <strong>🚗 Transport (dowóz)</strong>
          <div class="muted tiny">Cena ustalana indywidualnie — cena zamówienia moze ulec zmianie</div>
        </div>
      </div>
    ` : "";

  items.innerHTML = itemsHTML + transportHTML;
}

/*
  ============================================================================
  [JS-06] SPRAWDZANIE TERMINU
  ============================================================================
  Data jest porównywana z BOOKED_DATES z data.js. Minimalną datą jest jutro.
  To sprawdzenie działa w przeglądarce i nie rezerwuje terminu na serwerze.
*/
function isBooked(dateStr){ return BOOKED.includes(dateStr); }

function validateDate(){
  const d = dateEl?.value;
  const booked = !!(d && isBooked(d));

  if(booked){
    warnEl && (warnEl.textContent = "⛔ Ten termin jest zajęty. Wybierz inną datę.");
    warnEl?.classList.add("is-show");
  } else {
    warnEl && (warnEl.textContent = "");
    warnEl?.classList.remove("is-show");
  }

  return !booked;
}

// ustaw min. na jutro, ale nie ustawiaj domyślnej daty — data jest opcjonalna
if(dateEl){
  const d = new Date();
  d.setDate(d.getDate() + 1);
  dateEl.min = d.toISOString().slice(0,10);
}

dateEl?.addEventListener("change", validateForm);

/*
  ============================================================================
  [JS-06] BUDOWANIE WIADOMOŚCI WHATSAPP
  ============================================================================
  buildText() składa produkty, ceny, termin, dowóz i uwagi w jeden czytelny
  tekst. Zmieniając format wiadomości, edytuj lines.push(...) w tej funkcji.
*/
function buildText(){
  const date = dateEl?.value || "";
  const time = (timeHourEl?.value && timeMinEl?.value) ? `${timeHourEl.value}:${timeMinEl.value}` : "";
  const where = $("where")?.value || "";
  const notes = $("notes")?.value || "";

  const lines = ["Zamówienie – patery:", ""];
  if(cart.size === 0) lines.push("(brak produktów)");

  for(const [key, qty] of cart.entries()){
    const item = resolveCartItem(key);
    if(!item) continue;
    const { p, sizeLabel, flavor, price } = item;
    const opts = [flavor, sizeLabel].filter(Boolean).join(", ");
    const name = opts ? `${p.name} (${opts})` : p.name;
    lines.push(`- ${name} x${qty} (${money(price)}/szt.)`);
  }

  lines.push("");
  lines.push(`Suma: ${money(total())}`);

  if(date || time){
    lines.push(`Termin: ${date || "bez daty"}${time ? " " + time : ""}`);
  }

  if(deliveryMode === "odbior"){
    lines.push("Odbiór osobisty");
  } else if(deliveryMode === "dowoz"){
    lines.push(`Dowóz: ${where || "(brak adresu)"}`);
    lines.push("Transport: cena ustalana indywidualnie (może ulec zmianie)");
  }

  if(notes){
    lines.push(`Uwagi: ${notes}`);
  }

  return lines.join("\n");
}

/*
  ============================================================================
  [JS-07] KLIKNIĘCIA W PRODUKTY I KOSZYK
  ============================================================================
  Jeden wspólny listener obsługuje przyciski generowane dynamicznie. data-add,
  data-inc i data-dec mówią, czy dodać produkt, zwiększyć lub zmniejszyć ilość.
*/
document.addEventListener("click", (e) => {
  // klik w pozycję z "Najpopularniejsze" -> przejdź do niej w menu
  const gotoEl = e.target.closest?.("[data-goto]");
  if(gotoEl){
    gotoProduct(Number(gotoEl.getAttribute("data-goto")));
    return;
  }

  if(e.target.classList.contains("sub")){
    e.target.classList.toggle("is-expanded");
    return;
  }

  const add = e.target?.getAttribute?.("data-add");
  if(add){
    if(!ORDERS_ENABLED) return;
    const id = Number(add);
    const isSized = e.target.getAttribute("data-sized");
    let key;
    let addQty = 1;
    if(isSized){
      const card = e.target.closest(".card");
      const sel = card?.querySelector(".sizeSelect");
      const flav = card?.querySelector(".flavorSelect");
      const qtyEl = card?.querySelector(".qtyInput");
      key = cartKey(id, sel?.value || "", flav?.value || "");
      if(qtyEl){
        const n = parseInt(qtyEl.value, 10);
        addQty = (Number.isFinite(n) && n > 0) ? n : 1;
        qtyEl.value = "1"; // reset do domyślnej ilości
      }
    } else {
      key = cartKey(id, null, null);
    }
    cart.set(key, (cart.get(key) || 0) + addQty);
    updateUI();

    // natychmiastowy feedback wizualny
    if(e.target.classList.contains("add")){
      const btn = e.target;
      btn.classList.add("is-added");
      btn.textContent = "Dodano ✓";
      clearTimeout(btn._addedT);
      btn._addedT = setTimeout(() => {
        btn.classList.remove("is-added");
        btn.textContent = "Dodaj";
      }, 900);
    }
    bumpCount();
    return;
  }

  const inc = e.target?.getAttribute?.("data-inc");
  if(inc){
    if(!ORDERS_ENABLED) return;
    cart.set(inc, (cart.get(inc)||0) + 1);
    updateUI();
    return;
  }

  const dec = e.target?.getAttribute?.("data-dec");
  if(dec){
    if(!ORDERS_ENABLED) return;
    const next = (cart.get(dec)||0) - 1;
    if(next <= 0) cart.delete(dec);
    else cart.set(dec, next);
    updateUI();
    return;
  }
});

// Zmiana rozmiaru na karcie — aktualizuje wyświetlaną cenę
document.addEventListener("change", (e) => {
  if(e.target.classList.contains("sizeSelect")){
    const card = e.target.closest(".card");
    const opt = e.target.options[e.target.selectedIndex];
    const priceEl = card?.querySelector(".sizePrice");
    if(priceEl && opt.dataset.price) priceEl.textContent = money(Number(opt.dataset.price));
  }
});

// Filtry (seg)
segBtns.forEach(btn => btn.addEventListener("click", () => {
  setFilter(btn.dataset.filter);
}));

// Search
q?.addEventListener("input", render);

// panel open/close
function openPanel(){
  if(!ORDERS_ENABLED) return;
  panel?.classList.add("is-open");
  panel?.setAttribute("aria-hidden","false");
}
function closePanel(){ panel?.classList.remove("is-open"); panel?.setAttribute("aria-hidden","true"); }

// Ustawia stan stałych przycisków, które istnieją bezpośrednio w index.html.
function applyOrderingAvailability(){
  const topOrderButton = $('openPanel');
  const heroOrderButton = $('openPanel2');
  const orderEntryButtons = [topOrderButton, heroOrderButton];
  orderEntryButtons.forEach(btn => {
    if(!btn) return;
    btn.disabled = !ORDERS_ENABLED;
    btn.setAttribute("aria-disabled", ORDERS_ENABLED ? "false" : "true");
    btn.title = ORDERS_ENABLED ? "" : ORDERS_DISABLED_MESSAGE;
  });

  if(topOrderButton){
    topOrderButton.setAttribute(
      "aria-label",
      ORDERS_ENABLED ? "Podgląd zamówienia" : ORDERS_DISABLED_MESSAGE
    );
  }
  if(heroOrderButton){
    heroOrderButton.textContent = ORDERS_ENABLED ? "Otwórz zamówienie" : "Zamawianie niedostępne";
  }

  /*
    Przy wyłączonych zamówieniach pokazujemy czytelną informację pod przyciskami
    w hero. Są tu zwykłe linki kontaktowe — nie otwierają koszyka ani nie tworzą
    automatycznej wiadomości z zamówieniem.
  */
  let notice = $('ordersDisabledNotice');
  if(!ORDERS_ENABLED && !notice){
    notice = document.createElement('div');
    notice.id = 'ordersDisabledNotice';
    notice.className = 'ordersDisabledNotice';
    notice.setAttribute('role', 'status');
    notice.innerHTML = `
      <strong>Zamawianie przez stronę jest chwilowo niedostępne.</strong>
      <span>
        Prosimy o kontakt przez
        <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener">WhatsApp</a>
        lub
        <a href="${SITE_CONFIG.facebookUrl}" target="_blank" rel="noopener">Facebooka</a>.
      </span>
    `;

    document.querySelector('.hero__cta')?.insertAdjacentElement('afterend', notice);
  }
  if(notice) notice.hidden = ORDERS_ENABLED;

  document.body.classList.toggle("orders-disabled", !ORDERS_ENABLED);
  if(!ORDERS_ENABLED) closePanel();
}

/*
  ============================================================================
  [JS-08] PANEL ZAMÓWIENIA I MENU MOBILNE
  ============================================================================
  openPanel/closePanel sterują koszykiem z boku. setNav steruje hamburgerem.
  Klasa nav-open zmienia wygląd przez reguły zapisane w styles.css.
*/
const topBar = document.querySelector(".top");
const navToggle = $("navToggle");
const navEl = $("nav");

function setNav(open){
  if(!topBar) return;
  topBar.classList.toggle("nav-open", open);
  navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle?.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
}

navToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  setNav(!topBar?.classList.contains("nav-open"));
});

// zamknij po kliknięciu w link w menu
navEl?.addEventListener("click", (e) => {
  if(e.target.closest("a")) setNav(false);
});

// zamknij klikając poza menu
document.addEventListener("click", (e) => {
  if(!topBar?.classList.contains("nav-open")) return;
  if(e.target.closest("#nav") || e.target.closest("#navToggle")) return;
  setNav(false);
});

// zamknij klawiszem Esc
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") setNav(false);
});

$("openPanel")?.addEventListener("click", openPanel);
$("openPanel2")?.addEventListener("click", openPanel);
$("closePanel")?.addEventListener("click", closePanel);

// actions
$("copy")?.addEventListener("click", async () => {
  if(!ORDERS_ENABLED) return;
  if(!validateForm()) return;

  try{
    await navigator.clipboard.writeText(buildText());
    alert("Skopiowano treść zamówienia.");
  }catch{
    alert("Nie mogę skopiować w tej przeglądarce.");
  }
});

$("wa")?.addEventListener("click", () => {
  if(!ORDERS_ENABLED) return;
  if(!validateForm()) return;

  const txt = encodeURIComponent(buildText());
  window.open(`https://wa.me/${WA_NUMBER}?text=${txt}`, "_blank");
});

$("clear")?.addEventListener("click", () => {
  cart.clear();
  updateUI();
});

/*
  ============================================================================
  [JS-09] ODBIÓR, DOWÓZ I WALIDACJA FORMULARZA
  ============================================================================
  Przy dowozie pokazujemy adres. validateForm() sprawdza wszystkie wymagania,
  aktualizuje checklistę i dopiero wtedy odblokowuje Kopiuj/WhatsApp.
*/
const modeBtns = $$("#modeToggle .modeBtn");
const modeHint = $("modeHint");
let deliveryMode = null; // "odbior" | "dowoz"

function setDeliveryMode(mode){
  if(!ORDERS_ENABLED) return;
  deliveryMode = mode;
  const isDowoz = mode === "dowoz";

  modeBtns.forEach(b => {
    const on = b.dataset.mode === mode;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });

  if(whereEl){
    whereEl.hidden = !isDowoz;
    if(!isDowoz) whereEl.value = "";
    else whereEl.focus();
  }
  if(modeHint){
    modeHint.textContent = isDowoz ? "Podaj adres dowozu." : "Odbiór osobisty — adres nie jest potrzebny.";
  }

  updateUI(); // odśwież koszyk (pozycja transportu) + walidacja
}

modeBtns.forEach(b => b.addEventListener("click", () => setDeliveryMode(b.dataset.mode)));

// Formularz jest wymagany — bez daty, godziny i sposobu odbioru nie można wysłać zamówienia.
// Adres wymagany tylko przy dowozie.
function validateForm(){
  const hasProducts = cart.size > 0;
  const hasDate = (dateEl?.value || "").trim().length > 0;
  const hasTime = (timeHourEl?.value || "").length > 0 && (timeMinEl?.value || "").length > 0;
  const hasMode = deliveryMode === "odbior" || deliveryMode === "dowoz";
  const addrOk = deliveryMode === "odbior"
    ? true
    : (whereEl?.value || "").trim().length >= 5;
  const dateOk = validateDate();
  const canSend = ORDERS_ENABLED && hasProducts && hasDate && hasTime && hasMode && addrOk && dateOk;

  // Checklista wyjaśnia użytkownikowi, co blokuje wysłanie zamówienia.
  const checklist = $("orderChecklist");
  const checklistTitle = $("checklistTitle");
  const checks = { products: hasProducts, date: hasDate && dateOk, time: hasTime, mode: hasMode, address: addrOk };
  Object.entries(checks).forEach(([name, ok]) => {
    const row = checklist?.querySelector(`[data-requirement="${name}"]`);
    if(!row) return;
    if(name === "address") row.hidden = deliveryMode !== "dowoz";
    row.classList.toggle("is-done", ok);
    const icon = row.querySelector("span");
    if(icon) icon.textContent = ok ? "✓" : "○";
  });
  checklist?.classList.toggle("is-complete", canSend);
  if(checklistTitle){
    checklistTitle.textContent = !ORDERS_ENABLED
      ? ORDERS_DISABLED_MESSAGE
      : (canSend ? "Zamówienie gotowe do wysłania" : "Dokończ zamówienie");
  }

  [waBtn, copyBtn].forEach(btn => {
    if(!btn) return;
    btn.disabled = !canSend;
  });

  return canSend;
}
whereEl?.addEventListener("input", validateForm);
dateEl?.addEventListener("input", validateForm);
timeHourEl?.addEventListener("change", validateForm);
timeMinEl?.addEventListener("change", validateForm);

/*
  ============================================================================
  [JS-10] GALERIA
  ============================================================================
  Domyślnie używa LOCAL_GALLERY z data.js. Jeśli kiedyś ustawisz FB_API_URL,
  strona spróbuje pobierać wpisy z zewnętrznego API. Pierwsze dwa obrazy są
  ładowane od razu, ponieważ galeria znajduje się wysoko w sekcji hero.
  Dopiero dalsze realizacje korzystają z lazy-loading.
*/
function renderGallery(grid, posts){
  const SHOW = 3;
  grid.innerHTML = posts.map((p, index) => `
    <a class="fbCard" href="${p.url || p.permalink_url}" target="_blank" rel="noopener">
      <img class="fbImg" src="${p.img || p.image || ""}"
           alt="${escapeHTML(p.alt || p.text || p.message || "Realizacja cateringu Paterka")}"
           loading="${index < 2 ? "eager" : "lazy"}"
           ${index < 2 ? 'fetchpriority="high"' : ''}
           decoding="async" width="800" height="500">
      <div class="fbBody">
        <div class="fbText">${escapeHTML(p.text || p.message || "")}</div>
        <div class="fbMeta">${new Date(p.date || p.created_time).toLocaleDateString("pl-PL")}</div>
      </div>
    </a>
  `).join("");

  if(posts.length <= SHOW) return;

  // ukryj zdjęcia po 3
  Array.from(grid.children).slice(SHOW).forEach(el => el.classList.add("fbCard--hidden"));

  // przycisk
  const btn = document.createElement("button");
  btn.className = "fbToggle";
  btn.textContent = `Pokaż więcej (${posts.length - SHOW})`;
  grid.after(btn);

  btn.addEventListener("click", () => {
    const hidden = grid.querySelectorAll(".fbCard--hidden");
    const isExpanded = hidden.length === 0;

    if(isExpanded){
      Array.from(grid.children).slice(SHOW).forEach(el => el.classList.add("fbCard--hidden"));
      btn.textContent = `Pokaż więcej (${posts.length - SHOW})`;
    } else {
      hidden.forEach(el => el.classList.remove("fbCard--hidden"));
      btn.textContent = "Zwiń";
    }
  });
}

// [JS-10] OPCJONALNE API FACEBOOK/INSTAGRAM — obecnie wyłączone pustym URL-em.
// Ustaw prawdziwy URL backendu gdy będzie gotowy, np. "https://twoj-worker.workers.dev/posts"
const FB_API_URL = "";

async function loadFB(){
  const gallery = document.querySelector(".fbGallery");
  const grid = document.getElementById("fbGrid");
  if(!grid) return;

  // Brak API — renderuj z LOCAL_GALLERY z data.js
  if(!FB_API_URL){
    if(!LOCAL_GALLERY || LOCAL_GALLERY.length === 0){
      if(grid) grid.innerHTML = `<div class="muted">Brak zdjęć w galerii.</div>`;
      return;
    }
    renderGallery(grid, LOCAL_GALLERY);
    return;
  }

  try{
    const res = await fetch(FB_API_URL, { cache: "no-store" });
    if(!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    const pageLink = document.getElementById("fbPageLink");
    if(pageLink && data.page_url) pageLink.href = data.page_url;

    const posts = (data.posts || []).slice(0, 6);
    if(posts.length === 0){
      grid.innerHTML = `<div class="muted">Brak postów do wyświetlenia.</div>`;
      return;
    }

    grid.innerHTML = posts.map((p, index) => `
      <a class="fbCard" href="${p.permalink_url}" target="_blank" rel="noopener">
        <img class="fbImg" src="${p.image || ""}"
             alt="${escapeHTML(p.alt || p.message || "Realizacja cateringu Paterka")}"
             loading="${index < 2 ? "eager" : "lazy"}"
             ${index < 2 ? 'fetchpriority="high"' : ''}
             decoding="async" width="800" height="500">
        <div class="fbBody">
          <div class="fbText">${escapeHTML(p.message || "Zobacz post")}</div>
          <div class="fbMeta">${new Date(p.created_time).toLocaleDateString("pl-PL")}</div>
        </div>
      </a>
    `).join("");

  }catch(err){
    if(gallery) gallery.style.display = "none";
    console.warn("Galeria niedostępna:", err);
  }
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

// odpal po starcie
window.addEventListener("pageshow", loadFB);

/* [JS-11] GENEROWANIE GODZIN — zakres 08:00–21:45 co 15 minut. */
function fillTimeOptions(){
  if(!timeHourEl || !timeMinEl) return;
  if(timeHourEl.options.length > 1) return;
  for(let h = 8; h <= 21; h++){
    const opt = document.createElement("option");
    opt.value = String(h).padStart(2, "0");
    opt.textContent = String(h).padStart(2, "0");
    timeHourEl.appendChild(opt);
  }
  [0, 15, 30, 45].forEach(m => {
    const opt = document.createElement("option");
    opt.value = String(m).padStart(2, "0");
    opt.textContent = String(m).padStart(2, "0");
    timeMinEl.appendChild(opt);
  });
}

/* [JS-11] NAJPOPULARNIEJSZE — wybiera produkty z popular: true w data.js. */
function renderPopular(){
  const list = document.getElementById("popularList");
  if(!list) return;

  const popular = PRODUCTS.filter(p => p.popular && p.available !== false);
  if(popular.length === 0){
    list.innerHTML = `<div class="muted">Brak pozycji.</div>`;
    return;
  }

  list.innerHTML = popular.map(p => {
    const labels = p.tags.map(t => TAG_LABELS[t]).filter(Boolean).join(" • ");
    return `
      <div class="miniItem" data-goto="${p.id}" role="button" tabindex="0"
           title="Pokaż w menu" aria-label="${p.name} — pokaż w menu">
        <div class="dot"></div>
        <div>
          <strong>${p.name}</strong>
          <div class="muted">${labels}</div>
        </div>
        <div class="price">${money(p.price)}</div>
      </div>
    `;
  }).join("");
}

/*
  ============================================================================
  [JS-12] MODAL KONTAKTU I DROBNA NAWIGACJA
  ============================================================================
  Modal otwierają elementy z data-contact. Dalsze funkcje rozwijają sekcję
  wskazaną hashem, przewijają do produktu i pokazują przycisk powrotu na górę.
*/
const contactModal = $("contactModal");

function openContact(){
  contactModal?.classList.add("is-open");
  contactModal?.setAttribute("aria-hidden", "false");
}
function closeContact(){
  contactModal?.classList.remove("is-open");
  contactModal?.setAttribute("aria-hidden", "true");
}

$$("[data-contact]").forEach(el => el.addEventListener("click", (e) => {
  e.preventDefault();
  openContact();
}));
$("contactClose")?.addEventListener("click", closeContact);
$$("[data-close-contact]").forEach(el => el.addEventListener("click", closeContact));
document.addEventListener("keydown", (e) => {
  if(e.key === "Escape") closeContact();
});

// [JS-12] Otwiera <details>, jeśli jego id znajduje się po # w adresie.
function openHashTarget(){
  const id = (location.hash || "").slice(1);
  if(!id) return;
  const el = document.getElementById(id);
  if(el && el.tagName === "DETAILS"){
    el.open = true;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
window.addEventListener("hashchange", openHashTarget);
window.addEventListener("load", openHashTarget);

// [JS-12] Przejście z Najpopularniejszych do właściwej karty w katalogu.
function gotoProduct(id){
  // wyczyść szukajkę i pokaż wszystkie kategorie, by pozycja była widoczna
  if(q) q.value = "";
  setFilter("all"); // renderuje katalog i otwiera sekcje

  requestAnimationFrame(() => {
    const card = document.querySelector(`.card[data-card-id="${id}"]`);
    if(!card) return;
    const det = card.closest("details");
    if(det) det.open = true;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("card--flash");
    setTimeout(() => card.classList.remove("card--flash"), 1800);
  });
}

// obsługa klawiatury (Enter/Spacja) na klikalnych pozycjach popularnych
document.addEventListener("keydown", (e) => {
  if(e.key !== "Enter" && e.key !== " ") return;
  const gotoEl = e.target.closest?.("[data-goto]");
  if(gotoEl){
    e.preventDefault();
    gotoProduct(Number(gotoEl.getAttribute("data-goto")));
  }
});

// [JS-12] Przycisk powrotu na górę pojawia się po przewinięciu 300 px.
const toTopBtn = $("toTop");
window.addEventListener("scroll", () => {
  toTopBtn?.classList.toggle("is-visible", window.scrollY > 300);
}, { passive: true });
toTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/*
  ============================================================================
  [JS-13] START APLIKACJI
  ============================================================================
  boot() uruchamia wszystkie elementy w odpowiedniej kolejności. Jeśli dodasz
  nową funkcję wymagającą startu strony, wywołaj ją właśnie tutaj.
*/
function boot(){
  restoreCart();
  Object.values(accDetails).forEach(d => { if(d) d.open = true; });
  setFilter("all");
  applyOrderingAvailability();

  fillTimeOptions();
  renderPopular();

  const fbLink = $("fbPageLink");
  if(fbLink) fbLink.href = SITE_CONFIG.facebookUrl;
  updateUI();
  validateDate();
  validateForm();

  requestAnimationFrame(render);
}

// defer => DOM gotowy, ale zostawiamy też pageshow (Safari/BFCache)
boot();
window.addEventListener("pageshow", boot);
