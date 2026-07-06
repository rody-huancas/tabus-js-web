---
title: How it works
description: tabus-js internal architecture — the Tabus class, ITransport, and the concrete transports.
---

tabus-js has a small, deliberately simple architecture: a single public class that delegates sending/receiving messages to a swappable transport.

```
Tabus<Events>
      │
      └── ITransport
               ├── BroadcastTransport  — wraps the native BroadcastChannel
               └── MemoryTransport     — module-level Map of listeners
```

## `Tabus`, the only public class

`Tabus` is the entry point and the only class the library exposes. Its responsibilities:

- **Chooses the transport** when constructed: if `typeof BroadcastChannel !== "undefined"` it uses `BroadcastTransport`; otherwise it uses `MemoryTransport`. See [Transports](/en/docs/guias/transportes/).
- **Deduplicates messages**: compares `msg.tabId` against its own `tabId` so the tab that emits an event never delivers it to itself.
- **Defers `tab:join`** with `setTimeout(0)`, so whoever constructs the instance can register handlers synchronously before the notice is broadcast to peers. See [Lifecycle events](/en/docs/guias/eventos-ciclo-vida/).
- **Guards `destroy()`** with an internal flag: if the instance is destroyed before the `tab:join` timer fires, neither that event nor `tab:leave` are sent.
- **Throttles `emit()`** with a leading + trailing edge strategy. See [Throttling](/en/docs/guias/throttle/).

For the full detail of every public member (`on`, `off`, `emit`, `destroy`, `tabId`), see the [Tabus class reference](/en/docs/api/tabus/).

## `ITransport`, the transport contract

All message sending/receiving goes through a common interface:

```ts
interface ITransport {
  send(msg: TabusMessage): void;
  onMessage(listener: (msg: TabusMessage) => void): void;
  destroy(): void;
}
```

:::caution
Deduplication by `tabId` is **`Tabus`'s** responsibility, not the transport's. A transport can perfectly well hand the emitting instance its own message back — it's `Tabus` that filters it out. Any new `ITransport` implementation must respect this contract.
:::

tabus-js ships two ready-to-use implementations:

- **`BroadcastTransport`**: a thin wrapper around the native `BroadcastChannel` API. Communicates real tabs, windows, and workers of the same origin.
- **`MemoryTransport`**: an in-memory fallback that kicks in when `BroadcastChannel` doesn't exist (Node, SSR, very old browsers). Only works within the same process.

Both are explained in detail, along with their differences and limitations, in [Transports](/en/docs/guias/transportes/).

## Next step

- [Transports](/en/docs/guias/transportes/): when each one is used and what the fallback implies.
- [Lifecycle events](/en/docs/guias/eventos-ciclo-vida/): `tab:join`, `tab:leave`, and why they're deferred.
- [Throttling](/en/docs/guias/throttle/): how to limit the frequency of `emit()`.
