import type { Energia } from '../data/energias';

/**
 * Eventos que se emiten sobre `document` para que otras piezas reaccionen:
 * - La intro avisa cuando se abre y se cierra (por ejemplo, el campo estelar se pausa
 *   mientras está abierta).
 * - El selector de energía avisa cuando cambia el color (el personaje de Contacto cambia
 *   con él).
 */
export const INTRO_ABIERTA = 'intro:abierta';
export const INTRO_CERRADA = 'intro:cerrada';
export const ENERGIA_CAMBIADA = 'energia:cambiada';

declare global {
  interface DocumentEventMap {
    [INTRO_ABIERTA]: Event;
    [INTRO_CERRADA]: Event;
    [ENERGIA_CAMBIADA]: CustomEvent<Energia>;
  }
}
