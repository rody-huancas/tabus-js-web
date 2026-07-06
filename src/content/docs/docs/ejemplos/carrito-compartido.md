---
title: Carrito compartido
description: Mantener el carrito de compras sincronizado entre pestañas en tiempo real.
---

## El problema

Un usuario abre tu tienda en dos pestañas — una viendo el catálogo, otra en el checkout. Agrega un producto en una, pero la otra no se entera hasta recargar.

## La solución

Emitir un evento `cart:add` cada vez que se agrega un producto, y que todas las pestañas actualicen su copia del carrito al recibirlo.

```ts
import { Tabus } from "tabus-js";

type CartEvents = {
  "cart:add": { id: string; qty: number };
};

const bus = new Tabus<CartEvents>("shop");

const cart = new Map<string, number>();

function addToCart(id: string, qty = 1) {
  cart.set(id, (cart.get(id) ?? 0) + qty);
  renderCart();

  // Avisar a las demás pestañas
  bus.emit("cart:add", { id, qty });
}

// Recibir cambios hechos desde otras pestañas
bus.on("cart:add", ({ id, qty }) => {
  cart.set(id, (cart.get(id) ?? 0) + qty);
  renderCart();
});

function renderCart() {
  console.log("Carrito:", Object.fromEntries(cart));
}
```

## Por qué funciona

- `addToCart()` actualiza el estado local **y** emite el evento en el mismo paso — como la pestaña emisora no recibe su propio `emit()`, hay que aplicar el cambio localmente de forma explícita.
- El handler `bus.on("cart:add", ...)` solo se dispara en las **demás** pestañas, que aplican el mismo cambio a su copia del carrito.
- Ambas pestañas terminan con el mismo estado, sin necesitar un servidor ni websockets.

:::caution
Este patrón sincroniza *cambios incrementales* (deltas), no el estado completo. Si una pestaña se abre después de que ya se agregaron productos en otra, no recibirá el historial — solo los eventos que ocurran a partir de que se suscribió. Para el estado inicial completo, sigue necesitando venir de tu fuente de verdad habitual (`localStorage`, tu API, etc.).
:::

## Siguiente paso

Para integrarlo dentro de un framework en vez de JavaScript plano, revisa las guías de [Integraciones](/docs/integraciones/react/) — todas usan este mismo evento `cart:add` como ejemplo.
