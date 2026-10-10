# Heart Graphic · Tienda de diseños personalizados

Sitio de la tienda **Heart Graphic** (tazones, stickers, tarjetas, carnets, talonarios y más).
Es una página estática (HTML + CSS + JS, sin build): los pedidos se hacen por **WhatsApp** y el catálogo se lee desde una **planilla de Google Sheets**, así que cambiar precios o productos no requiere tocar código.

- Instagram: [@heartgraphic_](https://www.instagram.com/heartgraphic_)
- Hosting: Netlify, con deploy automático desde GitHub

---

## Estructura

```
index.html                    Marcado del sitio (tienda + vista de Políticas). Logos e íconos
                              van como SVG en línea.
catalogo_heart_graphic.xlsx   Plantilla del catálogo para subir a Google Sheets (trae hoja "leeme").
planners_heart_graphic.xlsx   Pestañas de la sección Planners para la misma planilla (trae hoja "leeme").
instructivo_planners.pdf      Guía paso a paso (para cualquier persona) para usar esa planilla.
assets/
  css/tienda.css              Estilos del sitio (trae embebidas Neulis Alt Regular y Neulis Bold)
  js/tienda.js                Script del sitio: configuración, catálogo, carrito, ofertas, router
  css/planners.css            Estilos de la Sección PLANNERS
  js/planners.js              Sección PLANNERS: precios, rutas de imágenes, visores, galería
  logos/                      SVG de marca
  iconos/                     WhatsApp, Instagram, Facebook, correo
  fuentes/                    Tipografías Neulis (OTF con licencia)
  productos/                  Fotos de productos, carnets_veterinarios/ y planners/
  referencias/                Catálogo PDF, logo.ai y JPG del logo
mockups/                      Exploraciones de diseño (no forman parte del sitio)
LEEME.txt                     Guía rápida original
```

## Configuración

Todo se ajusta en constantes al inicio de `assets/js/tienda.js`:

| Constante | Qué hace |
|---|---|
| `WHATSAPP` | Número de pedidos, sin `+` |
| `SHEET_ID` | ID de la planilla publicada. Vacío = usa el catálogo embebido en el HTML |
| `IMG_BASE` | Prefijo para fotos escritas solo con el nombre de archivo |
| `ROTA_TARJETA` / `ROTA_MODAL` | Cada cuántos ms rotan las fotos en tarjetas y en la ficha |
| `TESTIMONIOS` | Textos del carrusel de testimonios |
| `OFERTA_WA`, `OFERTA_FIN`, `ROTA_OFERTA` | Sección de ofertas (ver más abajo) |
| `ENTRADA` | Qué entrada va arriba: `"cyber"` (hoy) o `"salud"`. Cambio manual (ver Entrada salud) |

## Catálogo en Google Sheets

1. Sube `catalogo_heart_graphic.xlsx` a Google Sheets.
2. **Archivo → Compartir → Publicar en la web**.
3. Copia el ID de la URL de la planilla en `SHEET_ID`.

La hoja se llama `productos` y tiene una fila por producto. Las instrucciones detalladas (con ejemplos de JSON) están en la hoja **leeme** de la planilla.

| Columna | Uso |
|---|---|
| `id` | Número único |
| `nombre`, `emoji`, `descripcion`, `notas` | Textos del producto. El emoji se muestra si no hay fotos |
| `activo` | `si` / `no` para mostrar u ocultar sin borrar |
| `carrusel` | `si` = aparece en la **Sección OFERTAS** |
| `tarjeta_inicio` | `si` = rota en la **tarjeta de la entrada salud**. Solo afecta esa tarjeta, no el carrusel ni otros destacados. Si ninguno la tiene, rota por todo el catálogo |
| `material` | Ficha de material (JSON) |
| `imagen_principal`, `galeria` | URL de la foto principal y lista de fotos |
| `colores` | Colores disponibles, cada uno con su foto opcional (JSON) |
| `cantidades` | Tramos de precio, con o sin variantes (JSON) |
| `descuento` | % de descuento del producto (ej. `15`). Tacha el precio de lista y muestra el nuevo en tarjetas, carrito y mensaje de WhatsApp |

> ⚠️ **La planilla es compartida por `main` y `develop`.** Cualquier cambio (precios, descuentos, `carrusel`) se ve al instante en producción y en la vista previa.

**Fotos:** se recomienda subirlas a Cloudinary y pegar la URL tal como la entrega. El sitio agrega solo `f_auto`, `q_auto` y el ancho justo para cada lugar, así que no hace falta achicarlas antes.

**Seguridad:** el sitio no usa claves ni tokens. `WHATSAPP` y `SHEET_ID` son públicos por diseño; comparte la planilla solo como **lector** para que nadie pueda editar precios.

## Sección OFERTAS

Bloque de campaña bajo el hero. Hay dos campañas y solo una va activa a la vez; ambas muestran los productos con `carrusel = si`.

### Cyber Day (activa)

- **Oferta estrella:** tarjeta que rota por los productos marcados cada `ROTA_OFERTA` ms, con foto, variante, precio y burbuja **DESCUENTO -N%**. Los puntos permiten elegir y un clic abre la ficha del producto.
- **Contador:** cuenta hasta `OFERTA_FIN` (ofertas extendidas: sábado 11 de octubre a las 23:59, hora de Chile) y se oculta solo al llegar a cero, junto con el texto "Las ofertas terminan en". Vacío = sin contador. El título dice "EXTENDEMOS LAS OFERTAS CYBER" (antes "CYBER DAY RELÁMPAGO"), con los mismos colores.
- **Cintas:** la de arriba calcula sola el "HASTA -N%" con el mayor descuento de los productos marcados.
- **Botón "Lo quiero":** abre WhatsApp con el mensaje de `OFERTA_WA`.
- Si ningún producto tiene `carrusel = si`, la sección completa se oculta.

### Entrada salud (lista, sin activar)

Reemplaza al Cyber Day cuando termine. Está en el HTML como `hg-zona` (oculta) y su módulo `SALUD` en `tienda.js`; los estilos llevan prefijo `.hg-` en `tienda.css`.

- **Activarla:** cambiar `const ENTRADA = "cyber";` por `"salud"` en `tienda.js` y publicar. **No cambia sola por fecha.**
- **Mirarla sin activarla:** abrir la página con `?entrada=salud` (ej. `https://…/?entrada=salud`). Con `?entrada=cyber` se fuerza el Cyber.
- **Tarjeta:** rota cada `ROTA_OFERTA` ms por los productos con `tarjeta_inicio = si` (si no hay ninguno, por todo el catálogo; no incluye los planners). Muestra foto, variante, precio con descuento tachado; puntos para elegir y clic para abrir la ficha.
- **Botón "Cotiza gratis":** abre WhatsApp con un mensaje de cotización. **"Ver productos"** baja al catálogo.
- **Cintas:** dos inclinadas (arriba y al medio); sus textos están en el objeto `CINTAS` del módulo `SALUD`. Debajo queda la banda de siempre de la web, pegada a la cinta del medio.

### Especial veterinarias (guardada)

Está completa pero comentada en el HTML, con su carrusel vertical; su módulo `VET` del script no hace nada mientras la sección esté comentada. Para volver a ella:

1. Descomentar la sección `Especial veterinarias` y comentar la de `Cyber Day` (ambas marcadas con `Seccion OFERTAS`).
2. Cambiar `OFERTA_WA` por el mensaje de veterinarias (está anotado al lado).

## Sección PLANNERS

Pestaña del Catálogo: bajo el título hay un switch **Catálogo / Planner** (cápsula blanca con el corazón hg en ambas opciones). La pastilla oscura se estira como gota hasta la opción elegida, su corazón late al llegar, y el contenido sale hacia el costado mientras el nuevo entra desde el lado al que se movió el switch. El enlace **Planners** del menú (o entrar con `#planners`) abre esa pestaña y baja hasta ella; **Productos** vuelve al catálogo. No sale de la planilla: sus datos están al inicio de `assets/js/planners.js`.

- **Agendas (23):** Atrévete 2027, Mi Planner (3 diseños), Planner Brilla (Levántate & Brilla, Brilla como si todo el Universo fuera tuyo), Planner Docente · Héroes, Planner Docente (Enseñar es Inspirar, Gran Corazón), Universitario (6 portadas), Planner Diario (3 diseños), Planner Diario anillado arriba (5 diseños), Semanal Diario (Potencial, Buen Día), Sueña en Grande (Azul, Atardecer), Diario de Gratitud (2 portadas), Mini Planner Diario (5 portadas), Mini Agenda Líneas (4 portadas), Planner Control de Gastos (2 portadas), Mini Planner Semanal (5 portadas), Agenda Mis Pedidos (2 portadas), Mini Planner de Escritorio (3 diseños), Planner Semanal (11 diseños), 100 Citas Juntos (3 portadas), 100 Citas con Amigas (2 portadas), 100 Citas con Mamá, Carnet de Control Veterinario (4 portadas) y Agenda Mis Recetas (4 portadas). Cada tarjeta muestra su **tamaño** con la hoja dibujada a escala y un color por tamaño (B5 rosa, A5 lila, A6 celeste; `tam` en `AGENDAS`, A5 por defecto); arriba de las tarjetas, la "Guía de tamaños" (Elige tu tamaño) muestra las tres agendas a escala, una sobre otra y con su anillado, y el catálogo va de mayor a menor tamaño; dentro de cada tamaño van primero los planners y al final las agendas de otra temática (`tema: true`: Gratitud, 100 Citas, Carnet, Recetas, Mis Pedidos, Mini Agenda Líneas), cada grupo del precio más alto al más bajo. Los diseños que vienen de la misma carpeta de PLANNERS van juntos en un producto y cada portada muestra su propio interior. Cada una es un producto con el mismo modelo: portada anillada, selector de portada cuando hay más de una (fila compacta de miniaturas con ‹ › en la tarjeta + flechas y puntos sobre la portada grande, sincronizados), opción **Personaliza tu portada** (+$1.000: el cliente sube su imagen y la ve como portada en la foto y en el visor; la imagen no viaja, se pide por WhatsApp) y visor **Ve el interior** con las hojas girando sobre el lomo. Sin precio cargado muestran "Consultar" y el WhatsApp pide consulta (sin carrito).
- **Anillado:** perforaciones rectangulares y alambre doble blanco (wire-o), dibujado con los SVG de `assets/productos/planners/anillado/`; en la portada cerrada el alambre sobresale del borde y en el visor abierto une las dos páginas.
- **Orden de las páginas** (igual que la Atrévete, lo arma `paginasDe`): interior de la portada en blanco, datos personales a la derecha con su reverso en blanco, y los pliegos de dos páginas (`par()` en `AGENDAS`) siempre empezando a la izquierda; si hace falta se intercala una página en blanco. El interior va siempre en este orden: datos y calendarios, planificación mensual, control de gastos y hábitos, y después la planificación semanal o diaria (al final, notas y hojas libres).
- **Margen del anillado:** en el visor, las hojas interiores dejan junto al lomo el espacio que el diseño reserva para las perforaciones (papel en blanco), así los anillos no tapan el contenido. La portada y la contratapa sí van perforadas.
- **Planner Semanal:** mismo modelo que las agendas, apaisado y con anillado arriba: 11 diseños (portada + interior a juego: tiro = planificación semanal, retiro = hábitos), valor único y "Personaliza tu portada". El visor muestra el interior del diseño elegido.
- **Anillado arriba:** Planner Semanal, Planner Diario anillado arriba, Mini Planner Semanal, Mis Pedidos, Mini Planner de Escritorio y Agenda Mis Recetas (`lomo: "arriba"` en `AGENDAS`): alambre en el borde superior y visor de una hoja a la vez: la página se ve a tamaño completo y, al avanzar, se levanta por arriba girando sobre el anillado y deja ver la siguiente (en el Semanal, planificación y hábitos se ven por separado).
- Más unidades se suman en el carrito con +/−.
- Cada producto tiene WhatsApp (mensaje con la elección y el total), Instagram y carrito, igual que el catálogo.
- Visores y galería: Esc cierra, flechas del teclado pasan las hojas, el foco queda dentro del diálogo y respetan `prefers-reduced-motion`. Los anillos son siempre blancos.

| Constante (`planners.js`) | Qué hace |
|---|---|
| `WA_NUM` | Número de pedidos de planners. Hoy usa `WHATSAPP` (**TODO**) |
| `PRECIOS` | Valor único del Planner Semanal y recargo por portada personalizada (**TODO**: precios reales) |
| `VISTAS` | Bajada bajo los títulos en cada pestaña |
| `AGENDAS` | Una entrada por agenda: nombre, precio (**TODO**, `null` = Consultar), descripción, formato, portadas, títulos de páginas y proporción de página |
| `PL_IMG` | Ruta base de las imágenes |

**Imágenes (temporal):** se sirven desde `assets/productos/planners/` (`agendas/<id>/` con `portada-N.jpg`, `portada-N-mini.jpg`, `contratapa-N.jpg` y `pagina-NN.jpg` en orden de lectura, copiadas y achicadas desde las carpetas de diseño (PLANNERS, 100 CITAS, 100 Citas con AMIGAS, 100 Citas con mamá, AGENDA DE CONTROL VET y AGENDA de Recetas); con `interiorPorPortada` las páginas son `pagina-K-NN.jpg`, una serie por portada). Cuando se migren a un servicio externo, basta con cambiar `PL_IMG` o las rutas de la configuración.

**Precios:** salen del catálogo de planners (Canva) y siempre terminan en 990 ($12.000 → $11.990); la web aplica esa regla también a lo que venga de la planilla y a los descuentos (`a990` en `planners.js`). Los que no están en el catálogo: A6 $5.990 (Mini Planner de Escritorio $6.990), Carnet de Control Veterinario, Planner Docente · Héroes y 100 Citas con Amigas y con Mamá $9.990. Las páginas de la Atrévete se recortaron en el lomo para quitar el anillado redondo que traían dibujado.

### Planners en Google Sheets

`planners_heart_graphic.xlsx` trae las pestañas para administrar la sección desde la **misma planilla del catálogo** (Archivo › Importar › "Insertar hojas nuevas"). Las instrucciones detalladas están en su hoja **leeme**. Si una pestaña no existe o una fila está mal escrita, la web usa lo que trae `AGENDAS` en `planners.js` y avisa en la consola con el número de fila.

| Pestaña | Uso |
|---|---|
| `planners` | Una fila por planner (`id` = el de `AGENDAS`): `activo`, `nombre`, `precio` (vacío = Consultar; se muestra terminado en 990), `descuento` (%), `tamano` (B5/A5/A6), `descripcion`, `detalles`, `ocultar_portadas`, `orden` (desempata a igual tamaño y precio), `anillado`, `orientacion`, `tipo` (planner / tematica). La fila `config` guarda en `precio` el valor de "Personaliza tu portada". Un `id` nuevo crea un planner nuevo. |
| `planners_portadas` | Portadas nuevas: `id_planner`, `orden`, `nombre`, `url_portada`, `url_contratapa`, `color`, `activo`. Usan el interior de la primera portada. |
| `planners_hojas` | Hojas que se suman al final del interior: `id_planner`, `portada` (vacío = todas), `orden`, `titulo`, `url` (imagen en internet o el archivo de una hoja actual, ej. `pagina-1-03.jpg`), `pliego` (si = par izquierda + derecha), `repetir` (veces). |
| `hojas_actuales` | Solo referencia: las hojas que hoy tiene cada planner, con su título y su archivo. |

> Google devuelve la primera pestaña cuando se pide una que no existe; por eso la web solo acepta cada pestaña si trae sus columnas propias (`tamano`, `url_portada`, `titulo`…).

## Ramas y despliegue (Netlify)

| Rama | Dónde se ve |
|---|---|
| `main` | Producción: el dominio del sitio |
| `develop` | Vista previa fija: `develop--<sitio>.netlify.app` |
| Pull request a `main` | `deploy-preview-<N>--<sitio>.netlify.app` |

Flujo recomendado: trabajar en `develop`, revisar en su vista previa y luego abrir un PR `develop → main`. Al hacer merge, producción se actualiza sola.

Los branch deploys se activan en Netlify en **Project configuration → Developer settings → Continuous deployment → Branches and deploy contexts**.

## Ver el sitio en local

Basta con abrir `index.html` en el navegador. Si algo no carga al abrirlo como archivo (por ejemplo las fotos de `assets/` en los mockups), sírvelo por HTTP con la extensión **Live Server** de VS Code, o con `npx serve .` si tienes Node instalado.

## Mockups

`mockups/` guarda las exploraciones de diseño, por ejemplo `propuestas_cyber*.html` y `propuesta_cyber_final.html` para el Cyber Day. En la vista previa de `develop` se abren en `/mockups/<archivo>.html`. No se enlazan desde el sitio.
