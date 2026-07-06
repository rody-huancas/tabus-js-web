---
title: Vue
description: Cómo integrar tabus-js en una aplicación Vue con un composable.
---

En Vue, un composable que crea el bus en `onMounted` y lo destruye en `onUnmounted` sigue el mismo ciclo de vida que el hook de React.

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

Y en el componente:

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

## Por qué `bus` vive fuera del `onMounted`

La instancia se declara en el cuerpo del composable para que `onUnmounted` pueda acceder a ella. Como `bus` se crea siempre en `onMounted` antes de que el componente se desmonte, `onUnmounted` siempre encuentra una instancia válida para destruir.

## Siguiente paso

Revisa el ejemplo completo de [carrito compartido](/docs/ejemplos/carrito-compartido/), que amplía este mismo patrón.
