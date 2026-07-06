---
title: Tabus class
description: Full reference for the Tabus class — constructor, tabId, on, off, emit, and destroy.
---

`Tabus` is the only public class the library exposes.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus<Events>(channelName?, options?);
```

## Public API

| Member | Description |
|---|---|
| `new Tabus<Events>(channelName?, options?)` | Creates an instance. `channelName` defaults to `"tabus"`. |
| `tabId: string` | Unique identifier for this instance/tab (`crypto.randomUUID()` or a manual fallback). |
| `on(event, handler)` | Subscribes to an event (includes `"tab:join"` / `"tab:leave"`). Returns `this` (chainable). |
| `off(event, handler)` | Unsubscribes a specific handler. Returns `this`. |
| `emit(event, payload)` | Broadcasts an event to all **other** instances on the same channel. The emitting instance doesn't receive its own event. Returns `this` (chainable). |
| `destroy()` | Emits `"tab:leave"`, closes the transport, and clears all handlers. Safe to call multiple times (no-op after the first). |

## Constructor

```ts
new Tabus<Events extends EventMap>(channelName?: string, options?: TabusOptions)
```

- `channelName` (optional): the channel name. All instances with the same name, on the same origin, communicate with each other. Default: `"tabus"`.
- `options` (optional): see [`TabusOptions`](/en/docs/api/opciones/).

When constructed, `Tabus` automatically picks the right transport — see [Transports](/en/docs/api/transportes/) — and schedules the deferred emission of `tab:join` (see [Lifecycle events](/en/docs/guias/eventos-ciclo-vida/)).

## `tabId`

```ts
readonly tabId: string
```

Unique identifier for this instance, generated with `crypto.randomUUID()` (or a manual fallback if it isn't available). Used internally to deduplicate messages: `Tabus` never delivers a message to a handler whose `tabId` matches its own.

## `on(event, handler)`

```ts
on<E extends keyof FullEventMap<Events>>(
  event: E,
  handler: Handler<FullEventMap<Events>[E]>,
): this
```

Subscribes `handler` to the given event. Accepts both events you've defined and the internal `"tab:join"` and `"tab:leave"` events. Returns `this`, so calls are chainable:

```ts
bus
  .on("data", (payload) => console.log(payload))
  .on("tab:join", ({ tabId }) => console.log(tabId));
```

## `off(event, handler)`

```ts
off<E extends keyof FullEventMap<Events>>(
  event: E,
  handler: Handler<FullEventMap<Events>[E]>,
): this
```

Unsubscribes a specific `handler` previously registered with `on()`. Must be the same function reference.

## `emit(event, payload)`

```ts
emit<E extends keyof Events>(event: E, payload: Events[E]): this
```

Broadcasts `event` with `payload` to all **other** instances on the same channel (in any tab or window). Returns `this`, so it's chainable just like `on()` and `off()`.

The type of `event` is restricted to `keyof Events` — that is, **you can't emit `"tab:join"` or `"tab:leave"` manually**: TypeScript rejects it, because those events are `Tabus`'s exclusive responsibility.

:::caution
The emitting instance **never receives its own `emit()`**. If you also need to process the event in the tab that originated it, invoke your handler manually in addition to emitting. See [Considerations and limits](/en/docs/guias/limites/).
:::

If `throttle` was configured in the constructor, `emit()` limits the actual sending frequency — see [Throttling](/en/docs/guias/throttle/).

## `destroy()`

```ts
destroy(): void
```

Emits `"tab:leave"` (if applicable), closes the underlying transport (closing the `BroadcastChannel` or releasing the in-memory listeners), and clears all registered handlers.

:::note
`destroy()` is **idempotent**: calling it more than once produces no side effects or errors.
:::

## Next step

- [Options](/en/docs/api/opciones/): the shape of `TabusOptions`.
- [Types](/en/docs/api/tipos/): `Handler`, `EventMap`, `TabusMessage`, `InternalEvents`, and `FullEventMap`.
