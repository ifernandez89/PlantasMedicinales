"use client";

export default function ExportPDF() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        onClick={handlePrint}
        className="fixed bottom-6 right-20 z-40
                   w-12 h-12 rounded-full
                   bg-humo-600 hover:bg-humo-700
                   text-hueso-50 shadow-lg
                   flex items-center justify-center
                   transition-all duration-300
                   focus:outline-none focus:ring-2 focus:ring-humo-400 focus:ring-offset-2
                   hover:shadow-xl hover:scale-110
                   print:hidden"
        aria-label="Exportar a PDF"
        title="Exportar a PDF"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
      </button>

      {/* Estilos de impresión */}
      <style jsx global>{`
        @media print {
          /* Ocultar elementos de navegación */
          header,
          footer,
          .print\\:hidden {
            display: none !important;
          }

          /* Ajustar márgenes y colores para impresión */
          body {
            background: white !important;
            color: black !important;
          }

          main {
            padding-top: 0 !important;
          }

          /* Evitar cortes de página dentro de cards */
          .card-herbarium,
          [class*="rounded-xl"] {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Asegurar que los colores de fondo se impriman */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </>
  );
}
