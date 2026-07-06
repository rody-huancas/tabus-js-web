---
title: Svelte
description: How to integrate tabus-js in Svelte with onMount and a cleanup function.
---

In Svelte, create the bus inside `onMount` and return a cleanup function — Svelte runs it automatically when the component is destroyed.

```ts
import { onMount } from "svelte";
import { Tabus } from "tabus-js";

onMount(() => {
  const bus = new Tabus<{ "cart:add": { id: string } }>("shop");
  bus.on("cart:add", ({ id }) => addToCart(id));
  return () => bus.destroy();
});
```

Inside a `.svelte` component:

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

## Why return a function from `onMount`

Svelte recognizes that the return value of the callback passed to `onMount` is a cleanup function, and invokes it automatically on `onDestroy`. It's the direct equivalent of the `return` in React's `useEffect`.

## Next step

Check out the full [shared cart](/en/docs/ejemplos/carrito-compartido/) example, which expands on this same pattern.
