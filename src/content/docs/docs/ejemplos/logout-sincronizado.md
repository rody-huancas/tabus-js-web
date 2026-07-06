---
title: Logout sincronizado
description: Cerrar sesión en una pestaña y reflejarlo automáticamente en todas las demás.
---

## El problema

Un usuario tiene tu app abierta en varias pestañas. Si cierra sesión en una, las demás siguen mostrando contenido protegido como si la sesión siguiera activa — hasta que recarga o hace otra petición y recibe un 401.

## La solución

Emitir un evento `auth:logout` al cerrar sesión, y que cada pestaña, al recibirlo, limpie su propio estado de autenticación y redirija al login.

```ts
import { Tabus } from "tabus-js";

type AuthEvents = {
  "auth:logout": void;
};

const bus = new Tabus<AuthEvents>("auth");

export function logout() {
  // 1. Limpieza local (la pestaña que origina el logout no recibe su propio emit)
  clearSession();
  redirectToLogin();

  // 2. Avisar a todas las demás pestañas
  bus.emit("auth:logout", undefined);
}

// En cada pestaña, al arrancar la app:
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

## Por qué funciona

- `bus.emit("auth:logout", undefined)` difunde el evento a **todas las demás pestañas** del mismo canal `"auth"`.
- Como [la pestaña emisora nunca recibe su propio `emit()`](/docs/guias/limites/), la pestaña donde el usuario hizo clic en "Cerrar sesión" limpia su estado de forma directa (no a través del bus), mientras que el resto reacciona al evento entrante.
- Si el usuario abre una pestaña nueva ya deslogueado en otra, no hay ningún evento que recibir — simplemente arranca sin sesión, como es de esperar.

:::tip
Puedes extender `auth:logout` para incluir un motivo (`{ reason: "manual" | "expired" }`) si necesitas mostrar mensajes distintos según el caso.
:::

## Siguiente paso

Revisa [Eventos de ciclo de vida](/docs/guias/eventos-ciclo-vida/) si además quieres saber cuántas pestañas siguen activas antes de decidir hacer algo global como este logout.
