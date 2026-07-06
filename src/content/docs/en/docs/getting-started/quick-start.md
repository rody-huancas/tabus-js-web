---
title: Quick start
description: Create your first cross-tab event bus in a few minutes.
---

This guide walks through the basic usage of tabus-js step by step, until you have two tabs in sync.

## 1. Define your events

`Tabus` is generic: define a type with the events you're going to emit and their payloads. This gives you autocomplete and type checking on `on()` and `emit()`.

```ts
type MyEvents = {
  data: { value: number };
  reset: void;
};
```

## 2. Create the instance

Instantiate `Tabus` passing a channel name. All instances created with the same name, in any tab of the same origin, communicate with each other.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus<MyEvents>("my-app");
```

If you don't pass a name, `"tabus"` is used by default.

## 3. Subscribe to events

`on()` accepts both your custom events and the internal lifecycle events `tab:join` and `tab:leave`:

```ts
bus.on("data", ({ value }) => console.log("value received:", value));
bus.on("tab:join", ({ tabId }) => console.log("new tab connected:", tabId));
bus.on("tab:leave", ({ tabId }) => console.log("tab closed:", tabId));
```

## 4. Emit events

`emit()` broadcasts the event to all other instances on the same channel:

```ts
bus.emit("data", { value: 42 });
```

:::caution
The tab that emits an event **never receives it itself**. If you also need to process the event locally, invoke your handler manually in addition to emitting.
:::

## 5. Clean up on close

Call `destroy()` when you no longer need the instance, for example when closing the tab. It emits `tab:leave`, closes the underlying transport, and clears all handlers:

```ts
window.addEventListener("beforeunload", () => bus.destroy());
```

## Putting it all together

```ts
import { Tabus } from "tabus-js";

type MyEvents = {
  data: { value: number };
  reset: void;
};

// All instances with the same channel name communicate with each other.
const bus = new Tabus<MyEvents>("my-app");

bus.on("data", ({ value }) => console.log("value received:", value));
bus.on("tab:join", ({ tabId }) => console.log("new tab connected:", tabId));
bus.on("tab:leave", ({ tabId }) => console.log("tab closed:", tabId));

// Emit an event to all OTHER tabs (this tab doesn't receive its own)
bus.emit("data", { value: 42 });

// Clean up when the tab closes
window.addEventListener("beforeunload", () => bus.destroy());
```

To try it out: open the same page in two tabs, run `bus.emit("data", { value: 42 })` in the console of one, and watch the `console.log` in the other.

## Next step

- To understand the reasoning behind these decisions (deduplication, deferred `tab:join`, idempotent `destroy()`), check out [How it works](/en/docs/guias/conceptos/).
- If your app uses React, Vue, Angular, or Svelte, check out the [Integrations](/en/docs/integraciones/react/) section for each framework's idiomatic pattern.
