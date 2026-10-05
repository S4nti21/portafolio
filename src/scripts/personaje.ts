/**
 * Personaje de Contacto: cada energía tiene el suyo (rojo → Darth Vader, azul → Obi-Wan,
 * verde → Yoda, violeta → Mace Windu).
 *
 * - Las imágenes esperan en <template>, así el navegador no descarga ninguna de entrada.
 * - Se inserta solo la de la energía activa, cuando el escenario se acerca a la pantalla.
 *   Por debajo de 75em el escenario está oculto: el observador nunca dispara y no se
 *   descarga nada.
 * - Al cambiar de energía, el personaje se desvanece y aparece el nuevo. Si la energía no
 *   tiene personaje, el espacio queda vacío.
 * - Con prefers-reduced-motion se muestra el primer cuadro quieto, dibujado en un canvas.
 */

import type { Energia } from '../data/energias';
import { energiaActual } from './energia';
import { ENERGIA_CAMBIADA } from './eventos';

/** Distancia a la pantalla desde la que se empieza a cargar el personaje. */
const MARGEN_CARGA = '300px 0px';
/** Lo que dura el fundido de salida en el CSS, en ms. */
const DURACION_SALIDA_MS = 600;
/** Tope de densidad para el canvas quieto (las versiones más grandes miden 944 px de alto). */
const DPR_MAXIMO = 2;

/** Copia el cuadro de una imagen recién cargada (el primero) en un canvas. */
function congelar(imagen: HTMLImageElement): HTMLCanvasElement {
  const escala = Math.min(window.devicePixelRatio || 1, DPR_MAXIMO);
  const lienzo = document.createElement('canvas');
  lienzo.className = imagen.className;
  lienzo.width = Math.round(imagen.naturalWidth * escala);
  lienzo.height = Math.round(imagen.naturalHeight * escala);
  // Con medidas explícitas: con srcset, naturalWidth viene corregido por densidad y no
  // coincide con los píxeles del archivo elegido, que es lo que dibujaría drawImage solo.
  lienzo.getContext('2d')?.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  return lienzo;
}

class Personaje {
  private readonly escenario: HTMLElement;
  private readonly consultaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  /** Si el escenario está cerca de la pantalla. */
  private cerca = false;
  /** Energía del personaje que se ve o se está cargando (null: ninguno). */
  private energia: Energia | null = null;
  /** Lo que está en pantalla: la imagen animada o el canvas quieto. */
  private pieza: HTMLElement | null = null;
  /** Número del último pedido: las cargas de pedidos anteriores se descartan. */
  private pedido = 0;

  constructor(escenario: HTMLElement) {
    this.escenario = escenario;
  }

  iniciar(): void {
    document.addEventListener(ENERGIA_CAMBIADA, this.alCambiarEnergia);
    this.consultaMovimiento.addEventListener('change', this.alCambiarMovimiento);
    if (!('IntersectionObserver' in window)) {
      this.cerca = true;
      void this.mostrar(energiaActual());
      return;
    }
    new IntersectionObserver(this.alCruzar, { rootMargin: MARGEN_CARGA }).observe(this.escenario);
  }

  private async mostrar(energia: Energia): Promise<void> {
    if (energia === this.energia) return;
    const pedido = ++this.pedido;
    this.energia = energia;
    this.retirar();

    const imagen = this.crearImagen(energia);
    if (!imagen) return;
    const quieto = this.consultaMovimiento.matches;
    // La animada carga en su lugar, invisible; la quieta solo se usa para dibujar el canvas.
    if (!quieto) this.escenario.append(imagen);
    try {
      await imagen.decode();
    } catch {
      // No se pudo cargar: el espacio queda vacío y se reintenta al volver a acercarse.
      imagen.remove();
      if (pedido === this.pedido) this.energia = null;
      return;
    }
    if (pedido !== this.pedido) {
      imagen.remove();
      return;
    }

    const pieza = quieto ? congelar(imagen) : imagen;
    if (quieto) this.escenario.append(pieza);
    this.pieza = pieza;
    // Un cuadro después, para que el fundido arranque desde opacidad 0.
    requestAnimationFrame(() => {
      if (this.pieza === pieza) pieza.dataset.visible = '';
    });
  }

  /** Copia la imagen del <template> de esa energía (null si no tiene personaje). */
  private crearImagen(energia: Energia): HTMLImageElement | null {
    const plantilla = this.escenario.querySelector<HTMLTemplateElement>(
      `template[data-energia="${energia}"]`,
    );
    const original = plantilla?.content.firstElementChild;
    if (!original) return null;
    const imagen = document.importNode(original, true);
    return imagen instanceof HTMLImageElement ? imagen : null;
  }

  /** Desvanece lo que está en pantalla y lo saca cuando termina el fundido. */
  private retirar(): void {
    const pieza = this.pieza;
    this.pieza = null;
    if (!pieza) return;
    delete pieza.dataset.visible;
    window.setTimeout(() => pieza.remove(), DURACION_SALIDA_MS);
  }

  /** Saca el personaje y descarta las cargas en curso. */
  private olvidar(): void {
    this.pedido++;
    this.energia = null;
    this.retirar();
  }

  private readonly alCruzar = (entradas: IntersectionObserverEntry[]): void => {
    this.cerca = entradas.at(-1)?.isIntersecting ?? false;
    if (this.cerca) void this.mostrar(energiaActual());
  };

  private readonly alCambiarEnergia = (evento: CustomEvent<Energia>): void => {
    if (this.cerca) {
      void this.mostrar(evento.detail);
      return;
    }
    // Lejos de la pantalla: el personaje viejo se va y el nuevo carga al volver.
    this.olvidar();
  };

  private readonly alCambiarMovimiento = (): void => {
    this.olvidar();
    if (this.cerca) void this.mostrar(energiaActual());
  };
}

/** Busca el escenario del personaje y lo pone en marcha. */
export function iniciarPersonaje(): void {
  const escenario = document.querySelector<HTMLElement>('[data-personaje]');
  if (escenario) new Personaje(escenario).iniciar();
}
