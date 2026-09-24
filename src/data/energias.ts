/**
 * Colores de energía disponibles en el selector de la nav.
 * Los valores de color (hex y RGB) viven en src/styles/tokens.css.
 */
export const ENERGIAS = [
  { id: 'rojo', etiqueta: 'Energía roja' },
  { id: 'azul', etiqueta: 'Energía azul' },
  { id: 'verde', etiqueta: 'Energía verde' },
  { id: 'violeta', etiqueta: 'Energía violeta' },
] as const;

export type Energia = (typeof ENERGIAS)[number]['id'];

export const ENERGIA_POR_DEFECTO: Energia = 'azul';

/** Clave de localStorage donde se guarda la energía elegida. */
export const CLAVE_ENERGIA = 'energia';

export function esEnergia(valor: unknown): valor is Energia {
  return ENERGIAS.some((energia) => energia.id === valor);
}
