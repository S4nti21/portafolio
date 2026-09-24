/**
 * Hojas de energía: arrancan apagadas (scaleX(0)) y se encienden al entrar en pantalla.
 * El estado encendido es el atributo data-encendida; la animación la resuelve el CSS.
 */

const UMBRAL_VISIBLE = 0.3;
const RETRASO_REENCENDIDO_MS = 250;

const movimientoReducido = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function encender(hoja: HTMLElement): void {
  hoja.dataset.encendida = '';
}

export function iniciarHojas(): void {
  const hojas = document.querySelectorAll<HTMLElement>('[data-hoja]');
  if (movimientoReducido() || !('IntersectionObserver' in window)) {
    hojas.forEach(encender);
    return;
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting || !(entrada.target instanceof HTMLElement)) continue;
        encender(entrada.target);
        observador.unobserve(entrada.target);
      }
    },
    { threshold: UMBRAL_VISIBLE },
  );
  hojas.forEach((hoja) => observador.observe(hoja));
}

/** Apaga la hoja al instante y la vuelve a encender (se usa al cerrar la intro). */
export function reencenderHoja(hoja: HTMLElement): void {
  if (movimientoReducido()) return;
  hoja.style.transition = 'none';
  delete hoja.dataset.encendida;
  // Fuerza el cálculo de estilos para que el apagado no se anime.
  void hoja.offsetWidth;
  hoja.style.transition = '';
  window.setTimeout(() => encender(hoja), RETRASO_REENCENDIDO_MS);
}
