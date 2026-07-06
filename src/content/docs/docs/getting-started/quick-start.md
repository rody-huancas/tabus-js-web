---
title: Inicio rápido
description: Crea tu primer bus de eventos entre pestañas en unos minutos.
---

Esta guía recorre el uso básico de tabus-js paso a paso, hasta tener dos pestañas sincronizadas.

## 1. Define tus eventos

`Tabus` es genérico: define un tipo con los eventos que vas a emitir y sus payloads. Esto te da autocompletado y chequeo de tipos en `on()` y `emit()`.

```ts
type MyEvents = {
  data: { value: number };
  reset: void;
};
```

## 2. Crea la instancia

Instancia `Tabus` pasando un nombre de canal. Todas las instancias creadas con el mismo nombre, en cualquier pestaña del mismo origen, se comunican entre sí.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus<MyEvents>("my-app");
```

Si no pasas un nombre, se usa `"tabus"` por defecto.

## 3. Suscríbete a eventos

`on()` acepta tanto tus eventos personalizados como los eventos internos de ciclo de vida `tab:join` y `tab:leave`:

```ts
bus.on("data", ({ value }) => console.log("valor recibido:", value));
bus.on("tab:join", ({ tabId }) => console.log("nueva pestaña conectada:", tabId));
bus.on("tab:leave", ({ tabId }) => console.log("pestaña cerrada:", tabId));
```

## 4. Emite eventos

`emit()` difunde el evento a todas las demás instancias del mismo canal:

```ts
bus.emit("data", { value: 42 });
```

:::caution
La pestaña que emite un evento **nunca lo recibe a sí misma**. Si necesitas también procesar el evento localmente, invoca tu handler de forma manual además de emitir.
:::

## 5. Limpia al cerrar

Llama a `destroy()` cuando ya no necesites la instancia, por ejemplo al cerrar la pestaña. Emite `tab:leave`, cierra el transporte subyacente y limpia todos los handlers:

```ts
window.addEventListener("beforeunload", () => bus.destroy());
```

## Todo junto

```ts
import { Tabus } from "tabus-js";

type MyEvents = {
  data: { value: number };
  reset: void;
};

// Todas las instancias con el mismo nombre de canal se comunican entre sí.
const bus = new Tabus<MyEvents>("my-app");

bus.on("data", ({ value }) => console.log("valor recibido:", value));
bus.on("tab:join", ({ tabId }) => console.log("nueva pestaña conectada:", tabId));
bus.on("tab:leave", ({ tabId }) => console.log("pestaña cerrada:", tabId));

// Emitir un evento a todas las DEMÁS pestañas (esta pestaña no se recibe a sí misma)
bus.emit("data", { value: 42 });

// Limpieza al cerrar la pestaña
window.addEventListener("beforeunload", () => bus.destroy());
```

Para probarlo: abre la misma página en dos pestañas, ejecuta `bus.emit("data", { value: 42 })` en la consola de una y observa el `console.log` en la otra.

## Siguiente paso

- Para entender el porqué de estas decisiones (deduplicación, `tab:join` diferido, `destroy()` idempotente), revisa [Cómo funciona](/docs/guias/conceptos/).
- Si tu app usa React, Vue, Angular o Svelte, revisa la sección [Integraciones](/docs/integraciones/react/) para ver el patrón idiomático de cada framework.
