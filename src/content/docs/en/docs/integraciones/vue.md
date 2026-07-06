---
title: Vue
description: How to integrate tabus-js in a Vue application with a composable.
---

In Vue, a composable that creates the bus in `onMounted` and destroys it in `onUnmounted` follows the same lifecycle as the React hook.

```ts
import { onMounted, onUnmounted } from "vue";
import { Tabus } from "tabus-js";

export const useTabSync = (onAdd: (id: string) => void) => {
  let bus: Tabus<{ "cart:add": { id: string } }>;

  onMounted(() => {
    bus = new Tabus("shop");
    bus.on("cart:add", ({ id }) => onAdd(id));
  });

  onUnmounted(() => bus.destroy());
};
```

And in the component:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useTabSync } from "./useTabSync";

const items = ref<string[]>([]);

useTabSync((id) => items.value.push(id));
</script>

<template>
  <ul>
    <li v-for="id in items" :key="id">{{ id }}</li>
  </ul>
</template>
```

## Why `bus` lives outside `onMounted`

The instance is declared in the composable's body so that `onUnmounted` can access it. Since `bus` is always created in `onMounted` before the component unmounts, `onUnmounted` always finds a valid instance to destroy.

## Next step

Check out the full [shared cart](/en/docs/ejemplos/carrito-compartido/) example, which expands on this same pattern.
