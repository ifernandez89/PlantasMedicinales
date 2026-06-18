import type { Metadata } from "next";
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
      <header className="space-y-2">
        <Link
          href="/plantas"
          className="text-sm text-verde-700 hover:underline"
        >
          ← Volver a plantas
        </Link>
        <h1 className="text-4xl font-bold text-verde-900">{planta.nombre}</h1>
        {planta.nombreCientifico && (
          <p className="text-gray-400 italic">{planta.nombreCientifico}</p>
        )}
        {planta.familia && (
          <p className="text-sm text-gray-500">Familia: {planta.familia}</p>
        )}

        {/* Acciones globales */}
        <div className="flex flex-wrap gap-2 pt-2">
          {planta.acciones.map((a) => (
            <Link key={a} href={`/acciones/${encodeURIComponent(a)}`}>
              <span className="badge-accion cursor-pointer hover:bg-verde-200">
                {a}
              </span>
            </Link>
          ))}
        </div>
      </header>

      {/* Descripción */}
      {planta.descripcionHtml && (
        <section className="prose prose-green max-w-none">
          <div dangerouslySetInnerHTML={{ __html: planta.descripcionHtml }} />
        </section>
      )}

      {/* Acciones terapéuticas detalladas */}
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

              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                  Usos tradicionales
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                  {at.usosTradicionales.map((uso) => (
                    <li key={uso}>{uso}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fuentes */}
      {planta.fuentes.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-verde-900">Fuentes</h2>
          <ul className="text-sm text-gray-500 space-y-1">
            {planta.fuentes.map((f, i) => (
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
