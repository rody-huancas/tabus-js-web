---
title: Exports
description: Todo lo que se exporta públicamente desde el paquete tabus-js.
---

Esto es todo lo que expone el punto de entrada público del paquete (`src/index.ts`):

```ts
export { Tabus } from "./core/tabus";
export type { ITransport } from "./transport/transport.interface";
export type { EventMap, InternalEvents, Handler, TabusMessage, TabusOptions } from "./core/types";
```

| Export | Tipo de export | Descripción |
|---|---|---|
| `Tabus` | Clase | La única clase pública. Ver [Clase Tabus](/docs/api/tabus/). |
| `ITransport` | Solo tipo | Contrato que implementan los transportes internos. Ver [Transportes](/docs/api/transportes/). |
| `EventMap` | Solo tipo | Restricción genérica para tus eventos. Ver [Tipos](/docs/api/tipos/). |
| `InternalEvents` | Solo tipo | Forma de `tab:join` / `tab:leave`. Ver [Tipos](/docs/api/tipos/). |
| `Handler` | Solo tipo | Firma de un handler de evento. Ver [Tipos](/docs/api/tipos/). |
| `TabusMessage` | Solo tipo | Forma del mensaje interno. Ver [Tipos](/docs/api/tipos/). |
| `TabusOptions` | Solo tipo | Opciones del constructor. Ver [Opciones](/docs/api/opciones/). |

En la práctica, la mayoría de las integraciones solo necesitan:

```ts
import { Tabus } from "tabus-js";
import type { TabusOptions } from "tabus-js";
```

:::note
`BroadcastTransport`, `MemoryTransport` y `__resetMemoryBus` **no** forman parte de estos exports públicos: son detalles de implementación internos que `Tabus` usa automáticamente. Ver [Transportes](/docs/api/transportes/).
:::
