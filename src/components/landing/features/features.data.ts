export type FeatureVisualId = "fallback" | "typed-events" | "throttle" | "zero-deps" | "tiny";

export interface FeatureData {
  number      : string;
  icon        : string;
  title       : string;
  description : string;
  visual      : FeatureVisualId;
  class      ?: string;
}

export const features: FeatureData[] = [
  {
    number     : "02",
    icon       : "lucide:radio-tower",
    title      : "Fallback en memoria",
    description: "¿Entorno sin BroadcastChannel? Cae a un bus en memoria automáticamente, misma API.",
    visual     : "fallback",
  },
  {
    number     : "03",
    icon       : "lucide:braces",
    title      : "Eventos tipados",
    description: "Define tu mapa de eventos con genéricos. emit y on con autocompletado y checks reales.",
    visual     : "typed-events",
  },
  {
    number     : "04",
    icon       : "lucide:gauge",
    title      : "Throttle incluido",
    description: "Limita eventos de alta frecuencia con una opción, ideal para scroll o resize compartidos.",
    visual     : "throttle",
  },
  {
    number     : "05",
    icon       : "lucide:package",
    title      : "Cero dependencias",
    description: "Nada que auditar, nada que actualizar. No arrastra un árbol a tu bundle.",
    visual     : "zero-deps",
  },
  {
    number     : "06",
    icon       : "lucide:feather",
    title      : "Diminuto",
    description: "925 B min+gzip, CJS + ESM y tipos incluidos. Se instala y se olvida.",
    visual     : "tiny",
    class      : "sm:col-span-2 lg:col-span-1",
  },
];
