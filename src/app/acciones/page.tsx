import type { Metadata } from "next";
import Link from "next/link";
import { getPlantasPorAccion } from "@/lib/plantas";

export const metadata: Metadata = {
  title: "Acciones terapéuticas",
};

export default async function AccionesPage() {
  const mapa = await getPlantasPorAccion();
  const acciones = Object.keys(mapa).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-verde-900">
          Acciones terapéuticas
        </h1>
        <p className="text-gray-500 mt-1">
          {acciones.length} acciones registradas
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {acciones.map((accion) => {
          const plantas = mapa[accion];
          return (
            <Link
              key={accion}
              href={`/acciones/${encodeURIComponent(accion)}`}
              className="card-planta block space-y-2"
            >
              <h2 className="font-semibold text-verde-800">{accion}</h2>
              <p className="text-xs text-gray-500">
                {plantas.length} planta{plantas.length !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-1">
                {plantas.map((p) => (
                  <span key={p.slug} className="badge-sistema">
                    {p.nombre}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
