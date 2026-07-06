---
title: Vanilla
description: Cómo usar tabus-js sin ningún framework, con JavaScript o TypeScript plano.
---

Sin framework de por medio, tabus-js se usa tal cual: crear la instancia, suscribirse y emitir.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus<{ "cart:add": { id: string } }>("shop");

bus.on("cart:add", ({ id }) => addToCart(id));

bus.emit("cart:add", { id: "sku_42" });
```

En una página con múltiples scripts o módulos, conviene mantener una única instancia por canal y compartirla:

```ts
// bus.ts
import { Tabus } from "tabus-js";

export const bus = new Tabus<{ "cart:add": { id: string } }>("shop");
```

```ts
// cart.ts
import { bus } from "./bus";

bus.on("cart:add", ({ id }) => addToCart(id));
```

```ts
// checkout.ts
import { bus } from "./bus";

bus.emit("cart:add", { id: "sku_42" });
```

## Limpieza

Si tu página es una SPA que desmonta y remonta vistas, llama a `bus.destroy()` cuando la vista se descarte. Si es una página tradicional de una sola carga, con `beforeunload` alcanza:

```ts
window.addEventListener("beforeunload", () => bus.destroy());
```

## Siguiente paso

Revisa el ejemplo completo de [carrito compartido](/docs/ejemplos/carrito-compartido/), que amplía este mismo patrón.
