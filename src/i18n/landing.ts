export type Locale = "es" | "en";

/**
 * Prefixes internal absolute paths with `/en` for the English locale, mirroring
 * the routing convention already used by the bilingual Starlight docs.
 * External URLs and the Spanish (root) locale are returned unchanged.
 */
export const localizeHref = (href: string, locale: Locale): string => {
  if (locale !== "en") return href;
  if (/^https?:\/\//.test(href)) return href;
  if (href === "/") return "/en";
  if (href.startsWith("/")) return `/en${href}`;
  return href;
};

const es = {
  meta: {
    title: "Tabus.js",
    description:
      "Sincroniza el estado entre pestañas del navegador en tiempo real. Sin servidor, sin WebSockets, sin configuración extra.",
  },
  header: {
    navAria   : "Principal",
    homeAria  : "tabus-js — inicio",
    docs      : "Docs",
    demo      : "Demo",
    githubAria: "Ver repositorio en GitHub",
    npmAria   : "Ver paquete en npm",
    cta       : "Empezar",
    backToTop : "Volver arriba",
    langAria  : "Idioma",
  },
  demoSection: {
    heading: "Míralo en vivo",
  },
  hero: {
    scrollHint: "Demo en vivo",
    headline  : {
      line1        : "Sincroniza",
      line2Prefix  : "tus",
      line2Highlight: "pestañas",
      line3        : "en tiempo real",
    },
    subhead: "Conecta el estado entre pestañas al instante. Sin servidor, sin WebSockets, sin configuración extra.",
    ctaPrimary: "Empezar ahora",
  },
  heroPreview: {
    domain       : "app.mi-proyecto.dev",
    tabStore     : "Tienda",
    tabCheckout  : "Checkout",
    tabProfile   : "Perfil",
    cartLabel    : "Carrito compartido",
    productName  : "Zapatillas Tabus",
    syncedState  : "Estado sincronizado",
    active       : "Activo",
    eventReceived: "Pestaña B recibió el evento",
    bubbleTitle  : "Pestaña A → B",
    bubbleSubtitle: "Evento en ~0ms",
  },
  heroStats: {
    minGzip     : "Min + gzip",
    dependencies: "Dependencias",
    servers     : "Servidores",
  },
  installTabs: {
    ariaPackageManager: "Gestor de paquetes",
    copyAria          : "Copiar comando de instalación",
    copy              : "Copiar",
    copied            : "¡Copiado!",
  },
  features: {
    heading: "Poco, pero lo justo",
    subhead: "Sin runtime pesado ni conceptos nuevos. Una clase, dos métodos, y el navegador hace el resto.",
    highlight: {
      title      : "BroadcastChannel nativo",
      description: "Sincroniza el estado entre pestañas con la API nativa del navegador. Sin WebSockets, sin polling, sin servidor intermedio.",
    },
    items: {
      fallback: {
        title      : "Fallback en memoria",
        description: "¿Entorno sin BroadcastChannel? Cae a un bus en memoria automáticamente, misma API.",
      },
      "typed-events": {
        title      : "Eventos tipados",
        description: "Define tu mapa de eventos con genéricos. emit y on con autocompletado y checks reales.",
      },
      throttle: {
        title      : "Throttle incluido",
        description: "Limita eventos de alta frecuencia con una opción, ideal para scroll o resize compartidos.",
      },
      "zero-deps": {
        title      : "Cero dependencias",
        description: "Nada que auditar, nada que actualizar. No arrastra un árbol a tu bundle.",
      },
      tiny: {
        title      : "Diminuto",
        description: "925 B min+gzip, CJS + ESM y tipos incluidos. Se instala y se olvida.",
      },
    },
    busVisual: {
      tabA: "Pestaña A",
      tabB: "Pestaña B",
    },
    fallbackVisual: {
      memory: "Memoria",
    },
    tinyVisual: {
      others: "otras",
    },
  },
  codePreview: {
    kicker : "// la API completa",
    heading: "Esto es todo lo que escribes",
    subhead: "Creas un canal tipado, escuchas en las demás pestañas, emites desde la tuya. No hay paso cuatro.",
    bullets: [
      { icon: "lucide:plug", label: "Creás el canal" },
      { icon: "lucide:ear", label: "Escuchás en las otras pestañas" },
      { icon: "lucide:send", label: "Emitís desde la tuya" },
    ],
    copyAria: "Copiar código",
    copy    : "Copiar",
    copied  : "Copiado",
    codeComments: {
      listen: "escucha en las otras pestañas",
      emit  : "emite desde esta",
    },
  },
  compat: {
    kicker  : "// funciona donde ya trabajas",
    heading : "Sin framework preferido",
    subhead : "Es una clase de JS sobre una API estándar. Envuélvela en un hook, un composable, o úsala directamente.",
    tabsAria: "Framework",
    copyAria: "Copiar código",
    copy    : "Copiar",
    copied  : "Copiado",
  },
  cta: {
    heading     : "Deja de pelear con localStorage.",
    subhead     : "Sincroniza tus pestañas en el tiempo que tardas en leer los docs.",
    terminalPath: "~/mi-proyecto",
    copyAria    : "Copiar comando",
    copy        : "Copiar",
    copied      : "Copiado",
    button      : "Leer los docs",
  },
  footer: {
    homeAria  : "tabus-js — inicio",
    tagline   : "Sincroniza el estado entre pestañas del navegador. Sobre BroadcastChannel, cero dependencias.",
    copyAria  : "Copiar comando",
    copiedAria: "Copiado",
    product   : "Producto",
    resources : "Recursos",
    community : "Comunidad",
    docs      : "Docs",
    demo      : "Demo",
    api       : "API",
    github    : "GitHub",
    npm       : "npm",
    issues    : "Issues",
    githubAria: "Ver repositorio en GitHub",
    npmAria   : "Ver paquete en npm",
    madeBy    : "hecho por",
  },
  demo: {
    tabA       : "Pestaña A",
    tabB       : "Pestaña B",
    cartLabel  : "Carrito compartido",
    productName: "Zapatillas Tabus",
    syncedState: "Estado sincronizado",
    active     : "Activo",
    waiting    : "Esperando eventos de la otra pestaña…",
    received   : "recibió",
    addToCart  : "Agregar al carrito",
    reset      : "Reset",
    openInNewTab: "Ábrela en otra pestaña real",
  },
};

const en: typeof es = {
  meta: {
    title: "Tabus.js",
    description:
      "Sync state across browser tabs in real time. No server, no WebSockets, no extra configuration.",
  },
  header: {
    navAria   : "Main",
    homeAria  : "tabus-js — home",
    docs      : "Docs",
    demo      : "Demo",
    githubAria: "View repository on GitHub",
    npmAria   : "View package on npm",
    cta       : "Get started",
    backToTop : "Back to top",
    langAria  : "Language",
  },
  demoSection: {
    heading: "See it live",
  },
  hero: {
    scrollHint: "Live demo",
    headline  : {
      line1        : "Sync",
      line2Prefix  : "your",
      line2Highlight: "tabs",
      line3        : "in real time",
    },
    subhead: "Connect state across tabs instantly. No server, no WebSockets, no extra configuration.",
    ctaPrimary: "Get started now",
  },
  heroPreview: {
    domain       : "app.my-project.dev",
    tabStore     : "Store",
    tabCheckout  : "Checkout",
    tabProfile   : "Profile",
    cartLabel    : "Shared cart",
    productName  : "Tabus Sneakers",
    syncedState  : "Synced state",
    active       : "Active",
    eventReceived: "Tab B received the event",
    bubbleTitle  : "Tab A → B",
    bubbleSubtitle: "Event in ~0ms",
  },
  heroStats: {
    minGzip     : "Min + gzip",
    dependencies: "Dependencies",
    servers     : "Servers",
  },
  installTabs: {
    ariaPackageManager: "Package manager",
    copyAria          : "Copy install command",
    copy              : "Copy",
    copied            : "Copied!",
  },
  features: {
    heading: "Small, but just enough",
    subhead: "No heavy runtime, no new concepts. One class, two methods, and the browser does the rest.",
    highlight: {
      title      : "Native BroadcastChannel",
      description: "Sync state across tabs with the browser's native API. No WebSockets, no polling, no server in between.",
    },
    items: {
      fallback: {
        title      : "In-memory fallback",
        description: "No BroadcastChannel in your environment? It automatically falls back to an in-memory bus, same API.",
      },
      "typed-events": {
        title      : "Typed events",
        description: "Define your event map with generics. emit and on get real autocomplete and type checking.",
      },
      throttle: {
        title      : "Built-in throttling",
        description: "Limit high-frequency events with a single option — ideal for shared scroll or resize handling.",
      },
      "zero-deps": {
        title      : "Zero dependencies",
        description: "Nothing to audit, nothing to update. It doesn't drag a dependency tree into your bundle.",
      },
      tiny: {
        title      : "Tiny",
        description: "925 B min+gzip, CJS + ESM, and types included. Install it and forget about it.",
      },
    },
    busVisual: {
      tabA: "Tab A",
      tabB: "Tab B",
    },
    fallbackVisual: {
      memory: "Memory",
    },
    tinyVisual: {
      others: "other",
    },
  },
  codePreview: {
    kicker : "// the full API",
    heading: "This is all you write",
    subhead: "You create a typed channel, listen on the other tabs, and emit from yours. There's no step four.",
    bullets: [
      { icon: "lucide:plug", label: "Create the channel" },
      { icon: "lucide:ear", label: "Listen on the other tabs" },
      { icon: "lucide:send", label: "Emit from yours" },
    ],
    copyAria: "Copy code",
    copy    : "Copy",
    copied  : "Copied",
    codeComments: {
      listen: "listen on the other tabs",
      emit  : "emit from this one",
    },
  },
  compat: {
    kicker  : "// works wherever you already do",
    heading : "No framework required",
    subhead : "It's a JS class built on a standard API. Wrap it in a hook, a composable, or use it directly.",
    tabsAria: "Framework",
    copyAria: "Copy code",
    copy    : "Copy",
    copied  : "Copied",
  },
  cta: {
    heading     : "Stop fighting with localStorage.",
    subhead     : "Sync your tabs in about as long as it takes to read the docs.",
    terminalPath: "~/my-project",
    copyAria    : "Copy command",
    copy        : "Copy",
    copied      : "Copied",
    button      : "Read the docs",
  },
  footer: {
    homeAria  : "tabus-js — home",
    tagline   : "Sync state across browser tabs. Built on BroadcastChannel, zero dependencies.",
    copyAria  : "Copy command",
    copiedAria: "Copied",
    product   : "Product",
    resources : "Resources",
    community : "Community",
    docs      : "Docs",
    demo      : "Demo",
    api       : "API",
    github    : "GitHub",
    npm       : "npm",
    issues    : "Issues",
    githubAria: "View repository on GitHub",
    npmAria   : "View package on npm",
    madeBy    : "made by",
  },
  demo: {
    tabA       : "Tab A",
    tabB       : "Tab B",
    cartLabel  : "Shared cart",
    productName: "Tabus Sneakers",
    syncedState: "Synced state",
    active     : "Active",
    waiting    : "Waiting for events from the other tab…",
    received   : "received",
    addToCart  : "Add to cart",
    reset      : "Reset",
    openInNewTab: "Open it in another real tab",
  },
};

export const landing = { es, en };
export type LandingDict = typeof es;
