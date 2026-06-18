import type { Metadata } from "next";
import { getAllPlantas } from "@/lib/plantas";
import PlantaCard from "@/components/PlantaCard";

export const metadata: Metadata = {
  title: "El registro completo",
  description: "Todas las plantas medicinales del herbarium.",
};

export default async function PlantasPage() {
  const plantas = await getAllPlantas();

  return (
    <div className="space-y-12">

      {/* Header */}
      <header className="bloom-1 pt-4">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-3">
          Herbarium · El registro
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-light text-humo-800 leading-tight">
          Plantas<br />
          <span className="italic text-salvia-500">medicinales</span>
        </h1>
        <p className="font-body text-sm text-humo-400 mt-4 max-w-sm leading-relaxed">
          {plantas.length} especies documentadas · ordenadas alfabéticamente
        </p>
      </header>

      <hr className="divider-organic" />

      {/* Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {plantas.map((planta, i) => (
          <PlantaCard key={planta.slug} planta={planta} priority={i < 3} index={i} />
        ))}
      </div>
    </div>
  );
}
