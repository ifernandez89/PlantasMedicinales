import type { Metadata } from "next";
import Link from "next/link";
import { getAllPlantas } from "@/lib/plantas";
import PlantaCard from "@/components/PlantaCard";

export const metadata: Metadata = {
  title: "Todas las plantas",
};

export default async function PlantasPage() {
  const plantas = await getAllPlantas();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-verde-900">Plantas</h1>
        <p className="text-gray-500 mt-1">
          {plantas.length} plantas en el registro
        </p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {plantas.map((planta, i) => (
          <PlantaCard key={planta.slug} planta={planta} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
