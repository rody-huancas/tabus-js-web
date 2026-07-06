// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://tabus-js.vercel.app",

  integrations: [
    starlight({
      title      : "Tabus.js",
      description: "Bus de mensajes tipado entre pestañas del navegador, con fallback en memoria.",
      head: [
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.ico",
            type: "image/x-icon",
          },
        },
      ],
      logo       : {
        src         : "./src/assets/tabus-logo.png",
        alt         : "tabus-js",
        replacesTitle: true,
      },
      customCss: ["./src/styles/starlight.css"],
      social: [
        {
          icon : "github",
          label: "GitHub",
          href : "https://github.com/rody-huancas/tabus-js",
        },
      ],
      sidebar: [
        {
          label: "Empezar",
          items: [
            {
              label: "Introducción",
              slug : "docs/getting-started/introduccion",
            },
            { label: "Instalación", slug: "docs/getting-started/instalacion" },
            { label: "Inicio rápido", slug: "docs/getting-started/quick-start" },
          ],
        },
        {
          label: "Conceptos",
          items: [
            { label: "Cómo funciona", slug: "docs/guias/conceptos" },
            { label: "Transportes", slug: "docs/guias/transportes" },
            {
              label: "Eventos de ciclo de vida",
              slug : "docs/guias/eventos-ciclo-vida",
            },
            { label: "Throttling", slug: "docs/guias/throttle" },
            { label: "Consideraciones y límites", slug: "docs/guias/limites" },
          ],
        },
        {
          label: "Integraciones",
          items: [
            { label: "React", slug: "docs/integraciones/react" },
            { label: "Vue", slug: "docs/integraciones/vue" },
            { label: "Angular", slug: "docs/integraciones/angular" },
            { label: "Svelte", slug: "docs/integraciones/svelte" },
            { label: "Vanilla", slug: "docs/integraciones/vanilla" },
          ],
        },
        {
          label: "Referencia de API",
          items: [
            { label: "Clase Tabus", slug: "docs/api/tabus" },
            { label: "Opciones", slug: "docs/api/opciones" },
            { label: "Tipos", slug: "docs/api/tipos" },
            { label: "Transportes", slug: "docs/api/transportes" },
            { label: "Exports", slug: "docs/api/exports" },
          ],
        },
        {
          label: "Ejemplos",
          items: [
            {
              label: "Logout sincronizado",
              slug : "docs/ejemplos/logout-sincronizado",
            },
            {
              label: "Carrito compartido",
              slug : "docs/ejemplos/carrito-compartido",
            },
            {
              label: "Cursor en tiempo real",
              slug : "docs/ejemplos/cursor-tiempo-real",
            },
            {
              label: "Detección de presencia",
              slug : "docs/ejemplos/presencia-pestanas",
            },
          ],
        },
      ],
    }),
    react(),
    icon(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
