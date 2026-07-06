---
title: Detección de presencia de pestañas
description: Saber cuántas pestañas de tu app están abiertas en tiempo real, usando tab:join y tab:leave.
---

## El problema

Quieres saber cuántas pestañas de tu app tiene abiertas el usuario ahora mismo — por ejemplo, para mostrar un aviso de "tu sesión también está abierta en otra pestaña" o para evitar tareas duplicadas entre pestañas.

## La solución

Los eventos internos `tab:join` y `tab:leave` avisan cuándo una pestaña se conecta o se desconecta del canal. Con eso alcanza para mantener un registro de pestañas activas.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus("presence");

// Empieza en 1: esta misma pestaña ya cuenta.
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
  console.log(`Pestañas activas: ${activeTabs.size}`);
}

window.addEventListener("beforeunload", () => bus.destroy());
```

## Por qué funciona

- Cada instancia de `Tabus` emite `tab:join` poco después de crearse, avisando a los peers existentes que una nueva pestaña se unió — ver [Eventos de ciclo de vida](/docs/guias/eventos-ciclo-vida/).
- Al llamar `destroy()` (por ejemplo, en `beforeunload`), esa instancia emite `tab:leave`, y las demás pestañas descuentan su `tabId` del registro.
- Como el propio `tabId` se agrega manualmente al set al arrancar, cada pestaña siempre cuenta consigo misma sin depender de recibir su propio `tab:join`.

:::caution
Este conteo vive solo en memoria de cada pestaña: si una pestaña se cierra de forma abrupta (el navegador se cuelga, se mata el proceso) sin que `beforeunload` llegue a ejecutarse, su `tab:leave` puede no emitirse y el conteo quedar temporalmente desactualizado en las demás pestañas.
:::

## Siguiente paso

Combina esto con [Logout sincronizado](/docs/ejemplos/logout-sincronizado/) para, por ejemplo, solo forzar un logout global cuando la última pestaña se cierra.
