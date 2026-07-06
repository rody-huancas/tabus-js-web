---
title: Transports
description: BroadcastTransport vs MemoryTransport, and when tabus-js falls back.
---

`Tabus` doesn't talk to the browser directly: it delegates sending and receiving messages to a transport that implements [`ITransport`](/en/docs/api/transportes/). Two implementations are included, and `Tabus` picks one automatically when constructed.

## Automatic choice

```ts
typeof BroadcastChannel !== "undefined"
  ? new BroadcastTransport(channelName)
  : new MemoryTransport(channelName);
```

You don't need to choose the transport by hand: `Tabus` checks whether `BroadcastChannel` exists in the current environment and decides for you.

## `BroadcastTransport`

It's a thin wrapper around the native [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) API:

| `ITransport` method | Translates to |
|---|---|
| `send(msg)` | `bc.postMessage(msg)` |
| `onMessage(listener)` | `bc.addEventListener("message", ...)` |
| `destroy()` | `bc.close()` |

Works **across real tabs, windows, and workers** of the same origin. It's the transport used in any modern browser.

## `MemoryTransport`, the fallback

Kicks in when `BroadcastChannel` doesn't exist: Node, SSR environments, or very old browsers without support.

- Keeps a **module-level** registry: a `Map<string, Set<listener>>` shared by every `MemoryTransport` instance within the same process.
- Unlike `BroadcastTransport`, the emitter's own listener **is** invoked by `send()` — it's `Tabus`, not the transport, that filters by `tabId` so as not to hand the tab its own event back.
- Emits a single `console.warn` **per channel name**, warning that the fallback kicked in.
- Exposes `__resetMemoryBus()`, meant exclusively for clearing state between tests.

:::caution
The in-memory fallback **doesn't cross real tabs**. It's only useful for communication within the same process (for example, in tests or SSR). If your app depends on actually syncing tabs, it needs to run in a browser that supports `BroadcastChannel`.
:::

:::note
`__resetMemoryBus()` is meant **only for tests** — don't use it in production code.
:::

## When should I worry about this?

In practice, you almost never have to think about which transport is being used: `Tabus`'s public API (`on`, `off`, `emit`, `destroy`) is identical in both cases. It's worth keeping in mind in two scenarios:

- **SSR**: tabus-js doesn't throw errors when imported or instantiated on the server, because it falls back to the in-memory bus instead of trying to use `BroadcastChannel`.
- **Tests**: if you run tests in Node (as the library itself does, with Vitest), it's normal to see the fallback's `console.warn` unless you force or mock `BroadcastChannel`.

## Next step

Check the [transports API reference](/en/docs/api/transportes/) to see the exact shape of `ITransport`, `BroadcastTransport`, and `MemoryTransport`.
