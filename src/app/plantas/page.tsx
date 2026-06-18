import type { Metadata } from "next";
import { getAllPlantas } from "@/lib/plantas";
import SearchBar from "@/components/SearchBar";
import InfiniteScroll from "@/components/InfiniteScroll";

export const metadata: Metadata = {
  title: "El registro completo",
  description: "Todas las plantas medicinales del herbarium.",
};

// Forzar generación estática
export const dynamic = 'force-static';

export default async function PlantasPage() {
  // Cargar todas las plantas en build time
  // El filtrado lo hace el cliente con SearchBar + InfiniteScroll
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
          {plantas.length} especies documentadas
        </p>
      </header>

      <hr className="divider-organic" />

      {/* Buscador protagonista */}
      {/* (ya está integrado en InfiniteScroll) */}

      {/* Grid con Infinite Scroll */}
      <InfiniteScroll plantas={plantas} itemsPerPage={15} />
    </div>
  );
}
