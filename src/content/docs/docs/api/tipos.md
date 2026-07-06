---
title: Tipos
description: Referencia de los tipos públicos de tabus-js — Handler, EventMap, TabusMessage, InternalEvents y FullEventMap.
---

Todos estos tipos viven en `src/core/types.ts` y forman la base del sistema de tipos de la librería.

| Tipo | Descripción |
|---|---|
| `Handler<T>` | `(payload: T) => void` — firma de un handler de evento. |
| `EventMap` | `Record<string, unknown>` — restricción genérica para los eventos definidos por el usuario. |
| `TabusMessage<T>` | Forma del mensaje interno: `{ tabId, event, payload }`. |
| `InternalEvents` | `{ "tab:join": { tabId }, "tab:leave": { tabId } }` — eventos de ciclo de vida emitidos automáticamente. |
| `FullEventMap<T>` | Combina los eventos del usuario (`T`) con `InternalEvents`; se usa en las firmas de `on()` / `off()`. |
| `TabusOptions` | `{ throttle?: number; trailing?: boolean }` — ver [Opciones](/docs/api/opciones/). |

## `Handler<T>`

```ts
type Handler<T = unknown> = (payload: T) => void;
```

Firma que debe cumplir cualquier función pasada a `on()` u `off()`.

## `EventMap`

```ts
type EventMap = Record<string, unknown>;
```

Restricción genérica que debe cumplir el tipo de eventos que le pasas a `Tabus<Events>`. Cualquier objeto con claves de tipo `string` sirve:

```ts
type MyEvents = {
  data: { value: number };
  reset: void;
};
```

## `TabusMessage<T>`

```ts
interface TabusMessage<T = unknown> {
  tabId: string;
  event: string;
  payload: T;
}
```

Forma del mensaje interno que viaja por el transporte. Es el tipo que reciben `send()` y los listeners registrados con `onMessage()` en [`ITransport`](/docs/api/transportes/).

## `InternalEvents`

```ts
type InternalEvents = {
  "tab:join": { tabId: string };
  "tab:leave": { tabId: string };
};
```

Los dos eventos de ciclo de vida que `Tabus` emite automáticamente. Ver [Eventos de ciclo de vida](/docs/guias/eventos-ciclo-vida/).

## `FullEventMap<T>`

```ts
type FullEventMap<T extends EventMap> = T & InternalEvents;
```

Combina tus eventos personalizados con `InternalEvents`. Es el tipo real que usan las firmas de `on()` y `off()`, por lo que siempre puedes suscribirte a `"tab:join"` / `"tab:leave"` además de tus propios eventos, sin declararlos tú mismo.

## Siguiente paso

- [Clase Tabus](/docs/api/tabus/): dónde se usan estos tipos en la práctica.
- [Exports](/docs/api/exports/): qué se exporta públicamente desde el paquete.
