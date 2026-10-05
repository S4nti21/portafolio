# Portafolio · Santiago Weidmann

Portafolio personal de **Santiago Weidmann**, desarrollador de software Jr. (Java · React · JavaScript) en Santa Fe, Argentina. La temática es Star Wars: un campo estelar animado, una intro con texto en perspectiva y cuatro "colores de energía" para elegir.

- **Sitio estático** con [Astro](https://astro.build) 7 y TypeScript en modo estricto.
- **CSS propio** con custom properties, sin frameworks de UI ni librerías de animación.
- **JavaScript solo donde hace falta**: el campo estelar, la intro, el selector de energía, el encendido de las hojas y el personaje de Contacto.
- **Accesible**:
  - Se usa entero con teclado y tiene contraste AA.
  - Respeta "reducir movimiento".
  - Todo el contenido se ve sin JavaScript.
- **Rendimiento y SEO**:
  - Fuentes autoalojadas e imágenes optimizadas.
  - Open Graph, datos estructurados y sitemap.
  - Lighthouse, en mobile y desktop (septiembre de 2026): 99–100 en rendimiento y 100 en accesibilidad, buenas prácticas y SEO.

## Requisitos

- **Node.js 24 LTS** (24.16 o superior). Astro funciona desde Node 22.12, pero las herramientas de lint piden 24.16. Con una versión anterior, `npm install` muestra avisos `EBADENGINE`. La versión está indicada en `.nvmrc`.
- **Conexión a internet** la primera vez que corras `dev` o `build`: Astro descarga las fuentes de Fontsource y después las guarda en caché.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí <http://localhost:4321>. Los cambios se ven al instante.

| Comando           | Qué hace                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `npm run dev`     | Levanta el servidor de desarrollo. Muestra también las misiones en borrador. |
| `npm run build`   | Revisa tipos y plantillas (`astro check`) y genera el sitio en `dist/`.      |
| `npm run preview` | Sirve `dist/` para probar el build antes de publicarlo.                      |
| `npm run check`   | Hace solo la revisión de tipos y plantillas.                                 |
| `npm run lint`    | Corre ESLint con reglas de TypeScript, Astro y accesibilidad.                |
| `npm run format`  | Formatea todo con Prettier. `npm run format:check` solo lo verifica.         |

## Estructura

```text
src/
├─ data/perfil.ts       ← tus datos y todos los textos del sitio
├─ content/misiones/    ← una misión (proyecto) por archivo .md
├─ assets/              ← foto, fondos opcionales, imágenes de misiones, personajes y la fuente Star Jedi
├─ components/          ← secciones y piezas de la interfaz
├─ scripts/             ← campo estelar, intro, energía, hojas y personaje (TypeScript)
├─ styles/              ← tokens.css (colores, fuentes y medidas) y global.css
├─ layouts/Base.astro   ← <head>, fuentes, SEO y fondo de estrellas
└─ pages/               ← inicio, /intro, /misiones/[slug], 404 y robots.txt
public/                 ← archivos que se publican tal cual: CV, íconos y og.png
```

Las carpetas `diseno/` y `cv/` son referencias locales: el diseño original y el CV fuente. Están en `.gitignore` y no forman parte del sitio.

## Editar tus datos

Todo el contenido está en **`src/data/perfil.ts`**, salvo las misiones. El archivo está tipado: si falta un campo o un nombre está mal escrito, te avisan el editor y `npm run check`.

| Bloque                         | Qué cambia                                                                                                                |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `nombre`, `rol`, `tecnologias` | Nombre y subtítulo del inicio. También se usan para el SEO.                                                               |
| `ubicacion`                    | Coordenadas que aparecen al pie del inicio. La ciudad y la región se usan en los datos para buscadores.                   |
| `secciones`                    | Número romano, etiqueta, título y texto del menú de cada sección.                                                         |
| `hero`                         | Pastilla superior, bajada, botones e indicación de scroll del inicio.                                                     |
| `historia`                     | Cita, texto, datos (base, formación, idiomas y estado) y texto alternativo de la foto.                                    |
| `entrenamiento`                | Niveles y habilidades. `largo` va de 0 a 1 y es el largo de la hoja. `enEntrenamiento: true` muestra los chips punteados. |
| `contacto`                     | Email, LinkedIn, GitHub, CV y teléfono.                                                                                   |
| `intro`                        | Textos de la intro.                                                                                                       |
| `seo`                          | Título y descripción para buscadores y redes.                                                                             |

Otros cambios frecuentes:

- **Teléfono**: está oculto. Aparece cuando ponés `mostrarTelefono: true` en `contacto`.
- **Foto**:
  - Reemplazá `src/assets/foto-perfil.webp` por otra con el mismo nombre.
  - Conviene que sea vertical y de al menos 700 px de ancho. Se recorta a 4:5 y Astro genera las versiones AVIF y WebP.
  - Actualizá también `historia.fotoAlt`.
- **CV**: reemplazá el PDF de `public/cv/` por otro con el mismo nombre, o cambiá la ruta en `contacto.cv`.
- **Colores de energía**:
  - Los valores están en `src/styles/tokens.css`: cada color tiene `--energia-*` y su versión `--energia-*-rgb`, y tenés que cambiar las dos.
  - Los nombres de cada color (el que leen los lectores de pantalla y el tooltip) están en `src/data/energias.ts`.

## Agregar una misión

Cada archivo `.md` de `src/content/misiones/` es una misión. El nombre del archivo define la URL: `mi-proyecto.md` se publica en `/misiones/mi-proyecto/`.

1. Copiá `src/content/misiones/_plantilla.md` y renombralo, por ejemplo, a `mi-proyecto.md`. Los archivos que empiezan con `_` no se publican.
2. Completá el frontmatter:

   | Campo                    | ¿Obligatorio? | Qué es                                                                               |
   | ------------------------ | ------------- | ------------------------------------------------------------------------------------ |
   | `titulo`                 | Sí            | Nombre real del proyecto.                                                            |
   | `codigo`                 | Sí            | Nombre en clave que se ve grande. Va en mayúsculas, por ejemplo `ÓRBITA`.            |
   | `anio`                   | Sí            | Año, como número.                                                                    |
   | `categoria`              | Sí            | Tipo de proyecto.                                                                    |
   | `resumen`                | Sí            | Una línea: qué es y para quién.                                                      |
   | `problema` / `resultado` | Sí            | Una o dos oraciones cada uno.                                                        |
   | `stack`                  | Sí            | Lista de tecnologías, por ejemplo `['React', 'CSS3']`.                               |
   | `orden`                  | Sí            | Posición en la lista (menor = primero). El número "Misión 0X" sale de esta posición. |
   | `repo` / `demo`          | No            | URLs completas, con `https://`. Aparecen como botones en la página de la misión.     |
   | `imagen` / `imagenAlt`   | No            | Portada y su descripción (ver abajo).                                                |
   | `borrador`               | No            | Con `true`, solo se ve con `npm run dev`. Por defecto es `false`.                    |

3. Debajo del frontmatter escribí **"La solución"** en Markdown. Para los subtítulos usá `###`, porque la página ya usa los niveles de título anteriores.

**Imagen de portada**: guardala en `src/assets/misiones/` y referenciala con una ruta relativa al `.md`:

```yaml
imagen: '../../assets/misiones/mi-proyecto.webp'
imagenAlt: 'Pantalla principal de la app con el listado de turnos'
```

- Formato recomendado: horizontal 16:9, de al menos 1600 × 900 px, en JPG, PNG, WebP o AVIF.
- Si la imagen es vertical, por ejemplo un celular, agregale a los costados el mismo fondo hasta llegar a 1,9:1 (por ejemplo, 2194 × 1152). Así se ve entera en la página de la misión y al compartirla en redes. Si la usás vertical, en la página de la misión se recorta casi entera.
- Sin transparencia: en la tarjeta, lo transparente deja ver el fondo difuminado. Un logo con fondo transparente conviene ponerlo sobre un fondo oscuro, como en `atupuerta.jpg`.
- Astro la optimiza y genera varios tamaños. En la tarjeta se ve entera, sobre un fondo hecho con la misma imagen difuminada. En la página de la misión se recorta a 16:9.
- La misma imagen se usa para compartir la misión en redes.
- Sin imagen, se muestra el nombre en clave con el brillo del color de energía.

Si un campo falta o tiene un formato inválido, `npm run dev` y `npm run build` muestran el error con el archivo y el campo.

## Cambiar fondos

El inicio, Entrenamiento y Contacto aceptan una imagen de fondo opcional. Para agregarla, guardá en `src/assets/fondos/` un archivo con el nombre de la sección: `hero`, `entrenamiento` o `contacto`, en `.jpg`, `.png`, `.webp` o `.avif`. Por ejemplo, `hero.jpg`.

- **Qué pasa sola**:
  - `src/utils/fondos.ts` detecta el archivo y Astro lo optimiza.
  - La sección le pone un velo oscuro para que el texto se lea, y las estrellas quedan por encima.
  - Sin archivo, la sección muestra solo el campo estelar. Para sacar un fondo, borrá el archivo.
- **Qué imagen usar**: oscura y de al menos 1920 px de ancho.
- Si agregás el archivo con `npm run dev` corriendo y no aparece, reinicialo.

## Personajes de Contacto

En pantallas de 1200 px o más, a la derecha de Contacto aparece un personaje animado que cambia con el color de energía: Darth Vader con la roja, Obi-Wan Kenobi con la azul, Yoda con la verde y Mace Windu con la violeta.

Cada uno es un archivo de `src/assets/personajes/` con el nombre de la energía: `rojo.webp`, `azul.webp`, `verde.webp` y `violeta.webp`. Para cambiar un personaje, reemplazá su archivo.

- **Qué pasa sola**:
  - `src/utils/personajes.ts` detecta el archivo y Astro genera dos versiones livianas, de 708 y 944 px de alto.
  - El navegador descarga solo el personaje de la energía activa, cuando la sección se acerca a la pantalla. En celulares y tablets no se muestra ni se descarga.
  - Al cambiar de energía, el personaje se desvanece y aparece el del nuevo color.
  - Sin archivo, esa energía no muestra personaje. Para sacar uno, borrá el archivo.
  - Con "reducir movimiento" se ve un cuadro quieto.
- **Qué imagen usar**:
  - WebP animado con fondo transparente, de 1180 px de alto.
  - De ancho, lo que ocupe el personaje: Vader mide 630 y Obi-Wan, con el sable extendido, 800. No pases de 800: lo que pasa de 700 se extiende hacia la izquierda, sobre el espacio libre que queda hasta el texto. Si necesita más, achicalo.
  - Los pies a la misma altura que los demás, a unos 56 px del borde de abajo del lienzo, y una escala parecida, para que el cambio de color no salte. Yoda es la excepción: está saltando, así que flota un poco más arriba.
  - Un loop corto, como los 4 s del de Vader. Cuanto más largo, más pesa.
- La primera vez que se pide con `npm run dev`, puede tardar unos segundos en aparecer, porque Astro la procesa en ese momento. Si agregás el archivo con `npm run dev` corriendo y no aparece, reinicialo.

## Cambiar fuentes

Las fuentes se autoalojan con la [Fonts API de Astro](https://docs.astro.build/en/guides/fonts/):

- Se descargan una sola vez y se sirven desde el mismo sitio, con `font-display: swap`.
- Astro genera fuentes de respaldo con métricas ajustadas, así el texto no salta mientras cargan.

| Rol (en `tokens.css`) | Fuente                          | Dónde se usa                                       |
| --------------------- | ------------------------------- | -------------------------------------------------- |
| `--font-titulo`       | Syncopate                       | Títulos de sección y de misión, nombre en la barra |
| `--font-cuerpo`       | Archivo                         | Textos y botones                                   |
| `--font-mono`         | JetBrains Mono                  | Etiquetas, menú y pie                              |
| `--font-saga`         | Star Jedi (respaldo: Syncopate) | Solo el nombre del inicio y la intro               |

- **Cambiar una fuente de Fontsource**, por ejemplo Syncopate por otra:
  - En `astro.config.mjs`, dentro de `fonts`, cambiá `name` por la familia nueva tal como figura en [fontsource.org](https://fontsource.org), y ajustá los `weights` y `styles`.
  - Si cambiás el `cssVariable`, actualizalo también en `src/styles/tokens.css` y en los `<Font>` de `src/layouts/Base.astro`.
- **Asignar otra fuente a un rol**: editá la variable en `src/styles/tokens.css`, por ejemplo `--font-titulo`.
- **Star Jedi** es un archivo local, `src/assets/fonts/starjedi.woff2`. Para usar otra fuente local, poné su `.woff2` en esa carpeta y cambiá la ruta en `astro.config.mjs`.
- **Precarga**: en `src/layouts/Base.astro`, `preload` decide qué fuentes se piden primero. Conviene precargar solo las que se ven apenas entra la página.

## Build y publicación

```bash
npm run build     # revisa tipos y genera dist/
npm run preview   # sirve dist/ en http://localhost:4321
```

`dist/` es el sitio completo y estático. Se puede subir a cualquier hosting estático: Netlify, Vercel, Cloudflare Pages o GitHub Pages.

Antes de publicar, revisá las dos constantes del principio de **`astro.config.mjs`**:

- `SITIO` es la URL pública. La actual (`https://s4nti21.github.io`) es **provisoria**. Se usa en las URLs canónicas, el sitemap, `robots.txt` y las imágenes para redes.
- `BASE` es la subcarpeta desde la que se sirve el sitio:
  - `'/'` sirve para un dominio propio, Netlify, Vercel o GitHub Pages de usuario (`s4nti21.github.io`).
  - Para GitHub Pages de proyecto, usá el nombre del repo, por ejemplo `'/portafolio'`.
  - Los links internos se adaptan solos.

Otros detalles:

- La página 404 se genera como `dist/404.html`, y la mayoría de los hostings la usa automáticamente.
- La imagen para compartir en redes es `public/og.png` (1200 × 630). Los íconos también están en `public/`: `favicon.svg`, `favicon.ico` y `apple-touch-icon.png`.
- `/intro/` es un extra y no una página de contenido: no aparece en el sitemap y lleva `noindex`.

## La intro

- En la home se muestra sola **una vez por sesión**, porque queda guardado en `sessionStorage`. Para verla de nuevo, usá "▶ Ver intro" en el pie o abrí el sitio en una pestaña nueva.
- Se cierra con "Saltar intro →", `Esc` o `Enter`.
- `/intro/` la muestra sola y termina con "Ver de nuevo" e "Ir al portafolio".
- Si el sistema tiene activado "reducir movimiento", se muestra una versión estática.

## Créditos

- **Syncopate, Archivo y JetBrains Mono**: licencia SIL Open Font License, vía Fontsource.
- **Star Jedi**: © 1998 Boba Fonts (Davide Canavero), distribuida como freeware para uso personal. Si el sitio pasara a tener uso comercial, revisá la licencia o cambiala por otra fuente.
- **Star Wars**: es una marca registrada de Lucasfilm Ltd. Este es un proyecto personal sin fines comerciales, inspirado en la saga.
- **Personajes de Contacto**: Darth Vader, Obi-Wan Kenobi, Yoda, Mace Windu y los demás personajes de la saga son propiedad de Lucasfilm Ltd. Si el sitio pasara a tener uso comercial, reemplazalos por imágenes propias o con licencia.
