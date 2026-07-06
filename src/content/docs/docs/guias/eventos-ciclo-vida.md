---
title: Eventos de ciclo de vida
description: tab:join y tab:leave — cuándo se emiten, por qué están diferidos y cómo protege destroy() este comportamiento.
---

Además de los eventos que tú definas, cada instancia de `Tabus` emite automáticamente dos eventos internos para avisar a sus peers sobre su ciclo de vida.

| Evento | Payload | Cuándo se emite |
|---|---|---|
| `tab:join` | `{ tabId: string }` | Poco después de crear la instancia, avisando a los peers que una nueva pestaña se unió al canal. |
| `tab:leave` | `{ tabId: string }` | Al llamar a `destroy()`, siempre que `tab:join` ya se haya emitido previamente. |

Se escuchan igual que cualquier otro evento:

```ts
bus.on("tab:join", ({ tabId }) => console.log("nueva pestaña conectada:", tabId));
bus.on("tab:leave", ({ tabId }) => console.log("pestaña cerrada:", tabId));
```

## Por qué `tab:join` está diferido

`tab:join` no se emite de forma síncrona en el constructor: se difiere con `setTimeout(0)`. Esto le da a quien crea la instancia una oportunidad de registrar sus handlers **antes** de que el aviso llegue a los peers:

```ts
const bus = new Tabus("my-app");

// Este handler ya está registrado cuando tab:join se difunde,
// porque la emisión real ocurre en el siguiente tick.
bus.on("tab:join", ({ tabId }) => console.log("nueva pestaña:", tabId));
```

Si `tab:join` se emitiera de forma inmediata (síncrona), existiría una ventana de carrera: otra pestaña podría reaccionar y responder antes de que esta instancia llegara a suscribirse a nada.

## La protección de `destroy()`

Como `tab:join` es asíncrono, existe la posibilidad de que alguien llame a `destroy()` en el mismo tick en el que se creó la instancia, antes de que el timer dispare. `Tabus` lo contempla con una bandera interna:

- Si `destroy()` se llama **antes** de que el timer de `tab:join` dispare, **ni `tab:join` ni `tab:leave` se envían**. Los peers nunca llegaron a saber que esta pestaña existió, así que tampoco tiene sentido avisarles de que se fue.
- Si `destroy()` se llama **después**, se emite `tab:leave` normalmente.

:::tip
Esta protección evita eventos "fantasma": pestañas que se crean y destruyen en el mismo tick (por ejemplo, en un componente que se monta y desmonta muy rápido) no generan ruido en el resto de las pestañas.
:::

## Siguiente paso

- [Consideraciones y límites](/docs/guias/limites/) resume este y otros comportamientos a tener en cuenta.
- La forma completa de estos eventos está en [Tipos → `InternalEvents`](/docs/api/tipos/).
