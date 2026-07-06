---
title: Options
description: TabusOptions reference — throttle and trailing.
---

`TabusOptions` is the second, optional argument of the [`Tabus`](/en/docs/api/tabus/) constructor.

```ts
interface TabusOptions {
  throttle?: number; // minimum ms between emitted messages (default: 0, no throttle)
  trailing?: boolean; // emit the last pending message when the window expires (default: true)
}
```

| Option | Type | Default | Description |
|---|---|---|---|
| `throttle` | `number` | `0` (no throttle) | Minimum milliseconds between messages actually emitted by the transport. |
| `trailing` | `boolean` | `true` | Whether the last pending message is automatically emitted when the throttle window expires. |

## Usage

```ts
const bus = new Tabus<Events>("canvas", { throttle: 16 });
```

With `throttle: 0` (the default), every call to `emit()` is sent immediately — there's no rate limiting.

`trailing` only has an effect when `throttle` is set (greater than `0`); if there's no throttle, there's no window to track.

With `trailing: false`, only the leading edge is honored: the first call within the window is emitted, and the rest are silently dropped until the window expires.

## Next step

See [Throttling](/en/docs/guias/throttle/) for the full detail of the leading + trailing edge strategy, with examples.
