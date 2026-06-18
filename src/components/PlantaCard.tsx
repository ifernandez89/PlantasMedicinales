"use client";

import Image from "next/image";
import Link from "next/link";
import type { Planta } from "@/lib/plantas";

interface Props {
  planta: Planta;
  priority?: boolean;
  index?: number;
}

// Determina el ciclo vital según las propiedades de la planta
function getCicloVital(planta: Planta): "brote" | "floracion" | "marchitez" {
  if (planta.toxicidad || planta.contraindicaciones.length > 2) return "marchitez";
  if (planta.accionesTerapeuticas.length >= 4) return "floracion";
  return "brote";
}

const cicloConfig = {
  brote: {
    icon: "🌱",
    label: "Brote",
    overlayClass: "from-salvia-900/60 via-salvia-800/30 to-transparent",
    badgeClass: "badge-brote",
    accentClass: "bg-salvia-400",
  },
  floracion: {
    icon: "🌸",
    label: "Floración",
    overlayClass: "from-humo-900/70 via-petal-900/20 to-transparent",
    badgeClass: "badge-floracion",
    accentClass: "bg-petal-400",
  },
  marchitez: {
    icon: "🍂",
    label: "Precaución",
    overlayClass: "from-humo-900/75 via-humo-800/30 to-transparent",
    badgeClass: "badge-marchitez",
    accentClass: "bg-humo-400",
  },
};

export default function PlantaCard({ planta, priority = false, index = 0 }: Props) {
  const ciclo = getCicloVital(planta);
  const cfg = cicloConfig[ciclo];

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  
  // Usar thumbnail optimizado si existe, sino imagen original
  const imageSrc = planta.imagenThumb || planta.imagen;
  const finalSrc = imageSrc ? (imageSrc.startsWith("/") ? `${basePath}${imageSrc}` : imageSrc) : "";

  return (
    <Link
      href={`/plantas/${planta.slug}`}
      className={`card-herbarium flex flex-col group bloom-${Math.min(index + 1, 6)}`}
    >
      {/* ── Imagen con overlay orgánico ── */}
      <div className="relative w-full h-52 overflow-hidden">
        {finalSrc ? (
          <>
            <Image
              src={finalSrc}
              alt={planta.nombre}
              width={400}
              height={300}
              className={`object-cover w-full h-full transition-all duration-800 ease-out ${
                ciclo === "marchitez"
                  ? "group-hover:scale-105 group-hover:saturate-50 group-hover:brightness-90"
                  : "group-hover:scale-105 group-hover:brightness-105"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
            {/* Gradient overlay */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t ${cfg.overlayClass}
                         transition-opacity duration-600 group-hover:opacity-100 opacity-70`} 
            />
          </>
        ) : (
          <div className="w-full h-full bg-hueso-200 flex items-center justify-center">
            <span className="text-5xl opacity-30">{cfg.icon}</span>
          </div>
        )}

        {/* Nombre sobre la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className={`font-display text-2xl font-light text-hueso-50
                          transition-all duration-400
                          group-hover:translate-y-0 group-hover:opacity-100 translate-y-1 opacity-95`}>
            {planta.nombre}
          </h3>
          {planta.nombreCientifico && (
            <p className={`font-display text-xs italic text-hueso-200/80
                           transition-all duration-400
                           group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2`}>
              {planta.nombreCientifico}
            </p>
          )}
        </div>

        {/* Badge ciclo vital */}
        <div className="absolute top-3 right-3">
          <span className={`${cfg.badgeClass} text-xs backdrop-blur-sm`}>
            {cfg.icon}
          </span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex flex-wrap gap-1">
          {planta.acciones.slice(0, 3).map((a) => (
            <span key={a} className="badge-accion">{a}</span>
          ))}
          {planta.acciones.length > 3 && (
            <span className="badge-accion text-humo-400">+{planta.acciones.length - 3}</span>
          )}
        </div>

        {/* Acento de ciclo en el bottom */}
        <div className={`mt-auto h-0.5 rounded-full transition-all duration-600 ${cfg.accentClass}
                          group-hover:w-full group-hover:opacity-60 w-8 opacity-30`} />
      </div>
    </Link>
  );
}
