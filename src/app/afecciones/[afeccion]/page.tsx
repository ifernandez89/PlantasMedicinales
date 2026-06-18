import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAfecciones, getPlantasByAfeccion } from "@/lib/plantas";
import PlantaCard from "@/components/PlantaCard";

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
  return { title: decodeURIComponent(afeccion) };
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
    <div className="space-y-12">
      <header className="bloom-1 pt-4">
        <Link href="/afecciones"
              className="font-body text-xs tracking-widest uppercase text-humo-400
                         hover:text-petal-500 transition-colors duration-300 mb-8 inline-block">
          ← Afecciones
        </Link>
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-3">
          Plantas indicadas para
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-light text-humo-800 leading-tight">
          {nombre}
        </h1>
        <p className="font-body text-sm text-humo-400 mt-3">
          {plantas.length} planta{plantas.length !== 1 ? "s" : ""} indicadas
        </p>
      </header>

      <hr className="divider-organic" />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {plantas.map((planta, i) => (
          <PlantaCard key={planta.slug} planta={planta} index={i} />
        ))}
      </div>
    </div>
  );
}
