---
title: Introduction
description: What tabus-js is, what problem it solves, and when to use it.
---

## What is it?

`tabus-js` is a **dependency-free TypeScript** library that lets you send and receive typed events between tabs or windows of the same browser (or between multiple instances within the same process).

It uses the native [`BroadcastChannel`](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) API when available, and when it isn't (SSR, unsupported environments, Node), it automatically falls back to an in-memory bus within the same process.

:::note
The bus is identified by a **channel name**. All instances created with the same name — in any tab of the same origin — communicate with each other.
:::

## What is it for?

Typical use cases:

- **Syncing state across tabs**: for example, logging out in one tab and reflecting it in all the others.
- **Cross-tab notifications**: telling other tabs that an event happened (new data saved, cart updated, etc.).
- **Detecting the presence of other tabs**: knowing how many tabs of the app are open, using the `tab:join` / `tab:leave` events.
- **Coordinating actions**: preventing two tabs from doing the same task in parallel (simple locks, leader/follower).
- **SSR-safe**: works on the server without throwing errors, because it uses the in-memory fallback when `BroadcastChannel` doesn't exist.

## Next step

Continue with [Installation](/en/docs/getting-started/instalacion/) to add tabus-js to your project, or jump straight to [Quick start](/en/docs/getting-started/quick-start/) to see basic usage step by step.
