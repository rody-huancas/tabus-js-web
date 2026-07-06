import { useEffect, useRef, useState } from "react";
import { Tabus } from "tabus-js";
import { landing, type Locale } from "../../i18n/landing";

type CartEvents = {
  "cart:add": void;
  "cart:reset": void;
};

const CHANNEL = "tabus-demo-cart";

const DemoWindow = ({ label, t }: { label: string; t: (typeof landing)["es"]["demo"] }) => {
  const busRef = useRef<Tabus<CartEvents> | null>(null);
  const pulseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [count    , setCount    ] = useState<number>(0);
  const [pulsing  , setPulsing  ] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<keyof CartEvents | null>(null);

  useEffect(() => {
    const bus = new Tabus<CartEvents>(CHANNEL);
    busRef.current = bus;

    const handleAdd = () => {
      setCount((c) => c + 1);
      setPulsing(true);
      setLastEvent("cart:add");

      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);

      pulseTimeout.current = setTimeout(() => setPulsing(false), 400);
    };

    const handleReset = () => {
      setCount(0);
      setLastEvent("cart:reset");
    };

    bus.on("cart:add", handleAdd);
    bus.on("cart:reset", handleReset);

    // Astro's View Transitions swap the DOM directly, bypassing React's own
    // unmount lifecycle — so this component's useEffect cleanup below is not
    // guaranteed to run when navigating away. Without this, the BroadcastChannel
    // connection would leak and a second live instance would be created when
    // this island remounts on the next visit. destroy() is idempotent, so it's
    // safe even if React's cleanup below also runs.
    const handleBeforeSwap = () => bus.destroy();
    document.addEventListener("astro:before-swap", handleBeforeSwap);

    return () => {
      bus.off("cart:add", handleAdd);
      bus.off("cart:reset", handleReset);
      bus.destroy();
      busRef.current = null;
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
      document.removeEventListener("astro:before-swap", handleBeforeSwap);
    };
  }, []);

  const handleAddToCart = () => {
    setCount((c) => c + 1);
    busRef.current?.emit("cart:add", undefined);
  };

  const handleReset = () => {
    setCount(0);
    busRef.current?.emit("cart:reset", undefined);
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-brand-200/80 bg-white shadow-2xl shadow-brand-900/10">
      <div className="flex items-center gap-3 border-b border-brand-100 bg-brand-50/80 px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate rounded-full bg-white px-3 py-1 text-xs text-brand-600">
          shop.tabus.dev
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">
          {label}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-brand-400 uppercase">
              {t.cartLabel}
            </p>
            <p className="mt-1 font-display text-lg font-bold text-brand-900">
              {t.productName}
            </p>
          </div>
          <span
            className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold transition-transform duration-300 ${
              pulsing
                ? "scale-125 bg-brand-600 text-on-accent"
                : "bg-brand-100 text-brand-700"
            }`}
          >
            {count}
          </span>
        </div>

        <div className="rounded-2xl bg-brand-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-600">{t.syncedState}</span>
            <span className="flex items-center gap-1.5 font-semibold text-green-600">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {t.active}
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-200">
            <div className="h-full w-full rounded-full bg-linear-to-r from-brand-500 to-brand-400" />
          </div>
        </div>

        <div className="rounded-xl border border-brand-200 px-4 py-3 font-mono text-xs text-brand-700">
          {lastEvent ? (
            <span>
              <span className="text-brand-400">←</span> {t.received} {lastEvent}
            </span>
          ) : (
            <span className="text-brand-400">
              {t.waiting}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded-md bg-brand-600 px-4 py-2.5 text-sm font-semibold text-on-accent shadow-[0_3px_12px_-4px_var(--brand-glow-subtle)] transition-all duration-200 hover:-translate-y-px hover:bg-brand-500 hover:shadow-[0_5px_16px_-4px_var(--brand-glow-subtle-hover)] active:translate-y-0 active:shadow-[0_2px_8px_-4px_var(--brand-glow-subtle-active)] motion-reduce:hover:translate-y-0"
          >
            {t.addToCart}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-md border border-brand-300/70 bg-white/60 px-4 py-2.5 text-sm font-semibold text-brand-700 backdrop-blur-sm transition-colors hover:border-brand-400 hover:bg-white hover:text-brand-900"
          >
            {t.reset}
          </button>
        </div>
      </div>
    </div>
  );
}

const LiveTabsDemo = ({ locale = "es" }: { locale?: Locale }) => {
  const t = landing[locale].demo;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <DemoWindow label={t.tabA} t={t} />
        <DemoWindow label={t.tabB} t={t} />
      </div>

      <button
        type="button"
        onClick={() => window.open("/demo")}
        className="mx-auto rounded-md border border-brand-300/70 bg-white/60 px-5 py-2.5 text-sm font-semibold text-brand-700 backdrop-blur-sm transition-colors hover:border-brand-400 hover:bg-white hover:text-brand-900"
      >
        {t.openInNewTab}
      </button>
    </div>
  );
}

export default LiveTabsDemo;
