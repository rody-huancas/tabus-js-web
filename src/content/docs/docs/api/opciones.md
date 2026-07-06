---
title: Opciones
description: Referencia de TabusOptions — throttle y trailing.
---

`TabusOptions` es el segundo argumento opcional del constructor de [`Tabus`](/docs/api/tabus/).

```ts
interface TabusOptions {
  throttle?: number; // ms mínimos entre mensajes emitidos (default: 0, sin throttle)
  trailing?: boolean; // emitir el último mensaje pendiente al expirar la ventana (default: true)
}
```

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `throttle` | `number` | `0` (sin throttle) | Milisegundos mínimos entre mensajes realmente emitidos por el transporte. |
| `trailing` | `boolean` | `true` | Si al expirar la ventana de throttle se emite automáticamente el último mensaje pendiente. |

## Uso

```ts
const bus = new Tabus<Events>("canvas", { throttle: 16 });
```

Con `throttle: 0` (el valor por defecto), cada llamada a `emit()` se envía de inmediato — no hay limitación de frecuencia.

`trailing` solo tiene efecto cuando `throttle` está seteado (mayor que `0`); si no hay throttle, no hay ventana que rastrear.

Con `trailing: false`, solo se respeta el leading edge: la primera llamada dentro de la ventana se emite, y el resto se descarta silenciosamente hasta que la ventana expire.

## Siguiente paso

Consulta [Throttling](/docs/guias/throttle/) para el detalle completo de la estrategia leading + trailing edge, con ejemplos.
