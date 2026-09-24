import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

/**
 * Misiones (proyectos). Cada archivo .md de src/content/misiones/ es una misión:
 * el frontmatter tiene los datos de la tarjeta y el cuerpo cuenta la solución.
 * Los archivos que empiezan con "_" se ignoran (sirven de plantilla).
 */
const misiones = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/misiones' }),
  schema: ({ image }) =>
    z.object({
      /** Nombre real del proyecto. */
      titulo: z.string(),
      /** Nombre en clave que se muestra grande (ej. ÓRBITA). */
      codigo: z.string(),
      anio: z.number().int().min(2000).max(2100),
      categoria: z.string(),
      /** Una línea: qué es el proyecto. */
      resumen: z.string(),
      problema: z.string(),
      resultado: z.string(),
      stack: z.array(z.string()).min(1),
      repo: z.url().optional(),
      demo: z.url().optional(),
      /** Ruta relativa al .md, por ejemplo ../../assets/misiones/orbita.webp */
      imagen: image().optional(),
      /** Descripción de la imagen para lectores de pantalla. */
      imagenAlt: z.string().optional(),
      /** Posición en la lista (menor = primero). */
      orden: z.number(),
      /** Si es true, la misión solo se ve en desarrollo (npm run dev). */
      borrador: z.boolean().default(false),
    }),
});

export const collections = { misiones };
