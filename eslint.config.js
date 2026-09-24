// @ts-check
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Salidas generadas, dependencias y referencias que no son código del sitio.
  globalIgnores(['dist/', '.astro/', 'node_modules/', 'diseno/', 'cv/', 'public/']),

  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  astro.configs.recommended,
  // Reglas de accesibilidad adaptadas a plantillas .astro (usa eslint-plugin-jsx-a11y-x).
  astro.configs['jsx-a11y-recommended'],

  {
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    // Archivos de configuración que corren en Node.
    files: ['*.config.{js,mjs,ts}'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);
