export type FeatureVisualId = "fallback" | "typed-events" | "throttle" | "zero-deps" | "tiny";

export interface FeatureMeta {
  number : string;
  icon   : string;
  visual : FeatureVisualId;
  class ?: string;
}

export const featuresMeta: FeatureMeta[] = [
  {
    number: "02",
    icon  : "lucide:radio-tower",
    visual: "fallback",
  },
  {
    number: "03",
    icon  : "lucide:braces",
    visual: "typed-events",
  },
  {
    number: "04",
    icon  : "lucide:gauge",
    visual: "throttle",
  },
  {
    number: "05",
    icon  : "lucide:package",
    visual: "zero-deps",
  },
  {
    number: "06",
    icon  : "lucide:feather",
    visual: "tiny",
    class : "sm:col-span-2 lg:col-span-1",
  },
];
