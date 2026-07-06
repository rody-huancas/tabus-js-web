---
title: Shared cart
description: Keep the shopping cart in sync across tabs in real time.
---

## The problem

A user opens your store in two tabs — one looking at the catalog, another at checkout. They add a product in one, but the other doesn't find out until it's reloaded.

## The solution

Emit a `cart:add` event every time a product is added, and have every tab update its copy of the cart when it receives it.

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

  // Notify the other tabs
  bus.emit("cart:add", { id, qty });
}

// Receive changes made from other tabs
bus.on("cart:add", ({ id, qty }) => {
  cart.set(id, (cart.get(id) ?? 0) + qty);
  renderCart();
});

function renderCart() {
  console.log("Cart:", Object.fromEntries(cart));
}
```

## Why it works

- `addToCart()` updates local state **and** emits the event in the same step — since the emitting tab doesn't receive its own `emit()`, the change has to be applied locally in an explicit way.
- The `bus.on("cart:add", ...)` handler only fires in the **other** tabs, which apply the same change to their copy of the cart.
- Both tabs end up with the same state, without needing a server or websockets.

:::caution
This pattern syncs *incremental changes* (deltas), not the full state. If a tab is opened after products have already been added in another one, it won't receive the history — only the events that happen after it subscribed. For the full initial state, you still need it to come from your usual source of truth (`localStorage`, your API, etc.).
:::

## Next step

To integrate this within a framework instead of plain JavaScript, check out the [Integrations](/en/docs/integraciones/react/) guides — they all use this same `cart:add` event as an example.
