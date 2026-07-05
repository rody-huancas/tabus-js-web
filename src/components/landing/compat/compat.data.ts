const kw  = (s: string) => `<span class="text-brand-400">${s}</span>`;
const ty  = (s: string) => `<span class="text-amber-300">${s}</span>`;
const str = (s: string) => `<span class="text-green-400">${s}</span>`;

const cartAddType = () => `{ ${str("'cart:add'")}: { id: ${ty("string")} } }`;

export interface Framework {
  id      : string;
  label   : string;
  icon    : string;
  filename: string;
  raw     : string;
  code    : string;
}

export const frameworks: Framework[] = [
  {
    id      : "react",
    label   : "React",
    icon    : "simple-icons:react",
    filename: "useTabSync.ts",
    raw     : `import { useEffect } from 'react'
import { Tabus } from 'tabus-js'

export const useTabSync = (onAdd: (id: string) => void) => {
  useEffect(() => {
    const bus = new Tabus<{ 'cart:add': { id: string } }>('shop')
    bus.on('cart:add', ({ id }) => onAdd(id))
    return () => bus.destroy()
  }, [])
}`,
    code: [
      `${kw("import")} { useEffect } ${kw("from")} ${str("'react'")}`,
      `${kw("import")} { ${ty("Tabus")} } ${kw("from")} ${str("'tabus-js'")}`,
      ``,
      `${kw("export")} ${kw("const")} useTabSync = (onAdd: (id: ${ty("string")}) =&gt; ${ty("void")}) =&gt; {`,
      `  useEffect(() =&gt; {`,
      `    ${kw("const")} ${kw("bus")} = ${kw("new")} ${ty("Tabus")}&lt;${cartAddType()}&gt;(${str("'shop'")})`,
      `    ${kw("bus")}.on(${str("'cart:add'")}, ({ id }) =&gt; onAdd(id))`,
      `    ${kw("return")} () =&gt; ${kw("bus")}.destroy()`,
      `  }, [])`,
      `}`,
    ].join("\n"),
  },
  {
    id      : "vue",
    label   : "Vue",
    icon    : "simple-icons:vuedotjs",
    filename: "useTabSync.ts",
    raw     : `import { onMounted, onUnmounted } from 'vue'
import { Tabus } from 'tabus-js'

export const useTabSync = (onAdd: (id: string) => void) => {
  let bus: Tabus<{ 'cart:add': { id: string } }>
  onMounted(() => {
    bus = new Tabus('shop')
    bus.on('cart:add', ({ id }) => onAdd(id))
  })
  onUnmounted(() => bus.destroy())
}`,
    code: [
      `${kw("import")} { onMounted, onUnmounted } ${kw("from")} ${str("'vue'")}`,
      `${kw("import")} { ${ty("Tabus")} } ${kw("from")} ${str("'tabus-js'")}`,
      ``,
      `${kw("export")} ${kw("const")} useTabSync = (onAdd: (id: ${ty("string")}) =&gt; ${ty("void")}) =&gt; {`,
      `  ${kw("let")} ${kw("bus")}: ${ty("Tabus")}&lt;${cartAddType()}&gt;`,
      `  onMounted(() =&gt; {`,
      `    ${kw("bus")} = ${kw("new")} ${ty("Tabus")}(${str("'shop'")})`,
      `    ${kw("bus")}.on(${str("'cart:add'")}, ({ id }) =&gt; onAdd(id))`,
      `  })`,
      `  onUnmounted(() =&gt; ${kw("bus")}.destroy())`,
      `}`,
    ].join("\n"),
  },
  {
    id      : "angular",
    label   : "Angular",
    icon    : "simple-icons:angular",
    filename: "tab-sync.service.ts",
    raw     : `import { Injectable, OnDestroy } from '@angular/core'
import { Tabus } from 'tabus-js'

@Injectable({ providedIn: 'root' })
export class TabSyncService implements OnDestroy {
  private bus = new Tabus<{ 'cart:add': { id: string } }>('shop')

  onAdd = (cb: (id: string) => void) => {
    this.bus.on('cart:add', ({ id }) => cb(id))
  }

  ngOnDestroy = () => this.bus.destroy()
}`,
    code: [
      `${kw("import")} { ${ty("Injectable")}, ${ty("OnDestroy")} } ${kw("from")} ${str("'@angular/core'")}`,
      `${kw("import")} { ${ty("Tabus")} } ${kw("from")} ${str("'tabus-js'")}`,
      ``,
      `${ty("@Injectable")}({ providedIn: ${str("'root'")} })`,
      `${kw("export")} ${kw("class")} ${ty("TabSyncService")} ${kw("implements")} ${ty("OnDestroy")} {`,
      `  ${kw("private")} ${kw("bus")} = ${kw("new")} ${ty("Tabus")}&lt;${cartAddType()}&gt;(${str("'shop'")})`,
      ``,
      `  onAdd = (cb: (id: ${ty("string")}) =&gt; ${ty("void")}) =&gt; {`,
      `    ${kw("this")}.${kw("bus")}.on(${str("'cart:add'")}, ({ id }) =&gt; cb(id))`,
      `  }`,
      ``,
      `  ngOnDestroy = () =&gt; ${kw("this")}.${kw("bus")}.destroy()`,
      `}`,
    ].join("\n"),
  },
  {
    id      : "svelte",
    label   : "Svelte",
    icon    : "simple-icons:svelte",
    filename: "TabSync.svelte",
    raw     : `import { onMount } from 'svelte'
import { Tabus } from 'tabus-js'

onMount(() => {
  const bus = new Tabus<{ 'cart:add': { id: string } }>('shop')
  bus.on('cart:add', ({ id }) => addToCart(id))
  return () => bus.destroy()
})`,
    code: [
      `${kw("import")} { onMount } ${kw("from")} ${str("'svelte'")}`,
      `${kw("import")} { ${ty("Tabus")} } ${kw("from")} ${str("'tabus-js'")}`,
      ``,
      `onMount(() =&gt; {`,
      `  ${kw("const")} ${kw("bus")} = ${kw("new")} ${ty("Tabus")}&lt;${cartAddType()}&gt;(${str("'shop'")})`,
      `  ${kw("bus")}.on(${str("'cart:add'")}, ({ id }) =&gt; addToCart(id))`,
      `  ${kw("return")} () =&gt; ${kw("bus")}.destroy()`,
      `})`,
    ].join("\n"),
  },
  {
    id      : "vanilla",
    label   : "Vanilla",
    icon    : "simple-icons:javascript",
    filename: "main.ts",
    raw     : `import { Tabus } from 'tabus-js'

const bus = new Tabus<{ 'cart:add': { id: string } }>('shop')
bus.on('cart:add', ({ id }) => addToCart(id))
bus.emit('cart:add', { id: 'sku_42' })`,
    code: [
      `${kw("import")} { ${ty("Tabus")} } ${kw("from")} ${str("'tabus-js'")}`,
      ``,
      `${kw("const")} ${kw("bus")} = ${kw("new")} ${ty("Tabus")}&lt;${cartAddType()}&gt;(${str("'shop'")})`,
      `${kw("bus")}.on(${str("'cart:add'")}, ({ id }) =&gt; addToCart(id))`,
      `${kw("bus")}.emit(${str("'cart:add'")}, { id: ${str("'sku_42'")} })`,
    ].join("\n"),
  },
];
