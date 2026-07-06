---
title: Types
description: Reference for tabus-js's public types — Handler, EventMap, TabusMessage, InternalEvents, and FullEventMap.
---

All of these types live in `src/core/types.ts` and form the foundation of the library's type system.

| Type | Description |
|---|---|
| `Handler<T>` | `(payload: T) => void` — signature of an event handler. |
| `EventMap` | `Record<string, unknown>` — generic constraint for user-defined events. |
| `TabusMessage<T>` | Shape of the internal message: `{ tabId, event, payload }`. |
| `InternalEvents` | `{ "tab:join": { tabId }, "tab:leave": { tabId } }` — automatically emitted lifecycle events. |
| `FullEventMap<T>` | Combines the user's events (`T`) with `InternalEvents`; used in the signatures of `on()` / `off()`. |
| `TabusOptions` | `{ throttle?: number; trailing?: boolean }` — see [Options](/en/docs/api/opciones/). |

## `Handler<T>`

```ts
type Handler<T = unknown> = (payload: T) => void;
```

The signature any function passed to `on()` or `off()` must satisfy.

## `EventMap`

```ts
type EventMap = Record<string, unknown>;
```

Generic constraint that the event type you pass to `Tabus<Events>` must satisfy. Any object with `string` keys works:

```ts
type MyEvents = {
  data: { value: number };
  reset: void;
};
```

## `TabusMessage<T>`

```ts
interface TabusMessage<T = unknown> {
  tabId: string;
  event: string;
  payload: T;
}
```

Shape of the internal message that travels through the transport. It's the type received by `send()` and by listeners registered with `onMessage()` on [`ITransport`](/en/docs/api/transportes/).

## `InternalEvents`

```ts
type InternalEvents = {
  "tab:join": { tabId: string };
  "tab:leave": { tabId: string };
};
```

The two lifecycle events that `Tabus` emits automatically. See [Lifecycle events](/en/docs/guias/eventos-ciclo-vida/).

## `FullEventMap<T>`

```ts
type FullEventMap<T extends EventMap> = T & InternalEvents;
```

Combines your custom events with `InternalEvents`. It's the actual type used by the signatures of `on()` and `off()`, so you can always subscribe to `"tab:join"` / `"tab:leave"` in addition to your own events, without declaring them yourself.

## Next step

- [Tabus class](/en/docs/api/tabus/): where these types are used in practice.
- [Exports](/en/docs/api/exports/): what's publicly exported from the package.
