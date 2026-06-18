"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import type { Planta } from "@/lib/plantas";
import PlantaCard from "./PlantaCard";
import SearchBar from "./SearchBar";

interface Props {
  plantas: Planta[];
  itemsPerPage?: number;
}

export default function InfiniteScroll({ plantas, itemsPerPage = 15 }: Props) {
  const [displayedItems, setDisplayedItems] = useState(itemsPerPage);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);

  // Filtrar plantas por búsqueda (client-side)
  const filteredPlantas = useMemo(() => {
    if (!searchQuery.trim()) return plantas;
    
    const q = searchQuery.toLowerCase();
    return plantas.filter(p => 
      p.nombre.toLowerCase().includes(q) ||
      p.nombreCientifico?.toLowerCase().includes(q) ||
      p.otrosNombres.some(n => n.toLowerCase().includes(q)) ||
      p.acciones.some(a => a.toLowerCase().includes(q)) ||
      p.afecciones.some(a => a.toLowerCase().includes(q)) ||
      p.sistemas.some(s => s.toLowerCase().includes(q))
    );
  }, [plantas, searchQuery]);

  const visiblePlantas = filteredPlantas.slice(0, displayedItems);
  const hasMore = displayedItems < filteredPlantas.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && displayedItems < filteredPlantas.length) {
          setIsLoading(true);
          
          setTimeout(() => {
            setDisplayedItems(prev => Math.min(prev + itemsPerPage, filteredPlantas.length));
            setIsLoading(false);
          }, 300);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "200px"
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [displayedItems, filteredPlantas.length, itemsPerPage]);

  // Reset cuando cambie el filtro
  useEffect(() => {
    setDisplayedItems(itemsPerPage);
  }, [filteredPlantas, itemsPerPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="space-y-8">
      {/* Buscador integrado */}
      <div className="bloom-2 pb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Grid de plantas */}
      {visiblePlantas.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {visiblePlantas.map((planta, i) => (
              <PlantaCard 
                key={planta.slug} 
                planta={planta} 
                priority={i < 6} 
                index={i} 
              />
            ))}
          </div>

          {/* Loader / Trigger */}
          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-8">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-salvia-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-salvia-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      🌱
                    </div>
                  </div>
                  <p className="font-body text-sm text-humo-400">
                    Cargando más plantas...
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-body text-sm text-humo-400">
                    Hacé scroll para cargar más
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Mensaje cuando se llegó al final */}
          {!hasMore && filteredPlantas.length > itemsPerPage && (
            <div className="text-center py-8 border-t border-hueso-200">
              <span className="text-3xl mb-2 inline-block">🌸</span>
              <p className="font-display text-lg text-humo-500">
                Has visto todas las plantas
              </p>
              <p className="font-body text-sm text-humo-400 mt-1">
                {filteredPlantas.length} especies {searchQuery && `encontradas para "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* Contador */}
          {filteredPlantas.length > 0 && (
            <div className="text-center font-body text-xs text-humo-400">
              Mostrando {displayedItems} de {filteredPlantas.length}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 bloom-3">
          <span className="text-6xl mb-4 inline-block opacity-30">🍂</span>
          <p className="font-display text-2xl text-humo-500 mb-2">
            No encontramos plantas
          </p>
          <p className="font-body text-sm text-humo-400">
            Intentá buscar por nombre, acción o afección
          </p>
        </div>
      )}
    </div>
  );
}
