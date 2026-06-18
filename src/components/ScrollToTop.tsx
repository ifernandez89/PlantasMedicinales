"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar el botón cuando se hace scroll más de 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40
                  w-12 h-12 rounded-full
                  bg-salvia-500 hover:bg-salvia-600 
                  text-hueso-50 shadow-lg
                  flex items-center justify-center
                  transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-salvia-400 focus:ring-offset-2
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16 pointer-events-none"}
                  hover:shadow-xl hover:scale-110`}
      aria-label="Volver arriba"
      title="Volver arriba"
    >
      {/* Icono de flecha hacia arriba */}
      <svg 
        className="w-6 h-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M5 15l7-7 7 7" 
        />
      </svg>
    </button>
  );
}
