/**
 * Selector de energía: cambia --acc/--accrgb en todo el sitio a través del atributo
 * data-energia de <html>, recuerda la elección en localStorage y avisa del cambio con
 * el evento ENERGIA_CAMBIADA.
 * El color guardado ya lo aplica el script inline del <head> antes del primer pintado;
 * acá solo se sincronizan los radios y se escuchan los cambios.
 */
import { CLAVE_ENERGIA, ENERGIA_POR_DEFECTO, esEnergia, type Energia } from '../data/energias';
import { ENERGIA_CAMBIADA } from './eventos';

/** Energía activa, según el atributo data-energia de <html> (azul si todavía no hay). */
export function energiaActual(): Energia {
  const valor = document.documentElement.dataset.energia;
  return esEnergia(valor) ? valor : ENERGIA_POR_DEFECTO;
}

function aplicarEnergia(energia: Energia): void {
  document.documentElement.dataset.energia = energia;
  try {
    localStorage.setItem(CLAVE_ENERGIA, energia);
  } catch {
    // Sin almacenamiento disponible: la elección dura solo esta visita.
  }
  document.dispatchEvent(new CustomEvent(ENERGIA_CAMBIADA, { detail: energia }));
}

export function iniciarSelectorEnergia(): void {
  const actual = energiaActual();
  const radios = document.querySelectorAll<HTMLInputElement>(
    '[data-selector-energia] input[type="radio"]',
  );
  for (const radio of radios) {
    radio.checked = radio.value === actual;
    radio.addEventListener('change', () => {
      if (radio.checked && esEnergia(radio.value)) aplicarEnergia(radio.value);
    });
  }
}
