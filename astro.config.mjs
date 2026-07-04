// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://tabus-js.vercel.app',

  integrations: [starlight({
			title: 'tabus-js',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
        {
            label: 'Getting started',
            items: [
                { label: 'Introducción', slug: 'docs/getting-started/introduccion' },
                { label: 'Instalación', slug: 'docs/getting-started/instalacion' },
                { label: 'Quick start', slug: 'docs/getting-started/quick-start' },
            ],
        },
        {
            label: 'Guías',
            items: [
                { label: 'Conceptos', slug: 'docs/guias/conceptos' },
                { label: 'Throttle', slug: 'docs/guias/throttle' },
                { label: 'React', slug: 'docs/guias/react' },
            ],
        },
        {
            label: 'API',
            items: [
                { label: 'tabus', slug: 'docs/api/tabus' },
            ],
        },
        {
            label: 'Ejemplos',
            items: [
                { label: 'Ejemplos', slug: 'docs/ejemplos' },
            ],
        },
			],
  }), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
