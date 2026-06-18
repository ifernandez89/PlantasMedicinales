import type { Metadata } from "next";
import Link from "next/link";
import { getAllSistemas, getPlantasBySistema } from "@/lib/plantas";

export const metadata: Metadata = {
  title: "Sistemas corporales",
};

export default async function SistemasPage() {
  const sistemas = await getAllSistemas();

  // Cargamos las plantas por sistema en paralelo
  const entries = await Promise.all(
    sistemas.map(async (s) => ({
      sistema: s,
      plantas: await getPlantasBySistema(s),
    }))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-verde-900">Sistemas corporales</h1>
        <p className="text-gray-500 mt-1">
          {sistemas.length} sistemas en el registro
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {entries.map(({ sistema, plantas }) => (
          <div key={sistema} className="card-planta space-y-3">
            <h2 className="font-semibold text-verde-800 text-lg">{sistema}</h2>
            <p className="text-xs text-gray-400">
              {plantas.length} planta{plantas.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {plantas.map((p) => (
                <Link
                  key={p.slug}
                  href={`/plantas/${p.slug}`}
                  className="badge-accion hover:bg-verde-200"
                >
                  {p.nombre}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
