---
title: Vanilla
description: How to use tabus-js without any framework, with plain JavaScript or TypeScript.
---

With no framework involved, tabus-js is used as-is: create the instance, subscribe, and emit.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus<{ "cart:add": { id: string } }>("shop");

bus.on("cart:add", ({ id }) => addToCart(id));

bus.emit("cart:add", { id: "sku_42" });
```

On a page with multiple scripts or modules, it's best to keep a single instance per channel and share it:

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

## Cleanup

If your page is an SPA that mounts and unmounts views, call `bus.destroy()` when the view is discarded. If it's a traditional, single-load page, `beforeunload` is enough:

```ts
window.addEventListener("beforeunload", () => bus.destroy());
```

## Next step

Check out the full [shared cart](/en/docs/ejemplos/carrito-compartido/) example, which expands on this same pattern.
