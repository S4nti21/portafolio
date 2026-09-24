/** Base del sitio definida en astro.config.mjs (por ejemplo '/' o '/portafolio'). */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Devuelve una ruta interna con la base del sitio aplicada, para que los links
 * funcionen tanto en la raíz del dominio como en una subcarpeta.
 *
 * @example ruta('/misiones/orbita') // '/misiones/orbita' o '/portafolio/misiones/orbita'
 * @example ruta('/#contacto') // '/#contacto' o '/portafolio/#contacto'
 */
export function ruta(camino = '/'): string {
  return `${BASE}${camino.startsWith('/') ? camino : `/${camino}`}`;
}
