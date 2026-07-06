---
title: Considerations and limits
description: Behaviors to keep in mind when using tabus-js in production.
---

Before integrating tabus-js into your app, keep these by-design behaviors in mind:

:::caution
**The emitting tab never receives its own `emit()`.** If you also need to handle the event in the tab that originated it, invoke your handler manually in addition to emitting.
:::

```ts
const bus = new Tabus<{ data: number }>("app");

const handleData = (value: number) => console.log(value);

bus.on("data", handleData);

function send(value: number) {
  bus.emit("data", value);
  handleData(value); // explicit local processing
}
```

:::caution
**The in-memory fallback doesn't cross real tabs.** [`MemoryTransport`](/en/docs/guias/transportes/) is only meant for tests, SSR, or communication within the same process. If your app needs to actually sync tabs, it depends on the browser supporting `BroadcastChannel`.
:::

:::note
**`destroy()` is idempotent.** Calling it more than once produces no side effects or errors — it's safe to invoke it from multiple places (for example, a `beforeunload` and a `useEffect` cleanup) without coordinating them with each other.
:::

- **After `destroy()`, `on()` and `emit()` are safe no-ops.** They don't throw and have no effect — they simply do nothing. There's no need to manually check whether an instance is still alive before using it.

- **Zero runtime dependencies.** tabus-js only uses native APIs from the environment: `BroadcastChannel`, `crypto.randomUUID`, and `setTimeout`. There's nothing to keep up to date from transitive dependencies.
- **Delivery order isn't guaranteed across tabs under different load.** If two tabs emit at nearly the same time, the order each peer receives them in depends on the browser's scheduler, not on a global clock.
- **`tabId` is ephemeral.** It's generated per instance (with `crypto.randomUUID()` or a manual fallback) and doesn't persist across page reloads — don't use it as a stable user or session identifier.

## Next step

- [Lifecycle events](/en/docs/guias/eventos-ciclo-vida/) explains the deferral of `tab:join` and the `destroy()` guard in detail.
- The [Tabus class reference](/en/docs/api/tabus/) documents the exact signature of every method.
