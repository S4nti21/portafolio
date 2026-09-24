// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

/**
 * URL pública del sitio. Es PROVISORIA: cambiala cuando sepas dónde lo publicás.
 * Se usa para el sitemap, las URLs canónicas y las imágenes de Open Graph.
 */
const SITIO = 'https://s4nti21.github.io';

/**
 * Subcarpeta desde la que se sirve el sitio. Dejá '/' si va en la raíz del dominio
 * (Vercel, Netlify, GitHub Pages de usuario). Para GitHub Pages de proyecto usá, por
 * ejemplo, '/portafolio'. Todos los links internos se adaptan solos (ver src/utils/rutas.ts).
 */
const BASE = '/';

export default defineConfig({
  site: SITIO,
  base: BASE,
  integrations: [
    sitemap({
      // La intro sola es un extra del portafolio: no hace falta indexarla.
      filter: (pagina) => !/\/intro\/?$/.test(new URL(pagina).pathname),
    }),
  ],
  build: {
    // CSS dentro del HTML: evita una petición que bloquea el primer pintado.
    inlineStylesheets: 'always',
  },
  // Fuentes autoalojadas: Astro las descarga en el build, genera los @font-face
  // (font-display: swap) y fallbacks con métricas ajustadas para evitar saltos.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Syncopate',
      cssVariable: '--font-syncopate',
      weights: [700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Archivo',
      cssVariable: '--font-archivo',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['monospace'],
    },
    {
      provider: fontProviders.local(),
      name: 'Star Jedi',
      cssVariable: '--font-star-jedi',
      // Sin fallback propio: en tokens.css cae a Syncopate (--font-saga).
      fallbacks: [],
      options: {
        variants: [{ src: ['./src/assets/fonts/starjedi.woff2'], weight: 400, style: 'normal' }],
      },
    },
  ],
});
