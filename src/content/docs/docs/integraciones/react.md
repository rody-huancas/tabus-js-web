---
title: React
description: Cómo integrar tabus-js en una aplicación React con un hook reutilizable.
---

En React, envuelve `Tabus` en un hook para crear y destruir la instancia junto con el ciclo de vida del componente.

```ts
import { useEffect } from "react";
import { Tabus } from "tabus-js";

export const useTabSync = (onAdd: (id: string) => void) => {
  useEffect(() => {
    const bus = new Tabus<{ "cart:add": { id: string } }>("shop");
    bus.on("cart:add", ({ id }) => onAdd(id));
    return () => bus.destroy();
  }, []);
};
```

Y en el componente:

```tsx
function Cart() {
  const [items, setItems] = useState<string[]>([]);

  useTabSync((id) => setItems((prev) => [...prev, id]));

  return <ul>{items.map((id) => <li key={id}>{id}</li>)}</ul>;
}
```

## Por qué el `return` en `useEffect`

El callback de limpieza de `useEffect` llama a `bus.destroy()`, así que la instancia se cierra automáticamente cuando el componente se desmonta. Como `destroy()` es idempotente, no hay riesgo si React vuelve a montar el componente en modo estricto durante desarrollo.

:::note
Si necesitas emitir eventos desde el mismo componente, expón `bus` (o una función `emit` envuelta) desde el hook en vez de mantenerlo solo dentro del `useEffect`.
:::

## Siguiente paso

Revisa el ejemplo completo de [carrito compartido](/docs/ejemplos/carrito-compartido/), que amplía este mismo patrón.
