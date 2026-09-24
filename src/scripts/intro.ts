/**
 * Intro con texto en perspectiva (réplica de la línea de tiempo de "Intro" en v3).
 *
 * - Modo "superpuesta": overlay de la home. Se abre sola una vez por sesión (lo decide
 *   un script inline antes del primer pintado) o con el botón "▶ Ver intro".
 * - Modo "sola": página /intro. Al terminar muestra "Fin de la intro".
 *
 * El nombre que se aleja se dibuja en el canvas: si fuera texto HTML, al aparecer grande
 * a los ~5 s Chrome lo tomaría como Largest Contentful Paint y empeoraría la métrica.
 * El texto del crawl sí es HTML (se lee con lectores de pantalla).
 */
import { INTRO_ABIERTA, INTRO_CERRADA } from './eventos';
import { reencenderHoja } from './hojas';

type Modo = 'superpuesta' | 'sola';

interface EstrellaIntro {
  readonly x: number;
  readonly y: number;
  readonly lado: number;
  readonly alfa: number;
  readonly fase: number;
  readonly titileo: number;
}

/** Clave de sessionStorage: la intro se muestra sola una vez por sesión. */
export const CLAVE_INTRO_VISTA = 'intro-vista';

/** Línea de tiempo en segundos (idéntica a v3). */
const TIEMPOS = {
  lineaEntra: 0.3,
  lineaFundido: 0.9,
  lineaSale: 3.9,
  nombreEntra: 4.9,
  nombreFundido: 0.25,
  nombreViaje: 7.5,
  crawlEntra: 6.2,
  crawlFundido: 0.8,
  crawlViaje: 17,
  fundidoFinal: 22.6,
  fundidoFinalDura: 0.9,
  fin: 23.5,
} as const;

const CANTIDAD_ESTRELLAS = 520;
const DPR_MAXIMO = 1.75;
const PASO_MAXIMO = 0.1;
const ALFA_ESTATICO = 0.85;
const COLOR_FONDO = '#030308';
const COLOR_ESTRELLA = 'rgb(255,246,236)';
/**
 * Opacidad mínima del crawl mientras corre la intro. Con la perspectiva, al arrancar parte del
 * texto queda detrás de la "cámara" y Chrome le calcula un tamaño de pantalla completa: si se
 * pintara recién a los 6 s, contaría como un LCP tardío. Así se pinta (invisible, fuera de
 * pantalla) desde el primer cuadro.
 */
const OPACIDAD_MINIMA_CRAWL = 0.01;

const limitar = (valor: number): number => Math.max(0, Math.min(1, valor));
const envolver = (valor: number, limite: number): number => ((valor % limite) + limite) % limite;

function crearEstrellas(): EstrellaIntro[] {
  return Array.from({ length: CANTIDAD_ESTRELLAS }, () => {
    const sorteo = Math.random();
    return {
      x: Math.random(),
      y: Math.random(),
      lado: sorteo < 0.1 ? 1.8 : Math.random() < 0.4 ? 1.2 : 0.8,
      alfa: 0.35 + Math.random() * 0.65,
      fase: Math.random() * 6.28,
      titileo: 0.4 + Math.random() * 1.5,
    };
  });
}

class Intro {
  private readonly consultaMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)');
  private readonly estrellas = crearEstrellas();
  private readonly lineasNombre: string[];

  private ancho = 0;
  private alto = 0;
  private altoCrawl = 0;
  private tiempo = 0;
  private ultimo = 0;
  private idFrame = 0;
  private terminada = false;
  private familiaNombre = 'sans-serif';
  private colorNombre = '#ffc83d';

  constructor(
    private readonly raiz: HTMLElement,
    private readonly modo: Modo,
    private readonly canvas: HTMLCanvasElement,
    private readonly ctx: CanvasRenderingContext2D,
    private readonly linea: HTMLElement,
    private readonly perspectiva: HTMLElement,
    private readonly crawl: HTMLElement,
    private readonly botonSaltar: HTMLButtonElement,
  ) {
    // Star Jedi en minúsculas es la versión que se parece al logo.
    this.lineasNombre = (canvas.dataset.nombre ?? '').toLocaleLowerCase('es').split(' ');
  }

  iniciar(): void {
    const estilos = getComputedStyle(document.documentElement);
    this.familiaNombre = estilos.getPropertyValue('--font-saga').trim() || 'sans-serif';
    this.colorNombre = getComputedStyle(this.raiz).color;

    window.addEventListener('resize', this.alRedimensionar, { passive: true });
    document.addEventListener('visibilitychange', this.alCambiarVisibilidad);
    document.addEventListener('keydown', this.alPresionarTecla);
    this.botonSaltar.addEventListener('click', () => this.terminar());
    this.raiz
      .querySelectorAll<HTMLButtonElement>('[data-intro-cerrar]')
      .forEach((boton) => boton.addEventListener('click', () => this.terminar()));
    this.raiz
      .querySelector<HTMLButtonElement>('[data-intro-repetir]')
      ?.addEventListener('click', () => this.repetir());

    if (this.modo === 'superpuesta') {
      document
        .querySelectorAll<HTMLButtonElement>('[data-ver-intro]')
        .forEach((boton) => boton.addEventListener('click', () => this.abrir()));
      if (this.estaAbierta()) this.alAbrir();
    } else {
      marcarVista();
      this.reproducir();
    }
  }

  /** Relanza la intro desde el botón "▶ Ver intro". */
  private abrir(): void {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.dataset.intro = 'abierta';
    marcarVista();
    this.alAbrir();
    this.botonSaltar.focus({ preventScroll: true });
  }

  private alAbrir(): void {
    this.fijarPaginaInerte(true);
    document.dispatchEvent(new Event(INTRO_ABIERTA));
    this.reproducir();
  }

  private reproducir(): void {
    this.terminada = false;
    delete this.raiz.dataset.terminada;
    this.tiempo = 0;
    this.raiz.style.opacity = '';
    this.linea.style.opacity = '0';
    this.crawl.style.opacity = String(OPACIDAD_MINIMA_CRAWL);
    this.ajustarTamano();
    // Mientras las fuentes cargan, el primer cuadro ya muestra el cielo.
    void document.fonts.load(`48px ${this.familiaNombre}`);
    if (this.consultaMovimiento.matches) {
      this.dibujarCielo(true);
      return;
    }
    this.arrancar();
  }

  private repetir(): void {
    this.reproducir();
    this.botonSaltar.focus({ preventScroll: true });
  }

  private terminar(): void {
    if (this.terminada) return;
    this.terminada = true;
    this.detener();
    if (this.modo === 'superpuesta') {
      this.cerrar();
      return;
    }
    const teniaFoco = this.raiz.contains(document.activeElement);
    this.raiz.dataset.terminada = '';
    this.raiz.style.opacity = '';
    this.dibujarCielo(true);
    if (teniaFoco) {
      this.raiz.querySelector<HTMLButtonElement>('[data-intro-repetir]')?.focus();
    }
  }

  private cerrar(): void {
    const teniaFoco = this.raiz.contains(document.activeElement);
    delete document.documentElement.dataset.intro;
    this.raiz.style.opacity = '';
    this.fijarPaginaInerte(false);
    document.dispatchEvent(new Event(INTRO_CERRADA));
    const hojaHero = document.querySelector<HTMLElement>('[data-hoja="hero"]');
    if (hojaHero) reencenderHoja(hojaHero);
    if (teniaFoco) document.getElementById('contenido')?.focus({ preventScroll: true });
  }

  private estaAbierta(): boolean {
    return this.modo === 'sola' || document.documentElement.dataset.intro === 'abierta';
  }

  /** Mientras el overlay está abierto, el resto de la página no recibe foco ni clics. */
  private fijarPaginaInerte(inerte: boolean): void {
    for (const hijo of Array.from(document.body.children)) {
      if (hijo === this.raiz || !(hijo instanceof HTMLElement) || hijo.tagName === 'SCRIPT') {
        continue;
      }
      hijo.inert = inerte;
    }
  }

  private arrancar(): void {
    this.detener();
    if (document.hidden) return;
    this.ultimo = performance.now();
    this.idFrame = requestAnimationFrame(this.cuadro);
  }

  private detener(): void {
    cancelAnimationFrame(this.idFrame);
    this.idFrame = 0;
  }

  private readonly cuadro = (ahora: number): void => {
    this.idFrame = requestAnimationFrame(this.cuadro);
    // El reloj solo avanza mientras se ve: si la pestaña se oculta, la intro se pausa.
    this.tiempo += Math.min(PASO_MAXIMO, (ahora - this.ultimo) / 1000);
    this.ultimo = ahora;
    this.dibujarCielo(false);
    this.dibujarNombre();
    this.actualizarEscena();
  };

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
    this.perspectiva.style.perspective = `${Math.round(alto * 0.6)}px`;
    this.altoCrawl = this.crawl.offsetHeight;
    return true;
  }

  private dibujarCielo(estatico: boolean): void {
    const { ctx, ancho, alto, tiempo } = this;
    ctx.globalAlpha = 1;
    ctx.fillStyle = COLOR_FONDO;
    ctx.fillRect(0, 0, ancho, alto);
    ctx.fillStyle = COLOR_ESTRELLA;
    const deriva = estatico ? 0 : tiempo * 4;
    for (const estrella of this.estrellas) {
      ctx.globalAlpha = estatico
        ? estrella.alfa * ALFA_ESTATICO
        : estrella.alfa * (0.55 + 0.45 * Math.sin(tiempo * estrella.titileo * 2 + estrella.fase));
      const y = envolver(estrella.y * alto + deriva * estrella.lado, alto);
      ctx.fillRect(estrella.x * ancho, y, estrella.lado, estrella.lado);
    }
    ctx.globalAlpha = 1;
  }

  /** El nombre aparece grande y se aleja hasta perderse (escala 1.5 → 0.018). */
  private dibujarNombre(): void {
    const e = this.tiempo;
    if (e < TIEMPOS.nombreEntra) return;
    const viaje = limitar((e - TIEMPOS.nombreEntra) / TIEMPOS.nombreViaje);
    const opacidad =
      limitar((e - TIEMPOS.nombreEntra) / TIEMPOS.nombreFundido) *
      (1 - limitar((viaje - 0.82) / 0.18));
    if (opacidad <= 0) return;

    const { ctx } = this;
    const tamano = Math.max(48, Math.min(168, this.ancho * 0.12));
    const interlineado = tamano * 0.95;
    const primeraLinea = -((this.lineasNombre.length - 1) * interlineado) / 2;
    ctx.save();
    ctx.globalAlpha = opacidad;
    ctx.translate(this.ancho / 2, this.alto / 2);
    const escala = 1.5 * Math.pow(0.012, viaje);
    ctx.scale(escala, escala);
    ctx.font = `400 ${tamano}px ${this.familiaNombre}`;
    ctx.letterSpacing = `${(tamano * 0.06).toFixed(1)}px`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.colorNombre;
    this.lineasNombre.forEach((texto, indice) => {
      ctx.fillText(texto, 0, primeraLinea + indice * interlineado);
    });
    ctx.restore();
  }

  private actualizarEscena(): void {
    const e = this.tiempo;
    const t = TIEMPOS;
    this.linea.style.opacity = (
      limitar((e - t.lineaEntra) / t.lineaFundido) *
      (1 - limitar((e - t.lineaSale) / t.lineaFundido))
    ).toFixed(3);

    const avance = limitar((e - t.crawlEntra) / t.crawlViaje);
    this.crawl.style.opacity = Math.max(
      OPACIDAD_MINIMA_CRAWL,
      limitar((e - t.crawlEntra) / t.crawlFundido) * (1 - limitar((avance - 0.85) / 0.15)),
    ).toFixed(3);
    const recorrido = -avance * (this.alto * 1.9 + this.altoCrawl);
    this.crawl.style.transform = `translateX(-50%) rotateX(27deg) translateY(${recorrido.toFixed(1)}px)`;

    this.raiz.style.opacity = (1 - limitar((e - t.fundidoFinal) / t.fundidoFinalDura)).toFixed(3);
    if (e > t.fin) this.terminar();
  }

  private readonly alRedimensionar = (): void => {
    if (!this.estaAbierta() || !this.ajustarTamano()) return;
    if (this.terminada || this.consultaMovimiento.matches) this.dibujarCielo(true);
  };

  private readonly alCambiarVisibilidad = (): void => {
    if (document.hidden) {
      this.detener();
    } else if (this.estaAbierta() && !this.terminada && !this.consultaMovimiento.matches) {
      this.arrancar();
    }
  };

  private readonly alPresionarTecla = (evento: KeyboardEvent): void => {
    if (!this.estaAbierta() || this.terminada) return;
    if (evento.key === 'Escape') {
      this.terminar();
      return;
    }
    // Enter también cierra (como en v3), salvo sobre un botón o link: ahí actúa ese control.
    const destino = evento.target instanceof Element ? evento.target : null;
    if (evento.key === 'Enter' && !destino?.closest('a, button')) this.terminar();
  };
}

function marcarVista(): void {
  try {
    sessionStorage.setItem(CLAVE_INTRO_VISTA, '1');
  } catch {
    // Sin sessionStorage la intro puede volver a mostrarse: no es grave.
  }
}

/** Busca la intro de la página y la pone en marcha. */
export function iniciarIntro(): void {
  // Ojo: <html> también usa data-intro ("abierta"); la raíz del componente es data-intro-modo.
  const raiz = document.querySelector<HTMLElement>('[data-intro-modo]');
  if (!raiz) return;
  const modo: Modo = raiz.dataset.introModo === 'sola' ? 'sola' : 'superpuesta';
  const canvas = raiz.querySelector<HTMLCanvasElement>('[data-intro-cielo]');
  const ctx = canvas?.getContext('2d');
  const linea = raiz.querySelector<HTMLElement>('[data-intro-linea]');
  const perspectiva = raiz.querySelector<HTMLElement>('[data-intro-perspectiva]');
  const crawl = raiz.querySelector<HTMLElement>('[data-intro-crawl]');
  const botonSaltar = raiz.querySelector<HTMLButtonElement>('[data-intro-saltar]');
  if (!canvas || !ctx || !linea || !perspectiva || !crawl || !botonSaltar) return;
  new Intro(raiz, modo, canvas, ctx, linea, perspectiva, crawl, botonSaltar).iniciar();
}
