---
title: Angular
description: How to integrate tabus-js in Angular with an injectable service.
---

In Angular, the natural place for `Tabus` is a `providedIn: 'root'` service that implements `OnDestroy` to clean up the bus when Angular destroys the service.

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

And in the component:

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

## Why `providedIn: 'root'`

By registering the service as a root singleton, every component that injects it shares the same `Tabus` instance — and therefore the same channel. `ngOnDestroy` only fires when Angular destroys the service (typically when the app is destroyed), not on every component.

:::note
If you need a per-component bus instead of one shared at the app level, provide the service in the component itself (`providers: [TabSyncService]`) instead of at the root.
:::

## Next step

Check out the full [shared cart](/en/docs/ejemplos/carrito-compartido/) example, which expands on this same pattern.
