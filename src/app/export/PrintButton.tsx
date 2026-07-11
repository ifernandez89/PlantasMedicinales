"use client";

export default function PrintButton() {
  return (
    <div className="print-btn-bar">
      <button className="print-btn" onClick={() => window.print()}>
        ⬇ Descargar PDF
      </button>
    </div>
  );
}
