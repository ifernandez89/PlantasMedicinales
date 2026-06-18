import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Link from "next/link";
import NavMobile from "@/components/NavMobile";
import InstallPWA from "@/components/InstallPWA";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s — Herbarium",
    default: "Herbarium · Plantas Medicinales",
  },
  description:
    "Un herbarium emocional moderno. Plantas medicinales organizadas por acción terapéutica, sistema corporal y ciclo de vida.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Herbarium",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#7ba684",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const navLinks = [
  { href: "/plantas",    label: "Plantas" },
  { href: "/afecciones", label: "Afecciones" },
  { href: "/acciones",   label: "Acciones" },
  { href: "/sistemas",   label: "Sistemas" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {/* ─── Header ──────────────────────────────────────────────── */}
        <header className="fixed top-0 left-0 right-0 z-50
                           bg-hueso-50/80 backdrop-blur-md
                           border-b border-hueso-200/60">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
              <span className="text-salvia-500 text-lg transition-transform duration-600
                               group-hover:rotate-45 inline-block">
                ✦
              </span>
              <span className="font-display text-lg font-light tracking-[0.2em] text-humo-800 uppercase">
                Herbarium
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden sm:flex items-center gap-8" aria-label="Navegación principal">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm font-light tracking-wide text-humo-500
                             hover:text-salvia-600 transition-colors duration-300
                             relative after:absolute after:-bottom-0.5 after:left-0 after:right-0
                             after:h-px after:bg-salvia-400 after:scale-x-0
                             hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Nav mobile */}
            <NavMobile />
          </div>
        </header>

        {/* ─── Main ────────────────────────────────────────────────── */}
        <main className="pt-16 min-h-screen">
          <div className="max-w-6xl mx-auto px-6 py-12">
            {children}
          </div>
        </main>

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="border-t border-hueso-200 mt-24">
          <div className="max-w-6xl mx-auto px-6 py-12
                          flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <p className="font-display text-xl font-light italic text-humo-500">
                Herbarium
              </p>
              <p className="font-body text-xs text-humo-400">
                Solo con fines informativos · No reemplaza consejo médico
              </p>
            </div>

            {/* Ciclo en el footer */}
            <div className="flex items-center gap-3 text-humo-300">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-humo-400">
                🌱 brote
              </span>
              <span className="w-12 h-px bg-gradient-to-r from-salvia-200 via-petal-200 to-humo-200" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-humo-400">
                🌸 floración
              </span>
              <span className="w-12 h-px bg-gradient-to-r from-petal-200 via-lavanda-200 to-humo-200" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-humo-400">
                🍂 marchitez
              </span>
            </div>

            {/* Links del footer */}
            <nav className="flex gap-6" aria-label="Links del footer">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-xs text-humo-400 hover:text-salvia-500
                             transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>

        {/* PWA Install Prompt */}
        <InstallPWA />
        
        {/* Scroll to Top Button */}
        <ScrollToTop />
      </body>
    </html>
  );
}
