---
title: Angular
description: Cómo integrar tabus-js en Angular con un servicio inyectable.
---

En Angular, el lugar natural para `Tabus` es un servicio `providedIn: 'root'` que implementa `OnDestroy` para limpiar el bus cuando Angular destruye el servicio.

```ts
import { Injectable, OnDestroy } from "@angular/core";
import { Tabus } from "tabus-js";

@Injectable({ providedIn: "root" })
export class TabSyncService implements OnDestroy {
  private bus = new Tabus<{ "cart:add": { id: string } }>("shop");

  onAdd = (cb: (id: string) => void) => {
    this.bus.on("cart:add", ({ id }) => cb(id));
  };

  ngOnDestroy = () => this.bus.destroy();
}
```

Y en el componente:

```ts
@Component({ selector: "app-cart", template: `...` })
export class CartComponent implements OnInit {
  items: string[] = [];

  constructor(private tabSync: TabSyncService) {}

  ngOnInit() {
    this.tabSync.onAdd((id) => this.items.push(id));
  }
}
```

## Por qué `providedIn: 'root'`

Al registrar el servicio como singleton de raíz, todos los componentes que lo inyectan comparten la misma instancia de `Tabus` — y por lo tanto el mismo canal. `ngOnDestroy` solo se dispara cuando Angular destruye el servicio (normalmente al destruir la app), no en cada componente.

:::note
Si necesitas un bus por componente en vez de uno compartido a nivel de app, provee el servicio en el propio componente (`providers: [TabSyncService]`) en lugar de en la raíz.
:::

## Siguiente paso

Revisa el ejemplo completo de [carrito compartido](/docs/ejemplos/carrito-compartido/), que amplía este mismo patrón.
