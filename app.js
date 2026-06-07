// ====== BASIC SAFE HELPERS ======
const $ = (id) => document.getElementById(id);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
function money(n){ return `${n} zł`; }

// ====== SETTINGS FROM data.js ======
const WA_NUMBER = SITE_CONFIG.phone; // numer z data.js, bez + i bez spacji
const BOOKED = BOOKED_DATES; // zajęte terminy z data.js

// ====== DOM REFERENCES (SAFE) ======
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
  const typeLabel = TAG_LABELS[p.tags[0]] || p.tags[0];
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
          <span class="muted"></strong></span>
          <button class="add" data-add="${p.id}">Dodaj</button>
        </div>
      </div>
    </article>
  `;
}

// ====== MAIN RENDER ======
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

  validateForm();

  if(!items) return;

  if(cart.size === 0){
    items.innerHTML = `<div class="muted">Koszyk pusty. Dodaj patery z katalogu.</div>`;
    validateForm();
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

// ====== ORDER TEXT ======
function buildText(){
  const date = dateEl?.value || "";
  const time = (timeHourEl?.value && timeMinEl?.value) ? `${timeHourEl.value}:${timeMinEl.value}` : "";
  const where = $("where")?.value || "";
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

  if(date || time){
    lines.push(`Termin: ${date || "bez daty"}${time ? " " + time : ""}`);
  }

  if(where){
    lines.push(`${where}`);
  }

  if(notes){
    lines.push(`Uwagi: ${notes}`);
  }

  return lines.join("\n");
}

// ====== EVENTS (SAFE) ======
document.addEventListener("click", (e) => {
  if(e.target.classList.contains("sub")){
    e.target.classList.toggle("is-expanded");
    return;
  }

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
  if(!validateForm()) return;

  try{
    await navigator.clipboard.writeText(buildText());
    alert("Skopiowano treść zamówienia.");
  }catch{
    alert("Nie mogę skopiować w tej przeglądarce.");
  }
});

$("wa")?.addEventListener("click", () => {
  if(!validateForm()) return;

  const txt = encodeURIComponent(buildText());
  window.open(`https://wa.me/${WA_NUMBER}?text=${txt}`, "_blank");
});

$("clear")?.addEventListener("click", () => {
  cart.clear();
  updateUI();
});

// Formularz jest wymagany — bez daty, godziny i adresu nie można skopiować ani wysłać zamówienia.
function validateForm(){
  const hasProducts = cart.size > 0;
  const hasDate = (dateEl?.value || "").trim().length > 0;
  const hasTime = (timeHourEl?.value || "").length > 0 && (timeMinEl?.value || "").length > 0;
  const hasWhere = (whereEl?.value || "").trim().length >= 5;
  const dateOk = validateDate();
  const canSend = hasProducts && hasDate && hasTime && hasWhere && dateOk;

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

// ===== FB/IG GALLERY (from our API) =====
async function loadFB(){
  const grid = document.getElementById("fbGrid");
  const pageLink = document.getElementById("fbPageLink");
  if(!grid) return;

  try{
    // TU będzie URL do Twojego backendu (Cloudflare Worker)
    const API_URL = "https://www.facebook.com/justyna.obara?locale=pl_PL";

    const res = await fetch(API_URL, { cache: "no-store" });
    if(!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    if(pageLink && data.page_url) pageLink.href = data.page_url;

    const posts = (data.posts || []).slice(0, 6);
    if(posts.length === 0){
      grid.innerHTML = `<div class="muted">Brak postów do wyświetlenia.</div>`;
      return;
    }

    grid.innerHTML = posts.map(p => `
      <a class="fbCard" href="${p.permalink_url}" target="_blank" rel="noopener">
        <div class="fbImg" style="background-image:url('${p.image || ""}')"></div>
        <div class="fbBody">
          <div class="fbText">${escapeHTML(p.message || "Zobacz post")}</div>
          <div class="fbMeta">${new Date(p.created_time).toLocaleDateString("pl-PL")}</div>
        </div>
      </a>
    `).join("");

  }catch(err){
    grid.innerHTML = `<div class="muted">Nie udało się załadować galerii.</div>`;
    console.warn(err);
  }
}

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

// odpal po starcie
window.addEventListener("pageshow", loadFB);

// ====== TIME SELECTS ======
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

// ====== POPULAR ======
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
      <div class="miniItem">
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

// ====== SCROLL TO TOP ======
const toTopBtn = $("toTop");
window.addEventListener("scroll", () => {
  toTopBtn?.classList.toggle("is-visible", window.scrollY > 300);
}, { passive: true });
toTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ====== BOOT (100% reliable) ======
function boot(){
  Object.values(accDetails).forEach(d => { if(d) d.open = true; });
  setFilter("all");

  fillTimeOptions();
  renderPopular();
  updateUI();
  validateDate();
  validateForm();

  requestAnimationFrame(render);
}

// defer => DOM gotowy, ale zostawiamy też pageshow (Safari/BFCache)
boot();
window.addEventListener("pageshow", boot);
