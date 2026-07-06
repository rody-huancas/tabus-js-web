---
title: Transportes
description: BroadcastTransport vs MemoryTransport, y cuándo tabus-js cae al fallback.
---

`Tabus` no habla directamente con el navegador: delega el envío y la recepción de mensajes en un transporte que implementa [`ITransport`](/docs/api/transportes/). Hay dos implementaciones incluidas, y `Tabus` elige una automáticamente al construirse.

## Elección automática

```ts
typeof BroadcastChannel !== "undefined"
  ? new BroadcastTransport(channelName)
  : new MemoryTransport(channelName);
```

No necesitas elegir el transporte a mano: `Tabus` comprueba si `BroadcastChannel` existe en el entorno actual y decide por ti.

## `BroadcastTransport`

Es un envoltorio delgado sobre la API nativa [`BroadcastChannel`](https://developer.mozilla.org/es/docs/Web/API/BroadcastChannel):

| Método de `ITransport` | Se traduce a |
|---|---|
| `send(msg)` | `bc.postMessage(msg)` |
| `onMessage(listener)` | `bc.addEventListener("message", ...)` |
| `destroy()` | `bc.close()` |

Funciona **entre pestañas, ventanas y workers reales** del mismo origen. Es el transporte que se usa en cualquier navegador moderno.

## `MemoryTransport`, el fallback

Se activa cuando `BroadcastChannel` no existe: Node, entornos de SSR, o navegadores muy antiguos sin soporte.

- Mantiene un registro **a nivel de módulo**: un `Map<string, Set<listener>>` compartido por todas las instancias de `MemoryTransport` dentro del mismo proceso.
- A diferencia de `BroadcastTransport`, el propio listener del emisor **sí es invocado** por `send()` — es `Tabus`, no el transporte, quien filtra por `tabId` para no reenviarle a la pestaña su propio evento.
- Emite un único `console.warn` **por nombre de canal**, avisando que se activó el fallback.
- Expone `__resetMemoryBus()`, pensado exclusivamente para limpiar estado entre tests.

:::caution
El fallback en memoria **no cruza pestañas reales**. Solo sirve para comunicación dentro del mismo proceso (por ejemplo, en tests o en SSR). Si tu app depende de sincronizar pestañas de verdad, necesita ejecutarse en un navegador con soporte de `BroadcastChannel`.
:::

:::note
`__resetMemoryBus()` está pensado **solo para tests** — no lo uses en código de producción.
:::

## ¿Cuándo debería preocuparme por esto?

En la práctica, casi nunca tienes que pensar en qué transporte se está usando: la API pública de `Tabus` (`on`, `off`, `emit`, `destroy`) es idéntica en ambos casos. Vale la pena tenerlo en cuenta en dos escenarios:

- **SSR**: tabus-js no lanza errores al importarse o instanciarse en el servidor, porque cae al fallback en memoria en vez de intentar usar `BroadcastChannel`.
- **Tests**: si corres tests en Node (como hace la propia librería, con Vitest), es normal ver el `console.warn` del fallback salvo que fuerces o mockees `BroadcastChannel`.

## Siguiente paso

Consulta la [referencia de la API de transportes](/docs/api/transportes/) para ver la forma exacta de `ITransport`, `BroadcastTransport` y `MemoryTransport`.
