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
      favicon    : "/favicon.ico",
      logo       : {
        src         : "./src/assets/tabus-logo.png",
        alt         : "tabus-js",
        replacesTitle: true,
      },
      customCss: ["./src/styles/starlight.css"],
      components: {
        Head: "./src/components/starlight/Head.astro",
      },
      social: [
        {
          icon : "github",
          label: "GitHub",
          href : "https://github.com/rody-huancas/tabus-js",
        },
      ],
      locales: {
        root: { label: "Español", lang: "es" },
        en  : { label: "English", lang: "en" },
      },
      sidebar: [
        {
          label: "Empezar",
          translations: { en: "Getting started" },
          items: [
            {
              label: "Introducción",
              translations: { en: "Introduction" },
              slug : "docs/getting-started/introduccion",
            },
            {
              label: "Instalación",
              translations: { en: "Installation" },
              slug : "docs/getting-started/instalacion",
            },
            {
              label: "Inicio rápido",
              translations: { en: "Quick start" },
              slug : "docs/getting-started/quick-start",
            },
          ],
        },
        {
          label: "Conceptos",
          translations: { en: "Concepts" },
          items: [
            {
              label: "Cómo funciona",
              translations: { en: "How it works" },
              slug : "docs/guias/conceptos",
            },
            {
              label: "Transportes",
              translations: { en: "Transports" },
              slug : "docs/guias/transportes",
            },
            {
              label: "Eventos de ciclo de vida",
              translations: { en: "Lifecycle events" },
              slug : "docs/guias/eventos-ciclo-vida",
            },
            {
              label: "Throttling",
              translations: { en: "Throttling" },
              slug : "docs/guias/throttle",
            },
            {
              label: "Consideraciones y límites",
              translations: { en: "Considerations and limits" },
              slug : "docs/guias/limites",
            },
          ],
        },
        {
          label: "Integraciones",
          translations: { en: "Integrations" },
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
          translations: { en: "API reference" },
          items: [
            {
              label: "Clase Tabus",
              translations: { en: "Tabus class" },
              slug : "docs/api/tabus",
            },
            {
              label: "Opciones",
              translations: { en: "Options" },
              slug : "docs/api/opciones",
            },
            {
              label: "Tipos",
              translations: { en: "Types" },
              slug : "docs/api/tipos",
            },
            {
              label: "Transportes",
              translations: { en: "Transports" },
              slug : "docs/api/transportes",
            },
            { label: "Exports", slug: "docs/api/exports" },
          ],
        },
        {
          label: "Ejemplos",
          translations: { en: "Examples" },
          items: [
            {
              label: "Logout sincronizado",
              translations: { en: "Synchronized logout" },
              slug : "docs/ejemplos/logout-sincronizado",
            },
            {
              label: "Carrito compartido",
              translations: { en: "Shared cart" },
              slug : "docs/ejemplos/carrito-compartido",
            },
            {
              label: "Cursor en tiempo real",
              translations: { en: "Real-time cursor" },
              slug : "docs/ejemplos/cursor-tiempo-real",
            },
            {
              label: "Detección de presencia",
              translations: { en: "Presence detection" },
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
