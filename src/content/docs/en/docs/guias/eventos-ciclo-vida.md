---
title: Lifecycle events
description: tab:join and tab:leave — when they're emitted, why they're deferred, and how destroy() guards this behavior.
---

Besides the events you define, every `Tabus` instance automatically emits two internal events to notify its peers about its lifecycle.

| Event | Payload | When it's emitted |
|---|---|---|
| `tab:join` | `{ tabId: string }` | Shortly after the instance is created, notifying peers that a new tab joined the channel. |
| `tab:leave` | `{ tabId: string }` | When `destroy()` is called, as long as `tab:join` had already been emitted previously. |

They're listened to just like any other event:

```ts
bus.on("tab:join", ({ tabId }) => console.log("new tab connected:", tabId));
bus.on("tab:leave", ({ tabId }) => console.log("tab closed:", tabId));
```

## Why `tab:join` is deferred

`tab:join` isn't emitted synchronously in the constructor: it's deferred with `setTimeout(0)`. This gives whoever creates the instance a chance to register their handlers **before** the notice reaches peers:

```ts
const bus = new Tabus("my-app");

// This handler is already registered by the time tab:join is broadcast,
// because the actual emission happens on the next tick.
bus.on("tab:join", ({ tabId }) => console.log("new tab:", tabId));
```

If `tab:join` were emitted immediately (synchronously), there would be a race window: another tab could react and respond before this instance got around to subscribing to anything.

## The `destroy()` guard

Because `tab:join` is asynchronous, it's possible for someone to call `destroy()` in the same tick the instance was created, before the timer fires. `Tabus` accounts for this with an internal flag:

- If `destroy()` is called **before** the `tab:join` timer fires, **neither `tab:join` nor `tab:leave` are sent**. Peers never got to know this tab existed, so there's no point telling them it's gone either.
- If `destroy()` is called **afterward**, `tab:leave` is emitted normally.

:::tip
This guard prevents "ghost" events: tabs that are created and destroyed within the same tick (for example, in a component that mounts and unmounts very quickly) don't generate noise for the rest of the tabs.
:::

## Next step

- [Considerations and limits](/en/docs/guias/limites/) summarizes this and other behaviors to keep in mind.
- The full shape of these events is in [Types → `InternalEvents`](/en/docs/api/tipos/).
