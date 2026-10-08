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
  perso:   1000     /* recargo por portada personalizada (todas las agendas) */
};

/* bajada bajo los títulos del catálogo según la pestaña */
const VISTAS = {
  catalogo: { bajada: "Toca la cantidad que quieras y pídela directo por WhatsApp" },
  planners: { bajada: "Agendas y planners anillados, diseñados por nosotros. Toca la portada para ver su interior" }
};

/* ---------- AGENDAS ----------
   Cada agenda es un producto con el mismo modelo que la Atrévete: portada anillada
   (perforaciones rectangulares + alambre blanco) y visor de pliegos. Los diseños que
   vienen de la misma carpeta van juntos en un producto: el cliente elige la portada
   y cada portada trae su propio interior (interiorPorPortada).
   Imágenes en agendas/<id>/: portada-K.jpg, portada-K-mini.jpg, contratapa-K.jpg
   (si la portada trae retiro) y pagina-NN.jpg, o pagina-K-NN.jpg si el interior va por portada.
   - portadas: más de una = el cliente elige. color = contratapa lisa (sin retiro).
     Una portada puede traer sus propias "paginas" si su interior es distinto.
   - paginas: un título por imagen, en el orden de los archivos. par(t) = dos imágenes que
     forman un pliego (izquierda + derecha); par(t, n, m) = el pliego con las imágenes n (izq.) y m (der.); pg(n, t) = la imagen n (si el archivo va en otro orden).
     repetir = cuántas veces se muestra esa lista.
   - Orden de lectura igual que la Atrévete (lo arma paginasDe): el interior de la portada
     en blanco, los datos personales a la derecha con su reverso en blanco, y los pliegos
     siempre empezando a la izquierda (si hace falta se intercala una página en blanco).
   - Orden del interior (en "paginas"): datos y calendarios; luego planificación mensual, control de gastos
     y hábitos; después la planificación semanal o diaria; al final notas y hojas libres.
   - ratio: ancho/alto de la página (A5 ≈ .705).
   TODO: precios reales (null = "Consultar"), descripciones y cantidad de hojas. */
const A5 = "Tamaño A5 (14,8 × 21 cm) · anillado", A6 = "Tamaño A6 (10,5 × 14,8 cm) · anillado";
const D = "Datos personales", CAL = a => "Calendario " + a, NOTAS = "Notas", GASTOS = "Control de gastos";
const SEM = "Semana a la vista", DIA = "Planificación diaria", PSEM = "Planificación semanal", MENS = "Planificación mensual";
const par = (t, n, m) => ({ t, n, m, par: true }), pg = (n, t) => ({ t, n });
/* primera hoja que, como los datos personales, va a la derecha con el reverso en blanco */
const hoja1 = (n, t) => ({ t, n, blanco: true });
const citas = (desde, n) => Array.from({length: n}, (_, i) => pg(desde + i, "Cita " + (i + 1)));
/* tamaños: la tarjeta muestra el tamaño y el catálogo va de mayor a menor (tam: "B5" | "A5" | "A6"; por defecto A5) */
const TAMANOS = { B5: { cm: ["17,6", "25"], orden: 0 }, A5: { cm: ["14,8", "21"], orden: 1 }, A6: { cm: ["10,5", "14,8"], orden: 2 } };
const ATREVETE_PLIEGOS = ["Datos personales","Calendarios","Calendario 2028 y feriados","Planificación anual",
  "Metas y mi año en colores","Cumpleaños","Planificación mensual","Control de gastos y ahorro",
  "Notas","Semana a la vista","Semana a la vista","Mis lecturas","Lista de deseos","Notas"];
const portadasN = n => Array.from({length: n}, (_, i) => ({ nom: "N° " + (i + 1), retiro: true }));
const DOCENTE = [D, CAL(2026), CAL(2027), "Horario", "Evaluaciones", "Registro de asistencia", "Reunión de apoderados",
  "Citación de apoderados", par(MENS), par(PSEM)];
const AGENDAS = [
  /* Atrévete: sus imágenes ya son pliegos completos (incluidas las páginas en blanco) */
  { id: "atrevete", nombre: "Agenda Atrévete 2027", precio: 24990, tam: "B5", ratio: .6416, pliegos: true,
    desc: "Agenda mes a mes con calendario, metas, control de gastos, ahorro y semana a la vista.",
    formato: "Tamaño B5 de 17,6 × 25 cm, 100 hojas (200 páginas) anilladas",
    portadas: [{ nom: "Burdeo", color: "#7d1f3a" }, { nom: "Lila", color: "#e4c3e8" }],
    paginas: ATREVETE_PLIEGOS.flatMap(t => [t, t]) },
  { id: "mi-planner", nombre: "Mi Planner", precio: null, interiorPorPortada: true, formato: A5,
    desc: "Planner con datos personales, calendario, semana a la vista y hábitos. Elige entre 3 diseños.",
    portadas: [1, 2, 3].map(n => ({ nom: "Diseño " + n, retiro: true })),
    paginas: [D, CAL(2026), par(MENS, 5), pg(7, "Mis hábitos"), par(SEM, 3), pg(8, NOTAS)] },
  { id: "brilla", nombre: "Planner Brilla", precio: null, interiorPorPortada: true, formato: A5,
    desc: "Planner con calendarios 2026-2027, planificación mensual, gastos, hábitos y semana a la vista. Elige entre 2 portadas.",
    portadas: [{ nom: "Levántate & Brilla", retiro: true }, { nom: "Brilla como si todo el Universo fuera tuyo", retiro: true }],
    paginas: [D, CAL(2026), CAL(2027), par(MENS, 6), pg(9, GASTOS), pg(8, "Mis hábitos"), par(PSEM, 4), pg(10, NOTAS)] },
  /* Planner Docente: dos modelos distintos (Héroes, y Morado/Rosado con el mismo interior) */
  { id: "docente-heroes", nombre: "Planner Docente · Héroes", precio: null, formato: A5,
    desc: "Planner para profes: horario, evaluaciones y planificación semanal.",
    portadas: [{ nom: "Héroes", retiro: true }], paginas: [D, "Horario", "Evaluaciones", par(PSEM)] },
  { id: "docente", nombre: "Planner Docente", precio: null, interiorPorPortada: true, formato: A5,
    desc: "Planner para profes con calendarios 2026-2027, horario, evaluaciones y apoderados. Elige entre 2 diseños.",
    portadas: [{ nom: "Enseñar es Inspirar", retiro: true }, { nom: "Gran Corazón", retiro: true }],
    paginas: DOCENTE },
  { id: "universitario", nombre: "Planner Universitario", precio: null, desc: "Planner para la U con calendario 2027. Elige entre 6 portadas.", formato: A5,
    portadas: [1, 2, 3, 4, 5, 6].map(n => ({ nom: "N° " + n, retiro: n !== 5 })),   /* la 5 no trae contratapa */
    paginas: [D, CAL(2027), "Calendarios", "Calendarios", "Fechas importantes", "Horario", "Información académica",
      "Semana de pruebas", DIA, PSEM] },
  { id: "diario", nombre: "Planner Diario", precio: null, interiorPorPortada: true, formato: A5,
    desc: "Un día por página para planificar con calma, con cumpleaños, hábitos y mes a mes. Elige entre 3 diseños.",
    portadas: [1, 2, 3].map(n => ({ nom: "Diseño " + n, retiro: true })),
    paginas: [D, pg(3, "Cumpleaños importantes"), "Cumpleaños importantes", "Cumpleaños importantes", pg(7, "Números de teléfono"),
      par(MENS, 8), pg(6, "Hábitos"), pg(2, DIA)] },
  { id: "diario-arriba", nombre: "Planner Diario · Anillado arriba", precio: null, lomo: "arriba", interiorPorPortada: true, formato: A5,
    desc: "Un día por página, con el anillado arriba. Elige entre 5 diseños.",
    portadas: [1, 2, 3, 4, 5].map(n => ({ nom: "Diseño " + n, retiro: true })), paginas: [DIA], repetir: 4 },
  { id: "semanal-diario", nombre: "Planner Semanal Diario", precio: null, interiorPorPortada: true, formato: A5,
    desc: "Planificación semanal y diaria con calendario. Elige entre 2 diseños.",
    portadas: [
      { nom: "Potencial", retiro: true, paginas: [D, CAL(2026), par(MENS, 6), pg(8, GASTOS), pg(3, PSEM), par(DIA, 4)] },
      { nom: "Buen Día", retiro: true, paginas: [D, CAL(2026), CAL(2027), par(MENS, 7), pg(9, GASTOS), pg(4, PSEM), par(DIA, 5)] }] },
  { id: "suena", nombre: "Planner Sueña en Grande", precio: null, interiorPorPortada: true, formato: A5,
    desc: "Planner tipo cuaderno con calendario y planificación mensual. Elige entre 2 diseños.",
    portadas: [
      { nom: "Azul", retiro: true, paginas: [D, CAL(2026), par(MENS, 4), pg(3, NOTAS)] },
      { nom: "Atardecer", retiro: true, paginas: [D, CAL(2026), CAL(2027), par(MENS, 5), pg(4, NOTAS)] }] },
  { id: "gratitud", nombre: "Diario de Gratitud", precio: null, desc: "Diario para agradecer cada día. Elige entre 2 portadas.", formato: A5,
    portadas: [{ nom: "Noche", retiro: true }, { nom: "Rosa", retiro: true }],
    paginas: [D, CAL(2026), "Querido Universo", "Mapa de sueños", "Un momento para mí"] },
  /* Mini Planner Diario: la imagen 2 son los datos personales y la 1 el día */
  { id: "mini-diario", nombre: "Mini Planner Diario", precio: null, tam: "A6", ratio: .709, desc: "Planner diario de bolsillo. Elige entre 5 portadas.", formato: A6,
    portadas: portadasN(5), paginas: [pg(2, D), pg(1, DIA), pg(1, DIA), pg(1, DIA)] },
  { id: "mini-lineas", nombre: "Mini Agenda Líneas", precio: null, tam: "A6", ratio: .709, desc: "Agenda de bolsillo con hojas de líneas. Elige entre 4 portadas.", formato: A6,
    portadas: portadasN(4), paginas: ["Hojas de líneas"], repetir: 4 },
  { id: "gastos", nombre: "Planner Control de Gastos", precio: null, formato: A5,
    desc: "“Planificarme es mi superpoder”: ingresos, gastos fijos, gastos hormiga, ahorros y balance del mes. Elige entre 2 portadas.",
    portadas: [{ nom: "Turquesa", retiro: true }, { nom: "Coral", retiro: true }],
    paginas: [D, CAL(2025), CAL(2026), "Mi mes", "Ingresos y gastos fijos", par("Gastos hormiga"), "Mis ahorros",
      "Balance mensual", "Notas y observaciones"] },
  /* ---- 100 Citas: álbum de citas con reglas al inicio (el modelo con nombres de una pareja queda fuera) ---- */
  { id: "citas-juntos", nombre: "100 Citas Juntos", precio: null, formato: A5,
    desc: "Álbum de 100 citas para vivir en pareja: reglas, una página por cita con fotos, lugar, fecha y cómo se sintieron. Elige entre 3 portadas.",
    portadas: [{ nom: "Celeste", retiro: true }, { nom: "Lila", retiro: true }, { nom: "Gatitos", retiro: true }],
    paginas: ["Reglas", pg(2, ""), ...citas(3, 8), pg(11, "¡Felicidades!")] },
  { id: "citas-amigas", nombre: "100 Citas con Amigas", precio: null, formato: A5,
    desc: "Álbum de citas para vivir con tus amigas: reglas, una página por cita con fotos y recuerdos. Elige entre 2 portadas.",
    portadas: [{ nom: "Amigas", retiro: true }, { nom: "Amigas con flores", retiro: true }],
    paginas: ["Reglas", pg(2, ""), ...citas(3, 8), pg(11, "¡Felicidades!")] },
  /* Mamá: la imagen 1 es el interior de la portada; la 4 es una hoja en blanco decorada */
  { id: "citas-mama", nombre: "100 Citas con Mamá", precio: null, formato: A5, tapaInterior: 1,
    desc: "Álbum de 100 citas para compartir con mamá: carta, compromiso y una página por cita con foto.",
    portadas: [{ nom: "Flores", retiro: true }],
    paginas: [pg(2, "Carta para mamá"), pg(4, ""), pg(3, "Nuestro compromiso"), pg(4, ""), ...citas(5, 8)] },
  /* ---- control veterinario: 3 gatos y un perro y gato, cada uno con su interior ---- */
  { id: "control-vet", nombre: "Carnet de Control Veterinario", precio: null, ratio: .66, interiorPorPortada: true, formato: A5,
    desc: "Agenda de control para tu gato o perro: datos, vacunas, desparasitación, controles y aseo. Elige entre 4 portadas.",
    portadas: [
      { nom: "Gato negro", color: "#ef5b4c", paginas: [hoja1(1, "Datos de la mascota"), "Registro de vacunación", "Registro de desparasitación", "Observaciones", "Otros controles", "Aseo de la mascota"] },
      { nom: "Gato patita", color: "#35c2d8", paginas: [hoja1(1, "Datos de la mascota"), "Registro de vacunación", "Observaciones", "Otros controles", "Aseo de la mascota"] },
      { nom: "Gato verde", color: "#8fd171" },
      { nom: "Perro y gato", color: "#9b86e0" }],
    /* gato verde y perro y gato: cada sección es un pliego, su portadilla a la izquierda y el registro a la derecha */
    paginas: ["Datos de la mascota", par("Vacunación"), par("Desparasitación"), par("Observaciones"), par("Otros controles"),
      par("Aseo de la mascota")] },
  { id: "recetas", nombre: "Agenda Mis Recetas", precio: null, interiorPorPortada: true, formato: A5,
    desc: "Recetario para guardar tus recetas favoritas: ingredientes, tiempo, porciones y preparación. Elige entre 4 portadas.",
    portadas: [{ nom: "Girasoles", retiro: true }, { nom: "Mármol azul", retiro: true }, { nom: "Rosa", retiro: true },
      { nom: "Favoritas", retiro: true }],
    paginas: [hoja1(1, "Este libro pertenece a"), "Receta", "Preparación", pg(2, "Receta"), pg(3, "Preparación"), pg(2, "Receta"), pg(3, "Preparación")] },
  /* ---- anillado arriba ---- */
  /* Mini Planner Semanal: 5 portadas y 3 juegos de hojas (1 celeste y rosa, 2 lila, 3 rosa).
     TODO: confirmar qué juego de hojas va con cada portada (interior = número de juego) */
  { id: "mini-semanal", nombre: "Mini Planner Semanal", precio: null, tam: "A6", lomo: "arriba", ratio: 1.41, interiorPorPortada: true,
    formato: "Tamaño A6 apaisado (14,8 × 10,5 cm) · anillado", desc: "Planner semanal de bolsillo con calendario y planificación mensual. Elige entre 5 portadas.",
    portadas: [{ nom: "Tú puedes", retiro: true, interior: 1 },
      { nom: "Sigue tus sueños", retiro: true, interior: 3 }, { nom: "Un día a la vez", retiro: true, interior: 2 },
      { nom: "Yo soy capaz", retiro: true, interior: 3 }, { nom: "Si puedes creerlo", retiro: true, interior: 2 }],
    paginas: [D, CAL(2024), CAL(2025), pg(9, MENS), pg(7, PSEM), PSEM, pg(6, "Hojas de puntos")] },
  { id: "mis-pedidos", nombre: "Agenda Mis Pedidos", precio: null, tam: "A6", lomo: "arriba", ratio: 1.41, interiorPorPortada: true,
    formato: "Tamaño A6 apaisado (14,8 × 10,5 cm) · anillado", desc: "Para emprendedoras: registra cada pedido con cliente, productos, pago y entrega. Elige entre 2 portadas.",
    portadas: [{ nom: "Rosado", retiro: true }, { nom: "Verde", retiro: true }],
    paginas: [D, CAL(2024), CAL(2025), "Registro de pedido", pg(4, "Registro de pedido"), pg(4, "Registro de pedido")] },
  { id: "mini-escritorio", nombre: "Mini Planner de Escritorio", precio: null, tam: "A6", lomo: "arriba", ratio: 1.41, interiorPorPortada: true,
    formato: "Tamaño A6 apaisado (14,8 × 10,5 cm) · anillado", desc: "“Pequeños planes, grandes logros”: pendientes del día y calendario. Elige entre 3 diseños.",
    portadas: [{ nom: "Celeste", color: "#cfe0f3" }, { nom: "Rosa y morado", color: "#f6cfe0" }, { nom: "Verde", color: "#d7ebc6" }],
    paginas: [D, CAL(2025), CAL(2026), "Pendientes de hoy", pg(4, "Pendientes de hoy"), pg(4, "Pendientes de hoy")] },
  /* Planner Semanal apaisado, anillado arriba: cada portada trae su propio interior
     (pagina-K-01 = tiro: planificación semanal, pagina-K-02 = retiro: hábitos) */
  { id: "semanal", nombre: "Planner Semanal", precio: PRECIOS.semanal, lomo: "arriba", ratio: 1.42, interiorPorPortada: true,
    desc: "Organiza tu semana a la vista. Elige entre 11 diseños: cada uno con su interior a juego.",
    formato: "Tamaño A5 apaisado (21 × 14,8 cm) · anillado",   /* TODO: cantidad de hojas real */
    portadas: portadasN(11), paginas: ["Planificación semanal", "Hábitos y objetivos"], repetir: 3 }
];
/* ruta de cada imagen de una agenda (k = portada elegida, para los interiores por portada) */
const agImg = {
  portada:    (a, k) => `agendas/${a.id}/portada-${k + 1}.jpg`,
  mini:       (a, k) => `agendas/${a.id}/portada-${k + 1}-mini.jpg`,
  contratapa: (a, k) => `agendas/${a.id}/contratapa-${k + 1}.jpg`,
  pagina:     (a, i, k) => `agendas/${a.id}/pagina-${a.interiorPorPortada ? (a.portadas[k].interior || k + 1) + "-" : ""}${String(i + 1).padStart(2, "0")}.jpg`
};
/* páginas en orden de lectura: [{src, t}]; src null = página en blanco.
   Con el lomo al costado se ordenan como la Atrévete: interior de la portada en blanco,
   datos personales a la derecha (reverso en blanco) y cada pliego desde la izquierda. */
const PAG_BLANCA = { src: null, t: "" };
const paginasDe = (a, k = 0) => {
  const lista = (a.portadas[k] && a.portadas[k].paginas) || a.paginas;
  let sig = 1;
  const unidades = lista.map(e => {
    const o = typeof e === "string" ? { t: e } : e, n = o.n || sig;
    const ns = o.par ? [n, o.m || n + 1] : [n];
    sig = Math.max(...ns) + 1;
    return ns.map(m => ({ src: agImg.pagina(a, m - 1, k), t: o.t, blanco: o.blanco }));
  });
  const todas = Array.from({length: a.repetir || 1}, () => unidades).flat();
  if (a.lomo === "arriba" || a.pliegos) return todas.flat();
  /* interior de la portada: en blanco, o la imagen tapaInterior si el diseño lo trae */
  const out = [a.tapaInterior ? { src: agImg.pagina(a, a.tapaInterior - 1, k), t: "" } : PAG_BLANCA];
  todas.forEach((u, i) => {
    if (u.length === 2 && out.length % 2 === 1) out.push(PAG_BLANCA);   /* el pliego empieza a la izquierda */
    out.push(...u);
    if (i === 0 && (u[0].t === D || u[0].blanco)) out.push(PAG_BLANCA); /* reverso de los datos en blanco */
  });
  return out;
};

/* productos "virtuales" para el carrito de la tienda */
const pCarro = a => ({id: "pl-" + a.id, n: a.nombre, e: "📒", vars: [{v: "", p: []}], dcto: 0});

/* ---------- utilidades ---------- */
const $ = id => document.getElementById(id);
const src = ruta => PL_IMG + ruta;
const menosMov = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const waHref = msg => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const FOCO = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]):not([hidden]),[tabindex]:not([tabindex="-1"])';


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

/* Con un visor abierto la página de fondo no se desplaza. Se bloquea en <html>
   (tienda.css le pone overflow-x, así que el overflow de <body> no alcanza) y se
   reserva el ancho de la barra para que el fondo no salte ni quede una franja clara. */
function bloqueaScroll(si){
  const de = document.documentElement;
  if (si){
    const barra = innerWidth - de.clientWidth;
    de.style.overflow = "hidden";
    if (barra > 0) de.style.paddingRight = barra + "px";
  } else {
    de.style.overflow = "";
    de.style.paddingRight = "";
  }
}

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
    bloqueaScroll(true);
    if (alAbrir) alAbrir();
  }
  function cierra(){
    if (!abierto()) return;
    el.classList.remove("abierto");
    bloqueaScroll(false);
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
function visor(el, {libro, arma, rotulo, alEstado, mitadClic, atras = 1}){
  const cuenta = el.querySelector(".pl-cuenta");
  const [ant, sig] = el.querySelectorAll(".pl-nav");
  let hojas = [], cur = 0, ocupado = false, giro = -1;

  function pinta(){
    const n = hojas.length;
    hojas.forEach((h, i) => {
      h.classList.toggle("vuelta", i < cur);
      if (!h.classList.contains("girando")) h.style.zIndex = i < cur ? i + 1 : n - i;
      /* solo se dibujan las hojas a la vista (y las vecinas de la que gira): las de
         debajo, del mismo tamaño, asomaban como una línea clara en el borde */
      const ve = (i >= cur - atras && i <= cur) || (giro >= 0 && Math.abs(i - giro) <= 1);
      h.style.visibility = ve ? "" : "hidden";
    });
    alEstado(cur, n, giro);
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
    giro = obj;
    cur += dir;
    pinta();
    setTimeout(() => { h.classList.remove("girando"); ocupado = false; giro = -1; pinta(); }, menosMov() ? 30 : 900);
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
/* tamaño de la agenda: "A5 · 14,8 × 21 cm" (en las apaisadas, el ancho va primero) */
const tamDe = a => {
  const t = TAMANOS[a.tam] ? a.tam : "A5", c = TAMANOS[t].cm, cm = ratioDe(a) > 1 ? [c[1], c[0]] : c;
  return { t, cm: cm.join(" × ") + " cm", orden: TAMANOS[t].orden };
};
const REGLA_SVG = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="8" width="19" height="8" rx="2"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></g></svg>';
const SUBIR_SVG = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></g></svg>';

function agMsg(a){
  const k = agSel.get(a.id) || 0, p = agPerso.get(a.id) || {};
  const tam = ` tamaño ${tamDe(a).t}`;
  if (p.activo) return a.precio
    ? `Hola Heart Graphic! 💜 Quiero pedir: ${a.nombre}${tam} con portada personalizada (te envío la imagen por aquí) — ${fmt(a.precio + PRECIOS.perso)}`
    : `Hola Heart Graphic! 💜 Quiero consultar por: ${a.nombre}${tam} con portada personalizada (+${fmt(PRECIOS.perso)}, te envío la imagen por aquí)`;
  const portada = a.portadas.length > 1 ? ` (portada ${a.portadas[k].nom})` : "";
  return a.precio
    ? `Hola Heart Graphic! 💜 Quiero pedir: ${a.nombre}${tam}${portada} — ${fmt(a.precio)}`
    : `Hola Heart Graphic! 💜 Quiero consultar por: ${a.nombre}${tam}${portada}`;
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
  /* forma de la portada: anillado al costado (por defecto) o arriba, vertical o apaisada */
  const forma = (a.lomo === "arriba" ? " lomo-arriba" : "") + (ratioDe(a) > 1 ? " apaisada" : "");
  const portadaBtn = `<button class="pl-agenda-btn${forma}" type="button" data-ag="${a.id}" aria-label="Ver el interior de ${nombre}">
        <span class="pl-cantos" aria-hidden="true"></span>
        <img class="pl-agenda-portada" src="${src(agImg.portada(a, 0))}" alt="Portada de ${nombre}" loading="lazy">
      </button>`;
  art.innerHTML = `
    <div class="pl-arte">
      ${varias ? `<div class="pl-portada-marco${forma}">
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
      <div class="pl-cab"><span class="badge">planner</span><span class="pl-tam" title="Tamaño ${tamDe(a).t}: ${tamDe(a).cm}">${REGLA_SVG}<b>${tamDe(a).t}</b><span>${tamDe(a).cm}</span></span></div>
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

/* todas las tarjetas del panel se arman desde AGENDAS y se numeran en orden */
/* de mayor a menor: B5, A5 y A6 (dentro de cada tamaño, el orden de AGENDAS) */
AGENDAS.slice().sort((x, y) => tamDe(x).orden - tamDe(y).orden).forEach(a => $("plPanel").append(tarjetaAgenda(a)));
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
    const P = agPags = paginasDe(a, k), m = P.length;
    const img = (p, alt) => p.src ? `<img src="${src(p.src)}" alt="${esc(alt || p.t)}" draggable="false" loading="lazy">` : "";   /* src null: página en blanco */
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
    return (izq && izq.t) || (der && der.t) || "";   /* las páginas en blanco no tienen título */
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
/* el visor que corresponde según dónde va el anillado */
function abreAgenda(a){
  agActual = a;
  if (a.lomo === "arriba"){
    $("plVisorBlocTit").textContent = "Interior " + a.nombre;
    visorBlocEl.style.setProperty("--pag", ratioDe(a));
    visorBlocEl.style.setProperty("--anillos", ratioDe(a) > 2 ? 30 : ratioDe(a) > 1 ? 20 : 13);   /* apaisado: más anillos a lo ancho */
    visorBloc.abre();
    return;
  }
  $("plVisorAgendaTit").textContent = "Interior " + a.nombre;
  visorAgEl.style.setProperty("--pag", ratioDe(a));
  visorAgenda.abre();
}

/* ---- visor de las agendas con anillado arriba: una hoja a la vez ----
   Se ve una sola página, a tamaño completo. Al avanzar, la hoja se levanta por
   arriba girando sobre el anillado y se desvanece, dejando ver la siguiente.
   Hojas: portada y cada página (tiro y retiro, por separado); debajo de todo
   queda la contratapa, que se ve al final. */
const visorBlocEl = $("plVisorBloc");
const bloc = $("plBloc");
const visorBloc = visor(visorBlocEl, {
  libro: bloc,
  arma(){
    const a = agActual, k = agSel.get(a.id) || 0, c = a.portadas[k];
    const per = agPerso.get(a.id) || {}, propia = per.activo && per.url;
    const P = agPags = paginasDe(a, k);
    const img = (s, alt, perezosa = true) => `<img src="${s}" alt="${esc(alt)}" draggable="false"${perezosa ? ' loading="lazy"' : ""}>`;
    const tapa = propia ? img(propia, "Tu portada personalizada", false) : img(src(agImg.portada(a, k)), "Portada", false);
    const contra = !propia && c.retiro ? img(src(agImg.contratapa(a, k)), "Contratapa") : "";
    bloc.innerHTML = `<span class="pl-bloc-cantos" aria-hidden="true"></span><div class="pl-base">${contra}</div>`;
    const hojas = [tapa, ...P.map(p => img(src(p.src), p.t))].map((html, i) => {
      const h = document.createElement("div");
      h.className = i ? "pl-bhoja" : "pl-bhoja pl-btapa";   /* la tapa va perforada; las hojas dejan el margen del anillado */
      h.innerHTML = `${html}<div class="pl-sombra"></div>`;
      bloc.appendChild(h);
      return h;
    });
    /* anillado arriba: perforaciones + alambre doble blanco, siempre encima */
    bloc.insertAdjacentHTML("beforeend", '<span class="pl-anillado-h" aria-hidden="true"></span>');
    return hojas;
  },
  rotulo(cur, n){
    if (cur === 0) return "Portada";
    if (cur === n) return "Contratapa";
    return (agPags[cur - 1] || {}).t || "";
  },
  atras: 0,   /* las hojas ya pasadas no se ven */
  /* la contratapa de fondo solo se dibuja cuando queda a la vista (misma razón que las hojas) */
  alEstado(cur, n, giro){
    const base = bloc.querySelector(".pl-base");
    if (base) base.style.visibility = cur === n || giro === n - 1 ? "" : "hidden";
  },
  /* toque en el tercio de arriba: volver; en el resto: avanzar */
  mitadClic: (e, r) => e.clientY > r.top + r.height * .3 ? 1 : -1
});

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

/* entrar directo con #planners en la URL */
if (location.hash === "#planners") irAPlanners();

})();
