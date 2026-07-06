---
title: Exports
description: Everything that's publicly exported from the tabus-js package.
---

This is everything exposed by the package's public entry point (`src/index.ts`):

```ts
export { Tabus } from "./core/tabus";
export type { ITransport } from "./transport/transport.interface";
export type { EventMap, InternalEvents, Handler, TabusMessage, TabusOptions } from "./core/types";
```

| Export | Export kind | Description |
|---|---|---|
| `Tabus` | Class | The only public class. See [Tabus class](/en/docs/api/tabus/). |
| `ITransport` | Type-only | Contract implemented by the internal transports. See [Transports](/en/docs/api/transportes/). |
| `EventMap` | Type-only | Generic constraint for your events. See [Types](/en/docs/api/tipos/). |
| `InternalEvents` | Type-only | Shape of `tab:join` / `tab:leave`. See [Types](/en/docs/api/tipos/). |
| `Handler` | Type-only | Signature of an event handler. See [Types](/en/docs/api/tipos/). |
| `TabusMessage` | Type-only | Shape of the internal message. See [Types](/en/docs/api/tipos/). |
| `TabusOptions` | Type-only | Constructor options. See [Options](/en/docs/api/opciones/). |

In practice, most integrations only need:

```ts
import { Tabus } from "tabus-js";
import type { TabusOptions } from "tabus-js";
```

:::note
`BroadcastTransport`, `MemoryTransport`, and `__resetMemoryBus` **aren't** part of these public exports: they're internal implementation details that `Tabus` uses automatically. See [Transports](/en/docs/api/transportes/).
:::
