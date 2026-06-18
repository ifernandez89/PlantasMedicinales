"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Escuchar el evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detectar si ya fue instalada
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallButton(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    // Guardar preferencia para no mostrar por 7 días
    localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
  };

  // No mostrar si está instalada o si fue descartada recientemente
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowInstallButton(false);
      }
    }
  }, []);

  if (isInstalled || !showInstallButton) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 bloom-3
                    sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="card-herbarium p-4 shadow-xl border-2 border-salvia-200">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <span className="text-3xl">🌱</span>

          {/* Content */}
          <div className="flex-1">
            <h3 className="font-display text-lg font-light text-humo-800 mb-1">
              Instalar Herbarium
            </h3>
            <p className="font-body text-xs text-humo-500 leading-relaxed mb-3">
              Acceso rápido, funciona sin conexión y ahorra datos móviles
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-salvia-500 text-hueso-50 
                         font-body text-sm rounded-lg
                         hover:bg-salvia-600 transition-colors duration-300
                         focus:outline-none focus:ring-2 focus:ring-salvia-400 focus:ring-offset-2"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-transparent text-humo-500 
                         font-body text-sm rounded-lg border border-humo-200
                         hover:bg-humo-50 transition-colors duration-300
                         focus:outline-none focus:ring-2 focus:ring-humo-300 focus:ring-offset-2"
              >
                Ahora no
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-humo-400 hover:text-humo-600 transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
