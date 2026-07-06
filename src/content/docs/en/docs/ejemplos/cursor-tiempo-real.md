---
title: Real-time cursor
description: Show another tab's cursor position in real time, with throttling.
---

## The problem

You want to show in one tab where another tab's cursor is — for example, for a collaborative demo within the same browser session — but `mousemove` fires dozens of events per second. Emitting one for every movement would needlessly flood the channel.

## The solution

Use `Tabus`'s `throttle` option to limit the actual sending frequency to, say, ~60fps (16ms), taking advantage of the fact that throttling always emits the last value (trailing edge).

```ts
import { Tabus } from "tabus-js";

type CursorEvents = {
  cursor: { x: number; y: number };
};

const bus = new Tabus<CursorEvents>("canvas", { throttle: 16 });

// Emit this tab's cursor position
window.addEventListener("mousemove", (e) => {
  bus.emit("cursor", { x: e.clientX, y: e.clientY });
});

// Draw the other tabs' cursor
const remoteCursor = document.getElementById("remote-cursor")!;

bus.on("cursor", ({ x, y }) => {
  remoteCursor.style.transform = `translate(${x}px, ${y}px)`;
});

window.addEventListener("beforeunload", () => bus.destroy());
```

## Why it works

- Without `throttle`, every `mousemove` would emit immediately, generating excessive cross-tab traffic.
- With `throttle: 16`, the first position of each burst is emitted right away (leading edge) and the rest are dropped until the window expires, at which point the **last** known position is emitted automatically (trailing edge) — the remote cursor keeps looking smooth without flooding messages.
- `bus.destroy()` cancels any pending trailing send, so no "stale" position arrives after the tab closes.

:::tip
16ms is a good starting point for 60fps animations. For something less critical (like a progress bar), a larger throttle (100–250ms) is usually enough and reduces traffic even further.
:::

## Next step

See [Throttling](/en/docs/guias/throttle/) for the full detail of the leading + trailing edge strategy.
