---
title: Cursor en tiempo real
description: Mostrar la posición del cursor de otras pestañas en tiempo real, con throttle.
---

## El problema

Quieres mostrar en una pestaña dónde está el cursor de otra —por ejemplo, para una demo colaborativa dentro de la misma sesión de navegador—, pero `mousemove` dispara decenas de eventos por segundo. Emitir uno por cada movimiento saturaría el canal sin necesidad.

## La solución

Usar la opción `throttle` de `Tabus` para limitar la frecuencia real de envío a, por ejemplo, ~60fps (16ms), aprovechando que el throttle siempre emite el último valor (trailing edge).

```ts
import { Tabus } from "tabus-js";

type CursorEvents = {
  cursor: { x: number; y: number };
};

const bus = new Tabus<CursorEvents>("canvas", { throttle: 16 });

// Emitir la posición del cursor de esta pestaña
window.addEventListener("mousemove", (e) => {
  bus.emit("cursor", { x: e.clientX, y: e.clientY });
});

// Dibujar el cursor de las demás pestañas
const remoteCursor = document.getElementById("remote-cursor")!;

bus.on("cursor", ({ x, y }) => {
  remoteCursor.style.transform = `translate(${x}px, ${y}px)`;
});

window.addEventListener("beforeunload", () => bus.destroy());
```

## Por qué funciona

- Sin `throttle`, cada `mousemove` emitiría de inmediato, generando tráfico excesivo entre pestañas.
- Con `throttle: 16`, la primera posición de cada ráfaga se emite al instante (leading edge) y el resto se descarta hasta que expira la ventana, momento en el que se emite automáticamente la **última** posición conocida (trailing edge) — el cursor remoto sigue viéndose fluido sin flood de mensajes.
- `bus.destroy()` cancela cualquier envío de trailing pendiente, así que no llega una posición "vieja" después de cerrar la pestaña.

:::tip
16ms es un buen punto de partida para animaciones a 60fps. Para algo menos crítico (como una barra de progreso), un throttle mayor (100–250ms) suele bastar y reduce aún más el tráfico.
:::

## Siguiente paso

Consulta [Throttling](/docs/guias/throttle/) para el detalle completo de la estrategia leading + trailing edge.
