---
title: Transports
description: Reference for ITransport, BroadcastTransport, and MemoryTransport.
---

For the conceptual explanation of when each transport is used, see the [Transports](/en/docs/guias/transportes/) guide. This page documents its exact shape.

:::note
`BroadcastTransport` and `MemoryTransport` are internal details: `Tabus` picks them automatically and they aren't exported from the package's public entry point. Only `ITransport` (the contract type) is part of the [public exports](/en/docs/api/exports/).
:::

## `ITransport`

```ts
interface ITransport {
  send(msg: TabusMessage): void;
  onMessage(listener: (msg: TabusMessage) => void): void;
  destroy(): void;
}
```

| Member | Description |
|---|---|
| `send(msg)` | Sends a `TabusMessage` through the transport. |
| `onMessage(listener)` | Registers a listener that's invoked with every `TabusMessage` received. |
| `destroy()` | Releases the transport's resources (closes the underlying channel). |

:::caution
Deduplication by `tabId` is `Tabus`'s responsibility, **not** the transport's. Any new `ITransport` implementation must respect this contract: it can safely hand the emitter its own message back.
:::

## `BroadcastTransport`

A thin wrapper around the native `BroadcastChannel` API.

| Method | Implementation |
|---|---|
| `send(msg)` | `bc.postMessage(msg)` |
| `onMessage(listener)` | `bc.addEventListener("message", ...)` |
| `destroy()` | `bc.close()` |

It's the default transport used in any browser that supports `BroadcastChannel`, and it communicates real tabs, windows, and workers of the same origin.

## `MemoryTransport`

In-memory fallback, active when `BroadcastChannel` doesn't exist (Node, SSR, very old browsers).

- Keeps a module-level registry: `Map<string, Set<listener>>`, shared by every `MemoryTransport` instance within the same process.
- Only works within the same process/tab — it doesn't cross real tabs, because without `BroadcastChannel` that concept doesn't exist.
- Unlike `BroadcastTransport`, the emitter's own listener **is** invoked by `send()`; it's `Tabus`, not the transport, that filters by `tabId`.
- Emits a `console.warn` **once per channel name**, warning that the fallback kicked in.

### `__resetMemoryBus()`

```ts
function __resetMemoryBus(): void
```

Clears `MemoryTransport`'s internal module-level registry (the listeners and the record of channels already warned about).

:::caution
This is a function **internal to the transport module**, not part of the package's public entry point (you can't do `import { __resetMemoryBus } from "tabus-js"`). It exists solely so the library's own test suite can clear global state between tests — don't use it in application code.
:::

## Next step

[Exports](/en/docs/api/exports/) summarizes what all of this exports publicly from `tabus-js`.
