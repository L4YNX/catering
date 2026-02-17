document.getElementById("year").textContent = new Date().getFullYear();

const WA_NUMBER = "48000000000"; // <-- podmień na swój numer (bez +, bez spacji)

// ZAJĘTE TERMINY (YYYY-MM-DD) – dopisujesz ręcznie
const BOOKED = [
  "2026-02-20",
  "2026-02-21",
];

const TAG_LABELS = {
  cold: "na zimno",
  hot: "na ciepło",
  vege: "wege",
};

// Twoje produkty — możesz mieć tu 20+ pozycji
const PRODUCTS = [
  {
    id: 1,
    name: "Patera nr. 1",
    tags: ["cold"],
    serves: "4–6",
    price: 99,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg"
  },
  {
    id: 2,
    name: "Patera nr. 2",
    tags: ["cold"],
    serves: "6–8",
    price: 119,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg"
  },
  {
    id: 3,
    name: "Patera nr. 3",
    tags: ["cold"],
    serves: "4–6",
    price: 99,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg"
  },
  {
    id: 4,
    name: "Patera nr. 4",
    tags: ["cold"],
    serves: "6–8",
    price: 129,
    note: "Klasyczna, dla każdego.",
    img: "assets/patera1.jpg"
  },
  {
    id: 5,
    name: "Koryto nr. 1",
    tags: ["hot"],
    serves: "4–6",
    price: 99,
    note: "Klasyczne koryto, dla każdego.",
    img: "assets/patera1.jpg"
  },
];

// Grids w accordionie
const grids = {
  cold:  document.getElementById("gridCold"),
  hot:   document.getElementById("gridHot"),
  vege:  document.getElementById("gridVege"),
};

// Liczniki w nagłówkach accordionu
const counters = {
  cold:  document.getElementById("countCold"),
  hot:   document.getElementById("countHot"),
  vege:  document.getElementById("countVege"),
};

// <details> żeby móc otwierać/zamykać przy filtrach
const accDetails = {
  cold:  grids.cold?.closest("details"),
  hot:   grids.hot?.closest("details"),
  vege:  grids.vege?.closest("details"),
};

const q = document.getElementById("q");
const segBtns = Array.from(document.querySelectorAll(".seg__btn"));

const panel = document.getElementById("panel");
const items = document.getElementById("items");

let active = "all";
let cart = new Map(); // id -> qty

function money(n){ return `${n} zł`; }

function total(){
  let sum = 0;
  for(const [id, qty] of cart.entries()){
    const p = PRODUCTS.find(x => x.id === id);
    if(p) sum += p.price * qty;
  }
  return sum;
}

function cardHTML(p){
  const typeLabel =
    p.tags.includes("hot") ? "na ciepło" : "na zimno";
    

  const bg = p.img
    ? `style="background-image:url('${p.img}');"`
    : "";

  return `
    <article class="card">
      <div class="thumb thumb--photo" ${bg}>
        <span class="pTag">${typeLabel}</span>
        <span class="pTag">dla ${p.serves}</span>
      </div>

      <div class="cardBody">
        <div class="titleRow">
          <strong>${p.name}</strong>
          <span class="price2">${money(p.price)}</span>
        </div>
        <div class="sub">${p.note}</div>
        <div class="metaRow">
          ${p.tags
            .map(t => TAG_LABELS[t])
            .filter(Boolean)
            .map(lbl => `<span class="pill">${lbl}</span>`)
            .join("")}
        </div>
        <div class="buyRow">
          <span class="muted">Porcja: <strong>${p.serves}</strong></span>
          <button class="add" data-add="${p.id}">Dodaj</button>
        </div>
      </div>
    </article>
  `;
}

// --- RENDER DO 4 GRIDÓW ---
function render(){
  const term = (q.value || "").trim().toLowerCase();

  // baza: wyszukiwarka + (opcjonalnie) filtr seg
  const baseList = PRODUCTS.filter(p => {
    const okQ = !term || (p.name + " " + p.note).toLowerCase().includes(term);
    const okF = active === "all" || p.tags.includes(active);
    return okQ && okF;
  });

  function fill(key, filterFn){
    const list = baseList.filter(filterFn);
    if(grids[key]) grids[key].innerHTML = list.map(cardHTML).join("") || `<div class="muted">Brak pozycji.</div>`;
    if(counters[key]) counters[key].textContent = `(${list.length})`;
  }

  fill("cold",  p => p.tags.includes("cold") && !p.tags.includes("hot"));
  fill("hot",   p => p.tags.includes("hot"));
  fill("vege",  p => p.tags.includes("vege"));

  // UX: filtr otwiera tylko odpowiednią sekcję
  if(active !== "all"){
  Object.keys(accDetails).forEach(k => {
    if(!accDetails[k]) return;
    accDetails[k].open = (k === active);
  });
  } else {
    Object.keys(accDetails).forEach(k => {
      if(!accDetails[k]) return;
      accDetails[k].open = true; // <- otwórz wszystkie
    });
  }
}

// --- PANEL / ZAMÓWIENIE ---
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const waBtn  = document.getElementById("wa");
const warnEl = document.getElementById("dateWarn");

// ustaw min. na jutro + domyślnie jutro
if(dateEl){
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const min = d.toISOString().slice(0,10);
  dateEl.min = min;
  if(!dateEl.value) dateEl.value = min;
}

function isBooked(dateStr){
  return BOOKED.includes(dateStr);
}

function validateDate(){
  const d = dateEl?.value;
  const booked = !!(d && isBooked(d));

  if(booked){
    warnEl.textContent = "⛔ Ten termin jest zajęty. Wybierz inną datę.";
    warnEl.classList.add("is-show");
    waBtn.disabled = true;
    waBtn.style.opacity = ".55";
    waBtn.style.cursor = "not-allowed";
  } else {
    warnEl.textContent = "";
    warnEl.classList.remove("is-show");
    waBtn.disabled = false;
    waBtn.style.opacity = "";
    waBtn.style.cursor = "";
  }
}

dateEl?.addEventListener("change", validateDate);
timeEl?.addEventListener("change", validateDate);

function buildText(){
  const date = dateEl?.value || "[data]";
  const time = timeEl?.value || "[godzina]";
  const where = document.getElementById("where").value || "[odbiór/dowóz + adres]";
  const notes = document.getElementById("notes").value || "";

  const lines = ["Zamówienie – patery:", ""];
  if(cart.size === 0) lines.push("(brak produktów)");

  for(const [id, qty] of cart.entries()){
    const p = PRODUCTS.find(x => x.id === id);
    if(!p) continue;
    lines.push(`- ${p.name} x${qty} (${money(p.price)}/szt.)`);
  }

  lines.push("");
  lines.push(`Suma: ${money(total())}`);
  lines.push(`Termin: ${date} ${time}`);
  lines.push(`Odbiór/dowóz: ${where}`);
  if(notes) lines.push(`Uwagi: ${notes}`);
  return lines.join("\n");
}

function updateUI(){
  const count = Array.from(cart.values()).reduce((a,b)=>a+b,0);
  document.getElementById("count").textContent = count;
  document.getElementById("total").textContent = money(total());

  if(cart.size === 0){
    items.innerHTML = `<div class="muted">Koszyk pusty. Dodaj patery z katalogu.</div>`;
    return;
  }

  items.innerHTML = Array.from(cart.entries()).map(([id, qty]) => {
    const p = PRODUCTS.find(x => x.id === id);
    if(!p) return "";
    return `
      <div class="lineItem">
        <div>
          <strong>${p.name}</strong>
          <div class="muted tiny">${money(p.price)} / szt. • dla ${p.serves}</div>
        </div>
        <div class="qty">
          <button data-dec="${id}">−</button>
          <span>${qty}</span>
          <button data-inc="${id}">+</button>
        </div>
      </div>
    `;
  }).join("");
}

// --- KLIK “Dodaj” / +/- działa wszędzie (delegacja) ---
document.addEventListener("click", (e) => {
  const add = e.target?.getAttribute?.("data-add");
  if(add){
    const id = Number(add);
    cart.set(id, (cart.get(id) || 0) + 1);
    updateUI();
    return;
  }

  const inc = e.target?.getAttribute?.("data-inc");
  if(inc){
    const id = Number(inc);
    cart.set(id, (cart.get(id)||0) + 1);
    updateUI();
    return;
  }

  const dec = e.target?.getAttribute?.("data-dec");
  if(dec){
    const id = Number(dec);
    const next = (cart.get(id)||0) - 1;
    if(next <= 0) cart.delete(id);
    else cart.set(id, next);
    updateUI();
    return;
  }
});

// Filtry (seg)
segBtns.forEach(btn => btn.addEventListener("click", () => {
  segBtns.forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  active = btn.dataset.filter; // all/cold/hot/vege/sweet
  render();
}));

// Search
q.addEventListener("input", render);

// panel open/close
function openPanel(){ panel.classList.add("is-open"); panel.setAttribute("aria-hidden","false"); }
function closePanel(){ panel.classList.remove("is-open"); panel.setAttribute("aria-hidden","true"); }

document.getElementById("openPanel").addEventListener("click", openPanel);
document.getElementById("openPanel2").addEventListener("click", openPanel);
document.getElementById("closePanel").addEventListener("click", closePanel);

// actions
document.getElementById("copy").addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(buildText());
    alert("Skopiowano treść zamówienia.");
  }catch{
    alert("Nie mogę skopiować w tej przeglądarce.");
  }
});

document.getElementById("wa").addEventListener("click", () => {
  // dodatkowa blokada “na klik”
  validateDate();
  if(waBtn.disabled) return;

  const txt = encodeURIComponent(buildText());
  window.open(`https://wa.me/${WA_NUMBER}?text=${txt}`, "_blank");
});

document.getElementById("clear").addEventListener("click", () => {
  cart.clear();
  updateUI();
});

document.getElementById("addBest").addEventListener("click", () => {
  cart.set(1, (cart.get(1)||0) + 1);
  updateUI();
  openPanel();
});

const whereEl = document.getElementById("where");

function validateForm(){
  const okWhere = (whereEl.value || "").trim().length >= 5; // minimalnie coś wpisał
  // date blokuje validateDate(), więc tu tylko where
  document.getElementById("wa").disabled = document.getElementById("wa").disabled || !okWhere;
}
whereEl.addEventListener("input", validateForm);

alert("app.js działa ✅");

// --- HARD INIT (pewniak przy defer) ---
(function init(){
  // otwórz wszystkie sekcje, żeby od razu było widać katalog
  Object.values(accDetails).forEach(d => { if(d) d.open = true; });

  // ustaw startowo "Wszystko" (ważne jeśli gdzieś zostaje inna wartość)
  active = "all";

  // pierwszy render
  render();
  updateUI();
  validateDate();

  // drugi render po chwili (Safari/Chrome czasem dociąga dopiero po layout)
  setTimeout(render, 0);
})();