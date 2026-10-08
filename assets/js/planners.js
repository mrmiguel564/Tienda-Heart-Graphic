/* ================= Seccion PLANNERS =================
   Agendas (Atrévete y las demás, lista AGENDAS) y Planner Semanal (marcado en index.html → pestaña Planner #plPanel y
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
   más unidades se suman en el carrito (+/−). Los precios de cada agenda van en AGENDAS. */
const PRECIOS = {
  semanal: 9990,
  perso:   1000     /* recargo por portada personalizada del planner semanal */
};

/* bajada bajo los títulos del catálogo según la pestaña */
const VISTAS = {
  catalogo: { bajada: "Toca la cantidad que quieras y pídela directo por WhatsApp" },
  planners: { bajada: "Agendas y planners anillados, diseñados por nosotros. Toca la portada para ver su interior" }
};

/* ---------- AGENDAS ----------
   Cada agenda es un producto independiente con el mismo modelo que la Atrévete:
   portada anillada (perforaciones rectangulares + alambre blanco) y visor de pliegos.
   Imágenes en agendas/<id>/: portada-N.jpg, portada-N-mini.jpg, contratapa-N.jpg
   (si la portada trae retiro) y pagina-NN.jpg en orden de lectura (izq, der, izq…).
   - portadas: más de una = el cliente elige. color = contratapa lisa (sin retiro).
   - paginas: un título por página; repetir = cuántas veces se muestra esa lista.
   - ratio: ancho/alto de la página (A5 ≈ .705).
   TODO: precios reales (null = "Consultar"), descripciones y cantidad de hojas. */
const A5 = "Tamaño A5 (14,8 × 21 cm) · anillado", A6 = "Tamaño A6 (10,5 × 14,8 cm) · anillado", B5 = "Tamaño B5 (17,6 × 25 cm) · anillado";
const D = "Datos personales", I = "Páginas interiores", CAL = a => "Calendario " + a;
const SEM = "Semana a la vista", DIA = "Planificación diaria", PSEM = "Planificación semanal";
const veces = (t, n) => Array(n).fill(t);
const ATREVETE_PLIEGOS = ["Datos personales","Calendarios","Calendario 2028 y feriados","Planificación anual",
  "Metas y mi año en colores","Cumpleaños","Planificación mensual","Control de gastos y ahorro",
  "Notas","Semana a la vista","Semana a la vista","Mis lecturas","Lista de deseos","Notas"];
const portadasN = n => Array.from({length: n}, (_, i) => ({ nom: "N° " + (i + 1), retiro: true }));
const AGENDAS = [
  { id: "atrevete", nombre: "Agenda Atrévete 2027", precio: 24990, ratio: .6416,
    desc: "Agenda mes a mes con calendario, metas, control de gastos, ahorro y semana a la vista.",
    formato: "Tamaño B5 de 17,6 × 25 cm, 100 hojas (200 páginas) anilladas",
    portadas: [{ nom: "Burdeo", color: "#7d1f3a" }, { nom: "Lila", color: "#e4c3e8" }],
    paginas: ATREVETE_PLIEGOS.flatMap(t => [t, t]) },
  { id: "mi-planner-1", nombre: "Mi Planner · Diseño 1", precio: null, desc: "Planner con datos personales, calendario y semana a la vista.", formato: A5,
    portadas: [{ nom: "Mi Planner", retiro: true }], paginas: [D, CAL(2026), ...veces(SEM, 6)] },
  { id: "mi-planner-2", nombre: "Mi Planner · Diseño 2", precio: null, desc: "Planner con datos personales, calendario y semana a la vista.", formato: A5,
    portadas: [{ nom: "Mi Planner", retiro: true }], paginas: [D, CAL(2026), ...veces(SEM, 6)] },
  { id: "mi-planner-3", nombre: "Mi Planner · Diseño 3", precio: null, desc: "Planner con datos personales, calendario y semana a la vista.", formato: A5,
    portadas: [{ nom: "Mi Planner", retiro: true }], paginas: [D, CAL(2026), ...veces(SEM, 6)] },
  { id: "levantate-brilla", nombre: "Planner Levántate & Brilla", precio: null, desc: "Planner con calendarios 2026-2027 y planificación semanal.", formato: A5,
    portadas: [{ nom: "Levántate & Brilla", retiro: true }], paginas: [D, CAL(2026), CAL(2027), ...veces(PSEM, 7)] },
  { id: "brilla-universo", nombre: "Planner Brilla", precio: null, desc: "“Brilla como si todo el Universo fuera tuyo”: calendarios 2026-2027 y planificación semanal.", formato: A5,
    portadas: [{ nom: "Brilla", retiro: true }], paginas: [D, CAL(2026), CAL(2027), ...veces(PSEM, 7)] },
  { id: "docente-heroes", nombre: "Planner Docente · Héroes", precio: null, desc: "Planner para profes: organiza clases, cursos y semanas.", formato: A5,
    portadas: [{ nom: "Héroes", retiro: true }], paginas: veces(I, 5) },
  { id: "docente-inspirar", nombre: "Planner Docente · Enseñar es Inspirar", precio: null, desc: "Planner para profes con calendarios 2026-2027.", formato: A5,
    portadas: [{ nom: "Enseñar es Inspirar", retiro: true }], paginas: [I, CAL(2026), CAL(2027), ...veces(I, 9)] },
  { id: "docente-corazon", nombre: "Planner Docente · Gran Corazón", precio: null, desc: "Planner para profes con calendarios 2026-2027.", formato: A5,
    portadas: [{ nom: "Gran Corazón", retiro: true }], paginas: [I, CAL(2026), CAL(2027), ...veces(I, 9)] },
  { id: "universitario", nombre: "Planner Universitario", precio: null, desc: "Planner para la U con calendario 2027. Elige entre 6 portadas.", formato: A5,
    portadas: [1, 2, 3, 4, 5, 6].map(n => ({ nom: "N° " + n, retiro: n !== 5 })),   /* la 5 no trae contratapa */
    paginas: [D, CAL(2027), ...veces(I, 8)] },
  { id: "diario-1", nombre: "Planner Diario · Diseño 1", precio: null, desc: "Un día por página para planificar con calma.", formato: A5,
    portadas: [{ nom: "Planner Diario", retiro: true }], paginas: [D, ...veces(DIA, 8)] },
  { id: "diario-2", nombre: "Planner Diario · Diseño 2", precio: null, desc: "Un día por página para planificar con calma.", formato: A5,
    portadas: [{ nom: "Planner Diario", retiro: true }], paginas: [D, ...veces(DIA, 8)] },
  { id: "diario-3", nombre: "Planner Diario · Diseño 3", precio: null, desc: "Un día por página para planificar con calma.", formato: A5,
    portadas: [{ nom: "Planner Diario", retiro: true }], paginas: [D, ...veces(DIA, 8)] },
  { id: "diario-4", nombre: "Planner Diario · Diseño 4", precio: null, desc: "Un día por página para planificar con calma.", formato: A5,
    portadas: [{ nom: "Planner Diario", retiro: true }], paginas: [DIA], repetir: 4 },
  { id: "diario-5", nombre: "Planner Diario · Diseño 5", precio: null, desc: "Un día por página para planificar con calma.", formato: A5,
    portadas: [{ nom: "Planner Diario", retiro: true }], paginas: [DIA], repetir: 4 },
  { id: "diario-6", nombre: "Planner Diario · Diseño 6", precio: null, desc: "Un día por página para planificar con calma.", formato: A5,
    portadas: [{ nom: "Planner Diario", retiro: true }], paginas: [DIA], repetir: 4 },
  { id: "semanal-diario-potencial", nombre: "Planner Semanal Diario · Potencial", precio: null, desc: "Planificación semanal y diaria con calendario 2026.", formato: A5,
    portadas: [{ nom: "Potencial", retiro: true }], paginas: [D, CAL(2026), ...veces(PSEM, 6)] },
  { id: "semanal-diario-buen-dia", nombre: "Planner Semanal Diario · Buen Día", precio: null, desc: "Planificación semanal y diaria con calendarios 2026-2027.", formato: A5,
    portadas: [{ nom: "Buen Día", retiro: true }], paginas: [D, CAL(2026), "Calendario 2026-2027", ...veces(PSEM, 6)] },
  { id: "suena-azul", nombre: "Planner Sueña en Grande · Azul", precio: null, desc: "Planner tipo cuaderno con calendario 2026.", formato: A5,
    portadas: [{ nom: "Sueña en Grande", retiro: true }], paginas: [D, CAL(2026), ...veces(I, 3)] },
  { id: "suena-atardecer", nombre: "Planner Sueña en Grande · Atardecer", precio: null, desc: "Planner tipo cuaderno con calendarios 2026-2027.", formato: A5,
    portadas: [{ nom: "Sueña en Grande", retiro: true }], paginas: [D, CAL(2026), CAL(2027), ...veces(I, 3)] },
  { id: "xl", nombre: "Planner XL", precio: null, ratio: .704, desc: "Formato grande para planificar con espacio de sobra.", formato: B5,
    portadas: [{ nom: "La meta", retiro: true }], paginas: veces(I, 11) },
  { id: "gratitud", nombre: "Diario de Gratitud", precio: null, desc: "Diario para agradecer cada día. Elige entre 2 portadas.", formato: A5,
    portadas: [{ nom: "Noche", retiro: true }, { nom: "Rosa", retiro: true }], paginas: [D, CAL(2026), ...veces(I, 3)] },
  { id: "mini-diario", nombre: "Mini Planner Diario", precio: null, ratio: .709, desc: "Planner diario de bolsillo. Elige entre 5 portadas.", formato: A6,
    portadas: portadasN(5), paginas: [DIA, DIA], repetir: 2 },
  { id: "mini-lineas", nombre: "Mini Agenda Líneas", precio: null, ratio: .709, desc: "Agenda de bolsillo con hojas de líneas. Elige entre 4 portadas.", formato: A6,
    portadas: portadasN(4), paginas: ["Hojas de líneas"], repetir: 4 }
];
/* ruta de cada imagen de una agenda */
const agImg = {
  portada:    (a, k) => `agendas/${a.id}/portada-${k + 1}.jpg`,
  mini:       (a, k) => `agendas/${a.id}/portada-${k + 1}-mini.jpg`,
  contratapa: (a, k) => `agendas/${a.id}/contratapa-${k + 1}.jpg`,
  pagina:     (a, i) => `agendas/${a.id}/pagina-${String(i + 1).padStart(2, "0")}.jpg`
};
/* páginas en orden de lectura: [{src, t}] (repite la lista si la agenda lo pide) */
const paginasDe = a => {
  const una = a.paginas.map((t, i) => ({ src: agImg.pagina(a, i), t }));
  return Array.from({length: a.repetir || 1}, () => una).flat();
};

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
const pCarro = a => ({id: "pl-" + a.id, n: a.nombre, e: "📒", vars: [{v: "", p: []}], dcto: 0});
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
   AGENDAS (Atrévete y las demás)
   Cada una se arma desde AGENDAS con el mismo modelo: tarjeta con la portada
   anillada (perforaciones rectangulares + alambre blanco) y un visor compartido
   donde las hojas giran sobre el anillado del centro.
   ========================================================= */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const LIBRO_SVG = '<svg class="ic pl-ic-libro" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5c3-1.5 6.5-1.5 10 1 3.5-2.5 7-2.5 10-1v14c-3-1.5-6.5-1.5-10 1-3.5-2.5-7-2.5-10-1z"/><path d="M12 6v14"/></svg>';
const ANILLO_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><path d="M8 5h12M8 12h12M8 19h12"/></g></svg>';
const agSel = new Map();   /* id → índice de la portada elegida */
const agPerso = new Map(); /* id → {activo, url}: portada personalizada (la imagen no se sube, solo vista previa) */
const ratioDe = a => a.ratio || .705;
const SUBIR_SVG = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></g></svg>';

function agMsg(a){
  const k = agSel.get(a.id) || 0, p = agPerso.get(a.id) || {};
  if (p.activo) return a.precio
    ? `Hola Heart Graphic! 💜 Quiero pedir: ${a.nombre} con portada personalizada (te envío la imagen por aquí) — ${fmt(a.precio + PRECIOS.perso)}`
    : `Hola Heart Graphic! 💜 Quiero consultar por: ${a.nombre} con portada personalizada (+${fmt(PRECIOS.perso)}, te envío la imagen por aquí)`;
  const portada = a.portadas.length > 1 ? ` (portada ${a.portadas[k].nom})` : "";
  return a.precio
    ? `Hola Heart Graphic! 💜 Quiero pedir: ${a.nombre}${portada} — ${fmt(a.precio)}`
    : `Hola Heart Graphic! 💜 Quiero consultar por: ${a.nombre}${portada}`;
}

function tarjetaAgenda(a){
  const art = document.createElement("article");
  art.className = "prod pl-prod reveal";
  art.id = "ag-" + a.id;
  const nombre = esc(a.nombre);
  const varias = a.portadas.length > 1, total = a.portadas.length;
  const FLECHA = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}"/></svg>`;
  /* varias portadas: fila compacta de miniaturas con flechas en la tarjeta… */
  const elegir = varias
    ? `<div class="pl-pt-cab"><span class="pl-lab">Portada</span><span class="pl-pt-cuenta" aria-live="polite"></span></div>
       <div class="pl-pt-fila">
         <button class="pl-pt-flecha" type="button" data-dir="-1" aria-label="Ver portadas anteriores">${FLECHA(-1)}</button>
         <div class="pl-pt-pista" role="radiogroup" aria-label="Portada de ${nombre}">
           ${a.portadas.map((p, k) => `<label class="pl-pt" title="${esc(p.nom)}"><input class="pl-oculto" type="radio" name="ag-${a.id}" value="${k}" aria-label="Portada ${esc(p.nom)}"${k ? "" : " checked"}><img src="${src(agImg.mini(a, k))}" alt="" width="160" height="${Math.round(160 / ratioDe(a))}" loading="lazy"></label>`).join("")}
         </div>
         <button class="pl-pt-flecha" type="button" data-dir="1" aria-label="Ver más portadas">${FLECHA(1)}</button>
       </div>`
    : "";
  /* …y flechas + puntos sobre la portada grande */
  const portadaBtn = `<button class="pl-agenda-btn" type="button" data-ag="${a.id}" aria-label="Ver el interior de ${nombre}">
        <span class="pl-cantos" aria-hidden="true"></span>
        <img class="pl-agenda-portada" src="${src(agImg.portada(a, 0))}" alt="Portada de ${nombre}" loading="lazy">
      </button>`;
  art.innerHTML = `
    <div class="pl-arte">
      ${varias ? `<div class="pl-portada-marco">
        ${portadaBtn}
        <button class="pl-foto-flecha ant" type="button" data-paso="-1" aria-label="Portada anterior">${FLECHA(-1)}</button>
        <button class="pl-foto-flecha sig" type="button" data-paso="1" aria-label="Portada siguiente">${FLECHA(1)}</button>
      </div>
      <div class="pl-puntos" aria-hidden="true">
        ${a.portadas.map((p, k) => `<button class="pl-punto" type="button" tabindex="-1" data-k="${k}"></button>`).join("")}
        <span class="pl-puntos-n"></span>
      </div>` : portadaBtn}
      <button class="ver-mas" type="button" data-ag="${a.id}">${LIBRO_SVG} Ve el interior</button>
    </div>
    <div class="tarjeta">
      <span class="badge">planner</span>
      <h3>${nombre}</h3>
      <p class="desc">${esc(a.desc)}</p>
      <div class="pl-precio"><span>Valor único</span><b>${a.precio ? fmt(a.precio) : "Consultar"}</b></div>
      ${elegir}
      <div class="pl-perso">
        <label class="fila pl-op pl-op-check"><input class="pl-oculto pl-perso-chk" type="checkbox"><span class="chk" aria-hidden="true"></span><span class="un">Personaliza tu portada</span><span class="pr">+${fmt(PRECIOS.perso)}</span></label>
        <div class="pl-perso-box" hidden>
          <input type="file" class="pl-archivo" accept="image/png,image/jpeg,image/webp" hidden>
          <div class="pl-subir">
            <button type="button" class="pl-subir-btn">${SUBIR_SVG} <span class="pl-subir-txt">Subir imagen</span></button>
            <img class="pl-subida" alt="Vista previa de tu imagen" hidden>
            <button type="button" class="pl-quitar" hidden>Quitar</button>
          </div>
          <small class="pl-ayuda" aria-live="polite">Tu imagen será la portada: la ves en la foto y en «Ve el interior». Usa una imagen vertical en buena resolución (JPG o PNG).</small>
        </div>
      </div>
      ${a.precio ? `<div class="pl-total" hidden><span>Total con portada personalizada</span><b>${fmt(a.precio + PRECIOS.perso)}</b></div>` : ""}
      <p class="notas">${esc(a.formato)}</p>
      <div class="materiales">
        <div class="mat"><span class="ico">${ANILLO_SVG}</span><b>Anillado metálico</b><i>Full color</i></div>
      </div>
      <div class="fila-pedir">
        <a class="pedir" target="_blank" rel="noopener" title="Pedir por WhatsApp"><svg class="ic"><use href="#ic-wa"/></svg> <span class="lbl">WhatsApp</span></a>
        <button class="pedir pedir-ig" type="button" title="Pedir por Instagram" aria-label="Pedir por Instagram"><svg class="ic"><use href="#ic-ig"/></svg> <span class="lbl">Instagram</span></button>
        ${a.precio ? `<button class="add-cart" type="button" title="Agregar al carrito" aria-label="Agregar al carrito"><svg class="ic"><use href="#ic-cart-add"/></svg></button>` : ""}
      </div>
    </div>`;
  art.style.setProperty("--pag", ratioDe(a));

  const portada = art.querySelector(".pl-agenda-portada");
  const wa = art.querySelector(".pedir:not(.pedir-ig)");
  const radios = [...art.querySelectorAll(`input[name="ag-${a.id}"]`)];
  const pista = art.querySelector(".pl-pt-pista");
  const flechasFila = [...art.querySelectorAll(".pl-pt-flecha")];
  /* flechas de la fila: se apagan en los extremos y se ocultan si caben todas */
  const pintaFlechas = () => {
    if (!pista) return;
    const sobra = pista.scrollWidth - pista.clientWidth;
    flechasFila.forEach(f => {
      f.hidden = sobra <= 2;
      f.disabled = f.dataset.dir < 0 ? pista.scrollLeft <= 2 : pista.scrollLeft >= sobra - 2;
    });
  };
  /* portada personalizada: la imagen del cliente se ve como portada (foto y visor) */
  const st = { activo: false, url: null };
  agPerso.set(a.id, st);
  const chk = art.querySelector(".pl-perso-chk"), box = art.querySelector(".pl-perso-box");
  const archivo = art.querySelector(".pl-archivo"), subirBtn = art.querySelector(".pl-subir-btn");
  const ayuda = art.querySelector(".pl-ayuda"), AYUDA = ayuda.textContent, totalFila = art.querySelector(".pl-total");
  const avisa = m => { ayuda.textContent = m; ayuda.classList.add("aviso"); };
  const ayudaOk = () => { ayuda.textContent = AYUDA; ayuda.classList.remove("aviso"); };
  /* con "Personaliza" marcado no se puede pedir sin subir la imagen */
  const faltaImagen = () => {
    if (!st.activo || st.url) return false;
    avisa("Sube la imagen para tu portada antes de pedir.");
    subirBtn.focus();
    return true;
  };
  const pinta = () => {
    const k = agSel.get(a.id) || 0, nom = a.portadas[k].nom, propia = st.activo && st.url;
    portada.src = propia || src(agImg.portada(a, k));
    portada.alt = propia ? `Tu portada personalizada para ${a.nombre}` : `Portada ${varias ? nom + " " : ""}de ${a.nombre}`;
    wa.href = waHref(agMsg(a));
    if (totalFila) totalFila.hidden = !st.activo;
    art.classList.toggle("pl-con-perso", st.activo);
    if (!varias) return;
    radios.forEach((r, i) => { r.checked = !st.activo && i === k; });   /* con la propia, ninguna miniatura queda marcada */
    art.querySelector(".pl-pt-cuenta").textContent = st.activo ? "Tu imagen" : (/^N°/.test(nom) ? "" : nom + " · ") + `N° ${k + 1} de ${total}`;
    art.querySelectorAll(".pl-punto").forEach((p, i) => p.classList.toggle("on", !st.activo && i === k));
    art.querySelector(".pl-puntos-n").textContent = st.activo ? "Tu imagen" : `${k + 1} / ${total}`;
    /* la miniatura elegida siempre queda a la vista en la fila */
    const pt = radios[k].closest(".pl-pt");
    const izq = pt.offsetLeft - pista.offsetLeft, der = izq + pt.offsetWidth;
    if (izq < pista.scrollLeft) pista.scrollTo({ left: izq - 4, behavior: menosMov() ? "auto" : "smooth" });
    else if (der > pista.scrollLeft + pista.clientWidth) pista.scrollTo({ left: der - pista.clientWidth + 4, behavior: menosMov() ? "auto" : "smooth" });
  };
  /* elegir una portada del catálogo apaga la personalizada (la imagen subida se conserva) */
  const elige = k => {
    agSel.set(a.id, (k + total) % total);
    if (st.activo){ st.activo = false; chk.checked = false; box.hidden = true; ayudaOk(); }
    pinta();
  };
  chk.addEventListener("change", () => { st.activo = chk.checked; box.hidden = !chk.checked; ayudaOk(); pinta(); });
  subirBtn.addEventListener("click", () => archivo.click());
  archivo.addEventListener("change", async () => {
    const f = archivo.files[0];
    if (!f) return;
    if (!/^image\/(png|jpeg|webp)$/.test(f.type)){ avisa("Sube una imagen JPG, PNG o WEBP."); return; }
    if (f.size > 15 * 1024 * 1024){ avisa("La imagen pesa más de 15 MB. Prueba con una más liviana."); return; }
    let cmyk = false;
    try { cmyk = jpegEsCmyk(new Uint8Array(await f.slice(0, 256 * 1024).arrayBuffer())); } catch(_){}
    const url = URL.createObjectURL(f), im = new Image();
    im.onload = () => {
      if (st.url) URL.revokeObjectURL(st.url);
      st.url = url;
      const th = art.querySelector(".pl-subida"); th.src = url; th.hidden = false;
      art.querySelector(".pl-quitar").hidden = false;
      art.querySelector(".pl-subir-txt").textContent = "Cambiar imagen";
      if (cmyk) avisa("Tu imagen está en CMYK y en pantalla se ve más oscura. Si puedes, súbela en RGB para ver bien los colores.");
      else if (im.naturalHeight < 1200) avisa("Tu imagen es pequeña y podría verse borrosa impresa. Si tienes una más grande, mejor.");
      else ayudaOk();
      pinta();
    };
    im.onerror = () => { URL.revokeObjectURL(url); avisa("No pudimos leer la imagen. Prueba con otro archivo."); };
    im.src = url;
  });
  art.querySelector(".pl-quitar").addEventListener("click", () => {
    if (st.url) URL.revokeObjectURL(st.url);
    st.url = null;
    archivo.value = "";
    art.querySelector(".pl-subida").hidden = true;
    art.querySelector(".pl-quitar").hidden = true;
    art.querySelector(".pl-subir-txt").textContent = "Subir imagen";
    ayudaOk();
    pinta();
    subirBtn.focus();
  });
  wa.addEventListener("click", e => { if (faltaImagen()) e.preventDefault(); });
  radios.forEach(r => r.addEventListener("change", () => elige(+r.value)));
  art.querySelectorAll(".pl-foto-flecha").forEach(b => b.addEventListener("click", () => elige((agSel.get(a.id) || 0) + +b.dataset.paso)));
  art.querySelectorAll(".pl-punto").forEach(b => b.addEventListener("click", () => elige(+b.dataset.k)));
  flechasFila.forEach(f => f.addEventListener("click", () => pista.scrollBy({ left: f.dataset.dir * 104, behavior: menosMov() ? "auto" : "smooth" })));
  if (pista){
    pista.addEventListener("scroll", pintaFlechas, { passive: true });
    new ResizeObserver(pintaFlechas).observe(pista);
  }
  art.querySelector(".pedir-ig").addEventListener("click", () => { if (!faltaImagen()) CART.pedirIg(agMsg(a)); });
  const carro = art.querySelector(".add-cart");
  if (carro) carro.addEventListener("click", () => {
    if (faltaImagen()) return;
    const k = agSel.get(a.id) || 0;
    if (st.activo) CART.add(pCarro(a), "Portada personalizada (imagen por WhatsApp)", 1, a.precio + PRECIOS.perso, "");
    else CART.add(pCarro(a), varias ? `Portada ${a.portadas[k].nom}` : "Valor único", 1, a.precio, "");
  });
  art.querySelectorAll("[data-ag]").forEach(b => b.addEventListener("click", () => abreAgenda(a)));
  pinta();
  return art;
}

/* las agendas van antes del Planner Semanal; luego se numeran todas las tarjetas del panel */
const semanalArt = $("plSemanal");
AGENDAS.forEach(a => semanalArt.before(tarjetaAgenda(a)));
document.querySelectorAll("#plPanel > .prod .badge").forEach((b, i) => { b.textContent = "planner " + String(i + 1).padStart(2, "0"); });

/* ---- visor compartido de las agendas ---- */
const visorAgEl = $("plVisorAgenda");
const libroAg = $("plLibroAgenda");
let agActual = AGENDAS[0], agPags = [];
const visorAgenda = visor(visorAgEl, {
  libro: libroAg,
  /* hoja 0: portada → su dorso es la primera página (izquierda del pliego 1)
     hoja k: frente = página 2k-1 (derecha), dorso = página 2k (izquierda del siguiente)
     la última hoja termina en la contratapa (retiro de la portada, o su color liso) */
  arma(){
    const a = agActual, k = agSel.get(a.id) || 0, c = a.portadas[k];
    const per = agPerso.get(a.id) || {}, propia = per.activo && per.url;   /* portada personalizada: contratapa lisa */
    const P = agPags = paginasDe(a), m = P.length;
    const img = (p, alt) => `<img src="${src(p.src)}" alt="${esc(alt || p.t)}" draggable="false" loading="lazy">`;
    const contra = !propia && c.retiro ? img({ src: agImg.contratapa(a, k) }, "Contratapa") : "";
    const tapa = propia ? `<img src="${propia}" alt="Tu portada personalizada" draggable="false">` : `<img src="${src(agImg.portada(a, k))}" alt="Portada" draggable="false">`;
    const defs = [{ f: `<div class="pl-tapa">${tapa}</div>`, d: img(P[0]) }];
    for (let i = 1; i < m; i += 2) defs.push({ f: img(P[i]), d: P[i + 1] ? img(P[i + 1]) : contra, cd: P[i + 1] ? "" : "contratapa" });
    if (m % 2 === 1) defs.push({ f: "", d: contra, cd: "contratapa" });   /* número impar: hoja final en blanco */
    libroAg.innerHTML = "";
    libroAg.style.setProperty("--tapa", (!propia && c.color) || "#e8e2d8");
    const hojas = defs.map(x => {
      const h = document.createElement("div");
      h.className = "pl-hoja";
      h.innerHTML = hojaHTML("pl-cara", x.f, x.d, x.cd);
      libroAg.appendChild(h);
      return h;
    });
    /* anillado del lomo: perforaciones a cada lado + alambre doble blanco, siempre encima */
    libroAg.insertAdjacentHTML("beforeend", '<span class="pl-anillado" aria-hidden="true"></span>');
    return hojas;
  },
  rotulo(cur, n){
    if (cur === 0) return "Portada";
    if (cur === n) return "Contratapa";
    const izq = agPags[2 * cur - 2], der = agPags[2 * cur - 1];
    return (izq || der || {}).t || "";
  },
  alEstado(cur, n){
    libroAg.classList.toggle("cerrado-frente", cur === 0);
    libroAg.classList.toggle("cerrado-atras", cur === n);
  },
  mitadClic(e, r, cur, n){
    const mid = cur === 0 ? r.left : cur === n ? r.right : r.left + r.width / 2;
    return e.clientX > mid ? 1 : -1;
  }
});
function abreAgenda(a){
  agActual = a;
  $("plVisorAgendaTit").textContent = "Interior " + a.nombre;
  visorAgEl.style.setProperty("--pag", ratioDe(a));
  visorAgenda.abre();
}

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
