import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 bloom-1">
      {/* Número grande decorativo */}
      <div className="relative select-none">
        <span className="font-display text-[20vw] font-light text-humo-800/[0.06] leading-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl animate-breath">🍂</span>
        </div>
      </div>

      <div className="space-y-3 max-w-sm">
        <h1 className="font-display text-3xl font-light italic text-humo-600">
          Esta planta se marchitó
        </h1>
        <p className="font-body text-sm text-humo-400 leading-relaxed">
          La página que buscás no existe o fue movida.
          Volvé al jardín y empezá desde allí.
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-salvia-600 hover:bg-salvia-700 text-hueso-50
                     font-body text-sm px-6 py-3 rounded-full
                     transition-colors duration-400"
        >
          Volver al inicio
        </Link>
        <Link
          href="/plantas"
          className="border border-humo-200 hover:border-salvia-300
                     text-humo-500 hover:text-salvia-600
                     font-body text-sm px-6 py-3 rounded-full
                     transition-all duration-400"
        >
          Ver plantas
        </Link>
      </div>
    </div>
  );
}
