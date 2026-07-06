---
title: Synchronized logout
description: Log out in one tab and automatically reflect it in all the others.
---

## The problem

A user has your app open in several tabs. If they log out in one, the others keep showing protected content as if the session were still active — until they reload or make another request and get a 401.

## The solution

Emit an `auth:logout` event on logout, and have each tab, upon receiving it, clear its own authentication state and redirect to the login page.

```ts
import { Tabus } from "tabus-js";

type AuthEvents = {
  "auth:logout": void;
};

const bus = new Tabus<AuthEvents>("auth");

export function logout() {
  // 1. Local cleanup (the tab that originates the logout doesn't receive its own emit)
  clearSession();
  redirectToLogin();

  // 2. Notify all other tabs
  bus.emit("auth:logout", undefined);
}

// In every tab, when the app starts:
bus.on("auth:logout", () => {
  clearSession();
  redirectToLogin();
});

function clearSession() {
  localStorage.removeItem("session");
}

function redirectToLogin() {
  window.location.assign("/login");
}
```

## Why it works

- `bus.emit("auth:logout", undefined)` broadcasts the event to **all other tabs** on the same `"auth"` channel.
- Since [the emitting tab never receives its own `emit()`](/en/docs/guias/limites/), the tab where the user clicked "Log out" clears its state directly (not through the bus), while the rest react to the incoming event.
- If the user opens a new tab while already logged out in another one, there's no event to receive — it simply starts without a session, as expected.

:::tip
You can extend `auth:logout` to include a reason (`{ reason: "manual" | "expired" }`) if you need to show different messages depending on the case.
:::

## Next step

Check out [Lifecycle events](/en/docs/guias/eventos-ciclo-vida/) if you also want to know how many tabs are still active before deciding to do something global like this logout.
