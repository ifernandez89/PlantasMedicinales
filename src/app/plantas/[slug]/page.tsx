import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSlugs, getPlantaBySlug } from "@/lib/plantas";

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

// ─── Metadata dinámica ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const planta = await getPlantaBySlug(slug);
    return {
      title: planta.nombre,
      description: `Usos medicinales, acciones terapéuticas y sistemas corporales de ${planta.nombre}.`,
    };
  } catch {
    return { title: "Planta no encontrada" };
  }
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function PlantaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let planta;
  try {
    planta = await getPlantaBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className="space-y-10">
      {/* Encabezado */}
      <header className="space-y-3">
        <Link href="/plantas" className="text-sm text-verde-700 hover:underline">
          ← Volver a plantas
        </Link>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Imagen */}
          {planta.imagen && (
            <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 bg-verde-100">
              <Image
                src={planta.imagen}
                alt={planta.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 192px"
                priority
              />
            </div>
          )}

          <div className="space-y-2 flex-1">
            <h1 className="text-4xl font-bold text-verde-900">{planta.nombre}</h1>
            {planta.nombreCientifico && (
              <p className="text-gray-400 italic">{planta.nombreCientifico}</p>
            )}
            {planta.familia && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Familia:</span> {planta.familia}
              </p>
            )}
            {planta.origen && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Origen:</span> {planta.origen}
              </p>
            )}
            {planta.otrosNombres.length > 0 && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">También:</span>{" "}
                {planta.otrosNombres.join(", ")}
              </p>
            )}

            {/* Acciones globales */}
            <div className="flex flex-wrap gap-2 pt-1">
              {planta.acciones.map((a) => (
                <Link key={a} href={`/acciones/${encodeURIComponent(a)}`}>
                  <span className="badge-accion cursor-pointer hover:bg-verde-200">
                    {a}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Descripción */}
      {planta.descripcionHtml && (
        <section className="prose prose-green max-w-none">
          <div dangerouslySetInnerHTML={{ __html: planta.descripcionHtml }} />
        </section>
      )}

      {/* Acciones terapéuticas detalladas */}
      {planta.accionesTerapeuticas.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-verde-900">
            Acciones terapéuticas
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {planta.accionesTerapeuticas.map((at) => (
              <div key={at.accion} className="card-planta space-y-3">
                <h3 className="font-semibold text-verde-700 text-lg">
                  {at.accion}
                </h3>

                {at.sistemas.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Sistemas
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {at.sistemas.map((s) => (
                        <span key={s} className="badge-sistema">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {at.afecciones.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      Afecciones
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                      {at.afecciones.map((af) => (
                        <li key={af}>
                          <Link
                            href={`/afecciones/${encodeURIComponent(af)}`}
                            className="hover:text-verde-700 hover:underline"
                          >
                            {af}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info botánica / etnobotánica */}
      {(planta.principiosActivos.length > 0 ||
        planta.usosEtnobotanicos.length > 0 ||
        planta.polinizadores.length > 0) && (
        <section className="grid sm:grid-cols-3 gap-4">
          {planta.principiosActivos.length > 0 && (
            <div className="card-planta space-y-2">
              <h3 className="font-semibold text-verde-800 text-sm uppercase tracking-wide">
                Principios activos
              </h3>
              <ul className="text-sm text-gray-600 space-y-0.5">
                {planta.principiosActivos.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          )}
          {planta.usosEtnobotanicos.length > 0 && (
            <div className="card-planta space-y-2">
              <h3 className="font-semibold text-verde-800 text-sm uppercase tracking-wide">
                Etnobotánica
              </h3>
              <ul className="text-sm text-gray-600 space-y-0.5">
                {planta.usosEtnobotanicos.map((u) => (
                  <li key={u}>• {u}</li>
                ))}
              </ul>
            </div>
          )}
          {planta.polinizadores.length > 0 && (
            <div className="card-planta space-y-2">
              <h3 className="font-semibold text-verde-800 text-sm uppercase tracking-wide">
                Polinizadores
              </h3>
              <ul className="text-sm text-gray-600 space-y-0.5">
                {planta.polinizadores.map((p) => (
                  <li key={p}>• {p}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Precauciones */}
      {(planta.precauciones.length > 0 ||
        planta.contraindicaciones.length > 0 ||
        planta.toxicidad) && (
        <section className="card-planta border-l-4 border-amber-400 space-y-3">
          <h2 className="font-semibold text-amber-700">
            ⚠️ Precauciones y contraindicaciones
          </h2>
          {planta.precauciones.length > 0 && (
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
              {planta.precauciones.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          {planta.contraindicaciones.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Contraindicaciones
              </p>
              <div className="flex flex-wrap gap-1">
                {planta.contraindicaciones.map((c) => (
                  <span
                    key={c}
                    className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          {planta.toxicidad && (
            <p className="text-sm text-red-700 font-medium">
              🔴 {planta.toxicidad}
            </p>
          )}
        </section>
      )}

      {/* Fuentes */}
      {planta.fuentes.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-verde-900">Fuentes</h2>
          <ul className="text-sm text-gray-500 space-y-1">
            {planta.fuentes.map((f: { titulo: string; tipo: string }, i) => (
              <li key={i}>
                📄 {f.titulo}{" "}
                <span className="text-gray-400">({f.tipo})</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
