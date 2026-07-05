export const installCommands = {
  pnpm: "pnpm add tabus-js",
  npm : "npm install tabus-js",
  yarn: "yarn add tabus-js",
  bun : "bun add tabus-js",
} as const;

export type PackageManager = keyof typeof installCommands;
