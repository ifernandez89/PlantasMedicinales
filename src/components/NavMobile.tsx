"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/plantas",    label: "Plantas",    icon: "🌿" },
  { href: "/afecciones", label: "Afecciones", icon: "🩺" },
  { href: "/acciones",   label: "Acciones",   icon: "⚗️" },
  { href: "/sistemas",   label: "Sistemas",   icon: "🫀" },
];

export default function NavMobile() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="sm:hidden flex flex-col gap-1.5 p-1 group"
      >
        <span className={`block w-5 h-px bg-humo-500 transition-all duration-300
                          ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-5 h-px bg-humo-500 transition-all duration-300
                          ${open ? "opacity-0 scale-x-0" : ""}`} />
        <span className={`block w-5 h-px bg-humo-500 transition-all duration-300
                          ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Overlay + panel */}
      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-humo-900/20 backdrop-blur-sm sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          {/* Panel */}
          <nav
            className="fixed top-16 left-0 right-0 z-50 sm:hidden
                       bg-hueso-50/95 backdrop-blur-md
                       border-b border-hueso-200
                       animate-bloom"
          >
            <ul className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl
                                  font-body text-sm transition-all duration-300
                                  ${active
                                    ? "bg-salvia-100 text-salvia-700"
                                    : "text-humo-600 hover:bg-hueso-200 hover:text-humo-800"
                                  }`}
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                      {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-salvia-500" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
