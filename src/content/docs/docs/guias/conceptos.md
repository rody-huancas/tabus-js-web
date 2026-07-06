---
title: Cómo funciona
description: Arquitectura interna de tabus-js — la clase Tabus, ITransport y los transportes concretos.
---

tabus-js tiene una arquitectura pequeña y deliberadamente simple: una única clase pública que delega el envío/recepción de mensajes en un transporte intercambiable.

```
Tabus<Events>
      │
      └── ITransport
               ├── BroadcastTransport  — envuelve BroadcastChannel nativo
               └── MemoryTransport     — Map de listeners a nivel de módulo
```

## `Tabus`, la única clase pública

`Tabus` es el punto de entrada y la única clase que expone la librería. Sus responsabilidades:

- **Elige el transporte** al construirse: si `typeof BroadcastChannel !== "undefined"` usa `BroadcastTransport`; si no, usa `MemoryTransport`. Ver [Transportes](/docs/guias/transportes/).
- **Deduplica mensajes**: compara `msg.tabId` contra su propio `tabId` para que la pestaña que emite un evento nunca se lo entregue a sí misma.
- **Difiere `tab:join`** con `setTimeout(0)`, para que quien construye la instancia pueda registrar handlers de forma síncrona antes de que se emita el aviso a los peers. Ver [Eventos de ciclo de vida](/docs/guias/eventos-ciclo-vida/).
- **Protege `destroy()`** con una bandera interna: si la instancia se destruye antes de que dispare el timer de `tab:join`, ni ese evento ni `tab:leave` se envían.
- **Throttlea `emit()`** con una estrategia leading + trailing edge. Ver [Throttling](/docs/guias/throttle/).

Para el detalle completo de cada miembro público (`on`, `off`, `emit`, `destroy`, `tabId`), consulta la [referencia de la clase Tabus](/docs/api/tabus/).

## `ITransport`, el contrato de transporte

Todo el envío/recepción de mensajes pasa por una interfaz común:

```ts
interface ITransport {
  send(msg: TabusMessage): void;
  onMessage(listener: (msg: TabusMessage) => void): void;
  destroy(): void;
}
```

:::caution
La deduplicación por `tabId` es responsabilidad de **`Tabus`**, no del transporte. Un transporte puede perfectamente reenviarle al propio emisor su mensaje — es `Tabus` quien lo filtra. Cualquier implementación nueva de `ITransport` debe respetar este contrato.
:::

tabus-js incluye dos implementaciones listas para usar:

- **`BroadcastTransport`**: un envoltorio delgado sobre la API nativa `BroadcastChannel`. Comunica pestañas, ventanas y workers reales del mismo origen.
- **`MemoryTransport`**: fallback en memoria que se activa cuando `BroadcastChannel` no existe (Node, SSR, navegadores muy antiguos). Solo funciona dentro del mismo proceso.

Ambos se explican en detalle, con sus diferencias y limitaciones, en [Transportes](/docs/guias/transportes/).

## Siguiente paso

- [Transportes](/docs/guias/transportes/): cuándo se usa cada uno y qué implica el fallback.
- [Eventos de ciclo de vida](/docs/guias/eventos-ciclo-vida/): `tab:join`, `tab:leave` y por qué están diferidos.
- [Throttling](/docs/guias/throttle/): cómo limitar la frecuencia de `emit()`.
