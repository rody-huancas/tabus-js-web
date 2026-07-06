---
title: React
description: How to integrate tabus-js in a React application with a reusable hook.
---

In React, wrap `Tabus` in a hook to create and destroy the instance alongside the component's lifecycle.

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

And in the component:

```tsx
function Cart() {
  const [items, setItems] = useState<string[]>([]);

  useTabSync((id) => setItems((prev) => [...prev, id]));

  return <ul>{items.map((id) => <li key={id}>{id}</li>)}</ul>;
}
```

## Why the `return` inside `useEffect`

`useEffect`'s cleanup callback calls `bus.destroy()`, so the instance closes automatically when the component unmounts. Since `destroy()` is idempotent, there's no risk if React remounts the component in strict mode during development.

:::note
If you need to emit events from the same component, expose `bus` (or a wrapped `emit` function) from the hook instead of keeping it only inside `useEffect`.
:::

## Next step

Check out the full [shared cart](/en/docs/ejemplos/carrito-compartido/) example, which expands on this same pattern.
