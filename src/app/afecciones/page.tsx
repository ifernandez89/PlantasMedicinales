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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-verde-900">Afecciones y usos</h1>
        <p className="text-gray-500 mt-1">
          {afecciones.length} afecciones registradas — buscá tu síntoma y encontrá las plantas indicadas
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {afecciones.map((afeccion) => {
          const plantas = mapa[afeccion];
          return (
            <Link
              key={afeccion}
              href={`/afecciones/${encodeURIComponent(afeccion)}`}
              className="card-planta block space-y-2"
            >
              <h2 className="font-semibold text-verde-800">{afeccion}</h2>
              <p className="text-xs text-gray-500">
                {plantas.length} planta{plantas.length !== 1 ? "s" : ""}
              </p>
              <div className="flex flex-wrap gap-1">
                {plantas.slice(0, 4).map((p) => (
                  <span key={p.slug} className="badge-sistema">
                    {p.nombre}
                  </span>
                ))}
                {plantas.length > 4 && (
                  <span className="badge-sistema">+{plantas.length - 4}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
