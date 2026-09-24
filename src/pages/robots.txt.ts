import type { APIRoute } from 'astro';
import { ruta } from '../utils/rutas';

/** robots.txt generado con la URL real del sitio (ver SITIO en astro.config.mjs). */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(ruta('/sitemap-index.xml'), site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
