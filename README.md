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
assets/
  css/tienda.css              Estilos del sitio (trae embebidas Neulis Alt Regular y Neulis Bold)
  js/tienda.js                Script del sitio: configuración, catálogo, carrito, ofertas, router
  logos/                      SVG de marca
  iconos/                     WhatsApp, Instagram, Facebook, correo
  fuentes/                    Tipografías Neulis (OTF con licencia)
  productos/                  Fotos de productos y carnets_veterinarios/
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
- **Contador:** cuenta hasta `OFERTA_FIN` (hoy: miércoles 7 de octubre a medianoche, hora de Chile) y se oculta solo al llegar a cero. Vacío = sin contador.
- **Cintas:** la de arriba calcula sola el "HASTA -N%" con el mayor descuento de los productos marcados.
- **Botón "Lo quiero":** abre WhatsApp con el mensaje de `OFERTA_WA`.
- Si ningún producto tiene `carrusel = si`, la sección completa se oculta.

### Especial veterinarias (guardada)

Está completa pero comentada en el HTML, con su carrusel vertical; su módulo `VET` del script no hace nada mientras la sección esté comentada. Para volver a ella:

1. Descomentar la sección `Especial veterinarias` y comentar la de `Cyber Day` (ambas marcadas con `Seccion OFERTAS`).
2. Cambiar `OFERTA_WA` por el mensaje de veterinarias (está anotado al lado).

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
