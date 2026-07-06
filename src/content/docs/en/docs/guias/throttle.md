---
title: Throttling
description: How emit() throttling works in tabus-js — leading + trailing edge.
---

When you pass the `throttle` option (in milliseconds) when constructing a `Tabus`, `emit()` limits how often messages are actually sent through the transport.

```ts
interface TabusOptions {
  throttle?: number; // minimum ms between emitted messages (default: 0, no throttle)
  trailing?: boolean; // emit the last pending message when the window expires (default: true)
}
```

## Leading + trailing edge

- **Leading edge**: the first call within a "window" is emitted **immediately**.
- **Subsequent calls within the window**: aren't emitted instantly; instead they replace a pending message (only the last one is kept).
- **Trailing edge** (if `trailing !== false`): when the window expires, the saved pending message is emitted automatically.
- If `trailing: false`, intermediate messages are silently dropped and only the leading edge is honored.
- `destroy()` cancels any pending trailing timer and discards the pending message — nothing is emitted after the instance is destroyed.

## Example: cursor at ~60fps

```ts
const bus = new Tabus("canvas", { throttle: 16 }); // ~60fps

// If called many times in a row (e.g. on mousemove):
bus.emit("cursor", { x: 10, y: 20 }); // emitted RIGHT NOW (leading edge)
bus.emit("cursor", { x: 11, y: 21 }); // saved as pending
bus.emit("cursor", { x: 12, y: 22 }); // replaces the previous pending one
// ...once 16ms have passed since the last leading emit,
// the LAST pending payload is emitted automatically: { x: 12, y: 22 }
```

With `trailing: false`, only `{ x: 10, y: 20 }` would be emitted and the rest would be lost.

:::tip
This pattern is ideal for high-frequency events (mouse movement, scroll, resize): you drastically reduce cross-tab traffic without losing the final value, which is usually the most relevant one.
:::

## When to use `trailing: false`

Use it when the intermediate value doesn't matter and the only thing that's relevant is reacting quickly to the first event of a burst — for example, a "something changed" notice where you don't care about the last state, only that it happened.

## Next step

Check out the full [real-time cursor](/en/docs/ejemplos/cursor-tiempo-real/) example, which uses this same throttle pattern on a `mousemove`.
