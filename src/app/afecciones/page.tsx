import type { Metadata } from "next";
import Link from "next/link";
import { getPlantasPorAfeccion } from "@/lib/plantas";

export const metadata: Metadata = {
  title: "Afecciones y usos",
};

export default async function AfeccionesPage() {
  const mapa = await getPlantasPorAfeccion();
  const afecciones = Object.keys(mapa).sort((a, b) => a.localeCompare(b, "es"));

  return (
    <div className="space-y-12">
      <header className="bloom-1 pt-4">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-3">
          Herbarium · Búsqueda
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-light text-humo-800 leading-tight">
          Afecciones<br />
          <span className="italic text-petal-400">y usos</span>
        </h1>
        <p className="font-body text-sm text-humo-400 mt-4">
          {afecciones.length} afecciones · encontrá la planta indicada
        </p>
      </header>

      <hr className="divider-organic" />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {afecciones.map((afeccion, i) => {
          const plantas = mapa[afeccion];
          return (
            <Link
              key={afeccion}
              href={`/afecciones/${encodeURIComponent(afeccion)}`}
              className={`card-herbarium p-5 flex flex-col gap-3 group bloom-${Math.min(i + 1, 6)}`}
            >
              <h2 className="font-display text-xl font-light text-humo-800
                              group-hover:text-petal-500 transition-colors duration-300">
                {afeccion}
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
