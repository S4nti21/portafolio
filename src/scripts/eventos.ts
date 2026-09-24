/**
 * Eventos que la intro emite sobre `document` para que otras piezas reaccionen
 * (por ejemplo, el campo estelar se pausa mientras la intro está abierta).
 */
export const INTRO_ABIERTA = 'intro:abierta';
export const INTRO_CERRADA = 'intro:cerrada';

declare global {
  interface DocumentEventMap {
    [INTRO_ABIERTA]: Event;
    [INTRO_CERRADA]: Event;
  }
}
