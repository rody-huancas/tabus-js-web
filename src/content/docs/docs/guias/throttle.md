---
title: Throttling
description: Cómo funciona el throttle de emit() en tabus-js — leading + trailing edge.
---

Cuando pasas la opción `throttle` (en milisegundos) al construir un `Tabus`, `emit()` limita la frecuencia con la que se envían mensajes realmente por el transporte.

```ts
interface TabusOptions {
  throttle?: number; // ms mínimos entre mensajes emitidos (default: 0, sin throttle)
  trailing?: boolean; // emitir el último mensaje pendiente al expirar la ventana (default: true)
}
```

## Leading + trailing edge

- **Leading edge**: la primera llamada dentro de una "ventana" se emite **inmediatamente**.
- **Llamadas siguientes dentro de la ventana**: no se emiten al instante; en su lugar reemplazan un mensaje pendiente (solo se conserva el último).
- **Trailing edge** (si `trailing !== false`): cuando expira la ventana, el mensaje pendiente guardado se emite automáticamente.
- Si `trailing: false`, los mensajes intermedios se descartan silenciosamente y solo se respeta el leading edge.
- `destroy()` cancela cualquier timer de trailing pendiente y descarta el mensaje pendiente — no se emite nada tras destruir la instancia.

## Ejemplo: cursor a ~60fps

```ts
const bus = new Tabus("canvas", { throttle: 16 }); // ~60fps

// Si se llama muchas veces seguidas (p. ej. en un mousemove):
bus.emit("cursor", { x: 10, y: 20 }); // se emite YA (leading edge)
bus.emit("cursor", { x: 11, y: 21 }); // se guarda como pendiente
bus.emit("cursor", { x: 12, y: 22 }); // reemplaza el pendiente anterior
// ...cuando pasan los 16ms desde el último leading emit,
// se emite automáticamente el ÚLTIMO payload pendiente: { x: 12, y: 22 }
```

Con `trailing: false`, solo se emitiría `{ x: 10, y: 20 }` y el resto se perdería.

:::tip
Este patrón es ideal para eventos de alta frecuencia (movimiento del mouse, scroll, resize): reduces drásticamente el tráfico entre pestañas sin perder el valor final, que es normalmente el más relevante.
:::

## Cuándo usar `trailing: false`

Úsalo cuando el valor intermedio no importa y lo único relevante es reaccionar rápido al primer evento de una ráfaga — por ejemplo, un aviso de "algo cambió" donde no te interesa el último estado, solo saber que ocurrió.

## Siguiente paso

Mira el ejemplo completo de [cursor en tiempo real](/docs/ejemplos/cursor-tiempo-real/), que usa este mismo patrón de throttle sobre un `mousemove`.
