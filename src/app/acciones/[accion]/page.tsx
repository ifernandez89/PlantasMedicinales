import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllAcciones, getPlantasByAccion } from "@/lib/plantas";
import PlantaCard from "@/components/PlantaCard";

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
  return { title: nombre };
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
    <div className="space-y-12">
      <header className="bloom-1 pt-4">
        <Link href="/acciones"
              className="font-body text-xs tracking-widest uppercase text-humo-400
                         hover:text-salvia-500 transition-colors duration-300 mb-8 inline-block">
          ← Acciones
        </Link>
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-3">
          Acción terapéutica
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-light text-humo-800 leading-tight">
          {nombre}
        </h1>
        <p className="font-body text-sm text-humo-400 mt-3">
          {plantas.length} planta{plantas.length !== 1 ? "s" : ""} con esta acción
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
