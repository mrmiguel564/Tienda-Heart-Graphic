/* ================= Seccion PLANNERS =================
   Agenda Atrévete 2027 y Planner Semanal (marcado en index.html → pestaña Planner #plPanel y
   diálogos pl-*, estilos en assets/css/planners.css).
   Usa de assets/js/tienda.js (se carga antes): WHATSAPP, fmt y CART.

   TEMPORAL: las imágenes se sirven desde assets/productos/planners/. Cuando se
   migren a un servicio externo / la planilla, basta con cambiar PL_IMG o las
   rutas de esta configuración; el resto del módulo no se toca.
   ==================================================== */
(() => {

/* ---------- CONFIGURACIÓN ---------- */
const PL_IMG = "assets/productos/planners/";
const WA_NUM = WHATSAPP;   /* TODO: confirmar el número de pedidos de planners (sin +). Hoy usa el de la tienda */

/* TODO: completar con los precios reales (CLP). Cada producto tiene valor único;
   más unidades se suman en el carrito (+/−). */
const PRECIOS = {
  agenda:  24990,   /* cualquiera de las dos portadas */
  semanal: 9990,
  perso:   1000     /* recargo por portada personalizada del planner semanal */
};

/* bajada bajo los títulos del catálogo según la pestaña */
const VISTAS = {
  catalogo: { bajada: "Toca la cantidad que quieras y pídela directo por WhatsApp" },
  planners: { bajada: "Agendas y planners anillados, diseñados por nosotros. Toca la portada para ver su interior" }
};

const AGENDA = {
  nombre: "Agenda Atrévete 2027",
  portadas: {
    burdeo: { nom: "burdeo", img: "agenda/portada-burdeo.jpg", color: "#7d1f3a" },
    lila:   { nom: "lila",   img: "agenda/portada-lila.jpg",   color: "#e4c3e8" }
  },
  /* un título por pliego (página izq + der), en orden */
  pliegos: ["Datos personales","Calendarios","Calendario 2028 y feriados","Planificación anual",
            "Metas y mi año en colores","Cumpleaños","Planificación mensual","Control de gastos y ahorro",
            "Notas","Semana a la vista","Semana a la vista","Mis lecturas","Lista de deseos","Notas"]
};
const pliego = (i, lado) => `agenda/pliego-${String(i + 1).padStart(2, "0")}-${lado}.jpg`;

const SEMANAL = {
  nombre: "Planner Semanal",
  portadas: Array.from({length: 10}, (_, i) => `semanal/portadas/portada-${String(i + 1).padStart(2, "0")}.jpg`),
  mockups:  Array.from({length: 10}, (_, i) => `semanal/mockups/mockup-${String(i + 1).padStart(2, "0")}.webp`),  /* mismo orden */
  tiro:   "semanal/hoja-tiro.jpg",     /* planificación semanal */
  retiro: "semanal/hoja-retiro.jpg",   /* hábitos y objetivos */
  hojasVisor: 3,                       /* cuántas semanas muestra la vista previa */
  /* esquinas de la portada dentro del mockup (sobre un ancho de 1000px) */
  quad: [[137.6,78.1],[983.3,234.4],[865.9,906.7],[19.8,771.0]]
};

/* productos "virtuales" para el carrito de la tienda */
const P_AGENDA  = {id: "pl-agenda",  n: AGENDA.nombre,  e: "📒", vars: [{v: "", p: []}], dcto: 0};
const P_SEMANAL = {id: "pl-semanal", n: SEMANAL.nombre, e: "🗓️", vars: [{v: "", p: []}], dcto: 0};

/* ---------- utilidades ---------- */
const $ = id => document.getElementById(id);
const src = ruta => PL_IMG + ruta;
const menosMov = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const waHref = msg => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const FOCO = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]):not([hidden]),[tabindex]:not([tabindex="-1"])';

document.querySelectorAll("[data-pl-precio]").forEach(el => { el.textContent = fmt(PRECIOS[el.dataset.plPrecio]); });

/* =========================================================
   SWITCH DEL CATÁLOGO: Catálogo ↔ Planner
   La pastilla tinta se estira como gota hasta cubrir ambas opciones y se
   recoge en la elegida, cuyo corazón late al llegar. El contenido sale hacia
   el costado contrario y el nuevo entra desde el lado al que se movió el switch.
   ========================================================= */
const PANELES = { catalogo: $("listaProductos"), planners: $("plPanel") };
const TABS = { catalogo: $("tabCatalogo"), planners: $("tabPlanners") };
const SWITCH = $("plSwitch");
const cambian = [$("bajadaSec")];
let vista = "catalogo", vistaT = null, gotaT = null;

function laten(tab){
  const c = tab.querySelector(".hg-title");
  c.classList.remove("late");
  void c.getBoundingClientRect();   /* reinicia la animación si ya había latido */
  c.classList.add("late");
}
function mueveSwitch(v){
  clearTimeout(gotaT);
  if (menosMov()){ SWITCH.dataset.vista = v; return; }
  SWITCH.classList.add("estira");
  gotaT = setTimeout(() => {
    SWITCH.dataset.vista = v;
    SWITCH.classList.remove("estira");
    gotaT = setTimeout(() => laten(TABS[v]), 240);   /* cuando la pastilla ya se recogió */
  }, 240);
}

function muestraVista(v, enfoca){
  if (v === vista) return;
  const sale = PANELES[vista], entra = PANELES[v];
  vista = v;
  Object.entries(TABS).forEach(([k, t]) => {
    t.setAttribute("aria-selected", String(k === v));
    t.tabIndex = k === v ? 0 : -1;
  });
  if (enfoca) TABS[v].focus();
  mueveSwitch(v);
  $("productos").style.setProperty("--pl-dir", v === "planners" ? "1" : "-1");
  history.replaceState(null, "", v === "planners" ? "#planners" : "#productos");
  const cabecera = document.querySelector("#productos .titulo-sec");
  const cambia = () => {
    /* la cabecera no se mueve: al ocultar el catálogo el navegador re-ancla el
       scroll a otro elemento y la página salta; se compensa la diferencia */
    const antes = cabecera.getBoundingClientRect().top;
    sale.hidden = true;
    sale.classList.remove("pl-fuera");
    $("bajadaSec").textContent = VISTAS[v].bajada;
    entra.hidden = false;
    scrollBy({top: cabecera.getBoundingClientRect().top - antes, behavior: "instant"});
    entra.querySelectorAll(".reveal").forEach(el => el.classList.add("vis"));
    [entra, ...cambian].forEach(el => el.classList.add("pl-entra"));
    void entra.offsetWidth;
    [entra, ...cambian].forEach(el => el.classList.remove("pl-entra", "pl-fuera"));
  };
  clearTimeout(vistaT);
  if (menosMov()) return cambia();
  [sale, ...cambian].forEach(el => el.classList.add("pl-fuera"));
  vistaT = setTimeout(cambia, 200);
}
Object.entries(TABS).forEach(([k, t]) => {
  t.addEventListener("click", () => muestraVista(k));
  /* flechas entre pestañas (patrón tablist) */
  t.addEventListener("keydown", e => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    muestraVista(k === "catalogo" ? "planners" : "catalogo", true);
  });
});

/* el enlace "Planners" del menú (y #planners al cargar) abre la pestaña y baja al catálogo */
function irAPlanners(){
  const desdePoliticas = document.body.classList.contains("en-politicas");
  muestraVista("planners");
  /* se baja cuando el cambio de panel ya terminó (su ajuste de scroll cortaría el desplazamiento suave) */
  setTimeout(() => $("productos").scrollIntoView({behavior: menosMov() ? "instant" : "smooth", block: "start"}),
             (desdePoliticas ? 450 : 0) + (menosMov() ? 0 : 240));
}
document.querySelectorAll('a[href="#planners"]').forEach(a => a.addEventListener("click", e => {
  if (location.hash === "#planners"){ e.preventDefault(); irAPlanners(); }
}));
document.querySelectorAll('a[href="#productos"]').forEach(a => a.addEventListener("click", () => muestraVista("catalogo")));
addEventListener("hashchange", () => {
  if (location.hash === "#planners") irAPlanners();
  else if (location.hash === "#productos") muestraVista("catalogo");
});

/* Diálogo accesible: Esc cierra, el foco queda atrapado adentro y vuelve al
   botón que lo abrió; clic en el fondo también cierra. */
function dialogo(el, {alAbrir, teclas} = {}){
  let previo = null, t = null;
  const abierto = () => el.classList.contains("abierto");
  function abre(){
    previo = document.activeElement;
    clearTimeout(t);
    el.hidden = false;
    void el.offsetWidth;            /* fuerza el reflow para que corra la transición */
    el.classList.add("abierto");
    document.body.style.overflow = "hidden";
    if (alAbrir) alAbrir();
  }
  function cierra(){
    if (!abierto()) return;
    el.classList.remove("abierto");
    document.body.style.overflow = "";
    t = setTimeout(() => { el.hidden = true; }, menosMov() ? 0 : 300);
    if (previo && previo.focus) previo.focus();
  }
  document.addEventListener("keydown", e => {
    if (!abierto()) return;
    if (e.key === "Escape"){ e.preventDefault(); cierra(); return; }
    if (e.key === "Tab"){
      const fs = [...el.querySelectorAll(FOCO)].filter(x => x.offsetParent !== null);
      if (!fs.length) return;
      const i = fs.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0){ e.preventDefault(); fs[fs.length - 1].focus(); }
      else if (!e.shiftKey && (i === -1 || i === fs.length - 1)){ e.preventDefault(); fs[0].focus(); }
      return;
    }
    if (teclas) teclas(e);
  });
  el.addEventListener("click", e => { if (e.target === el) cierra(); });
  el.querySelectorAll(".pl-cerrar").forEach(b => b.addEventListener("click", cierra));
  return {abre, cierra};
}

/* Visor con hojas que giran. Sirve para la agenda (eje Y, anillado al centro) y
   para el planner (eje X, anillado arriba): cambia solo cómo se arma y se rotula. */
function visor(el, {libro, arma, rotulo, alEstado, mitadClic}){
  const cuenta = el.querySelector(".pl-cuenta");
  const [ant, sig] = el.querySelectorAll(".pl-nav");
  let hojas = [], cur = 0, ocupado = false;

  function pinta(){
    const n = hojas.length;
    hojas.forEach((h, i) => {
      h.classList.toggle("vuelta", i < cur);
      if (!h.classList.contains("girando")) h.style.zIndex = i < cur ? i + 1 : n - i;
    });
    alEstado(cur, n);
    ant.disabled = cur === 0;
    sig.disabled = cur === n;
    cuenta.textContent = rotulo(cur, n);
  }
  function gira(dir){
    if (ocupado) return;
    const n = hojas.length, obj = dir > 0 ? cur : cur - 1;
    if (obj < 0 || obj >= n) return;
    ocupado = true;
    const h = hojas[obj];
    h.classList.add("girando");
    h.style.zIndex = n + 5;
    cur += dir;
    pinta();
    setTimeout(() => { h.classList.remove("girando"); ocupado = false; pinta(); }, menosMov() ? 30 : 900);
  }
  ant.addEventListener("click", () => gira(-1));
  sig.addEventListener("click", () => gira(1));

  /* deslizar o tocar la hoja */
  let px = 0, py = 0;
  libro.addEventListener("pointerdown", e => { px = e.clientX; py = e.clientY; });
  libro.addEventListener("pointerup", e => {
    const dx = e.clientX - px, dy = e.clientY - py;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 40) gira((Math.abs(dy) > Math.abs(dx) ? dy : dx) < 0 ? 1 : -1);
  });
  libro.addEventListener("click", e => {
    if (Math.abs(e.clientX - px) > 10 || Math.abs(e.clientY - py) > 10) return;
    gira(mitadClic(e, libro.getBoundingClientRect(), cur, hojas.length));
  });

  const dlg = dialogo(el, {
    alAbrir(){
      cur = 0;
      hojas = arma();
      pinta();
      /* la portada se abre sola */
      setTimeout(() => { sig.focus(); gira(1); }, menosMov() ? 0 : 450);
    },
    teclas(e){
      const k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown"){ e.preventDefault(); gira(1); }
      if (k === "ArrowLeft"  || k === "ArrowUp"){   e.preventDefault(); gira(-1); }
    }
  });
  return dlg;
}

const hojaHTML = (cara, frente, dorso, claseDorso = "") =>
  `<div class="${cara} frente">${frente}</div><div class="${cara} dorso ${claseDorso}">${dorso}</div><div class="pl-sombra"></div>`;
const imgHTML = (ruta, alt) => `<img src="${src(ruta)}" alt="${alt}" draggable="false" loading="lazy">`;

/* =========================================================
   AGENDA ATRÉVETE 2027
   ========================================================= */
const agPortada = $("plAgendaPortada");
const agWa = $("plAgendaWa");
const agSel = () => AGENDA.portadas[document.querySelector('input[name="plAgendaPortada"]:checked').value];
const agMsg = () => {
  const c = agSel();
  return `Hola Heart Graphic! 💜 Quiero pedir: ${AGENDA.nombre} (portada ${c.nom}) — ${fmt(PRECIOS.agenda)}`;
};
function agPinta(){
  const c = agSel();
  agPortada.src = src(c.img);
  agPortada.alt = `Portada ${c.nom} de la ${AGENDA.nombre}`;
  agWa.href = waHref(agMsg());
}
document.querySelectorAll('input[name="plAgendaPortada"]').forEach(r => r.addEventListener("change", agPinta));
$("plAgendaIg").addEventListener("click", () => CART.pedirIg(agMsg()));
$("plAgendaCarro").addEventListener("click", () => {
  const c = agSel();
  CART.add(P_AGENDA, `Portada ${c.nom}`, 1, PRECIOS.agenda, "");
});
agPinta();

const libroAg = $("plLibroAgenda");
const visorAgenda = visor($("plVisorAgenda"), {
  libro: libroAg,
  /* hoja 0: portada → su dorso es la página izq del pliego 1
     hoja k: frente = der del pliego k-1, dorso = izq del pliego k
     última: frente = der del último pliego, dorso = contratapa */
  arma(){
    const c = agSel(), P = AGENDA.pliegos, n = P.length;
    const defs = [{f: `<div class="pl-tapa">${imgHTML(c.img, `Portada ${c.nom}`)}</div>`, d: imgHTML(pliego(0, "izq"), "Interior de la tapa")}];
    for (let k = 1; k < n; k++) defs.push({f: imgHTML(pliego(k - 1, "der"), P[k - 1]), d: imgHTML(pliego(k, "izq"), P[k])});
    defs.push({f: imgHTML(pliego(n - 1, "der"), "Interior de la contratapa"), d: "", cd: "contratapa"});
    libroAg.innerHTML = "";
    libroAg.style.setProperty("--tapa", c.color);
    return defs.map(x => {
      const h = document.createElement("div");
      h.className = "pl-hoja";
      h.innerHTML = hojaHTML("pl-cara", x.f, x.d, x.cd);
      libroAg.appendChild(h);
      return h;
    });
  },
  rotulo: (cur, n) => cur === 0 ? "Portada" : cur === n ? "Contratapa" : (AGENDA.pliegos[cur - 1] || ""),
  alEstado(cur, n){
    libroAg.classList.toggle("cerrado-frente", cur === 0);
    libroAg.classList.toggle("cerrado-atras", cur === n);
  },
  mitadClic(e, r, cur, n){
    const mid = cur === 0 ? r.left : cur === n ? r.right : r.left + r.width / 2;
    return e.clientX > mid ? 1 : -1;
  }
});
document.querySelectorAll('[data-pl-abre="agenda"]').forEach(b => b.addEventListener("click", visorAgenda.abre));

/* =========================================================
   PLANNER SEMANAL
   ========================================================= */
const mockup = $("plMockup");
const grid = $("plGaleriaGrid");
const perso = $("plPerso");
const ayuda = $("plAyuda");
const AYUDA = ayuda.textContent;
const semWa = $("plSemanalWa");
let semSel = 0;            /* portada elegida (índice) */
let propia = null;         /* imagen subida por el cliente (object URL, solo vista previa) */
let propiaCmyk = false;

$("plPersoPrecio").textContent = `+${fmt(PRECIOS.perso)}`;

const semTotal = () => PRECIOS.semanal + (perso.checked ? PRECIOS.perso : 0);
const semPortadaTxt = () => perso.checked ? "portada personalizada" : `portada N° ${semSel + 1}`;
function semMsg(){
  return `Hola Heart Graphic! 💜 Quiero pedir: ${SEMANAL.nombre} con ${semPortadaTxt()}` +
         (perso.checked ? " (te envío la imagen por aquí)" : "") + `. Total: ${fmt(semTotal())}`;
}
function avisa(m){ ayuda.textContent = m; ayuda.classList.add("aviso"); }
function ayudaNormal(){ ayuda.textContent = AYUDA; ayuda.classList.remove("aviso"); }
/* con "Personalizar" marcado no se puede pedir sin subir la imagen */
function faltaImagen(){
  if (!perso.checked || propia) return false;
  avisa("Sube la imagen para tu portada antes de pedir.");
  $("plSubir").focus();
  return true;
}

function semPinta(){
  const conPropia = perso.checked && !!propia;
  $("plTotal").textContent = fmt(semTotal());
  $("plTotalFila").hidden = !perso.checked;
  $("plCustom").hidden = !conPropia;
  $("plElegida").textContent = conPropia ? "Tu imagen" : `N° ${semSel + 1}`;
  $("plElegidaImg").src = conPropia ? propia : src(SEMANAL.portadas[semSel]);
  semWa.href = waHref(semMsg());
}

/* galería de portadas */
SEMANAL.portadas.forEach((ruta, i) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "pl-portada";
  b.setAttribute("aria-label", `Elegir portada ${i + 1}`);
  b.setAttribute("aria-pressed", "false");
  b.innerHTML = `<span class="pl-num" aria-hidden="true">${i + 1}.</span><img src="${src(ruta)}" alt="" loading="lazy" width="225" height="164">`;
  b.addEventListener("click", () => {
    if (perso.checked){ perso.checked = false; $("plPersoBox").hidden = true; }
    eligePortada(i);
    galeria.cierra();
  });
  grid.appendChild(b);
});
const galeria = dialogo($("plGaleria"), { alAbrir: () => grid.children[semSel].focus() });
$("plVerPortadas").addEventListener("click", galeria.abre);

function eligePortada(i, instantaneo){
  semSel = i;
  [...grid.children].forEach((t, k) => t.setAttribute("aria-pressed", String(k === i)));
  mockup.alt = `Planner Semanal con la portada N° ${i + 1}`;
  if (instantaneo || menosMov()) mockup.src = src(SEMANAL.mockups[i]);
  else {
    mockup.classList.add("fuera");
    setTimeout(() => { mockup.src = src(SEMANAL.mockups[i]); mockup.classList.remove("fuera"); }, 220);
  }
  semPinta();
}

perso.addEventListener("change", () => { $("plPersoBox").hidden = !perso.checked; ayudaNormal(); semPinta(); });
semWa.addEventListener("click", e => { if (faltaImagen()) e.preventDefault(); });
$("plSemanalIg").addEventListener("click", () => { if (!faltaImagen()) CART.pedirIg(semMsg()); });
$("plSemanalCarro").addEventListener("click", () => {
  if (faltaImagen()) return;
  const v = perso.checked ? "Portada personalizada (imagen por WhatsApp)" : `Portada N° ${semSel + 1}`;
  CART.add(P_SEMANAL, v, 1, semTotal(), "");
});

/* ---- imagen personalizada: se proyecta en perspectiva sobre la portada del mockup ---- */
function homografia(w, h, q){
  const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = q;
  const dx1 = x1-x2, dx2 = x3-x2, dy1 = y1-y2, dy2 = y3-y2, sx = x0-x1+x2-x3, sy = y0-y1+y2-y3;
  const det = dx1*dy2 - dx2*dy1, g = (sx*dy2 - dx2*sy)/det, hh = (dx1*sy - sx*dy1)/det;
  const a = x1-x0+g*x1, b = x3-x0+hh*x3, d = y1-y0+g*y1, e = y3-y0+hh*y3;
  return `matrix3d(${a/w},${d/w},0,${g/w}, ${b/h},${e/h},0,${hh/h}, 0,0,1,0, ${x0},${y0},0,1)`;
}
$("plWarp").style.transform = homografia(1000, 808, SEMANAL.quad);
const escena = document.querySelector("#plCustom .pl-escena");
new ResizeObserver(([en]) => { escena.style.transform = `scale(${en.contentRect.width / 1000})`; })
  .observe(document.querySelector(".pl-mockup"));

/* JPG en CMYK (archivos para imprenta): en pantalla se ven más oscuros */
function jpegEsCmyk(b){
  if (b[0] !== 0xFF || b[1] !== 0xD8) return false;
  let i = 2;
  while (i + 9 < b.length){
    if (b[i] !== 0xFF){ i++; continue; }
    const m = b[i+1], len = (b[i+2] << 8) | b[i+3];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return b[i+9] === 4;
    i += 2 + len;
  }
  return false;
}

const archivo = $("plArchivo");
$("plSubir").addEventListener("click", () => archivo.click());
archivo.addEventListener("change", async () => {
  const f = archivo.files[0];
  if (!f) return;
  if (!/^image\/(png|jpeg|webp)$/.test(f.type)){ avisa("Sube una imagen JPG, PNG o WEBP."); return; }
  if (f.size > 15 * 1024 * 1024){ avisa("La imagen pesa más de 15 MB. Prueba con una más liviana."); return; }
  try { propiaCmyk = jpegEsCmyk(new Uint8Array(await f.slice(0, 256 * 1024).arrayBuffer())); }
  catch(_){ propiaCmyk = false; }
  const url = URL.createObjectURL(f);
  const im = new Image();
  im.onload = () => {
    if (propia) URL.revokeObjectURL(propia);
    propia = url;
    $("plWarpImg").src = url;
    const th = $("plSubida"); th.src = url; th.hidden = false;
    $("plQuitar").hidden = false;
    $("plSubirTxt").textContent = "Cambiar imagen";
    if (propiaCmyk) avisa("Tu imagen está en CMYK y en pantalla se ve más oscura. Si puedes, súbela en RGB para ver bien los colores.");
    else if (im.naturalWidth < 1500) avisa("Tu imagen es pequeña y podría verse borrosa impresa. Si tienes una más grande, mejor.");
    else ayudaNormal();
    semPinta();
  };
  im.onerror = () => { URL.revokeObjectURL(url); avisa("No pudimos leer la imagen. Prueba con otro archivo."); };
  im.src = url;
});
$("plQuitar").addEventListener("click", () => {
  if (propia) URL.revokeObjectURL(propia);
  propia = null;
  archivo.value = "";
  $("plSubida").hidden = true;
  $("plQuitar").hidden = true;
  $("plSubirTxt").textContent = "Subir imagen";
  ayudaNormal();
  semPinta();
  $("plSubir").focus();
});

eligePortada(0, true);

/* ---- visor del planner: anillado arriba, las hojas giran hacia arriba ---- */
const bloc = $("plBlocSemanal");
/* aro blanco con contorno gris suave */
const ANILLA = '<svg viewBox="0 0 20 52" aria-hidden="true"><g fill="none" stroke-linecap="round"><g stroke="#a9a3ba" stroke-width="3.6"><ellipse cx="7" cy="26" rx="3.4" ry="23"/><ellipse cx="13" cy="26" rx="3.4" ry="23"/></g><g stroke="#fff" stroke-width="2"><ellipse cx="7" cy="26" rx="3.4" ry="23"/><ellipse cx="13" cy="26" rx="3.4" ry="23"/></g></g></svg>';
const visorSemanal = visor($("plVisorSemanal"), {
  libro: bloc,
  arma(){
    const portada = (perso.checked && propia) || src(SEMANAL.portadas[semSel]);
    const defs = [{f: `<img src="${portada}" alt="Portada" draggable="false">`, d: "", cd: "carton"}];
    for (let k = 0; k < SEMANAL.hojasVisor; k++)
      defs.push({f: imgHTML(SEMANAL.tiro, "Planificación semanal"), d: imgHTML(SEMANAL.retiro, "Hábitos y objetivos de la semana")});
    bloc.innerHTML = '<div class="pl-base"></div>';
    const hojas = defs.map(x => {
      const h = document.createElement("div");
      h.className = "pl-bhoja";
      h.innerHTML = hojaHTML("pl-bcara", x.f, x.d, x.cd);
      bloc.appendChild(h);
      return h;
    });
    const an = document.createElement("div");
    an.className = "pl-anillas";
    an.setAttribute("aria-hidden", "true");
    [9,15,21,27,33, 67,73,79,85,91].forEach(x => {
      an.insertAdjacentHTML("beforeend",
        `<span class="pl-hoyo abajo" style="left:${x}%"></span><span class="pl-hoyo arriba" style="left:${x}%"></span><span class="pl-anilla" style="left:${x}%">${ANILLA}</span>`);
    });
    bloc.appendChild(an);
    return hojas;
  },
  rotulo: (cur, n) => cur === 0 ? "Portada" : cur === 1 ? "Planificación semanal" : cur === n ? "Hábitos y objetivos" : "Hábitos · Planificación",
  alEstado: cur => bloc.classList.toggle("cerrado", cur === 0),
  mitadClic(e, r, cur){
    const mid = cur === 0 ? r.top + r.height * .25 : r.top + r.height / 2;
    return e.clientY > mid ? 1 : -1;
  }
});
document.querySelectorAll('[data-pl-abre="semanal"]').forEach(b => b.addEventListener("click", visorSemanal.abre));

/* entrar directo con #planners en la URL */
if (location.hash === "#planners") irAPlanners();

})();
