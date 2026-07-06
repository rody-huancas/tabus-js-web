---
title: Transportes
description: Referencia de ITransport, BroadcastTransport y MemoryTransport.
---

Para la explicación conceptual de cuándo se usa cada transporte, ver la guía [Transportes](/docs/guias/transportes/). Esta página documenta su forma exacta.

:::note
`BroadcastTransport` y `MemoryTransport` son detalles internos: `Tabus` los elige automáticamente y no se exportan desde el punto de entrada público del paquete. Solo `ITransport` (el tipo del contrato) forma parte de los [exports públicos](/docs/api/exports/).
:::

## `ITransport`

```ts
interface ITransport {
  send(msg: TabusMessage): void;
  onMessage(listener: (msg: TabusMessage) => void): void;
  destroy(): void;
}
```

| Miembro | Descripción |
|---|---|
| `send(msg)` | Envía un `TabusMessage` a través del transporte. |
| `onMessage(listener)` | Registra un listener que se invoca con cada `TabusMessage` recibido. |
| `destroy()` | Libera los recursos del transporte (cierra el canal subyacente). |

:::caution
La deduplicación por `tabId` es responsabilidad de `Tabus`, **no** del transporte. Cualquier implementación nueva de `ITransport` debe respetar este contrato: puede reenviarle al propio emisor su mensaje sin problema.
:::

## `BroadcastTransport`

Envoltorio delgado sobre la API nativa `BroadcastChannel`.

| Método | Implementación |
|---|---|
| `send(msg)` | `bc.postMessage(msg)` |
| `onMessage(listener)` | `bc.addEventListener("message", ...)` |
| `destroy()` | `bc.close()` |

Es el transporte usado por defecto en cualquier navegador con soporte de `BroadcastChannel`, y comunica pestañas, ventanas y workers reales del mismo origen.

## `MemoryTransport`

Fallback en memoria, activo cuando `BroadcastChannel` no existe (Node, SSR, navegadores muy antiguos).

- Mantiene un registro a nivel de módulo: `Map<string, Set<listener>>`, compartido por todas las instancias de `MemoryTransport` dentro del mismo proceso.
- Solo funciona dentro del mismo proceso/pestaña — no cruza pestañas reales, porque sin `BroadcastChannel` no existe tal concepto.
- A diferencia de `BroadcastTransport`, el propio listener del emisor **sí es invocado** por `send()`; es `Tabus` quien filtra por `tabId`.
- Emite un `console.warn` **una sola vez por nombre de canal**, avisando que se activó el fallback.

### `__resetMemoryBus()`

```ts
function __resetMemoryBus(): void
```

Limpia el registro interno a nivel de módulo de `MemoryTransport` (los listeners y el registro de canales ya avisados).

:::caution
Es una función **interna del módulo de transporte**, no forma parte del punto de entrada público del paquete (no se puede hacer `import { __resetMemoryBus } from "tabus-js"`). Existe únicamente para que la propia suite de tests de la librería limpie el estado global entre pruebas — no la uses en código de aplicación.
:::

## Siguiente paso

[Exports](/docs/api/exports/) resume qué de todo esto se exporta públicamente desde `tabus-js`.
