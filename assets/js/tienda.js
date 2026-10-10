/* ================= CONFIGURACIÓN =================
   WHATSAPP : número para pedidos (sin +)
   SHEET_ID : ID de la planilla Google publicada. Una sola hoja: "productos"
              (id, nombre, emoji, carrusel, descripcion, notas, material,
              imagen_principal, galeria, colores, cantidades, descuento, activo).
              Vacío = catálogo embebido aquí abajo.
              La columna "carrusel" (si/no) decide qué productos alimentan el
              carrusel de la "Seccion OFERTAS" de más arriba (hoy Cyber Day).
              La columna "descuento" (% entero, ej. 15) rebaja TODOS los tramos
              del producto: precio de lista tachado + precio nuevo + etiqueta -15%,
              redondeado a $10. Llega también al carrito y al mensaje de WhatsApp.
   IMG_BASE : prefijo para las fotos que NO son una URL completa. Si en la
              planilla escribes "https://..." se usa tal cual (caso normal);
              si escribes solo un nombre de archivo se le antepone esto.

   FOTOS    : si las subes a Cloudinary, pega en la planilla la URL tal como
              te la da Cloudinary (sin tocar). El sitio le agrega solo las
              transformaciones para pedirla liviana y del porte justo de cada
              lugar — ver el bloque "FOTOS LIVIANAS (CLOUDINARY)" más abajo.
   ================================================= */
const WHATSAPP = "56946910637";
const SHEET_ID = "1L20psMPcime5mykDnrCMMIJagioEIyQ6Q-_iwfvMKN8";
const IMG_BASE = "assets/productos/";

/* Cada cuánto se turnan solas las fotos genéricas (milisegundos).
   La transición entre una y otra dura .7s y está en el CSS (.capa img). */
const ROTA_TARJETA = 5000;   /* en las tarjetas del catálogo */
const ROTA_MODAL   = 3000;   /* dentro de la ficha ampliada  */

let CATALOGO = [{"id":1,"n":"Tazones Personalizados","e":"☕","carrusel":false,"d":"Tazón de 11 onzas personalizado con tu diseño favorito.","notas":"Valores por mayor no válidos para tazones de colores/especiales (valor único $4.000) · Colores: blanco, rojo, verde, celeste, rosado y amarillo (mango e interior de color) · Diseño gratis","mat":[],"img":"","fotos":[],"cols":[{"hex":"#ffffff","nom":"Blanco","img":""},{"hex":"#f23b3b","nom":"Rojo","img":""},{"hex":"#12b653","nom":"Verde","img":""},{"hex":"#25b6ee","nom":"Azul","img":""},{"hex":"#f9a8dd","nom":"Rosado","img":""},{"hex":"#ffd34d","nom":"Amarillo","img":""}],"vars":[{"v":"11 Onzas","p":[[1,4000],[5,18500],[20,50000],[30,60000]]}]},{"id":2,"n":"Stickers Troquelados","e":"🌟","carrusel":false,"d":"Stickers troquelados full color, máxima calidad de impresión.","notas":"Para forma personalizada se requiere previa cotización · Adhesivo 135gr, full impresión · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Adhesivo","detalle":["135 gramos","Full impresión"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"3x3 cm","p":[[100,4000],[500,13000],[1000,22500],[2000,37500]]},{"v":"4x4 cm","p":[[100,5500],[500,19950],[1000,35700],[2000,42000]]},{"v":"5x5 cm","p":[[100,7000],[500,25000],[1000,38000],[2000,48000]]},{"v":"6x6 cm","p":[[100,9500],[500,27500],[1000,42000],[2000,55900]]}]},{"id":3,"n":"Volantes / Flyers","e":"📄","carrusel":false,"d":"Flyers en papel fotográfico full color para tu negocio.","notas":"Gramaje del papel: 135gr · Full impresiones, máxima calidad · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Papel fotográfico","detalle":["135 gramos","Máxima calidad"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Fotográfico 10x14,5","p":[[500,24000],[1000,36000],[2000,60000],[4000,110000],[8000,155000]]},{"v":"Fotográfico 20x14,5","p":[[500,27000],[1000,40000],[2000,57000],[4000,120000],[8000,162000]]},{"v":"Mini Flyer 10x7,25","p":[[500,18000],[1000,27000],[2000,38000],[4000,63000],[8000,110000]]}]},{"id":4,"n":"Tarjetas de Presentación","e":"💳","carrusel":false,"d":"Tarjetas de 9x5,5 cm en opalina lisa full color.","notas":"Gramaje del papel: 250gr · Opalina lisa, full color · Tamaño 9x5,5 cm · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Opalina lisa","detalle":["250 gramos","Full color"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"1 Cara","p":[[100,8000],[200,14000],[500,25000],[1000,35000],[2000,55000]]},{"v":"2 Caras","p":[[100,16000],[200,20000],[500,30000],[1000,48000],[2000,68000]]}]},{"id":5,"n":"Magnético / Imán para el Refri","e":"🧲","carrusel":false,"d":"Imanes publicitarios para que nunca te olviden.","notas":"Grosor del imán: 0,4 · Adhesivo fotográfico full color · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Adhesivo fotográfico","detalle":["Imán de 0,4 mm","Full color"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Simple 5x5,5 cm","p":[[100,13000],[300,25000],[500,40000],[1000,63000],[2000,110000]]},{"v":"Grande 10x5,5 cm","p":[[100,21000],[300,45000],[500,65000],[1000,110000],[2000,185000]]}]},{"id":6,"n":"Talonario / Recetario","e":"📋","carrusel":true,"d":"Talonarios de 100 hojas, papel bond encolado full color.","notas":"100 hojas por talonario · Papel bond encolado, impresión alta calidad · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Papel bond encolado","detalle":["100 hojas","Alta calidad"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Media Carta 14x21,6","p":[[2,10000],[5,22000],[10,35000],[20,52000],[50,97000]]},{"v":"Carta 21,6x27,9","p":[[1,10000],[2,18000],[5,30000],[10,50000],[20,85000]]}]},{"id":7,"n":"Carnet de Vacunación","e":"🐾","carrusel":true,"d":"Carnets de vacunas para veterinarias y mascotas regalonas.","notas":"La medida indicada corresponde al carnet abierto · Papel 250gr, opalina lisa full color · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Opalina lisa","detalle":["250 gramos","Full color"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Mini Carnet 20x14,5","p":[[50,16000],[100,26000],[200,42000],[300,51000]]},{"v":"Maxi Carnet 21x27","p":[[50,18500],[100,35000],[200,60000],[300,80000]]}]},{"id":8,"n":"Bolsas de Papel Personalizadas","e":"🛍️","carrusel":false,"d":"Bolsas de papel kraft blanca personalizadas full color.","notas":"Bolsa kraft blanca personalizada full color · Con manilla · Biodegradables · Solo color blanco disponible","mat":[{"icono":"","emoji":"","titulo":"Kraft blanca","detalle":["Biodegradable","Con manilla"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Talla S 22x30","p":[[30,15100],[50,24500],[100,47500],[200,76000]]},{"v":"Talla M 30x32","p":[[30,18100],[50,29500],[100,55000],[200,98000]]},{"v":"Talla L 30x41","p":[[30,21100],[50,34000],[100,65000],[200,114000]]},{"v":"Talla XL 38x48","p":[[30,26850],[50,42000],[100,80000],[200,140000]]}]},{"id":9,"n":"Cierre de Bolsas","e":"🎀","carrusel":false,"d":"Stickers de cierre con QR personalizado para tus pedidos.","notas":"Puede incluir QR personalizado (redes sociales, contactos, agradecimiento) · Adhesivo brillante troquelado · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Adhesivo brillante","detalle":["Troquelado"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"3,5 x 10 cm","p":[[100,10000],[300,19000]]},{"v":"5 x 10 cm","p":[[100,14000],[300,25000]]}]},{"id":10,"n":"Tarjetas Cliente Frecuente","e":"💖","carrusel":false,"d":"Tarjetas de fidelización con sus stickers para timbrar.","notas":"Tarjetas de 9x5,5 cm y stickers de 1,5 cm de diámetro · Diseño gratis","mat":[],"img":"","fotos":[],"cols":[],"vars":[{"v":"Tarjeta + Stickers","p":[[100,19500],[300,28000]]}]},{"id":11,"n":"Sticker de Envío","e":"📦","carrusel":false,"d":"Stickers con datos de envío para tus paquetos.","notas":"Papel adhesivo glossy 135gr · Full color · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Adhesivo glossy","detalle":["135 gramos","Full color"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"10 x 8 cm","p":[[100,13000],[300,25000]]}]},{"id":12,"n":"Chapitas Personalizadas","e":"😺","carrusel":false,"d":"Chapitas metálicas con el diseño que quieras.","notas":"Diseño gratis al solicitar nuestro servicio","mat":[{"icono":"","emoji":"","titulo":"Metálica","detalle":["Full color"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Unidades","p":[[10,5000],[20,8600],[30,11100],[50,15000],[100,26000]]}]},{"id":13,"n":"Credenciales PVC","e":"🪪","carrusel":true,"d":"Credenciales de PVC para tu equipo o institución.","notas":"Plástico PVC · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Plástico PVC","detalle":[]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Unidades","p":[[1,3000],[10,25000],[20,40000],[30,53000]]}]},{"id":14,"n":"Cédula de Identidad para Mascotas","e":"🐱","carrusel":true,"d":"La cédula chilena de tu mascota, igualita a la real.","notas":"Plástico PVC · Diseño ambos lados","mat":[{"icono":"","emoji":"","titulo":"Plástico PVC","detalle":["Diseño ambos lados"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Unidades","p":[[1,3000],[2,5000]]}]},{"id":15,"n":"Placa para Mascotas","e":"🦴","carrusel":true,"d":"Placas rígidas con forma y nombre para tu mascota.","notas":"Plástico PVC rígido · Diseño ambos lados","mat":[{"icono":"","emoji":"","titulo":"PVC rígido","detalle":["Diseño ambos lados"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Unidades","p":[[1,3000],[2,5000]]}]},{"id":16,"n":"Etiquetas de Ropa","e":"👕","carrusel":false,"d":"Cinta espiga sublimada con tu marca para tus prendas.","notas":"Cinta espiga blanca sublimada · Full color personalizada · Diseño gratis","mat":[{"icono":"","emoji":"","titulo":"Cinta espiga blanca","detalle":["Sublimada","Full color"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Espiga 1,5 cm","p":[[30,3500],[50,5000],[100,8000],[300,18000],[500,23500]]},{"v":"Espiga 2 cm","p":[[30,4500],[50,6000],[100,9500],[300,20400],[500,25000]]},{"v":"Espiga 2,5 cm","p":[[30,5500],[50,7000],[100,11500],[300,22500],[500,27500]]}]},{"id":17,"n":"Cuadro Spotify","e":"🎵","carrusel":false,"d":"Tu canción favorita estampada directo al vidrio.","notas":"Precio único · Estampado directo al vidrio · Stock rotativo","mat":[{"icono":"","emoji":"","titulo":"Vidrio","detalle":["Estampado directo"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"16 x 11 cm","p":[[1,12000]]}]},{"id":18,"n":"Morral","e":"🎒","carrusel":false,"d":"Morral blanco con cordones ajustables para estampar.","notas":"Solo color blanco · Talla estándar · Cordones ajustables · 100% poliéster","mat":[{"icono":"","emoji":"","titulo":"100% poliéster","detalle":["Talla estándar","Cordones ajustables"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"Unidad","p":[[1,1800]]}]},{"id":19,"n":"Mousepad","e":"🖱️","carrusel":false,"d":"Mousepad de 21x17 cm con tu diseño motivacional.","notas":"Sobre las 10 unidades: $2.500 c/u · Diseño gratis","mat":[],"img":"","fotos":[],"cols":[],"vars":[{"v":"21 x 17 cm","p":[[1,3000],[10,25000]]}]},{"id":20,"n":"Llavero Spotify","e":"🔑","carrusel":false,"d":"Llavero con código Spotify escaneable, fondo personalizado.","notas":"Fondo personalizado · Diseño ambos lados","mat":[],"img":"","fotos":[],"cols":[],"vars":[{"v":"Unidades","p":[[1,3000],[2,5000],[3,6000]]}]},{"id":21,"n":"Mini Tarjeta QR","e":"📱","carrusel":false,"d":"Mini tarjetas 5x7 con tu QR: ¡Escanéame!","notas":"Precio único · Opalina lisa · Gramaje 250gr","mat":[{"icono":"","emoji":"","titulo":"Opalina lisa","detalle":["250 gramos"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"5 x 7 cm","p":[[100,5500]]}]},{"id":22,"n":"Poleras","e":"✨","carrusel":false,"d":"Poleras blancas 100% poliéster con tu estampado.","notas":"100% poliéster · Poleras solo color blanco","mat":[{"icono":"","emoji":"","titulo":"100% poliéster","detalle":["Solo color blanco"]}],"img":"","fotos":[],"cols":[],"vars":[{"v":"S - M - L","p":[[1,8000]]},{"v":"XL - 2XL","p":[[1,9000]]}]}];

document.getElementById("waNav").href =
document.getElementById("waHero").href =
document.getElementById("waContacto").href = `https://wa.me/${WHATSAPP}`;

const fmt = n => "$" + Number(n).toLocaleString("es-CL");

/* Rutas de imagen: nombre suelto -> assets/productos/  ·  http... -> tal cual */
const resolveImg = v => {
  const s = String(v || "").trim();
  if (!s) return "";
  if (/^(https?:|data:|\.{0,2}\/|assets\/)/i.test(s)) return s;
  return IMG_BASE + s.split("/").map(encodeURIComponent).join("/");
};

/* ============ FOTOS LIVIANAS (CLOUDINARY) ============
   Cloudinary transforma por URL: entre /upload/ y el archivo se insertan
   parámetros y su CDN devuelve —y deja cacheada— esa versión ya optimizada.
     f_auto  → entrega WebP/AVIF según el navegador (el ahorro más grande)
     q_auto  → calidad automática según el contenido de la foto
     w_###   → ancho máximo en píxeles
     c_limit → solo achica: nunca agranda ni recorta la foto original
   Así puedes pegar en la planilla la URL cruda que te da Cloudinary y el sitio
   pide sola la versión chica. Una URL que NO sea de Cloudinary (foto local,
   base64, otro hosting) o que ya venga con transformaciones propias se
   devuelve intacta, sin tocar nada. */
const CLD = /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i;
/* Prefijos de parámetro de Cloudinary. Sirven para reconocer una URL que ya
   trae transformaciones y respetarla (un nombre como "carnet_vet.png" o una
   carpeta "productos_heart" no se confunde: no están en esta lista). */
const CLD_PARAM = /^(a|ar|b|bo|c|co|d|dl|dn|dpr|e|f|fl|fn|g|h|if|l|o|pg|q|r|t|u|vc|w|x|y|z)_/;
const cldYaTransf = seg => !seg.includes(".") && seg.split(",").every(t => CLD_PARAM.test(t));

const cld = (url, ancho) => {
  const m = CLD.exec(String(url || ""));
  if (!m || cldYaTransf(m[2].split("/")[0])) return url;
  return `${m[1]}f_auto,q_auto,c_limit,w_${ancho}/${m[2]}`;
};
/* La misma foto en varios anchos: el navegador elige según el tamaño real en
   pantalla y la densidad (retina). Vacío si la URL no es transformable. */
const cldSet = (url, anchos) =>
  cld(url, anchos[0]) === url ? "" : anchos.map(w => `${cld(url, w)} ${w}w`).join(", ");
/* Atributos listos para pegar dentro de un <img>. */
const cldAttrs = (url, anchos, sizes) => {
  const set = cldSet(url, anchos);
  return set ? ` srcset="${set}" sizes="${sizes}"` : "";
};

/* Anchos por lugar de la página (ver el CSS de cada uno):
   tarjeta .prod .arte img → hasta 430px · carrusel .pv-item img → hasta 225px */
const ANCHOS_TARJETA = [300, 460, 700, 900], SIZES_TARJETA = "(max-width:760px) 330px, 430px";
const ANCHOS_VET = [200, 320, 460, 640], SIZES_VET = "225px";
const ANCHO_MODAL = 1000;   /* .m-foto ocupa ~480px, x2 por retina */
const ANCHO_THUMB = 120;    /* .m-thumb mide 56px */
const ANCHO_LIGHTBOX = 1600;

/* Texto de un pedido: "Tazones (11 Onzas, 5 un., color Rojo)". La variante se
   omite cuando es la única y se llama "Unidad(es)", igual que antes. */
function descPedido(p, variante, unidades, color){
  const v = (p.vars.length > 1 || !/unidad/i.test(variante)) ? ` ${variante},` : "";
  const c = color ? `, color ${color}` : "";
  return `${p.n} (${v} ${unidades} un.${c})`;
}
/* ============ DESCUENTO ============
   p.dcto es el % por defecto del producto (columna 'descuento' de la planilla).
   Los tramos de 'cantidades' guardan SIEMPRE el precio de lista; el precio con
   descuento se calcula al mostrar/pedir, redondeado a los $10 más cercanos.
   Así un 0 en la planilla vuelve todo a la normalidad sin tocar los precios. */
const tieneDcto = p => Number(p.dcto) > 0;
const precioFinal = (p, pr) => tieneDcto(p) ? Math.round(pr * (1 - p.dcto / 100) / 10) * 10 : pr;
const etqDcto = p => `-${String(p.dcto).replace(".", ",")}%`;
/* Precio para la tabla y el carrito: lista tachada + final + etiqueta -N% */
const htmlPrecio = (p, pr, veces = 1) => tieneDcto(p)
  ? `<s class="pv">${fmt(pr * veces)}</s><b class="pn">${fmt(precioFinal(p, pr) * veces)}</b><em class="pd">${etqDcto(p)}</em>`
  : fmt(pr * veces);
/* Precio en texto para los mensajes: "$3.400 (15% dcto, antes $4.000)" */
const txtPrecio = (p, pr, veces = 1) => tieneDcto(p)
  ? `${fmt(precioFinal(p, pr) * veces)} (${etqDcto(p).slice(1)} dcto, antes ${fmt(pr * veces)})`
  : fmt(pr * veces);

function msgPedido(p, variante, unidades, precio, color){
  return `Hola Heart Graphic! 💜 Quiero pedir: ${descPedido(p, variante, unidades, color)} — ${txtPrecio(p, precio)}`;
}
function waLink(p, variante, unidades, precio, color){
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msgPedido(p, variante, unidades, precio, color))}`;
}

/* ============ CARRITO ============
   Vive solo en memoria: al recargar la página se pierde, y está bien así.
   Cada línea guarda el producto + variante + tramo de cantidad + color, y un
   multiplicador "veces" por si piden 2 packs iguales. Al final todo sale
   agrupado en un solo mensaje de WhatsApp con el total. */
const CART = (() => {
  const items = [];   /* {key, p, variante, un, pr, color, veces} */
  const btn    = document.getElementById("carroBtn");
  const num    = document.getElementById("carroNum");
  const panel  = document.getElementById("carroPanel");
  const lista  = document.getElementById("carroLista");
  const totEl  = document.getElementById("carroTotal");
  const enviar = document.getElementById("carroEnviar");
  const enviarIg = document.getElementById("carroEnviarIg");
  const toast  = document.getElementById("carroToast");
  const toastTxt = document.getElementById("carroToastTxt");
  let toastT = null;

  /* x.pr es el precio de lista; el descuento del producto se aplica aquí */
  const finalDe = x => precioFinal(x.p, x.pr);
  const total = () => items.reduce((s, x) => s + finalDe(x) * x.veces, 0);
  const totalLista = () => items.reduce((s, x) => s + x.pr * x.veces, 0);
  const bultos = () => items.reduce((s, x) => s + x.veces, 0);

  function msgCarrito(){
    const lineas = items.map(it =>
      `• ${descPedido(it.p, it.variante, it.un, it.color)} — ${txtPrecio(it.p, it.pr)}` +
      (it.veces > 1 ? ` ×${it.veces} = ${fmt(finalDe(it) * it.veces)}` : ""));
    const ahorro = totalLista() - total();
    return `Hola Heart Graphic! 💜 Quiero pedir:\n${lineas.join("\n")}\n\nTotal: ${fmt(total())}` +
           (ahorro > 0 ? ` (ahorro ${fmt(ahorro)})` : "");
  }
  const waCarrito = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msgCarrito())}`;

  function avisa(txt, ms = 1600){
    toastTxt.textContent = txt;
    toast.classList.add("vis");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("vis"), ms);
  }

  function pinta(){
    num.textContent = bultos();
    btn.hidden = !items.length && !panel.classList.contains("abierto");
    lista.innerHTML = "";
    if (!items.length){
      lista.innerHTML = `<p class="carro-vacio">Tu carrito está vacío 💜<br>Agrégale productos con el botón <svg class="ic"><use href="#ic-cart-add"/></svg></p>`;
    }
    items.forEach((it, i) => {
      const sub = [
        (it.p.vars.length > 1 || !/unidad/i.test(it.variante)) ? it.variante : "",
        `${it.un} un.`,
        it.color ? `color ${it.color}` : ""
      ].filter(Boolean).join(" · ");
      const d = document.createElement("div");
      d.className = "carro-item";
      d.innerHTML = `<span class="emo">${it.p.e}</span>
        <div class="inf"><b>${it.p.n}</b><span>${sub}</span></div>
        <div class="veces"><button type="button" aria-label="Quitar uno">−</button><b>×${it.veces}</b><button type="button" aria-label="Agregar otro">+</button></div>
        <span class="pr${tieneDcto(it.p) ? " dc" : ""}">${htmlPrecio(it.p, it.pr, it.veces)}</span>`;
      const [menos, mas] = d.querySelectorAll(".veces button");
      menos.addEventListener("click", () => { if (--it.veces < 1) items.splice(i, 1); pinta(); });
      mas.addEventListener("click", () => { it.veces++; pinta(); });
      lista.appendChild(d);
    });
    totEl.textContent = fmt(total());
    enviar.href = waCarrito();
  }

  function add(p, variante, un, pr, color){
    const key = `${p.id}|${variante}|${un}|${color}`;
    const ya = items.find(x => x.key === key);
    if (ya) ya.veces++;
    else items.push({key, p, variante, un, pr, color, veces: 1});
    pinta();
    /* aviso: brinco del botón + toast breve */
    btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    avisa("Agregado al carrito");
  }

  const cierra = () => { panel.classList.remove("abierto"); pinta(); };
  btn.addEventListener("click", () => {
    panel.classList.toggle("abierto");
    pinta();
  });
  panel.querySelector(".carro-cerrar").addEventListener("click", cierra);
  document.getElementById("carroVaciar").addEventListener("click", () => { items.splice(0); pinta(); });
  enviar.addEventListener("click", e => { if (!items.length) e.preventDefault(); });

  /* Instagram no permite pre-llenar un DM por URL, así que copiamos el pedido
     al portapapeles y abrimos el chat para que solo tenga que pegarlo. */
  const copiaViejo = t => {
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch(_){}
    ta.remove();
  };
  const copia = t => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(t).catch(() => copiaViejo(t));
    copiaViejo(t);
  };
  function pedirIg(msg){
    copia(msg);
    avisa("Pedido copiado — pégalo en el chat 💬", 2800);
    open("https://ig.me/m/heartgraphic_", "_blank", "noopener");
  }
  enviarIg.addEventListener("click", () => { if (items.length) pedirIg(msgCarrito()); });
  addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("abierto")) cierra(); });

  pinta();
  return { add, pedirIg };
})();

const esClaro = hex => {
  const h = String(hex || "").replace("#","");
  if (h.length !== 6) return false;
  const [r,g,b] = [0,2,4].map(i => parseInt(h.substr(i,2),16));
  return (0.299*r + 0.587*g + 0.114*b) > 186;
};
const desde = p => Math.min(...p.vars.flatMap(v => v.p.map(x => x[1])));
const fotosDe = p => {
  const l = (p.fotos && p.fotos.length) ? p.fotos.slice() : (p.img ? [p.img] : []);
  if (p.img && !l.includes(p.img)) l.unshift(p.img);
  return l;
};
/* Todas las fotos: primero las genéricas (las que rotan solas) y después las
   propias de cada color, para que elegir un color sea solo saltar de índice. */
const fotosTodas = p => {
  const l = fotosDe(p);
  (p.cols || []).forEach(c => { if (c.img && !l.includes(c.img)) l.push(c.img); });
  return l;
};
/* índice de la foto de un color dentro de esa lista; -1 si ese color no tiene */
const idxColor = (p, lista, i) => {
  const c = (p.cols || [])[i];
  return c && c.img ? lista.indexOf(c.img) : -1;
};

function renderMarquee(){
  const base = `<span>✦ DISEÑO GRATIS</span><span><em>HEART</em> <i>GRAPHIC</i></span><span>♡ PERSONALIZA TODO</span><span>✦ FULL COLOR</span><span><em>ENVÍOS</em> A TODO CHILE</span>`;
  document.getElementById("marqueeTrack").innerHTML = base + base + base + base;
}

/* Ficha de material: ícono (SVG por URL) + título + líneas de detalle.
   Se configura en la columna "material" de la planilla. */
function htmlMateriales(mats){
  if (!mats || !mats.length) return "";
  return `<div class="materiales">` + mats.map(m => {
    const desc = m.detalle.join(" · ");
    return `<div class="mat">` +
      (m.icono ? `<span class="ico" data-svg="${resolveImg(m.icono)}"><img src="${resolveImg(m.icono)}" alt="" loading="lazy"></span>`
               : m.emoji ? `<span class="ico"><span>${m.emoji}</span></span>` : "") +
      (m.titulo ? `<b>${m.titulo}</b>` : "") +
      (desc ? `<i title="${desc}">${desc}</i>` : "") +
    `</div>`;
  }).join("") + `</div>`;
}

/* Un <svg> dentro de <img> no se puede recolorear por CSS, y una máscara CSS
   cross-origin se cae si el almacenamiento no manda cabeceras CORS (probado:
   el ícono desaparece). Así que traemos el archivo y lo inyectamos en línea
   para pintarlo con currentColor. Si el fetch no se puede (sin CORS, o abriendo
   el archivo con doble click en file://), se queda el <img> con sus colores
   originales: nunca desaparece. */
const SVG_CACHE = new Map();
function tintaIconos(raiz){
  /* abriendo el archivo con doble click no hay fetch posible y el navegador
     ensuciaría la consola con un error rojo por cada ícono */
  if (location.protocol === "file:") return;
  raiz.querySelectorAll(".ico[data-svg]").forEach(caja => {
    const url = caja.dataset.svg;
    if (!/\.svgz?($|[?#])/i.test(url)) return;          /* un PNG/JPG se deja tal cual */
    if (!SVG_CACHE.has(url))
      SVG_CACHE.set(url, fetch(url).then(r => r.ok ? r.text() : null).catch(() => null));
    SVG_CACHE.get(url).then(txt => {
      if (!txt || !/<svg[\s>]/i.test(txt) || !caja.isConnected) return;
      const doc = new DOMParser().parseFromString(txt, "image/svg+xml");
      const svg = doc.querySelector("svg");
      if (!svg || doc.querySelector("parsererror")) return;
      svg.removeAttribute("width"); svg.removeAttribute("height");
      svg.setAttribute("focusable", "false");
      svg.setAttribute("aria-hidden", "true");
      /* todo lo que tenga color pasa a currentColor; los "none" se respetan */
      svg.querySelectorAll("*").forEach(el => {
        ["fill", "stroke"].forEach(prop => {
          const v = el.getAttribute(prop);
          if (v && v.toLowerCase() !== "none") el.setAttribute(prop, "currentColor");
        });
        const st = el.getAttribute("style");
        if (st) el.setAttribute("style", st.replace(/(fill|stroke)\s*:\s*(?!none)[^;]+/gi, "$1:currentColor"));
      });
      caja.replaceChildren(svg);
    });
  });
}

/* ============ LISTADO DE PRODUCTOS ============ */
const rotadores = [];   /* apagadores de las tarjetas del render anterior */
function renderProductos(){
  const cont = document.getElementById("listaProductos");
  rotadores.splice(0).forEach(apaga => apaga());
  cont.innerHTML = "";
  const lista = CATALOGO;

  lista.forEach((p, idx) => {
    const fotos = fotosTodas(p);
    const nGen = fotosDe(p).length;          /* solo estas rotan solas */
    const art = fotos.length
      ? `<div class="capa">${fotos.map((f,i) => {
          const u = resolveImg(f);
          return `<img class="anim${i ? " oculta" : ""}" src="${cld(u, 700)}"${cldAttrs(u, ANCHOS_TARJETA, SIZES_TARJETA)} alt="${p.n}" loading="lazy"${i ? ' style="position:absolute;inset:0;margin:auto"' : ""}>`;
        }).join("")}</div>`
      : `<div class="pegatina anim"><span class="emoji">${p.e}</span></div>`;
    const sec = document.createElement("article");
    sec.className = "prod reveal";
    sec.innerHTML = `
      <div class="arte" data-par="${idx % 2 ? '-0.05' : '-0.08'}" role="button" tabindex="0" aria-label="Ver detalle de ${p.n}">
        ${nGen > 1 ? `<span class="cont-fotos">📷 ${nGen} fotos</span>` : ""}
        <span class="deco d1">${idx % 2 ? '♥' : '✦'}</span>
        ${art}
        <span class="deco d2">${idx % 2 ? '✧' : '♥'}</span>
        <button class="ver-mas" type="button">🔍 Ver fotos y detalle</button>
      </div>
      <div class="tarjeta">
        ${tieneDcto(p) ? `<span class="dcto-burbuja" aria-label="Descuento ${etqDcto(p).slice(1)}"><small>descuento</small><b>${etqDcto(p)}</b></span>` : ""}
        <span class="badge">producto ${String(idx+1).padStart(2,"0")}</span>
        <h3>${p.n}</h3>
        <p class="desc">${p.d}</p>
        <div class="variantes"></div>
        <div class="colores" hidden><span class="lab">Colores</span><div class="swatches"></div></div>
        <div class="tabla"></div>
        <p class="notas">${p.notas}</p>
        ${htmlMateriales(p.mat)}
        <div class="fila-pedir">
          <a class="pedir" target="_blank" title="Pedir por WhatsApp"><svg class="ic"><use href="#ic-wa"/></svg> <span class="lbl">WhatsApp</span></a>
          <button class="pedir pedir-ig" type="button" title="Pedir por Instagram" aria-label="Pedir por Instagram"><svg class="ic"><use href="#ic-ig"/></svg> <span class="lbl">Instagram</span></button>
          <button class="add-cart" type="button" title="Agregar al carrito" aria-label="Agregar al carrito"><svg class="ic"><use href="#ic-cart-add"/></svg></button>
        </div>
      </div>`;
    cont.appendChild(sec);

    const varCont = sec.querySelector(".variantes");
    const tabla = sec.querySelector(".tabla");
    const pedir = sec.querySelector(".pedir");
    let varIdx = 0, filaSel = 0, colorSel = -1;

    /* La tarjeta muestra la foto del color elegido; sin color elegido, las fotos
       genéricas se van turnando al pasar el mouse. */
    const capa = sec.querySelector(".arte .capa");
    const ims = capa ? [...capa.querySelectorAll("img")] : [];
    let fotoSel = 0, giro = null;   /* giro: temporizador de la rotación */
    function muestraFoto(i){
      if (!ims.length) return;
      fotoSel = Math.max(0, Math.min(i, ims.length - 1));
      ims.forEach((im, j) => im.classList.toggle("oculta", j !== fotoSel));
    }
    if (nGen > 1 && !reduceMotion){
      /* Solo giran las tarjetas que están en pantalla: 22 productos rotando a la
         vez gastarían batería sin que nadie los vea. El desfase por índice evita
         que dos tarjetas visibles cambien exactamente en el mismo instante. */
      const gira = () => { if (colorSel < 0) muestraFoto((fotoSel + 1) % nGen); };
      const arranca = () => {
        if (giro) return;
        const paso = () => { gira(); giro = setTimeout(paso, ROTA_TARJETA); };
        giro = setTimeout(paso, ROTA_TARJETA + (idx % 3) * 700);
      };
      const para = () => { clearTimeout(giro); giro = null; };
      const io = new IntersectionObserver(
        es => es.forEach(e => e.isIntersecting ? arranca() : para()), {threshold: .2});
      io.observe(sec);
      rotadores.push(() => { para(); io.disconnect(); });
    }

    const paleta = p.cols || [];
    if (paleta.length){
      const box = sec.querySelector(".colores");
      const sws = box.querySelector(".swatches");
      const lab = box.querySelector(".lab");
      box.hidden = false;
      const pintaColor = () => {
        [...sws.children].forEach((x, j) => { x.classList.toggle("on", j === colorSel); x.textContent = j === colorSel ? "✓" : ""; });
        lab.innerHTML = colorSel < 0 ? "Colores" : `Colores <b>· ${paleta[colorSel].nom}</b>`;
        muestraFoto(colorSel < 0 ? 0 : (idxColor(p, fotos, colorSel) >= 0 ? idxColor(p, fotos, colorSel) : 0));
      };
      paleta.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "sw" + (esClaro(c.hex) ? " claro" : "");
        b.style.background = c.hex;
        b.title = c.nom;
        b.type = "button";
        b.setAttribute("aria-label", "Color " + c.nom);
        b.addEventListener("click", () => {
          colorSel = (colorSel === i) ? -1 : i;   /* volver a tocarlo lo deselecciona */
          pintaColor();
          pintaTabla();
        });
        sws.appendChild(b);
      });
      pintaColor();
    }

    function pintaTabla(){
      const v = p.vars[varIdx];
      tabla.innerHTML = "";
      v.p.forEach(([un, pr], i) => {
        const f = document.createElement("div");
        f.className = "fila" + (i === filaSel ? " sel" : "");
        f.innerHTML = `<span class="chk">${i === filaSel ? "✓" : ""}</span><span class="un">${un} unidad${un==1?"":"es"}</span><span class="pr${tieneDcto(p) ? " dc" : ""}">${htmlPrecio(p, pr)}</span>`;
        f.addEventListener("click", () => { filaSel = i; pintaTabla(); });
        tabla.appendChild(f);
      });
      const [un, pr] = v.p[Math.min(filaSel, v.p.length-1)];
      pedir.href = waLink(p, v.v, un, pr, colorSel >= 0 ? paleta[colorSel].nom : "");
    }
    if (p.vars.length > 1){
      p.vars.forEach((v, i) => {
        const b = document.createElement("button");
        b.className = "var-btn" + (i === 0 ? " on" : "");
        b.type = "button";
        b.textContent = v.v;
        b.addEventListener("click", () => {
          varIdx = i; filaSel = 0;
          varCont.querySelectorAll(".var-btn").forEach(x => x.classList.remove("on"));
          b.classList.add("on"); pintaTabla();
        });
        varCont.appendChild(b);
      });
    } else {
      varCont.innerHTML = `<span class="var-btn on" style="cursor:default">${p.vars[0].v}</span>`;
    }
    pintaTabla();

    /* agrega al carrito lo que esté elegido en ese momento en la tarjeta */
    sec.querySelector(".add-cart").addEventListener("click", () => {
      const v = p.vars[varIdx];
      const [un, pr] = v.p[Math.min(filaSel, v.p.length - 1)];
      CART.add(p, v.v, un, pr, colorSel >= 0 ? paleta[colorSel].nom : "");
    });
    sec.querySelector(".pedir-ig").addEventListener("click", () => {
      const v = p.vars[varIdx];
      const [un, pr] = v.p[Math.min(filaSel, v.p.length - 1)];
      CART.pedirIg(msgPedido(p, v.v, un, pr, colorSel >= 0 ? paleta[colorSel].nom : ""));
    });

    const abre = () => abreModal(p, varIdx, filaSel);
    /* el botón vive dentro de .arte, que también abre la ficha: sin esto el
       modal se inicializaría dos veces por cada click */
    sec.querySelector(".ver-mas").addEventListener("click", e => { e.stopPropagation(); abre(); });
    sec.querySelector(".arte").addEventListener("click", abre);
    sec.querySelector(".arte").addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " "){ e.preventDefault(); abre(); }
    });
  });
  tintaIconos(cont);
  observaReveals();
  if (!reduceMotion) parallax();
}

/* ============ MODAL DE PRODUCTO ============ */
const MODAL = (() => {
  const raiz  = document.getElementById("modalProd");
  const velo  = raiz.querySelector(".velo");
  const card  = raiz.querySelector(".modal-card");
  const foto  = raiz.querySelector(".m-foto");
  const thumbs= raiz.querySelector(".m-thumbs");
  const avisoRot = raiz.querySelector(".m-rot");
  let rot = null, ims = [], k = 0, nGen = 0, ultimoFoco = null;

  const paraRot = () => { clearInterval(rot); rot = null; avisoRot.hidden = true; };
  const muestra = i => {
    ims.forEach((im, j) => im.classList.toggle("on", j === i));
    [...thumbs.children].forEach((t, j) => t.classList.toggle("on", j === i));
    k = i;
  };
  const arrancaRot = () => {
    paraRot();
    if (nGen < 2 || reduceMotion) return;
    if (k >= nGen) muestra(0);
    avisoRot.hidden = false;
    rot = setInterval(() => muestra((k + 1) % nGen), ROTA_MODAL);
  };

  function pintaFotos(fotos, emoji, genericas){
    foto.innerHTML = "";
    thumbs.innerHTML = "";
    ims = [];
    nGen = Math.max(0, Math.min(genericas ?? fotos.length, fotos.length));
    if (!fotos.length){
      foto.innerHTML = `<div class="emoji-big">${emoji}</div>`;
      avisoRot.hidden = true;
      foto.appendChild(avisoRot);
      return;
    }
    fotos.forEach((f, i) => {
      const u = resolveImg(f);
      const im = document.createElement("img");
      im.src = cld(u, ANCHO_MODAL); im.alt = ""; im.loading = i ? "lazy" : "eager";
      foto.appendChild(im); ims.push(im);
      const t = document.createElement("button");
      t.className = "m-thumb"; t.type = "button";
      t.setAttribute("aria-label", i < nGen ? `Foto ${i+1} de ${fotos.length}` : "Foto del color elegido");
      t.innerHTML = `<img src="${cld(u, ANCHO_THUMB)}" alt="" loading="lazy">`;
      t.addEventListener("click", () => { paraRot(); muestra(i); });
      thumbs.appendChild(t);
    });
    foto.appendChild(avisoRot);
    thumbs.hidden = fotos.length < 2;
    muestra(0);
    arrancaRot();
  }

  function cierra(){
    paraRot();
    raiz.classList.remove("vis");
    setTimeout(() => {
      raiz.classList.remove("abierto");
      document.body.style.overflow = "";
      if (ultimoFoco) ultimoFoco.focus();
    }, reduceMotion ? 0 : 260);
  }

  velo.addEventListener("click", cierra);
  raiz.querySelector(".m-cerrar").addEventListener("click", cierra);
  addEventListener("keydown", e => {
    if (!raiz.classList.contains("abierto")) return;
    if (e.key === "Escape") cierra();
    if (e.key === "Tab"){
      const f = [...card.querySelectorAll('button,a[href],[tabindex]:not([tabindex="-1"])')].filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const pri = f[0], ult = f[f.length-1];
      if (e.shiftKey && document.activeElement === pri){ e.preventDefault(); ult.focus(); }
      else if (!e.shiftKey && document.activeElement === ult){ e.preventDefault(); pri.focus(); }
    }
  });

  return { raiz, card, foto, thumbs, pintaFotos, paraRot, muestra, arrancaRot, cierra,
           get ims(){ return ims; },
           set foco(v){ ultimoFoco = v; } };
})();

function abreModal(p, varIdx0 = 0, filaSel0 = 0){
  const m = MODAL, raiz = m.raiz;
  const esVet = !!p.carrusel;
  m.card.classList.toggle("vet", esVet);
  m.foco = document.activeElement;

  const fotos = fotosTodas(p);
  const nGenericas = fotosDe(p).length;
  const paleta = p.cols || [];
  let varIdx = varIdx0, filaSel = filaSel0, colorSel = -1;   /* -1 = ningún color elegido */

  raiz.querySelector(".m-nombre").textContent = p.n;
  raiz.querySelector(".m-desc").textContent = p.d;
  raiz.querySelector(".m-materiales").innerHTML = htmlMateriales(p.mat);
  tintaIconos(raiz);
  raiz.querySelector(".m-notas").textContent = p.notas || "";
  raiz.querySelector(".m-notas").hidden = !p.notas;
  m.pintaFotos(fotos, p.e, nGenericas);

  /* colores */
  const cajaCol = raiz.querySelector(".m-colores");
  const sws = cajaCol.querySelector(".swatches");
  const labCol = cajaCol.querySelector(".lab");
  sws.innerHTML = "";
  cajaCol.hidden = !paleta.length;
  const pintaCol = () => {
    [...sws.children].forEach((x, j) => { x.classList.toggle("on", j === colorSel); x.textContent = j === colorSel ? "✓" : ""; });
    labCol.innerHTML = colorSel < 0
      ? (paleta.some(c => c.img) ? `Colores <b>· elige uno para ver su foto</b>` : `Colores <b>· elige uno</b>`)
      : `Colores <b>· ${paleta[colorSel].nom}</b>` +
        (paleta[colorSel].img ? "" : ` <b style="color:var(--ink-soft)">(sin foto aún)</b>`);
    if (colorSel < 0){ m.muestra(0); m.arrancaRot(); return; }
    const i = idxColor(p, fotos, colorSel);
    if (i >= 0){ m.paraRot(); m.muestra(i); }
    else m.arrancaRot();   /* ese color aún no tiene foto: seguimos mostrando las genéricas */
  };
  paleta.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "sw" + (esClaro(c.hex) ? " claro" : "");
    b.style.background = c.hex; b.title = c.nom; b.type = "button";
    b.setAttribute("aria-label", "Color " + c.nom);
    b.addEventListener("click", () => { colorSel = (colorSel === i) ? -1 : i; pintaCol(); pinta(); });
    sws.appendChild(b);
  });
  if (paleta.length) pintaCol();

  /* variantes + tabla */
  const varCont = raiz.querySelector(".m-variantes");
  const cajaVar = raiz.querySelector(".m-caja-var");
  const tabla = raiz.querySelector(".m-tabla");
  const precio = raiz.querySelector(".m-precio");
  const pedir = raiz.querySelector(".m-pedir");
  varCont.innerHTML = "";
  cajaVar.hidden = p.vars.length < 2;
  if (p.vars.length > 1){
    p.vars.forEach((v, i) => {
      const b = document.createElement("button");
      b.className = "var-btn" + (i === varIdx ? " on" : "");
      b.type = "button"; b.textContent = v.v;
      b.addEventListener("click", () => {
        varIdx = i; filaSel = 0;
        varCont.querySelectorAll(".var-btn").forEach(x => x.classList.remove("on"));
        b.classList.add("on"); pinta();
      });
      varCont.appendChild(b);
    });
  }

  function pinta(){
    const v = p.vars[varIdx];
    filaSel = Math.min(filaSel, v.p.length - 1);
    tabla.innerHTML = "";
    v.p.forEach(([un, pr], i) => {
      const f = document.createElement("div");
      f.className = "fila" + (i === filaSel ? " sel" : "");
      f.innerHTML = `<span class="chk">${i === filaSel ? "✓" : ""}</span><span class="un">${un} unidad${un==1?"":"es"}</span><span class="pr${tieneDcto(p) ? " dc" : ""}">${htmlPrecio(p, pr)}</span>`;
      f.addEventListener("click", () => { filaSel = i; pinta(); });
      tabla.appendChild(f);
    });
    const [un, pr] = v.p[filaSel];
    const pf = precioFinal(p, pr);
    const cu = Math.round(pf / un);
    precio.classList.toggle("dc", tieneDcto(p));
    /* con descuento el precio grande se reemplaza, en su mismo lugar, por la
       caja lista tachada + burbuja -N% / precio nuevo (misma que en las filas) */
    precio.innerHTML = `<small>${p.vars.length > 1 ? v.v + " · " : ""}${un} unidad${un==1?"":"es"}</small>` +
                       (tieneDcto(p) ? `<span class="pr dc">${htmlPrecio(p, pr)}</span>` : fmt(pr)) +
                       (un > 1 ? `<span class="unit"> · ${fmt(cu)} c/u</span>` : "");
    pedir.href = waLink(p, v.v, un, pr, colorSel >= 0 ? paleta[colorSel].nom : "");
  }
  pinta();

  /* onclick (no addEventListener): el botón es uno solo y abreModal corre en
     cada apertura; así el handler se reemplaza en vez de acumularse */
  raiz.querySelector(".m-add-cart").onclick = () => {
    const v = p.vars[varIdx];
    const [un, pr] = v.p[Math.min(filaSel, v.p.length - 1)];
    CART.add(p, v.v, un, pr, colorSel >= 0 ? paleta[colorSel].nom : "");
  };
  raiz.querySelector(".m-pedir-ig").onclick = () => {
    const v = p.vars[varIdx];
    const [un, pr] = v.p[Math.min(filaSel, v.p.length - 1)];
    CART.pedirIg(msgPedido(p, v.v, un, pr, colorSel >= 0 ? paleta[colorSel].nom : ""));
  };

  raiz.classList.add("abierto");
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => requestAnimationFrame(() => raiz.classList.add("vis")));
  setTimeout(() => raiz.querySelector(".m-cerrar").focus(), 60);
}

/* ============ PARALLAX: contenido más rápido que el fondo ============ */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function parallax(){
  const y = scrollY;
  document.querySelectorAll(".fondo,.fondo-lineas").forEach(el => {
    el.style.backgroundPosition = `0 ${-(y * el.dataset.speed)}px`;
  });
  document.querySelectorAll(".spark").forEach(el => {
    el.style.transform = `translate3d(0, ${-(y * el.dataset.speed)}px, 0)`;
  });
  document.querySelectorAll("[data-par]").forEach(el => {
    /* En móvil el arte va apilado sobre la tarjeta: desplazarlo le comería la
       burbuja de material. Además ahí el efecto casi no se nota. */
    if (innerWidth <= 760){ if (el.style.transform) el.style.transform = ""; return; }
    const r = el.getBoundingClientRect();
    const centro = r.top + r.height/2 - innerHeight/2;
    el.style.transform = `translate3d(0, ${centro * el.dataset.par}px, 0)`;
  });
}
let tick = false;
addEventListener("scroll", () => {
  if (reduceMotion || tick) return;
  requestAnimationFrame(() => { parallax(); tick = false; }); tick = true;
}, {passive:true});

/* chispitas flotantes con distinta velocidad (alternativa 1) */
(function sparks(){
  const chars = ["✦","✧","˖","♡","♥","⋆"];
  for (let i = 0; i < 14; i++){
    const s = document.createElement("span");
    s.className = "spark" + (i % 2 ? " l" : "");
    s.textContent = chars[i % chars.length];
    s.style.left = (4 + (i * 67) % 92) + "vw";
    s.style.top = (8 + (i * 53) % 84) + "vh";
    s.style.fontSize = (14 + (i * 7) % 18) + "px";
    s.dataset.speed = (0.25 + (i % 5) * 0.12).toFixed(2);
    document.body.appendChild(s);
  }
})();

function observaReveals(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("vis"); io.unobserve(e.target); }
  }), {threshold:.1});
  document.querySelectorAll(".reveal:not(.vis)").forEach(el => io.observe(el));
}




/* ============ Seccion OFERTAS ============
   Campaña activa: CYBER DAY (módulo CYBER, más abajo).
   Campaña guardada: ESPECIAL VETERINARIAS (módulo VET + HTML comentado).
   Las dos leen la columna "carrusel" (si/no) de la planilla para saber qué
   productos mostrar, y la columna "descuento" para el -N%. */

/* Mensaje del botón de WhatsApp de la sección. Veterinarias usaba:
   "Hola Heart Graphic! 🐾 Quiero cotizar recetarios y carnets para mi veterinaria" */
const OFERTA_WA = "Hola Heart Graphic! 💜 Quiero aprovechar las ofertas del Cyber Day";
/* Término del Cyber Day para el contador (hora de Chile). Vacío = sin contador.
   Cuando llega a cero el contador se oculta solo. */
const OFERTA_FIN = "2026-10-11T23:59:59-03:00";   /* ofertas extendidas: sábado 11 oct a las 11:59 de la noche */

/* ---------- Especial Veterinarias: carrusel vertical ----------
   El carrusel se arma con TODAS las fotos de los productos marcados con "si";
   las de productos con descuento llevan la etiqueta -N%. Si ningún producto
   marcado tiene fotos, se conservan los diseños que vienen escritos en el HTML.
   Escritorio: 2 columnas verticales en sentidos opuestos. Móvil: una sola fila
   horizontal con los diseños intercalados. En ambos casos el contenido se
   duplica para lograr el bucle infinito. Mientras la sección esté comentada
   en el HTML no hay #pvCols y este módulo no hace nada. */
const VET = (() => {
  const cols = document.getElementById("pvCols");
  if (!cols) return { pinta(){}, arma(){} };
  const up = cols.querySelector(".pv-col.up"), down = cols.querySelector(".pv-col.down");
  const media = matchMedia("(max-width:760px)");
  let itemsUp = [], itemsDown = [], intercalados = [], modo = null;

  /* diseños de arranque: los que ya vienen escritos en el HTML */
  const delHTML = () => [...cols.querySelectorAll(".pv-item")].map(n => ({
    url: n.querySelector("img").getAttribute("src"), alt: n.querySelector("img").alt, prod: null
  }));

  const nodo = it => {
    const d = document.createElement("div");
    d.className = "pv-item";
    /* en la columna se ve chiquito; la versión grande queda guardada en
       data-full para cuando se abra el lightbox */
    d.innerHTML = `<img src="${cld(it.url, 460)}"${cldAttrs(it.url, ANCHOS_VET, SIZES_VET)} alt="${it.alt || "Diseño"}" loading="lazy">`;
    d.dataset.full = cld(it.url, ANCHO_LIGHTBOX);
    if (it.prod) d.dataset.pid = it.prod.id;
    if (it.prod && tieneDcto(it.prod))
      d.insertAdjacentHTML("beforeend", `<span class="pv-dcto">${etqDcto(it.prod)}</span>`);
    return d;
  };
  const mitad = items => {
    const h = document.createElement("div"); h.className = "pv-half";
    items.forEach(n => h.appendChild(n.cloneNode(true)));
    return h;
  };
  const llena = (col, items) => {
    col.innerHTML = "";
    const h = mitad(items);
    col.appendChild(h); col.appendChild(h.cloneNode(true));
  };

  function reparte(items){
    /* con muy pocos diseños repetimos para que el bucle no se vea vacío */
    while (items.length && items.length < 6) items = items.concat(items);
    const mit = Math.ceil(items.length / 2);
    itemsUp = items.slice(0, mit).map(nodo);
    itemsDown = items.slice(mit).map(nodo);
    intercalados = [];
    for (let i = 0; i < Math.max(itemsUp.length, itemsDown.length); i++){
      if (itemsUp[i]) intercalados.push(itemsUp[i]);
      if (itemsDown[i]) intercalados.push(itemsDown[i]);
    }
    modo = null;
    arma();
  }

  function arma(){
    const nuevo = media.matches ? "movil" : "escritorio";
    if (nuevo === modo) return;
    modo = nuevo;
    if (nuevo === "movil"){ llena(up, intercalados); down.innerHTML = ""; }
    else { llena(up, itemsUp); llena(down, itemsDown); }
  }

  /* arma el carrusel con los productos marcados en la planilla */
  function pinta(){
    const items = [];
    CATALOGO.filter(p => p.carrusel).forEach(p =>
      fotosDe(p).forEach(f => items.push({url: resolveImg(f), alt: p.n, prod: p})));
    if (items.length) reparte(items);
    else console.warn("Carrusel veterinarias: ningún producto con carrusel=si tiene fotos en la planilla; se mantienen los diseños que trae la página.");
  }

  reparte(delHTML());
  (media.addEventListener ? media.addEventListener("change", arma) : addEventListener("resize", arma));

  const lb = document.getElementById("pvLightbox");
  cols.addEventListener("click", e => {
    const item = e.target.closest(".pv-item");
    if (!item) return;
    const p = CATALOGO.find(x => String(x.id) === item.dataset.pid);
    if (p){ abreModal(p); return; }          /* si sabemos de qué producto es, abrimos su ficha */
    lb.querySelector("img").src = item.dataset.full || item.querySelector("img").src;
    lb.classList.add("open");
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));
  document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });

  return { pinta, arma };
})();

/* ---------- Cyber Day: oferta estrella + contador ----------
   Tarjeta grande que va rotando por los productos con carrusel=si (una foto
   por producto, cada ROTA_OFERTA ms); los puntos permiten elegir y un clic en
   la tarjeta abre la ficha del producto. La burbuja muestra su descuento y
   alterna celeste/morado. La cinta de arriba dice "hasta -N%" con el mayor
   descuento de los productos marcados. */
const ROTA_OFERTA = 3200;

/* ---------- ¿Qué entrada se muestra arriba de la página? ----------
   "cyber"  → sección Cyber Day (ofertas relámpago con contador).
   "salud"  → entrada "Tu consulta merece una buena impresión" (módulo SALUD).
   El cambio es MANUAL: se edita esta línea y se publica. Para mirar la entrada
   salud sin cambiar nada, abre la página con ?entrada=salud al final de la URL. */
const ENTRADA = "cyber";
const ENTRADA_ACTIVA = (() => {
  const q = new URLSearchParams(location.search).get("entrada");
  return q === "salud" || q === "cyber" ? q : ENTRADA;
})();
const ANCHOS_OFERTA = [320, 460, 700, 900], SIZES_OFERTA = "(max-width:860px) 92vw, 430px";

const CYBER = (() => {
  const sec = document.getElementById("ofertas");
  const card = sec && sec.querySelector(".cy-estrella");
  const wa = document.getElementById("waOferta");
  if (wa) wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(OFERTA_WA)}`;
  if (!card) return { pinta(){} };

  const foto = card.querySelector(".cy-foto"), puntos = card.querySelector(".cy-puntos");
  const burbuja = card.querySelector(".cy-burbuja");
  const barra = sec.querySelector(".cy-barra"), cinta = sec.querySelector(".cinta-arriba span");
  const termina = sec.querySelector(".cy-termina");   /* "Las ofertas terminan en", se oculta con el contador */
  sec.querySelector(".cinta-abajo span").innerHTML =
    "<i>✦</i> OFERTAS POR TIEMPO LIMITADO <i>✦</i> HEART GRAPHIC ".repeat(8);
  let prods = [], k = 0, timer;

  /* precio de la tarjeta: el primer tramo de la primera variante */
  const tramo = p => { const v = p.vars[0], t = v.p[0]; return { v: v.v, u: t[0], pr: t[1] }; };

  function muestra(i){
    k = i; const p = prods[i], t = tramo(p);
    foto.querySelectorAll(".cy-slide").forEach((s,j) => s.classList.toggle("on", j === i));
    puntos.querySelectorAll("button").forEach((b,j) => b.classList.toggle("on", j === i));
    card.querySelector("h3").textContent = p.n;
    card.querySelector(".cy-det").textContent = `${t.v} · ${t.u} un.`;
    card.querySelector(".cy-pp").innerHTML = tieneDcto(p)
      ? `<b>${fmt(precioFinal(p, t.pr))}</b> <s>${fmt(t.pr)}</s>` : `<b>${fmt(t.pr)}</b>`;
    burbuja.hidden = !tieneDcto(p);
    burbuja.querySelector("b").textContent = tieneDcto(p) ? etqDcto(p) : "";
    burbuja.classList.toggle("l", i % 2 === 1);
  }
  const auto = () => {
    clearInterval(timer);
    if (prods.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      timer = setInterval(() => muestra((k + 1) % prods.length), ROTA_OFERTA);
  };

  function pinta(){
    prods = CATALOGO.filter(p => p.carrusel && p.vars.length);
    /* sin productos marcados (o con la entrada salud activa) la sección completa se oculta */
    sec.parentElement.hidden = ENTRADA_ACTIVA !== "cyber" || !prods.length;
    if (!prods.length) return;
    foto.innerHTML = prods.map(p => {
      const f = fotosDe(p)[0];
      if (!f) return `<div class="cy-slide cy-emoji" aria-hidden="true">${p.e}</div>`;
      const url = resolveImg(f);
      return `<img class="cy-slide" src="${cld(url, 700)}"${cldAttrs(url, ANCHOS_OFERTA, SIZES_OFERTA)} alt="${p.n}" loading="lazy">`;
    }).join("");
    puntos.innerHTML = prods.map(p => `<button type="button" aria-label="Ver ${p.n}"></button>`).join("");
    puntos.querySelectorAll("button").forEach((b,j) => b.addEventListener("click", e => {
      e.stopPropagation(); muestra(j); auto();
    }));

    const max = Math.max(0, ...prods.filter(tieneDcto).map(p => Number(p.dcto)));
    const base = `<i>✦</i> CYBER DAY · ${max ? `HASTA ${etqDcto({dcto: max})} · ` : ""}DISEÑO GRATIS · `;
    cinta.innerHTML = base.repeat(8);

    muestra(Math.min(k, prods.length - 1)); auto();
  }

  card.addEventListener("click", () => prods[k] && abreModal(prods[k]));
  card.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target === card){ e.preventDefault(); card.click(); }
  });

  /* contador hasta OFERTA_FIN */
  const fin = Date.parse(OFERTA_FIN);
  function tic(){
    const s = Math.floor((fin - Date.now()) / 1000);
    if (!(s > 0)){ barra.hidden = true; if (termina) termina.hidden = true; clearInterval(reloj); return; }
    const v = [Math.floor(s/86400), Math.floor(s%86400/3600), Math.floor(s%3600/60), s%60]
      .map(x => String(x).padStart(2, "0"));
    barra.querySelectorAll("b").forEach((b,i) => b.textContent = v[i]);
  }
  const reloj = setInterval(tic, 1000);
  tic();

  pinta();
  return { pinta };
})();

/* ---------- Entrada SALUD: "Tu consulta merece una buena impresión" ----------
   Se muestra en lugar del Cyber cuando ENTRADA_ACTIVA = "salud". La tarjeta rota
   por los productos con tarjeta_inicio = si en la planilla (solo afecta a esta
   tarjeta, no al carrusel ni a otros destacados); si ninguno está marcado, rota
   por todo el catálogo. Los puntos permiten elegir y un clic abre la ficha. */
const SALUD = (() => {
  const zona = document.querySelector(".hg-zona");
  const card = zona && zona.querySelector(".hg-card");
  if (!card) return { pinta(){} };
  zona.hidden = ENTRADA_ACTIVA !== "salud";

  const wa = document.getElementById("waSalud");
  if (wa) wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("¡Hola Heart Graphic! 💜 Quiero cotizar papelería para mi consulta.")}`;

  /* cintas: el grupo va duplicado para que el loop sea continuo */
  const grupo = (items, clase) => `<div class="hg-cinta__grupo">${
    [...items, ...items].map(t => `<span>${t}</span><span class="${clase}">✦</span>`).join("")}</div>`;
  const CINTAS = {
    arriba: grupo(["PAPELERÍA PARA LA SALUD", "DISEÑO GRATIS", "ENVÍOS A TODO CHILE", "HEART GRAPHIC", "DISEÑOS PERSONALIZADOS"], "hg-estrella-cian"),
    medio:  grupo(["HEART GRAPHIC", "RECETARIOS", "CARNETS", "IMANES", "TARJETAS", "FLYERS", "DISEÑOS PERSONALIZADOS"], "hg-estrella-lila")
  };   /* debajo de la cinta "medio" va la banda de siempre de la web */
  zona.querySelectorAll("[data-cinta]").forEach(p => p.innerHTML = (CINTAS[p.dataset.cinta] || "").repeat(2));

  const foto = card.querySelector(".hg-card__img"), puntos = card.querySelector(".hg-card__dots");
  let prods = [], k = 0, timer;
  const tramo = p => { const v = p.vars[0], t = v.p[0]; return { v: v.v, u: t[0], pr: t[1] }; };

  function muestra(i){
    k = i; const p = prods[i], t = tramo(p);
    foto.querySelectorAll(".hg-slide").forEach((s,j) => s.classList.toggle("on", j === i));
    puntos.querySelectorAll("button").forEach((b,j) => b.classList.toggle("on", j === i));
    card.querySelector(".hg-card__nombre").textContent = p.n;
    card.querySelector(".hg-card__detalle").textContent = `${t.v} · ${t.u} un.`;
    card.querySelector(".hg-card__precio").innerHTML = tieneDcto(p)
      ? `${fmt(precioFinal(p, t.pr))} <s>${fmt(t.pr)}</s>` : fmt(t.pr);
    card.setAttribute("aria-label", `Ver ${p.n}`);
  }
  const auto = () => {
    clearInterval(timer);
    if (ENTRADA_ACTIVA === "salud" && prods.length > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches)
      timer = setInterval(() => muestra((k + 1) % prods.length), ROTA_OFERTA);
  };

  function pinta(){
    const conPrecio = CATALOGO.filter(p => p.vars.length);
    const marcados = conPrecio.filter(p => p.tarjetaInicio);
    prods = marcados.length ? marcados : conPrecio;
    card.hidden = !prods.length;
    if (!prods.length) return;
    foto.innerHTML = prods.map(p => {
      const f = fotosDe(p)[0];
      if (!f) return `<div class="hg-slide hg-emoji" aria-hidden="true">${p.e}</div>`;
      const url = resolveImg(f);
      return `<img class="hg-slide" src="${cld(url, 700)}"${cldAttrs(url, ANCHOS_OFERTA, SIZES_OFERTA)} alt="${p.n}" loading="lazy">`;
    }).join("");
    puntos.innerHTML = prods.length > 1
      ? prods.map(p => `<button type="button" aria-label="Ver ${p.n}"></button>`).join("") : "";
    puntos.querySelectorAll("button").forEach((b,j) => b.addEventListener("click", e => {
      e.stopPropagation(); muestra(j); auto();
    }));
    muestra(Math.min(k, prods.length - 1)); auto();
  }

  card.addEventListener("click", () => prods[k] && abreModal(prods[k]));
  card.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target === card){ e.preventDefault(); card.click(); }
  });

  pinta();
  return { pinta };
})();

/* ============ TESTIMONIOS ============
   Se editan en la pestaña "testimonios" de la planilla (columnas: activo, nombre,
   instagram, producto, texto, foto, lado_foto y respuesta opcional). Si la pestaña no existe o está
   vacía, se muestran estos. El @instagram se muestra como texto, sin enlace.
   foto: URL de la foto del pedido · lado_foto: izquierda | derecha (por defecto) · el avatar es la inicial. */
let TESTIMONIOS = [
  {nombre:"Constanza · Veterinaria Pelitos", prod:"Carnets de vacunación",
   frase:"Los carnets quedaron hermosos y a mis clientes les encantan. El diseño fue gratis y el pedido llegó rapidísimo."},
  {nombre:"Javiera · Dulce Encanto", prod:"Stickers troquelados",
   frase:"La calidad de impresión es increíble, los colores quedaron tal cual el diseño. Ya voy en mi tercer pedido."},
  {nombre:"Camila · Nails Studio", prod:"Tarjetas cliente frecuente",
   frase:"Mis clientas coleccionan los stickers de la tarjeta de citas. La atención por WhatsApp es súper cercana."},
  {nombre:"Dra. Fernanda · VetSur", prod:"Recetarios veterinarios",
   frase:"Los talonarios con mi logo se ven muy profesionales y el papel es de excelente calidad. Totalmente recomendados."}
];
const TESTI = (() => {
  const track = document.getElementById("testiTrack");
  const dots = document.getElementById("testiDots");
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
  let n = 0, i = 0, timer;

  /* "Dra. Fernanda · VetSur" → "Fernanda": para la inicial del avatar y el "¡Gracias, …!" */
  const primerNombre = s => String(s || "").split("·")[0].trim().replace(/^(dra?|sra?|srta|prof[a]?)\.?\s+/i, "").split(/\s+/)[0] || "";
  /* el texto se reparte en uno o dos globos, cortando entre oraciones */
  const globos = s => {
    const o = String(s).match(/[^.!?…]+[.!?…]+["”]?|[^.!?…]+$/g)?.map(x => x.trim()).filter(Boolean) || [s];
    if (o.length < 2) return [o.join(" ")];
    const m = Math.ceil(o.length / 2);
    return [o.slice(0, m).join(" "), o.slice(m).join(" ")];
  };
  /* columna instagram: "@usuario", "usuario" o el enlace → @usuario con el ícono de Instagram;
     un texto que nombra WhatsApp ("Pedido directo de WhatsApp") → con el ícono de WhatsApp;
     cualquier otro texto ("Pedido personalizado") → tal cual, sin ícono. Nunca es un enlace. */
  const origen = v => {
    const s = String(v || "").trim();
    if (!s) return "";
    if (/instagram\.com/i.test(s) || /^@?[\w.]+$/.test(s)){
      const u = s.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/[/?#].*$/, "").replace(/^@/, "");
      return u ? `<span class="testi-ig"><svg aria-hidden="true"><use href="#ic-ig"/></svg>@${esc(u)}</span>` : "";
    }
    if (/whats\s*app/i.test(s)) return `<span class="testi-ig testi-wa"><svg aria-hidden="true"><use href="#ic-wa"/></svg>${esc(s)}</span>`;
    return `<span class="testi-ig">${esc(s)}</span>`;
  };
  const CHECK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

  function pinta(){
    const lista = TESTIMONIOS.filter(t => t.frase);
    track.textContent = ""; dots.textContent = "";
    n = lista.length; i = 0;
    track.closest("section").hidden = !n;
    lista.forEach(t => {
      const d = document.createElement("div");
      d.className = "testi-slide" + (t.foto && t.lado === "izquierda" ? " izq" : "");
      /* avatar: siempre la inicial del nombre (no se usan fotos ni logos de la persona) */
      const pn = primerNombre(t.nombre), ini = (pn || String(t.nombre || "?").trim()).charAt(0).toUpperCase();
      const resp = t.resp || (pn ? `¡Gracias, ${pn}! Nos encantó hacerlo` : "¡Gracias por confiar en nosotras!");
      d.innerHTML = `<div class="testi-chat">
          <div class="testi-cab"><span class="testi-ava" aria-hidden="true">${esc(ini)}</span>
            <span class="datos"><span class="nombre">${esc(t.nombre)}</span>${origen(t.ig)}${
              t.prod && !t.foto ? `<span class="testi-prod">Pidió: ${esc(t.prod)}</span>` : ""}</span>
            <span class="testi-real">${CHECK}Pedido real</span></div>
          ${globos(t.frase).map(g => `<p class="testi-burbuja">${esc(g)}</p>`).join("")}
          <div class="testi-stars" role="img" aria-label="5 de 5 estrellas">⭐⭐⭐⭐⭐</div>
          <div class="testi-resp"><p>${esc(resp)}</p><span class="testi-hg" aria-hidden="true"><svg><use href="#ic-hg"/></svg></span></div>
        </div>${t.foto ? `
        <figure class="testi-pola"><img src="${esc(cld(resolveImg(t.foto), 700))}" alt="Pedido de ${esc(t.nombre)}${t.prod ? ": " + esc(t.prod) : ""}" loading="lazy">${
          t.prod ? `<figcaption>${esc(t.prod)}</figcaption>` : ""}</figure>` : ""}`;
      track.appendChild(d);
    });
    for (let k = 0; k < n; k++){
      const d = document.createElement("button");
      d.className = "testi-dot" + (k ? "" : " on");
      d.setAttribute("aria-label", `Testimonio ${k + 1}`);
      d.addEventListener("click", () => go(k));
      dots.appendChild(d);
    }
    dots.hidden = n < 2;
    go(0);
  }
  function go(k){
    if (!n) return;
    i = (k + n) % n;
    track.style.transform = `translateX(-${i*100}%)`;
    dots.querySelectorAll(".testi-dot").forEach((d,j) => d.classList.toggle("on", j === i));
    reinicia();
  }
  function reinicia(){ clearInterval(timer); if (n > 1) timer = setInterval(() => go(i+1), 4500); }
  const box = track.closest(".testi-box");
  box.addEventListener("mouseenter", () => clearInterval(timer));
  box.addEventListener("mouseleave", reinicia);
  pinta();
  return { pinta };
})();


/* ============ ROUTER SPA con transición deslizante ============ */
(function(){
  const vTienda = document.getElementById("vistaTienda");
  const vPol = document.getElementById("vistaPoliticas");
  const suave = !matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DUR = suave ? 320 : 0;
  let actual = "tienda", scrollTienda = 0, animando = false, iniciado = false;

  const irA = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: suave ? "smooth" : "instant", block: "start"});
  };

  function activa(destino, ancla){
    if (destino === actual){
      if (ancla) irA(ancla);
      else if (destino === "politicas") scrollTo({top:0, behavior: suave ? "smooth" : "instant"});
      return;
    }
    if (animando) return;
    animando = true;
    const aPol = destino === "politicas";
    const sale = aPol ? vTienda : vPol;
    const entra = aPol ? vPol : vTienda;
    if (aPol) scrollTienda = scrollY;

    sale.classList.add(aPol ? "fuera-izq" : "fuera-der");
    setTimeout(() => {
      sale.classList.add("oculta");
      sale.classList.remove("fuera-izq","fuera-der");
      entra.classList.remove("oculta");
      entra.classList.add(aPol ? "fuera-der" : "fuera-izq");
      document.body.classList.toggle("en-politicas", aPol);
      document.title = aPol ? "Políticas · Heart Graphic" : "Heart Graphic · Diseños Personalizados";
      scrollTo({top: aPol ? 0 : (ancla ? scrollY : scrollTienda), behavior:"instant"});
      requestAnimationFrame(() => requestAnimationFrame(() => {
        entra.classList.remove("fuera-izq","fuera-der");
        actual = destino;
        animando = false;
        if (ancla) irA(ancla);
      }));
    }, DUR);
  }

  function ruta(){
    const h = location.hash.slice(1);
    if (h === "politicas") activa("politicas");
    else if (h.startsWith("pol-")) activa("politicas", h);
    else activa("tienda", h || null);
  }

  /* estado inicial: sin animación */
  (function inicio(){
    const h = location.hash.slice(1);
    if (h === "politicas" || h.startsWith("pol-")){
      vTienda.classList.add("oculta");
      vPol.classList.remove("oculta");
      document.body.classList.add("en-politicas");
      document.title = "Políticas · Heart Graphic";
      actual = "politicas";
      if (h.startsWith("pol-")) setTimeout(() => irA(h), 60);
    }
    iniciado = true;
  })();

  addEventListener("hashchange", ruta);
  const waPol = document.getElementById("waPol");
  if (waPol) waPol.href = `https://wa.me/${WHATSAPP}`;
})();

renderMarquee();
renderProductos();
parallax();

/* ============ CARGA DESDE GOOGLE SHEETS ============
   Lee las columnas por su NOMBRE, así que puedes reordenarlas en la planilla.
   Los precios salen SOLO de la columna 'cantidades'; no hay hoja de respaldo. */
const GVIZ = s => `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${s}`;

async function gvizHoja(sheet){
  const t = await (await fetch(GVIZ(sheet))).text();
  const j = JSON.parse(t.substring(t.indexOf("(") + 1, t.lastIndexOf(")")));
  if (j.status !== "ok") throw new Error(`Hoja "${sheet}": ${JSON.stringify(j.errors || j.status)}`);
  return {
    cols: (j.table.cols || []).map(c => String(c.label || "").trim().toLowerCase()),
    rows: (j.table.rows || []).map(r => (r.c || []).map(c => c ? c.v : null))
  };
}

/* JSON tolerante: acepta comillas simples, claves sin comillas y comas colgantes */
function jsonSuave(txt){
  const s = String(txt ?? "").trim();
  if (!s) return null;
  try { return JSON.parse(s); } catch(_){}
  try {
    const t = s.replace(/'/g, '"')
               .replace(/([{,]\s*)([A-Za-zÀ-ÿ0-9_][^":,{}\[\]]*?)\s*:/g, '$1"$2":')
               .replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(t);
  } catch(_){ console.warn("Celda con JSON mal escrito, se ignora:", s.slice(0,120)); return null; }
}

/* "si" / "sí" / "x" / 1 / true = va en el carrusel de arriba */
const esSi = v => /^(si|sí|s|x|1|true|yes)$/i.test(String(v ?? "").trim());

function normColores(raw){
  const o = jsonSuave(raw);
  if (!o) return [];
  const arr = Array.isArray(o) ? o : Object.keys(o).sort((a,b) => a - b).map(k => o[k]);
  return arr.filter(c => c && typeof c === "object").map(c => ({
    hex: String(c.Color_hex ?? c.color_hex ?? c.hex ?? "").trim(),
    nom: String(c.Color_name ?? c.color_name ?? c.nom ?? "Color").trim(),
    img: String(c.url_img ?? c.img ?? "").trim()
  })).filter(c => /^#?[0-9a-f]{3,8}$/i.test(c.hex))
     .map(c => ({...c, hex: c.hex.startsWith("#") ? c.hex : "#" + c.hex}));
}

/* material: un objeto {icono, titulo, detalle} o una lista de varios */
function normMaterial(raw){
  const o = jsonSuave(raw);
  if (!o) return [];
  const suelto = m => m && typeof m === "object" &&
    (m.titulo ?? m.title ?? m.nombre ?? m.icono ?? m.icon ?? m.svg) !== undefined;
  const arr = Array.isArray(o) ? o : (suelto(o) ? [o] : Object.values(o));
  return arr.filter(m => m && typeof m === "object").map(m => {
    const det = m.detalle ?? m.detalles ?? m.subtitulo ?? m.texto ?? m.descripcion ?? "";
    return {
      icono:  String(m.icono ?? m.icon ?? m.svg ?? m.url_img ?? "").trim(),
      emoji:  String(m.emoji ?? "").trim(),
      titulo: String(m.titulo ?? m.title ?? m.nombre ?? "").trim(),
      detalle: (Array.isArray(det) ? det : String(det).split(/\s*[·|;\n]\s*/))
                 .map(x => String(x ?? "").trim()).filter(Boolean)
    };
  }).filter(m => m.titulo || m.detalle.length);
}

function normGaleria(raw, principal){
  const s = String(raw ?? "").trim();
  const o = /^[\[{]/.test(s) ? jsonSuave(s) : null;   /* sin corchetes = lista simple con | */
  let l = Array.isArray(o) ? o
        : (o && typeof o === "object") ? Object.values(o)
        : s.split(/\s*[|;\n]\s*/);
  l = l.map(x => String(x ?? "").trim()).filter(Boolean);
  if (principal && !l.includes(principal)) l.unshift(principal);
  return l;
}

function normCantidades(raw){
  const o = jsonSuave(raw);
  if (!o) return [];
  const tramos = a => (Array.isArray(a) ? a : []).map(x => Array.isArray(x)
        ? [Number(x[0]), Number(x[1])]
        : [Number(x.unidades ?? x.un ?? x.cantidad), Number(x.precio ?? x.pr ?? x.valor)])
      .filter(t => Number.isFinite(t[0]) && Number.isFinite(t[1]))
      .sort((a,b) => a[0] - b[0]);
  if (Array.isArray(o)){
    const p = tramos(o);
    return p.length ? [{v: "Unidades", p}] : [];
  }
  return Object.entries(o).map(([v, a]) => ({v: String(v), p: tramos(a)})).filter(x => x.p.length);
}

/* Columna 'descuento': porcentaje por defecto del producto. Acepta "15", "15%",
   "15,5" o 0.15 (formato porcentaje de la planilla). Vacío, 0 o basura = 0. */
function normDcto(raw){
  if (raw == null || raw === "") return 0;
  let n = typeof raw === "number" ? raw : parseFloat(String(raw).replace("%", "").replace(",", ".").trim());
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n < 1) n *= 100;                         /* celda con formato % (0.15 = 15%) */
  return Math.min(90, Math.round(n * 10) / 10);
}

(async () => {
  if (!SHEET_ID) return;
  try {
    const P = await gvizHoja("productos");
    const col = (fila, nombre, alt) => {
      let i = P.cols.indexOf(nombre);
      if (i < 0 && alt) i = P.cols.indexOf(alt);
      return i < 0 ? null : fila[i];
    };

    const mapa = new Map();
    P.rows.forEach(r => {
      const id = col(r, "id"), nombre = col(r, "nombre");
      if (!nombre || String(col(r, "activo") ?? "si").toLowerCase() === "no") return;
      const img = String(col(r, "imagen_principal") ?? "").trim();
      mapa.set(id, {
        id, n: String(nombre).trim(), e: col(r, "emoji") || "💜",
        carrusel: P.cols.includes("carrusel")
                    ? esSi(col(r, "carrusel"))
                    : /vet/i.test(String(col(r, "categoria") ?? "")),   /* respaldo: planilla antigua */
        tarjetaInicio: esSi(col(r, "tarjeta_inicio")),   /* solo la tarjeta de la entrada salud */
        d: col(r, "descripcion") || "", notas: col(r, "notas") || "",
        img, fotos: normGaleria(col(r, "galeria"), img),
        mat: normMaterial(col(r, "material")),
        cols: normColores(col(r, "colores")),
        vars: normCantidades(col(r, "cantidades")),
        dcto: normDcto(col(r, "descuento"))
      });
    });
    mapa.forEach(p => p.vars.forEach(v => v.p.sort((a,b) => a[0] - b[0])));

    /* Un producto sin precios legibles no se puede mostrar: avisamos con nombre y
       fila para que sea fácil encontrar la celda en la planilla. */
    const sinPrecio = [...mapa.values()].filter(p => !p.vars.length);
    if (sinPrecio.length) console.error(
      "⚠ Estos productos NO se muestran porque su celda 'cantidades' está vacía o mal escrita:\n" +
      sinPrecio.map(p => `   · fila ${P.rows.findIndex(r => col(r,"id") === p.id) + 2} — ${p.n} (id ${p.id})`).join("\n"));

    const productos = [...mapa.values()].filter(p => p.vars.length);
    if (productos.length){
      CATALOGO = productos;
      renderProductos();
      VET.pinta();
      CYBER.pinta();
      SALUD.pinta();
      console.info(`Catálogo cargado desde Google Sheets: ${productos.length} productos.`);
    }
  } catch(e){
    console.warn("No se pudo leer el Sheet; se muestra el catálogo embebido.", e);
  }
})();

/* ---------- Testimonios desde la planilla (pestaña "testimonios") ----------
   Si la pestaña no existe gviz devuelve la primera hoja: por eso se exige la columna "texto". */
(async () => {
  if (!SHEET_ID) return;
  try {
    const T = await gvizHoja("testimonios");
    if (!T.cols.includes("texto")) return;
    const col = (r, nombre) => { const i = T.cols.indexOf(nombre); return i < 0 ? "" : String(r[i] ?? "").trim(); };
    const lista = T.rows
      .filter(r => col(r, "texto") && !/^no$/i.test(col(r, "activo")))
      .map(r => ({ nombre: col(r, "nombre"), ig: col(r, "instagram"), prod: col(r, "producto"),   /* instagram: TESTI.origen */
                   frase: col(r, "texto").replace(/^["“]|["”]$/g, ""), foto: col(r, "foto"), resp: col(r, "respuesta"),
                   lado: /^izq/i.test(col(r, "lado_foto")) ? "izquierda" : "derecha" }));
    if (lista.length){ TESTIMONIOS = lista; TESTI.pinta(); }
  } catch(e){
    console.warn("No se pudo leer la pestaña testimonios; se muestran los del código.", e);
  }
})();
