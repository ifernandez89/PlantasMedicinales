import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSlugs, getPlantaBySlug } from "@/lib/plantas";

export async function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

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
      description: `${planta.nombre} — usos medicinales, acciones terapéuticas y ciclo vital.`,
    };
  } catch {
    return { title: "Planta no encontrada" };
  }
}

// Ciclo visual según planta
function getCiclo(planta: Awaited<ReturnType<typeof getPlantaBySlug>>) {
  if (planta.toxicidad || planta.contraindicaciones.length > 2) return "marchitez" as const;
  if (planta.accionesTerapeuticas.length >= 4)                   return "floracion"  as const;
  return "brote" as const;
}

const cicloMeta = {
  brote:     { icon: "🌱", label: "Brote",     accentBg: "bg-salvia-500",  textColor: "text-salvia-600" },
  floracion: { icon: "🌸", label: "Floración", accentBg: "bg-petal-400",   textColor: "text-petal-500" },
  marchitez: { icon: "🍂", label: "Precaución",accentBg: "bg-humo-400",    textColor: "text-humo-500" },
};

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

  const ciclo = getCiclo(planta);
  const cm    = cicloMeta[ciclo];

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const imageSrc = planta.imagen ? (planta.imagen.startsWith("/") ? `${basePath}${planta.imagen}` : planta.imagen) : "";

  return (
    <article className="space-y-16">

      {/* ── Hero lámina botánica ──────────────────────────────────── */}
      <section className="bloom-1">
        <Link href="/plantas"
              className="inline-flex items-center gap-2 font-body text-xs
                         tracking-widest uppercase text-humo-400
                         hover:text-salvia-500 transition-colors duration-300 mb-8">
          ← Volver al registro
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Imagen */}
          {planta.imagen && (
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden
                            shadow-2xl shadow-humo-900/20">
              <Image
                src={imageSrc}
                alt={planta.nombre}
                fill
                className={`object-cover transition-all duration-[2000ms] ease-out
                            hover:scale-105
                            ${ciclo === "marchitez" ? "saturate-75" : ""}`}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-gradient-to-t
                              from-humo-900/40 via-transparent to-transparent" />

              {/* Numero de acciones (detalle editorial) */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span className={`font-display text-6xl font-light text-hueso-50/30 leading-none`}>
                  {String(planta.accionesTerapeuticas.length).padStart(2, "0")}
                </span>
                <span className={`font-body text-xs tracking-widest uppercase ${cm.textColor}
                                  bg-hueso-50/90 backdrop-blur-sm px-3 py-1.5 rounded-full`}>
                  {cm.icon} {cm.label}
                </span>
              </div>
            </div>
          )}

          {/* Info principal */}
          <div className="space-y-6 pt-4">

            {/* Clasificación */}
            <div className="space-y-1">
              {planta.familia && (
                <p className="font-body text-xs tracking-[0.2em] uppercase text-humo-400">
                  {planta.familia}
                </p>
              )}
              <h1 className="font-display text-5xl sm:text-6xl font-light text-humo-800 leading-tight">
                {planta.nombre}
              </h1>
              {planta.nombreCientifico && (
                <p className="font-display text-xl italic font-light text-humo-400">
                  {planta.nombreCientifico}
                </p>
              )}
            </div>

            {/* Metadata geográfica */}
            {(planta.origen || planta.distribucion.length > 0) && (
              <div className="space-y-2 text-sm font-body text-humo-500">
                {planta.origen && (
                  <p><span className="text-humo-300">Origen ·</span> {planta.origen}</p>
                )}
                {planta.distribucion.length > 0 && (
                  <p><span className="text-humo-300">Distribución ·</span> {planta.distribucion.join(", ")}</p>
                )}
                {planta.habitat && (
                  <p><span className="text-humo-300">Hábitat ·</span> {planta.habitat}</p>
                )}
              </div>
            )}

            {/* Ciclo anual y Porte */}
            {(planta.epocaFloracion || planta.epocaFructificacion || planta.tipoCiclo) && (
              <div className="card-herbarium p-5 bg-hueso-100/40 border-hueso-200/80 rounded-xl space-y-4">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-humo-400">
                  Ciclo anual y Porte
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-body text-humo-600">
                  {planta.tipoCiclo && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-salvia-500">🌿</span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-humo-400 font-medium leading-none">Tipo</p>
                        <p className="font-light mt-1 text-humo-700">{planta.tipoCiclo}</p>
                      </div>
                    </div>
                  )}
                  {planta.epocaFloracion && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-petal-500">🌸</span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-humo-400 font-medium leading-none">Floración</p>
                        <p className="font-light mt-1 text-humo-700">{planta.epocaFloracion}</p>
                      </div>
                    </div>
                  )}
                  {planta.epocaFructificacion && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-humo-400">🍂</span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-humo-400 font-medium leading-none">Fructificación</p>
                        <p className="font-light mt-1 text-humo-700">{planta.epocaFructificacion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-humo-400 mb-3">
                Acciones terapéuticas
              </p>
              <div className="flex flex-wrap gap-2">
                {planta.acciones.map((a) => (
                  <Link key={a} href={`/acciones/${encodeURIComponent(a)}`}>
                    <span className="badge-accion">{a}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sistemas */}
            {planta.sistemas.length > 0 && (
              <div>
                <p className="font-body text-xs tracking-[0.2em] uppercase text-humo-400 mb-3">
                  Sistemas corporales
                </p>
                <div className="flex flex-wrap gap-2">
                  {planta.sistemas.map((s) => (
                    <span key={s} className="badge-sistema">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Acento de ciclo */}
            <div className={`h-1 w-24 rounded-full ${cm.accentBg} opacity-60`} />
          </div>
        </div>
      </section>

      <hr className="divider-organic" />

      {/* ── Descripción ──────────────────────────────────────────── */}
      {planta.descripcionHtml && (
        <section className="bloom-2 max-w-2xl">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-humo-400 mb-6">
            Descripción
          </p>
          <div
            className="prose-botanico"
            dangerouslySetInnerHTML={{ __html: planta.descripcionHtml }}
          />
        </section>
      )}

      {/* ── Acciones terapéuticas detalladas ─────────────────────── */}
      {planta.accionesTerapeuticas.length > 0 && (
        <section className="bloom-3">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-humo-400 mb-6">
            Detalle terapéutico
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {planta.accionesTerapeuticas.map((at, i) => (
              <div key={at.accion}
                   className={`card-herbarium p-5 space-y-4 bloom-${Math.min(i + 1, 6)}`}>
                <h3 className="font-display text-xl font-light text-humo-800">
                  {at.accion}
                </h3>

                {at.sistemas.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {at.sistemas.map((s) => (
                      <span key={s} className="badge-sistema">{s}</span>
                    ))}
                  </div>
                )}

                {at.afecciones.length > 0 && (
                  <ul className="space-y-1">
                    {at.afecciones.map((af) => (
                      <li key={af}>
                        <Link href={`/afecciones/${encodeURIComponent(af)}`}
                              className="font-body text-sm text-humo-500
                                         hover:text-salvia-600 transition-colors duration-300
                                         flex items-center gap-2 group">
                          <span className="w-1 h-1 rounded-full bg-salvia-300
                                           group-hover:bg-salvia-500 transition-colors" />
                          {af}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Info botánica ─────────────────────────────────────────── */}
      {(planta.principiosActivos.length > 0 || planta.usosEtnobotanicos.length > 0 || planta.polinizadores.length > 0) && (
        <section className="bloom-4">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-humo-400 mb-6">
            Botánica y etnobotánica
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {planta.principiosActivos.length > 0 && (
              <div className="card-herbarium p-5 space-y-3">
                <h3 className="font-display text-base italic text-humo-600">Principios activos</h3>
                <ul className="space-y-1">
                  {planta.principiosActivos.map((p) => (
                    <li key={p} className="font-body text-sm text-humo-500 flex items-center gap-2">
                      <span className="text-salvia-300 text-xs">·</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {planta.usosEtnobotanicos.length > 0 && (
              <div className="card-herbarium p-5 space-y-3">
                <h3 className="font-display text-base italic text-humo-600">Etnobotánica</h3>
                <ul className="space-y-1">
                  {planta.usosEtnobotanicos.map((u) => (
                    <li key={u} className="font-body text-sm text-humo-500 flex items-start gap-2">
                      <span className="text-petal-300 text-xs mt-1">·</span>{u}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {planta.polinizadores.length > 0 && (
              <div className="card-herbarium p-5 space-y-3">
                <h3 className="font-display text-base italic text-humo-600">Polinizadores</h3>
                <ul className="space-y-1">
                  {planta.polinizadores.map((p) => (
                    <li key={p} className="font-body text-sm text-humo-500 flex items-center gap-2">
                      <span className="text-lavanda-300 text-xs">·</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Precauciones (ciclo marchitez) ───────────────────────── */}
      {(planta.precauciones.length > 0 || planta.contraindicaciones.length > 0 || planta.toxicidad) && (
        <section className="bloom-5">
          <div className="card-herbarium border-humo-300 bg-humo-50/60 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍂</span>
              <div>
                <h2 className="font-display text-xl font-light text-humo-700">
                  Precauciones
                </h2>
                <p className="font-body text-xs text-humo-400">
                  Consultá a un profesional antes de usar
                </p>
              </div>
            </div>

            {planta.toxicidad && (
              <p className="font-body text-sm text-petal-600 font-medium
                             bg-petal-50 border border-petal-200 rounded-xl px-4 py-3">
                {planta.toxicidad}
              </p>
            )}

            {planta.precauciones.length > 0 && (
              <ul className="space-y-1.5">
                {planta.precauciones.map((p) => (
                  <li key={p} className="font-body text-sm text-humo-600 flex items-start gap-2">
                    <span className="text-humo-300 mt-0.5">·</span>{p}
                  </li>
                ))}
              </ul>
            )}

            {planta.contraindicaciones.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {planta.contraindicaciones.map((c) => (
                  <span key={c} className="badge-marchitez">{c}</span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Fuentes ─────────────────────────────────────────────── */}
      {planta.fuentes.length > 0 && (
        <section className="bloom-6">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-humo-400 mb-4">
            Fuentes
          </p>
          <ul className="space-y-2">
            {planta.fuentes.map((f: { titulo: string; tipo: string }, i) => (
              <li key={i} className="font-body text-sm text-humo-400 flex items-center gap-3">
                <span className="text-salvia-300">·</span>
                {f.titulo}
                <span className="text-humo-300 text-xs">({f.tipo})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </article>
  );
}
