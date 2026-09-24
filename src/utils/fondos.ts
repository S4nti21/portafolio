import type { ImageMetadata } from 'astro';

/** Secciones que aceptan una imagen de fondo opcional. */
export type NombreFondo = 'hero' | 'entrenamiento' | 'contacto';

/*
 * Busca en src/assets/fondos/ archivos llamados como la sección (hero.jpg,
 * contacto.webp, …). Si no hay archivo, la sección muestra solo las estrellas.
 */
const archivos = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/fondos/*.{avif,jpg,jpeg,png,webp}',
  { eager: true },
);

export function obtenerFondo(nombre: NombreFondo): ImageMetadata | undefined {
  for (const [ruta, modulo] of Object.entries(archivos)) {
    const archivo = ruta.slice(ruta.lastIndexOf('/') + 1);
    if (archivo.slice(0, archivo.lastIndexOf('.')) === nombre) return modulo.default;
  }
  return undefined;
}
