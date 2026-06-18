import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAcciones, getPlantasByAccion } from "@/lib/plantas";

export async function generateStaticParams() {
  const acciones = await getAllAcciones();
  return acciones.map((accion) => ({ accion: encodeURIComponent(accion) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ accion: string }>;
}): Promise<Metadata> {
  const { accion } = await params;
  const nombre = decodeURIComponent(accion);
  return {
    title: `${nombre} — Acción terapéutica`,
    description: `Plantas medicinales con acción ${nombre}`,
  };
}

export default async function AccionPage({
  params,
}: {
  params: Promise<{ accion: string }>;
}) {
  const { accion } = await params;
  const nombre = decodeURIComponent(accion);

  const plantas = await getPlantasByAccion(nombre);

  if (!plantas.length) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/acciones"
          className="text-sm text-verde-700 hover:underline"
        >
          ← Volver a acciones
        </Link>
        <h1 className="text-3xl font-bold text-verde-900 mt-2">{nombre}</h1>
        <p className="text-gray-500 mt-1">
          {plantas.length} planta{plantas.length !== 1 ? "s" : ""} con esta
          acción terapéutica
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {plantas.map((planta) => {
          // Detalle específico de esta acción en esta planta
          const detalle = planta.accionesTerapeuticas.find(
            (a) => a.accion.toLowerCase() === nombre.toLowerCase()
          );

          return (
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

              {detalle && (
                <>
                  <div className="flex flex-wrap gap-1">
                    {detalle.sistemas.map((s) => (
                      <span key={s} className="badge-sistema">
                        {s}
                      </span>
                    ))}
                  </div>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-0.5">
                    {detalle.usosTradicionales.map((uso) => (
                      <li key={uso}>{uso}</li>
                    ))}
                  </ul>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
