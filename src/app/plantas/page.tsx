import type { Metadata } from "next";
import Link from "next/link";
import { getAllPlantas } from "@/lib/plantas";

export const metadata: Metadata = {
  title: "Todas las plantas",
};

export default async function PlantasPage() {
  const plantas = await getAllPlantas();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-verde-900">Plantas</h1>
        <p className="text-gray-500 mt-1">
          {plantas.length} plantas en el registro
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {plantas.map((planta) => (
          <Link
            key={planta.slug}
            href={`/plantas/${planta.slug}`}
            className="card-planta block space-y-3"
          >
            <div>
              <h2 className="font-semibold text-verde-800 text-lg">
                {planta.nombre}
              </h2>
              {planta.nombreCientifico && (
                <p className="text-xs italic text-gray-400">
                  {planta.nombreCientifico}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Acciones
              </p>
              <div className="flex flex-wrap gap-1">
                {planta.acciones.map((a) => (
                  <span key={a} className="badge-accion">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Sistemas
              </p>
              <div className="flex flex-wrap gap-1">
                {planta.sistemas.map((s) => (
                  <span key={s} className="badge-sistema">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
