---
title: Svelte
description: Cómo integrar tabus-js en Svelte con onMount y una función de limpieza.
---

En Svelte, crea el bus dentro de `onMount` y devuelve una función de limpieza — Svelte la ejecuta automáticamente cuando el componente se destruye.

```ts
import { onMount } from "svelte";
import { Tabus } from "tabus-js";

onMount(() => {
  const bus = new Tabus<{ "cart:add": { id: string } }>("shop");
  bus.on("cart:add", ({ id }) => addToCart(id));
  return () => bus.destroy();
});
```

Dentro de un componente `.svelte`:

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { Tabus } from "tabus-js";

  let items: string[] = [];

  function addToCart(id: string) {
    items = [...items, id];
  }

  onMount(() => {
    const bus = new Tabus<{ "cart:add": { id: string } }>("shop");
    bus.on("cart:add", ({ id }) => addToCart(id));
    return () => bus.destroy();
  });
</script>

<ul>
  {#each items as id}
    <li>{id}</li>
  {/each}
</ul>
```

## Por qué devolver una función desde `onMount`

Svelte reconoce que el valor de retorno de la callback pasada a `onMount` es una función de limpieza, y la invoca automáticamente en `onDestroy`. Es el equivalente directo al `return` de `useEffect` en React.

## Siguiente paso

Revisa el ejemplo completo de [carrito compartido](/docs/ejemplos/carrito-compartido/), que amplía este mismo patrón.
