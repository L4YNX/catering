// ====== BASIC SAFE HELPERS ======
const $ = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
function money(n){ return `${n} zł`; }

// ====== SETTINGS ======
const WA_NUMBER = "48508014420"; // <-- podmień na swój numer (bez +, bez spacji)
const BOOKED = [/*rrrr-mm-dd*/"2026-02-20", "2026-02-21"]; // ZAJĘTE TERMINY (YYYY-MM-DD)

// Tag labels (do wyświetlania)
const TAG_LABELS = {
  cold: "na zimno",
  hot: "na ciepło",
  vege: "wege",
};

// ====== DATA ======
const PRODUCTS = [
  { id: 1, name: "Patera nr. 1", tags:["cold"], serves:"4–6", price:99,  note:"Klasyczna, dla każdego.", img:"assets/patera1.jpg" },
  { id: 2, name: "Patera nr. 2", tags:["cold"], serves:"6–8", price:119, note:"Klasyczna, dla każdego.", img:"assets/patera1.jpg" },
  { id: 3, name: "Patera nr. 3", tags:["cold"], serves:"4–6", price:99,  note:"Klasyczna, dla każdego.", img:"assets/patera1.jpg" },
  { id: 4, name: "Patera nr. 4", tags:["cold"], serves:"6–8", price:129, note:"Klasyczna, dla każdego.", img:"assets/patera1.jpg" },
  { id: 5, name: "Koryto nr. 1", tags:["hot"],  serves:"4–6", price:99,  note:"Klasyczne koryto, dla każdego.", img:"assets/patera1.jpg" },
];

// ====== DOM REFERENCES (SAFE) ======
const yearEl = $("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const grids = {
  cold: $("gridCold"),
  hot:  $("gridHot"),
  vege: $("gridVege"),
};

const counters = {
  cold: $("countCold"),
  hot:  $("countHot"),
  vege: $("countVege"),
};

const accDetails = {
  cold: grids.cold?.closest("details") ?? null,
  hot:  grids.hot?.closest("details") ?? null,
  vege: grids.vege?.closest("details") ?? null,
};

const q = $("q");
const segBtns = $$(".seg__btn");

const panel = $("panel");
const items = $("items");

const dateEl = $("date");
const timeEl = $("time");
const warnEl = $("dateWarn");
const waBtn  = $("wa");
const whereEl = $("where");

// ====== STATE ======
let active = "all";
let cart = new Map(); // id -> qty

function total(){
  let sum = 0;
  for (const [id, qty] of cart.entries()){
    const p = PRODUCTS.find(x => x.id === id);
    if (p) sum += p.price * qty;
  }
  return sum;
}

// ====== CARD RENDER ======
function cardHTML(p){
  const typeLabel = p.tags.includes("hot") ? "na ciepło" : "na zimno";
  const bg = p.img ? `style="background-image:url('${p.img}');"` : "";

  const pills = p.tags
    .map(t => TAG_LABELS[t])
    .filter(Boolean)
    .map(lbl => `<span class="pill">${lbl}</span>`)
    .join("");

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

        ${pills ? `<div class="metaRow">${pills}</div>` : ""}

        <div class="buyRow">
          <span class="muted">Porcja: <strong>${p.serves}</strong></span>
          <button class="add" data-add="${p.id}">Dodaj</button>
        </div>
      </div>
    </article>
  `;
}

// ====== MAIN RENDER ======
function render(){
  const term = (q?.value || "").trim().toLowerCase();

  const baseList = PRODUCTS.filter(p => {
    const okQ = !term || (p.name + " " + p.note).toLowerCase().includes(term);
    const okF = active === "all" || p.tags.includes(active);
    return okQ && okF;
  });

  function fill(key, filterFn){
    const grid = grids[key];
    const counter = counters[key];
    if (!grid && !counter) return;

    const list = baseList.filter(filterFn);
    if (grid) grid.innerHTML = list.map(cardHTML).join("") || `<div class="muted">Brak pozycji.</div>`;
    if (counter) counter.textContent = `(${list.length})`;
  }

  fill("cold", p => p.tags.includes("cold") && !p.tags.includes("hot"));
  fill("hot",  p => p.tags.includes("hot"));
  fill("vege", p => p.tags.includes("vege"));

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

// ====== FILTER CONTROL ======
function setFilter(filter){
  active = filter;
  segBtns.forEach(b => b.classList.toggle("is-active", b.dataset.filter === filter));
  render();
}

// ====== CART UI ======
function updateUI(){
  const count = Array.from(cart.values()).reduce((a,b)=>a+b,0);
  
  const countEl = $("count");
  if (countEl) countEl.textContent = count;

  const totalEl = $("total");
  if (totalEl) totalEl.textContent = money(total());

  if(!items) return;

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

// ====== BOOKED DATE VALIDATION ======
function isBooked(dateStr){ return BOOKED.includes(dateStr); }

function validateDate(){
  const d = dateEl?.value;
  const booked = !!(d && isBooked(d));

  if(booked){
    warnEl && (warnEl.textContent = "⛔ Ten termin jest zajęty. Wybierz inną datę.");
    warnEl?.classList.add("is-show");
    if(waBtn){
      waBtn.disabled = true;
      waBtn.style.opacity = ".55";
      waBtn.style.cursor = "not-allowed";
    }
  } else {
    warnEl && (warnEl.textContent = "");
    warnEl?.classList.remove("is-show");
    if(waBtn){
      waBtn.disabled = false;
      waBtn.style.opacity = "";
      waBtn.style.cursor = "";
    }
  }
}

// ustaw min. na jutro + domyślnie jutro
if(dateEl){
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const min = d.toISOString().slice(0,10);
  dateEl.min = min;
  if(!dateEl.value) dateEl.value = min;
}

dateEl?.addEventListener("change", validateDate);
timeEl?.addEventListener("change", validateDate);

// ====== ORDER TEXT ======
function buildText(){
  const date = dateEl?.value || "[data]";
  const time = timeEl?.value || "[godzina]";
  const where = $("where")?.value || "[odbiór/dowóz + adres]";
  const notes = $("notes")?.value || "";

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

// ====== EVENTS (SAFE) ======
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
  setFilter(btn.dataset.filter);
}));

// Search
q?.addEventListener("input", render);

// panel open/close
function openPanel(){ panel?.classList.add("is-open"); panel?.setAttribute("aria-hidden","false"); }
function closePanel(){ panel?.classList.remove("is-open"); panel?.setAttribute("aria-hidden","true"); }

$("openPanel")?.addEventListener("click", openPanel);
$("openPanel2")?.addEventListener("click", openPanel);
$("closePanel")?.addEventListener("click", closePanel);

// actions
$("copy")?.addEventListener("click", async () => {
  try{
    await navigator.clipboard.writeText(buildText());
    alert("Skopiowano treść zamówienia.");
  }catch{
    alert("Nie mogę skopiować w tej przeglądarce.");
  }
});

$("wa")?.addEventListener("click", () => {
  validateDate();
  if(waBtn?.disabled) return;

  const txt = encodeURIComponent(buildText());
  window.open(`https://wa.me/${WA_NUMBER}?text=${txt}`, "_blank");
});

$("clear")?.addEventListener("click", () => {
  cart.clear();
  updateUI();
});

$("addBest")?.addEventListener("click", () => {
  cart.set(1, (cart.get(1)||0) + 1);
  updateUI();
  openPanel();
});

// validateForm (opcjonalne)
function validateForm(){
  const okWhere = (whereEl?.value || "").trim().length >= 5;
  if(waBtn) waBtn.disabled = waBtn.disabled || !okWhere;
}
whereEl?.addEventListener("input", validateForm);

// ====== BOOT (100% reliable) ======
function boot(){
  // otwórz wszystkie sekcje + ustaw "all"
  Object.values(accDetails).forEach(d => { if(d) d.open = true; });
  setFilter("all");

  updateUI();
  validateDate();
  validateForm();

  // “kick” po layout
  requestAnimationFrame(render);
}

// defer => DOM gotowy, ale zostawiamy też pageshow (Safari/BFCache)
boot();
window.addEventListener("pageshow", boot);
