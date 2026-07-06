---
title: Consideraciones y límites
description: Comportamientos a tener en cuenta al usar tabus-js en producción.
---

Antes de integrar tabus-js en tu app, ten presentes estos comportamientos por diseño:

:::caution
**La pestaña emisora nunca recibe su propio `emit()`.** Si necesitas manejar el evento también en la pestaña que lo origina, invoca tu handler de forma manual además de emitir.
:::

```ts
const bus = new Tabus<{ data: number }>("app");

const handleData = (value: number) => console.log(value);

bus.on("data", handleData);

function send(value: number) {
  bus.emit("data", value);
  handleData(value); // procesamiento local explícito
}
```

:::caution
**El fallback en memoria no cruza pestañas reales.** [`MemoryTransport`](/docs/guias/transportes/) solo sirve para pruebas, SSR, o comunicación dentro del mismo proceso. Si tu app necesita sincronizar pestañas de verdad, depende de que el navegador soporte `BroadcastChannel`.
:::

:::note
**`destroy()` es idempotente.** Llamarlo más de una vez no produce efectos secundarios ni errores — es seguro invocarlo desde múltiples lugares (por ejemplo, un `beforeunload` y un `useEffect` cleanup) sin coordinarlos entre sí.
:::

- **Después de `destroy()`, `on()` y `emit()` son no-ops seguros.** No lanzan errores ni tienen efecto — simplemente no hacen nada. No hace falta comprobar manualmente si una instancia sigue viva antes de usarla.

- **Cero dependencias en tiempo de ejecución.** tabus-js solo usa APIs nativas del entorno: `BroadcastChannel`, `crypto.randomUUID` y `setTimeout`. No hay nada que actualizar por dependencias transitivas.
- **El orden de entrega no está garantizado entre pestañas con carga distinta.** Si dos pestañas emiten casi al mismo tiempo, el orden en que cada peer los recibe depende del scheduler del navegador, no de un reloj global.
- **`tabId` es efímero.** Se genera por instancia (con `crypto.randomUUID()` o un fallback manual) y no persiste entre recargas de página — no lo uses como identificador estable de usuario o sesión.

## Siguiente paso

- [Eventos de ciclo de vida](/docs/guias/eventos-ciclo-vida/) explica en detalle el diferido de `tab:join` y la protección de `destroy()`.
- La [referencia de la clase Tabus](/docs/api/tabus/) documenta la firma exacta de cada método.
