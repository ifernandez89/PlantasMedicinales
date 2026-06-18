"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 bloom-1">
      <div className="relative select-none">
        <span className="font-display text-[18vw] font-light text-humo-800/[0.04] leading-none">
          ✦
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">🌧️</span>
        </div>
      </div>

      <div className="space-y-3 max-w-sm">
        <h2 className="font-display text-3xl font-light italic text-humo-600">
          Algo salió mal
        </h2>
        <p className="font-body text-sm text-humo-400 leading-relaxed">
          Hubo un error inesperado. Podés intentar recargar o volver al inicio.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-salvia-600 hover:bg-salvia-700 text-hueso-50
                     font-body text-sm px-6 py-3 rounded-full
                     transition-colors duration-400"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
