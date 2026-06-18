import type { Metadata } from "next";
import Link from "next/link";
import { getAllSistemas, getPlantasBySistema } from "@/lib/plantas";

export const metadata: Metadata = {
  title: "Sistemas corporales",
};

export default async function SistemasPage() {
  const sistemas = await getAllSistemas();
  const entries = await Promise.all(
    sistemas.map(async (s) => ({
      sistema: s,
      plantas: await getPlantasBySistema(s),
    }))
  );

  return (
    <div className="space-y-12">
      <header className="bloom-1 pt-4">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-3">
          Herbarium · Anatomía
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-light text-humo-800 leading-tight">
          Sistemas<br />
          <span className="italic text-lavanda-400">corporales</span>
        </h1>
        <p className="font-body text-sm text-humo-400 mt-4">
          {sistemas.length} sistemas documentados
        </p>
      </header>

      <hr className="divider-organic" />

      <div className="grid sm:grid-cols-2 gap-5">
        {entries.map(({ sistema, plantas }, i) => (
          <div key={sistema}
               className={`card-herbarium p-6 space-y-4 bloom-${Math.min(i + 1, 6)}`}>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-light text-humo-800">
                {sistema}
              </h2>
              <span className="font-body text-xs text-humo-400">
                {plantas.length} planta{plantas.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {plantas.map((p) => (
                <Link key={p.slug} href={`/plantas/${p.slug}`}>
                  <span className="badge-accion">{p.nombre}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
