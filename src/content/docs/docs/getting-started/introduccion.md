---
title: Introducción
description: Qué es tabus-js, qué problema resuelve y cuándo conviene usarlo.
---

## ¿Qué es?

`tabus-js` es una librería **TypeScript sin dependencias** que permite enviar y recibir eventos tipados entre pestañas o ventanas del mismo navegador (o entre múltiples instancias dentro del mismo proceso).

Usa la API nativa [`BroadcastChannel`](https://developer.mozilla.org/es/docs/Web/API/BroadcastChannel) cuando está disponible, y si no lo está (SSR, entornos sin soporte, Node) cae automáticamente a un bus en memoria dentro del mismo proceso.

:::note
El bus se identifica por un **nombre de canal**. Todas las instancias creadas con el mismo nombre —en cualquier pestaña del mismo origen— se comunican entre sí.
:::

## ¿Para qué sirve?

Casos de uso típicos:

- **Sincronizar estado entre pestañas**: por ejemplo, cerrar sesión en una pestaña y reflejarlo en todas las demás.
- **Notificaciones cross-tab**: avisar a otras pestañas que ocurrió un evento (nuevo dato guardado, carrito actualizado, etc.).
- **Detectar presencia de otras pestañas**: saber cuántas pestañas de la app están abiertas, usando los eventos `tab:join` / `tab:leave`.
- **Coordinar acciones**: evitar que dos pestañas hagan la misma tarea en paralelo (locks simples, líder/seguidor).
- **SSR-safe**: funciona en el servidor sin lanzar errores, porque usa el fallback en memoria cuando `BroadcastChannel` no existe.

## Siguiente paso

Continúa con [Instalación](/docs/getting-started/instalacion/) para agregar tabus-js a tu proyecto, o salta directo a [Inicio rápido](/docs/getting-started/quick-start/) para ver el uso básico paso a paso.
