---
title: Tab presence detection
description: Know how many tabs of your app are open in real time, using tab:join and tab:leave.
---

## The problem

You want to know how many tabs of your app the user currently has open — for example, to show a "your session is also open in another tab" notice, or to avoid duplicating tasks across tabs.

## The solution

The internal `tab:join` and `tab:leave` events notify you when a tab connects to or disconnects from the channel. That's enough to keep a registry of active tabs.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus("presence");

// Starts at 1: this tab itself already counts.
const activeTabs = new Set<string>([bus.tabId]);

bus.on("tab:join", ({ tabId }) => {
  activeTabs.add(tabId);
  renderCount();
});

bus.on("tab:leave", ({ tabId }) => {
  activeTabs.delete(tabId);
  renderCount();
});

function renderCount() {
  console.log(`Active tabs: ${activeTabs.size}`);
}

window.addEventListener("beforeunload", () => bus.destroy());
```

## Why it works

- Every `Tabus` instance emits `tab:join` shortly after being created, notifying existing peers that a new tab joined — see [Lifecycle events](/en/docs/guias/eventos-ciclo-vida/).
- When `destroy()` is called (for example, on `beforeunload`), that instance emits `tab:leave`, and the other tabs remove its `tabId` from the registry.
- Since its own `tabId` is manually added to the set on startup, every tab always counts itself without depending on receiving its own `tab:join`.

:::caution
This count only lives in each tab's memory: if a tab closes abruptly (the browser crashes, the process is killed) without `beforeunload` getting to run, its `tab:leave` might not be emitted, and the count can be temporarily out of date in the other tabs.
:::

## Next step

Combine this with [Synchronized logout](/en/docs/ejemplos/logout-sincronizado/) to, for example, only force a global logout when the last tab closes.
