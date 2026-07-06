---
title: Clase Tabus
description: Referencia completa de la clase Tabus — constructor, tabId, on, off, emit y destroy.
---

`Tabus` es la única clase pública que expone la librería.

```ts
import { Tabus } from "tabus-js";

const bus = new Tabus<Events>(channelName?, options?);
```

## API pública

| Miembro | Descripción |
|---|---|
| `new Tabus<Events>(channelName?, options?)` | Crea una instancia. `channelName` por defecto es `"tabus"`. |
| `tabId: string` | Identificador único de esta instancia/pestaña (`crypto.randomUUID()` o fallback manual). |
| `on(event, handler)` | Se suscribe a un evento (incluye `"tab:join"` / `"tab:leave"`). Devuelve `this` (encadenable). |
| `off(event, handler)` | Cancela la suscripción de un handler específico. Devuelve `this`. |
| `emit(event, payload)` | Difunde un evento a todas las **demás** instancias del mismo canal. La instancia emisora no recibe su propio evento. Devuelve `this` (encadenable). |
| `destroy()` | Emite `"tab:leave"`, cierra el transporte y limpia todos los handlers. Es seguro llamarlo varias veces (no-op tras la primera). |

## Constructor

```ts
new Tabus<Events extends EventMap>(channelName?: string, options?: TabusOptions)
```

- `channelName` (opcional): nombre del canal. Todas las instancias con el mismo nombre, en el mismo origen, se comunican entre sí. Por defecto: `"tabus"`.
- `options` (opcional): ver [`TabusOptions`](/docs/api/opciones/).

Al construirse, `Tabus` elige automáticamente el transporte adecuado — ver [Transportes](/docs/api/transportes/) — y programa la emisión diferida de `tab:join` (ver [Eventos de ciclo de vida](/docs/guias/eventos-ciclo-vida/)).

## `tabId`

```ts
readonly tabId: string
```

Identificador único de esta instancia, generado con `crypto.randomUUID()` (o un fallback manual si no está disponible). Se usa internamente para deduplicar mensajes: `Tabus` nunca entrega a un handler un mensaje cuyo `tabId` coincida con el propio.

## `on(event, handler)`

```ts
on<E extends keyof FullEventMap<Events>>(
  event: E,
  handler: Handler<FullEventMap<Events>[E]>,
): this
```

Suscribe `handler` al evento indicado. Acepta tanto los eventos definidos por ti como los internos `"tab:join"` y `"tab:leave"`. Devuelve `this`, por lo que las llamadas son encadenables:

```ts
bus
  .on("data", (payload) => console.log(payload))
  .on("tab:join", ({ tabId }) => console.log(tabId));
```

## `off(event, handler)`

```ts
off<E extends keyof FullEventMap<Events>>(
  event: E,
  handler: Handler<FullEventMap<Events>[E]>,
): this
```

Cancela la suscripción de un `handler` específico previamente registrado con `on()`. Debe ser la misma referencia de función.

## `emit(event, payload)`

```ts
emit<E extends keyof Events>(event: E, payload: Events[E]): this
```

Difunde `event` con `payload` a todas las **demás** instancias del mismo canal (en cualquier pestaña o ventana). Devuelve `this`, por lo que es encadenable igual que `on()` y `off()`.

El tipo de `event` está restringido a `keyof Events` — es decir, **no puedes emitir `"tab:join"` ni `"tab:leave"` manualmente**: TypeScript lo rechaza, porque esos eventos son responsabilidad exclusiva de `Tabus`.

:::caution
La instancia emisora **nunca recibe su propio `emit()`**. Si necesitas procesar el evento también en la pestaña que lo origina, invoca tu handler de forma manual además de emitir. Ver [Consideraciones y límites](/docs/guias/limites/).
:::

Si se configuró `throttle` en el constructor, `emit()` limita la frecuencia real de envío — ver [Throttling](/docs/guias/throttle/).

## `destroy()`

```ts
destroy(): void
```

Emite `"tab:leave"` (si correspondía), cierra el transporte subyacente (cerrando el `BroadcastChannel` o liberando los listeners en memoria) y limpia todos los handlers registrados.

:::note
`destroy()` es **idempotente**: llamarlo más de una vez no produce efectos secundarios ni errores.
:::

## Siguiente paso

- [Opciones](/docs/api/opciones/): la forma de `TabusOptions`.
- [Tipos](/docs/api/tipos/): `Handler`, `EventMap`, `TabusMessage`, `InternalEvents` y `FullEventMap`.
