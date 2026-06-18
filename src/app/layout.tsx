import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Plantas Medicinales",
    default: "Plantas Medicinales",
  },
  description:
    "Registro de plantas medicinales organizadas por acción terapéutica, sistema corporal y uso tradicional.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <header className="bg-verde-700 text-white shadow-md">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90">
              🌿 Plantas Medicinales
            </Link>
            <nav className="flex gap-5 text-sm font-medium">
              <Link href="/plantas" className="hover:underline underline-offset-4">
                Plantas
              </Link>
              <Link href="/afecciones" className="hover:underline underline-offset-4">
                Afecciones
              </Link>
              <Link href="/acciones" className="hover:underline underline-offset-4">
                Acciones
              </Link>
              <Link href="/sistemas" className="hover:underline underline-offset-4">
                Sistemas
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>

        <footer className="text-center text-xs text-gray-400 py-8 mt-10 border-t border-gray-200">
          Plantas Medicinales — solo con fines informativos
        </footer>
      </body>
    </html>
  );
}
