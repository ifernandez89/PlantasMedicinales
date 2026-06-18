"use client";

import { useState, useEffect, useRef } from "react";
import type { Planta } from "@/lib/plantas";

interface Props {
  initialQuery?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ 
  initialQuery = "", 
  placeholder = "Buscar planta, acción o afección...",
  onSearch
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado: Ctrl+K o Cmd+K para enfocar búsqueda
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
      <div
        className={`relative flex items-center transition-all duration-300 
                    bg-hueso-50 border-2 rounded-2xl overflow-hidden
                    ${isFocused 
                      ? "border-salvia-400 shadow-lg shadow-salvia-100/50" 
                      : "border-hueso-200 shadow-md"}`}
      >
        {/* Ícono de búsqueda */}
        <div className={`absolute left-4 transition-colors duration-300 
                        ${isFocused ? "text-salvia-500" : "text-humo-400"}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 py-3 pl-12 pr-24 font-body text-sm text-humo-800
                     placeholder:text-humo-400 bg-transparent
                     focus:outline-none"
          aria-label="Buscar plantas"
        />

        {/* Botón clear (si hay texto) */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 text-humo-400 hover:text-humo-600
                       transition-colors duration-200"
            aria-label="Limpiar búsqueda"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Botón submit */}
        <button
          type="submit"
          className="absolute right-2 px-4 py-1.5 bg-salvia-500 text-hueso-50 
                     font-body text-sm rounded-lg
                     hover:bg-salvia-600 transition-colors duration-300
                     focus:outline-none focus:ring-2 focus:ring-salvia-400 focus:ring-offset-2"
        >
          Buscar
        </button>
      </div>

      {/* Hint de atajo de teclado */}
      <div className="absolute right-0 -bottom-6 text-xs text-humo-400 font-body">
        <kbd className="px-2 py-0.5 bg-hueso-100 border border-hueso-200 rounded">
          {typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}+K
        </kbd>
        {' '}para enfocar
      </div>
    </form>
  );
}
