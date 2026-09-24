import { getCollection, type CollectionEntry } from 'astro:content';

export type Mision = CollectionEntry<'misiones'>;

/**
 * Misiones ordenadas por `orden`. Los borradores se ven solo en desarrollo,
 * así podés previsualizarlos sin publicarlos.
 */
export async function obtenerMisiones(): Promise<Mision[]> {
  const misiones = await getCollection(
    'misiones',
    ({ data }) => import.meta.env.DEV || !data.borrador,
  );
  return misiones.sort((a, b) => a.data.orden - b.data.orden);
}

/** Número con dos dígitos según la posición en la lista: 0 → "01". */
export function numeroMision(indice: number): string {
  return String(indice + 1).padStart(2, '0');
}

/** Texto alternativo de la imagen de una misión. */
export function altImagen(mision: Mision): string {
  return mision.data.imagenAlt ?? `Captura del proyecto ${mision.data.titulo}`;
}
