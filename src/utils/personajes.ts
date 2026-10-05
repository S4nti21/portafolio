import type { ImageMetadata } from 'astro';
import { ENERGIAS, type Energia } from '../data/energias';

export interface Personaje {
  energia: Energia;
  imagen: ImageMetadata;
}

/*
 * Busca en src/assets/personajes/ archivos llamados como la energía (rojo.webp,
 * azul.webp, …). Si una energía no tiene archivo, Contacto no muestra personaje con ella.
 */
const archivos = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/personajes/*.{gif,png,webp}',
  { eager: true },
);

/** Personajes disponibles, en el orden del selector de energía. */
export function obtenerPersonajes(): Personaje[] {
  const porNombre = new Map<string, ImageMetadata>();
  for (const [ruta, modulo] of Object.entries(archivos)) {
    const archivo = ruta.slice(ruta.lastIndexOf('/') + 1);
    porNombre.set(archivo.slice(0, archivo.lastIndexOf('.')), modulo.default);
  }
  return ENERGIAS.flatMap(({ id }) => {
    const imagen = porNombre.get(id);
    return imagen ? [{ energia: id, imagen }] : [];
  });
}
