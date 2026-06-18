import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAfecciones, getPlantasByAfeccion } from "@/lib/plantas";

export async function generateStaticParams() {
  const afecciones = await getAllAfecciones();
  return afecciones.map((a) => ({ afeccion: encodeURIComponent(a) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ afeccion: string }>;
}): Promise<Metadata> {
  const { afeccion } = await params;
  const nombre = decodeURIComponent(afeccion);
  return {
    title: `${nombre} — plantas indicadas`,
    description: `Plantas medicinales recomendadas para ${nombre}`,
  };
}

export default async function AfeccionPage({
  params,
}: {
  params: Promise<{ afeccion: string }>;
}) {
  const { afeccion } = await params;
  const nombre = decodeURIComponent(afeccion);

  const plantas = await getPlantasByAfeccion(nombre);

  if (!plantas.length) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/afecciones"
          className="text-sm text-verde-700 hover:underline"
        >
          ← Volver a afecciones
        </Link>
        <h1 className="text-3xl font-bold text-verde-900 mt-2">{nombre}</h1>
        <p className="text-gray-500 mt-1">
          {plantas.length} planta{plantas.length !== 1 ? "s" : ""} indicadas
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
            <div className="flex flex-wrap gap-1">
              {planta.acciones.map((a) => (
                <span key={a} className="badge-accion">
                  {a}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
