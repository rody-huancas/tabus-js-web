import { useEffect, useRef, useState } from "react";
import { Tabus } from "tabus-js";

type CartEvents = {
  "cart:add": void;
  "cart:reset": void;
};

const CHANNEL = "tabus-demo-cart";

function DemoWindow() {
  const busRef = useRef<Tabus<CartEvents> | null>(null);
  const pulseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [count, setCount] = useState(0);
  const [pulsing, setPulsing] = useState(false);

  useEffect(() => {
    const bus = new Tabus<CartEvents>(CHANNEL);
    busRef.current = bus;

    const handleAdd = () => {
      setCount((c) => c + 1);
      setPulsing(true);
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
      pulseTimeout.current = setTimeout(() => setPulsing(false), 400);
    };

    const handleReset = () => {
      setCount(0);
    };

    bus.on("cart:add", handleAdd);
    bus.on("cart:reset", handleReset);

    return () => {
      bus.off("cart:add", handleAdd);
      bus.off("cart:reset", handleReset);
      bus.destroy();
      busRef.current = null;
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
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
    <div className="flex flex-col overflow-hidden rounded-lg border border-brand-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-brand-100 bg-brand-50 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 truncate rounded-full bg-white px-3 py-0.5 text-xs text-brand-700">
          shop.tabus.dev
        </span>
      </div>

      <div className="flex flex-col items-stretch gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-brand-900">
            Zapatillas Tabus
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold transition-transform duration-300 ${
              pulsing
                ? "scale-125 bg-accent text-white"
                : "bg-brand-100 text-brand-700"
            }`}
          >
            {count}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-md bg-brand-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
        >
          Agregar al carrito
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full rounded-md border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default function LiveTabsDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DemoWindow />
        <DemoWindow />
        <DemoWindow />
      </div>

      <button
        type="button"
        onClick={() => window.open("/demo")}
        className="mx-auto rounded-md border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
      >
        Ábrela en otra pestaña real
      </button>
    </div>
  );
}
