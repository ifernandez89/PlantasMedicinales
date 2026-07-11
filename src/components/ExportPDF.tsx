"use client";

export default function ExportPDF() {
  return (
    <button
      onClick={() => window.print()}
      className="fixed bottom-6 right-20 z-40
                 w-12 h-12 rounded-full
                 bg-humo-600 hover:bg-humo-700
                 text-hueso-50 shadow-lg
                 flex items-center justify-center
                 transition-all duration-300
                 focus:outline-none focus:ring-2 focus:ring-humo-400 focus:ring-offset-2
                 hover:shadow-xl hover:scale-110
                 print:hidden"
      aria-label="Exportar esta página a PDF"
      title="Exportar esta página a PDF"
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
  );
}
