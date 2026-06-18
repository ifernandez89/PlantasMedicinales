import type { Metadata } from "next";
import Link from "next/link";
import { getPlantasPorAccion } from "@/lib/plantas";

export const metadata: Metadata = {
  title: "Acciones terapéuticas",
};

export default async function AccionesPage() {
  const mapa = await getPlantasPorAccion();
  const acciones = Object.keys(mapa).sort((a, b) => a.localeCompare(b, "es"));

  return (
    <div className="space-y-12">
      <header className="bloom-1 pt-4">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-3">
          Herbarium · Índice
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-light text-humo-800 leading-tight">
          Acciones<br />
          <span className="italic text-salvia-500">terapéuticas</span>
        </h1>
        <p className="font-body text-sm text-humo-400 mt-4">
          {acciones.length} acciones documentadas
        </p>
      </header>

      <hr className="divider-organic" />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 bloom-2">
        {acciones.map((accion, i) => {
          const plantas = mapa[accion];
          return (
            <Link
              key={accion}
              href={`/acciones/${encodeURIComponent(accion)}`}
              className={`card-herbarium p-5 flex flex-col gap-3 group bloom-${Math.min(i + 1, 6)}`}
            >
              <h2 className="font-display text-xl font-light text-humo-800
                              group-hover:text-salvia-600 transition-colors duration-300">
                {accion}
              </h2>
              <p className="font-body text-xs text-humo-400">
                {plantas.length} planta{plantas.length !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-1 mt-auto">
                {plantas.slice(0, 3).map((p) => (
                  <span key={p.slug} className="badge-sistema text-xs">{p.nombre}</span>
                ))}
                {plantas.length > 3 && (
                  <span className="badge-sistema text-xs">+{plantas.length - 3}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
