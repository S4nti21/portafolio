/**
 * Campo estelar de fondo: réplica de la lógica del canvas de "Portafolio v3".
 *
 * - 3 capas con cantidad máxima, densidad (px² por estrella), tamaño, velocidad con el
 *   scroll, deriva por segundo y paralaje con el mouse propios.
 * - Titileo con seno por estrella y tintes cálidos/fríos.
 * - Scroll y mouse suavizados (lerp 0.1 y 0.05).
 * - Estrella fugaz cada 7–17 s.
 * - devicePixelRatio con tope en 1.75.
 * - Se pausa con la pestaña oculta y mientras la intro está abierta.
 * - Con prefers-reduced-motion dibuja un solo cuadro estático.
 */

import { INTRO_ABIERTA, INTRO_CERRADA } from './eventos';

interface ConfigCapa {
  /** Cantidad máxima de estrellas. */
  readonly max: number;
  /** Densidad: px² de pantalla por estrella. */
  readonly densidad: number;
  /** Lado del punto, en px. */
  readonly tamano: number;
  /** Desplazamiento por cada px de scroll. */
  readonly velocidadScroll: number;
  /** Deriva constante, en px por segundo. */
  readonly deriva: number;
  /** Desplazamiento máximo por paralaje con el mouse, en px. */
  readonly paralaje: number;
}

interface Estrella {
  /** Posición normalizada (0–1). */
  readonly x: number;
  readonly y: number;
  /** Fase y velocidad del titileo. */
  readonly fase: number;
  readonly titileo: number;
  /** Opacidad base. */
  readonly alfa: number;
}

interface Capa extends ConfigCapa {
  /** Estrellas agrupadas por tinte (índice de TINTES_UNICOS). */
  readonly porTinte: readonly (readonly Estrella[])[];
  /** Estrellas visibles según el tamaño de la pantalla, agrupadas por tinte. */
  visibles: Estrella[][];
}

interface EstrellaFugaz {
  readonly inicio: number;
  readonly x: number;
  readonly y: number;
  readonly angulo: number;
  readonly largo: number;
  readonly velocidad: number;
}

const CAPAS: readonly ConfigCapa[] = [
  { max: 600, densidad: 3000, tamano: 0.8, velocidadScroll: 0.06, deriva: 1.5, paralaje: 8 },
  { max: 260, densidad: 7000, tamano: 1.2, velocidadScroll: 0.18, deriva: 4, paralaje: 18 },
  { max: 90, densidad: 18000, tamano: 1.8, velocidadScroll: 0.38, deriva: 8, paralaje: 34 },
];

/** Tintes posibles: el blanco cálido aparece 3 de cada 5 veces, como en v3. */
const TINTES_UNICOS = ['255,246,236', '210,225,255', '255,226,200'] as const;
const SORTEO_TINTES = [0, 0, 0, 1, 2] as const;

const DPR_MAXIMO = 1.75;
const PASO_MAXIMO = 0.05;
const SUAVIZADO_SCROLL = 0.1;
const SUAVIZADO_MOUSE = 0.05;
const ALFA_ESTATICO = 0.85;
const DURACION_FUGAZ = 1.1;
const PRIMERA_FUGAZ = 5;

function crearCapa(config: ConfigCapa): Capa {
  const porTinte: Estrella[][] = TINTES_UNICOS.map(() => []);
  for (let i = 0; i < config.max; i++) {
    const tinte = SORTEO_TINTES[Math.floor(Math.random() * SORTEO_TINTES.length)] ?? 0;
    porTinte[tinte]?.push({
      x: Math.random(),
      y: Math.random(),
      fase: Math.random() * 6.28,
      titileo: 0.3 + Math.random() * 1.6,
      alfa: 0.35 + Math.random() * 0.65,
    });
  }
  return { ...config, porTinte, visibles: porTinte.map(() => []) };
}

/** Módulo positivo (el % de JS conserva el signo). */
function envolver(valor: number, limite: number): number {
  return ((valor % limite) + limite) % limite;
}

class CampoEstelar {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly capas: Capa[];
  private readonly consultaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');

  private ancho = 0;
  private alto = 0;
  private reducido = this.consultaMovimiento.matches;
  private pausadoPorIntro = false;
  private idFrame = 0;
  private ultimo = 0;
  /** Tiempo de animación en segundos (solo avanza mientras corre el loop). */
  private tiempo = 0;
  private scrollY = window.scrollY;
  private scrollSuave = window.scrollY;
  private mouseX = 0;
  private mouseY = 0;
  private mouseSuaveX = 0;
  private mouseSuaveY = 0;
  private fugaz: EstrellaFugaz | null = null;
  private proximaFugaz = PRIMERA_FUGAZ;
  private redimensionPendiente = true;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.capas = CAPAS.map(crearCapa);
  }

  iniciar(): void {
    window.addEventListener('resize', this.alRedimensionar, { passive: true });
    window.addEventListener('scroll', this.alScrollear, { passive: true });
    window.addEventListener('pointermove', this.alMoverPuntero, { passive: true });
    document.addEventListener('visibilitychange', this.alCambiarVisibilidad);
    document.addEventListener(INTRO_ABIERTA, this.alAbrirIntro);
    document.addEventListener(INTRO_CERRADA, this.alCerrarIntro);
    this.consultaMovimiento.addEventListener('change', this.alCambiarMovimiento);
    this.pausadoPorIntro = document.documentElement.dataset.intro === 'abierta';
    this.arrancar();
  }

  /** Arranca el loop, o dibuja el cuadro estático si hay movimiento reducido. */
  private arrancar(): void {
    this.detener();
    if (this.reducido) {
      this.dibujarEstatico();
      return;
    }
    if (document.hidden || this.pausadoPorIntro) return;
    this.ultimo = performance.now();
    this.idFrame = requestAnimationFrame(this.cuadro);
  }

  private detener(): void {
    cancelAnimationFrame(this.idFrame);
    this.idFrame = 0;
  }

  private readonly cuadro = (ahora: number): void => {
    this.idFrame = requestAnimationFrame(this.cuadro);
    const paso = Math.min(PASO_MAXIMO, (ahora - this.ultimo) / 1000);
    this.ultimo = ahora;
    this.tiempo += paso;
    this.scrollSuave += (this.scrollY - this.scrollSuave) * SUAVIZADO_SCROLL;
    this.mouseSuaveX += (this.mouseX - this.mouseSuaveX) * SUAVIZADO_MOUSE;
    this.mouseSuaveY += (this.mouseY - this.mouseSuaveY) * SUAVIZADO_MOUSE;
    this.dibujar(false);
  };

  private dibujarEstatico(): void {
    this.dibujar(true);
  }

  /** Ajusta el buffer del canvas al tamaño en pantalla y recalcula las estrellas visibles. */
  private ajustarTamano(): boolean {
    const ancho = this.canvas.clientWidth;
    const alto = this.canvas.clientHeight;
    if (!ancho || !alto) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAXIMO);
    this.canvas.width = Math.round(ancho * dpr);
    this.canvas.height = Math.round(alto * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ancho = ancho;
    this.alto = alto;
    const area = ancho * alto;
    for (const capa of this.capas) {
      // Mantiene la proporción por tinte: toma de cada grupo la fracción que corresponde.
      const fraccion = Math.min(capa.max, Math.round(area / capa.densidad)) / capa.max;
      capa.visibles = capa.porTinte.map((grupo) =>
        grupo.slice(0, Math.round(grupo.length * fraccion)),
      );
    }
    this.redimensionPendiente = false;
    return true;
  }

  private dibujar(estatico: boolean): void {
    if (this.redimensionPendiente && !this.ajustarTamano()) return;
    const { ctx, ancho, alto, tiempo } = this;
    ctx.clearRect(0, 0, ancho, alto);

    const scroll = estatico ? 0 : this.scrollSuave;
    const mouseX = estatico ? 0 : this.mouseSuaveX;
    const mouseY = estatico ? 0 : this.mouseSuaveY;

    this.capas.forEach((capa, indiceCapa) => {
      const desplazamiento = scroll * capa.velocidadScroll + tiempo * capa.deriva;
      const paralajeX = -mouseX * capa.paralaje;
      const paralajeY = -mouseY * capa.paralaje;
      const lado = capa.tamano;
      const conHalo = indiceCapa === CAPAS.length - 1;

      capa.visibles.forEach((grupo, indiceTinte) => {
        ctx.fillStyle = `rgb(${TINTES_UNICOS[indiceTinte] ?? TINTES_UNICOS[0]})`;
        for (const estrella of grupo) {
          const y = envolver(estrella.y * alto - desplazamiento + paralajeY, alto);
          const x = envolver(estrella.x * ancho + paralajeX, ancho);
          const alfa = estatico
            ? estrella.alfa * ALFA_ESTATICO
            : estrella.alfa *
              (0.55 + 0.45 * Math.sin(tiempo * estrella.titileo * 2 + estrella.fase));
          ctx.globalAlpha = alfa;
          ctx.fillRect(x - lado / 2, y - lado / 2, lado, lado);
          // Las estrellas grandes y más brillantes llevan un halo suave.
          if (conHalo && estrella.alfa > 0.85) {
            ctx.globalAlpha = alfa * 0.12;
            ctx.fillRect(x - 3, y - 3, 6, 6);
          }
        }
      });
    });
    ctx.globalAlpha = 1;

    if (!estatico) this.dibujarFugaz();
  }

  private dibujarFugaz(): void {
    const { ctx, ancho, alto, tiempo } = this;
    if (!this.fugaz && tiempo > this.proximaFugaz) {
      this.fugaz = {
        inicio: tiempo,
        x: ancho * (0.3 + Math.random() * 0.65),
        y: alto * Math.random() * 0.35,
        angulo: Math.PI * (0.76 + Math.random() * 0.1),
        largo: 110 + Math.random() * 120,
        velocidad: ancho * 0.45 + 260,
      };
    }
    const fugaz = this.fugaz;
    if (!fugaz) return;

    const progreso = (tiempo - fugaz.inicio) / DURACION_FUGAZ;
    if (progreso > 1 || progreso < 0) {
      this.fugaz = null;
      this.proximaFugaz = tiempo + 7 + Math.random() * 10;
      return;
    }
    const coseno = Math.cos(fugaz.angulo);
    const seno = Math.sin(fugaz.angulo);
    const recorrido = progreso * fugaz.velocidad;
    const cabezaX = fugaz.x + coseno * recorrido;
    const cabezaY = fugaz.y + seno * recorrido;
    const colaX = cabezaX - coseno * fugaz.largo;
    const colaY = cabezaY - seno * fugaz.largo;

    const degradado = ctx.createLinearGradient(cabezaX, cabezaY, colaX, colaY);
    degradado.addColorStop(0, `rgba(255,248,240,${Math.sin(progreso * Math.PI).toFixed(3)})`);
    degradado.addColorStop(1, 'rgba(255,248,240,0)');
    ctx.strokeStyle = degradado;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cabezaX, cabezaY);
    ctx.lineTo(colaX, colaY);
    ctx.stroke();
  }

  private readonly alRedimensionar = (): void => {
    this.redimensionPendiente = true;
    // Con movimiento reducido no hay loop: se redibuja el cuadro estático.
    if (this.reducido) this.dibujarEstatico();
  };

  private readonly alScrollear = (): void => {
    this.scrollY = window.scrollY;
  };

  private readonly alMoverPuntero = (evento: PointerEvent): void => {
    this.mouseX = evento.clientX / window.innerWidth - 0.5;
    this.mouseY = evento.clientY / window.innerHeight - 0.5;
  };

  private readonly alCambiarVisibilidad = (): void => {
    if (document.hidden) this.detener();
    else this.arrancar();
  };

  private readonly alAbrirIntro = (): void => {
    this.pausadoPorIntro = true;
    this.detener();
  };

  private readonly alCerrarIntro = (): void => {
    this.pausadoPorIntro = false;
    this.arrancar();
  };

  private readonly alCambiarMovimiento = (evento: MediaQueryListEvent): void => {
    this.reducido = evento.matches;
    this.arrancar();
  };
}

/** Busca el canvas del campo estelar y lo pone en marcha. */
export function iniciarCampoEstelar(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-campo-estelar]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  new CampoEstelar(canvas, ctx).iniciar();
}
