import Image from "next/image";
import Link from "next/link";
import type { Planta } from "@/lib/plantas";

interface Props {
  planta: Planta;
  priority?: boolean;
}

export default function PlantaCard({ planta, priority = false }: Props) {
  return (
    <Link
      href={`/plantas/${planta.slug}`}
      className="group bg-white rounded-2xl shadow-sm border border-verde-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      {/* Imagen */}
      <div className="relative w-full h-44 bg-verde-50 flex-shrink-0">
        {planta.imagen ? (
          <Image
            src={planta.imagen}
            alt={planta.nombre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-verde-200">
            🌿
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 space-y-2 flex-1">
        <div>
          <h3 className="font-semibold text-verde-800 text-lg leading-tight">
            {planta.nombre}
          </h3>
          {planta.nombreCientifico && (
            <p className="text-xs italic text-gray-400">{planta.nombreCientifico}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1 pt-1">
          {planta.acciones.slice(0, 3).map((a) => (
            <span key={a} className="badge-accion">
              {a}
            </span>
          ))}
          {planta.acciones.length > 3 && (
            <span className="badge-accion">+{planta.acciones.length - 3}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
