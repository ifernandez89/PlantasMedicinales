import { getAllPlantas, getAllAcciones, getAllSistemas, getAllAfecciones } from "@/lib/plantas";
import type { Planta } from "@/lib/plantas";
import PrintButton from "./PrintButton";

export const metadata = { title: "Herbarium — Libro completo" };

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// ─── Sección de una planta ────────────────────────────────────────────────────
function PlantaPage({ planta }: { planta: Planta }) {
  return (
    <article className="plant-page">
      {/* Cabecera */}
      <header className="plant-header">
        <div className="plant-header-text">
          <h2 className="plant-name">{planta.nombre}</h2>
          {planta.nombreCientifico && (
            <p className="plant-sci">{planta.nombreCientifico}</p>
          )}
          {planta.familia && (
            <p className="plant-family">Familia: {planta.familia}</p>
          )}
          {planta.otrosNombres.length > 0 && (
            <p className="plant-aliases">
              También conocida como: {planta.otrosNombres.join(", ")}
            </p>
          )}
        </div>
        {planta.imagen && (
          <div className="plant-img-wrap">
            <img
              src={`${BASE_PATH}${planta.imagen}`}
              alt={planta.nombre}
              className="plant-img"
            />
          </div>
        )}
      </header>

      {/* Cuerpo */}
      <div className="plant-body">

        {/* Acciones / Sistemas / Afecciones */}
        <div className="plant-tags-grid">
          {planta.acciones.length > 0 && (
            <div>
              <h3 className="tag-label">Acciones terapéuticas</h3>
              <div className="tags">
                {planta.acciones.map(a => <span key={a} className="tag tag-accion">{a}</span>)}
              </div>
            </div>
          )}
          {planta.sistemas.length > 0 && (
            <div>
              <h3 className="tag-label">Sistemas</h3>
              <div className="tags">
                {planta.sistemas.map(s => <span key={s} className="tag tag-sistema">{s}</span>)}
              </div>
            </div>
          )}
          {planta.afecciones.length > 0 && (
            <div>
              <h3 className="tag-label">Afecciones</h3>
              <div className="tags">
                {planta.afecciones.map(a => <span key={a} className="tag tag-afeccion">{a}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        {planta.descripcionHtml && (
          <div
            className="plant-desc"
            dangerouslySetInnerHTML={{ __html: planta.descripcionHtml }}
          />
        )}

        {/* Datos botánicos */}
        <div className="plant-meta-grid">
          {planta.origen && <MetaItem label="Origen" value={planta.origen} />}
          {planta.habitat && <MetaItem label="Hábitat" value={planta.habitat} />}
          {planta.tipoCiclo && <MetaItem label="Ciclo" value={planta.tipoCiclo} />}
          {planta.epocaFloracion && <MetaItem label="Floración" value={planta.epocaFloracion} />}
          {planta.distribucion.length > 0 && (
            <MetaItem label="Distribución" value={planta.distribucion.join(", ")} />
          )}
          {planta.polinizadores.length > 0 && (
            <MetaItem label="Polinizadores" value={planta.polinizadores.join(", ")} />
          )}
        </div>

        {/* Principios activos */}
        {planta.principiosActivos.length > 0 && (
          <div className="plant-section">
            <h3 className="section-title">Principios activos</h3>
            <p className="section-text">{planta.principiosActivos.join(" · ")}</p>
          </div>
        )}

        {/* Usos etnobotánicos */}
        {planta.usosEtnobotanicos.length > 0 && (
          <div className="plant-section">
            <h3 className="section-title">Usos etnobotánicos</h3>
            <ul className="section-list">
              {planta.usosEtnobotanicos.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </div>
        )}

        {/* Precauciones */}
        {(planta.precauciones.length > 0 || planta.contraindicaciones.length > 0 || planta.toxicidad) && (
          <div className="plant-section plant-warning">
            <h3 className="section-title">⚠ Precauciones</h3>
            {planta.toxicidad && <p className="section-text"><strong>Toxicidad:</strong> {planta.toxicidad}</p>}
            {planta.precauciones.length > 0 && (
              <ul className="section-list">
                {planta.precauciones.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            )}
            {planta.contraindicaciones.length > 0 && (
              <>
                <p className="section-text"><strong>Contraindicaciones:</strong></p>
                <ul className="section-list">
                  {planta.contraindicaciones.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-item">
      <span className="meta-label">{label}</span>
      <span className="meta-value">{value}</span>
    </div>
  );
}

// ─── Página principal /export ─────────────────────────────────────────────────
export default async function ExportPage() {
  const [plantas, acciones, sistemas, afecciones] = await Promise.all([
    getAllPlantas(),
    getAllAcciones(),
    getAllSistemas(),
    getAllAfecciones(),
  ]);

  return (
    <>
      <style>{`
        /* Reset para impresión */
        .export-root * { box-sizing: border-box; }
        .export-root { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; background: white; }

        /* Portada */
        .cover-page {
          page-break-after: always;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 2rem;
          border-bottom: 2px solid #7ba684;
        }
        .cover-symbol { font-size: 4rem; margin-bottom: 1.5rem; color: #7ba684; }
        .cover-title { font-size: 5rem; font-weight: 300; letter-spacing: 0.15em; margin: 0; color: #2a2a2a; }
        .cover-subtitle { font-size: 1.2rem; font-weight: 300; color: #7ba684; letter-spacing: 0.3em; text-transform: uppercase; margin: 1rem 0 3rem; }
        .cover-desc { font-size: 1rem; color: #666; max-width: 480px; line-height: 1.8; }
        .cover-stats { display: flex; gap: 3rem; margin-top: 3rem; }
        .cover-stat-n { font-size: 2.5rem; font-weight: 300; color: #7ba684; display: block; }
        .cover-stat-l { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; }
        .cover-footer { margin-top: auto; padding-top: 3rem; font-size: 0.75rem; color: #bbb; letter-spacing: 0.2em; text-transform: uppercase; }

        /* Índice */
        .toc-page {
          page-break-after: always;
          padding: 3rem 2rem;
        }
        .toc-title { font-size: 2rem; font-weight: 300; color: #7ba684; border-bottom: 1px solid #ddd; padding-bottom: 0.75rem; margin-bottom: 2rem; }
        .toc-grid { columns: 2; column-gap: 2rem; }
        .toc-item { display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px dotted #ddd; break-inside: avoid; font-size: 0.9rem; }
        .toc-num { color: #7ba684; font-weight: 500; }
        .toc-sci { color: #999; font-style: italic; font-size: 0.8rem; }

        /* Página de planta */
        .plant-page {
          page-break-before: always;
          padding: 2.5rem 2rem;
          border-top: 3px solid #7ba684;
        }
        .plant-header { display: flex; gap: 2rem; margin-bottom: 1.5rem; align-items: flex-start; }
        .plant-header-text { flex: 1; }
        .plant-name { font-size: 2.5rem; font-weight: 300; margin: 0 0 0.25rem; color: #2a2a2a; }
        .plant-sci { font-style: italic; color: #7ba684; font-size: 1.1rem; margin: 0 0 0.25rem; }
        .plant-family { color: #888; font-size: 0.85rem; margin: 0 0 0.25rem; }
        .plant-aliases { color: #aaa; font-size: 0.8rem; margin: 0; font-style: italic; }
        .plant-img-wrap { width: 160px; flex-shrink: 0; }
        .plant-img { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; border: 1px solid #e8e0d0; }

        /* Tags */
        .plant-tags-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; background: #f9f6f0; padding: 1rem; border-radius: 8px; }
        .tag-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: #999; margin: 0 0 0.4rem; font-family: system-ui, sans-serif; }
        .tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }
        .tag { font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: 20px; font-family: system-ui, sans-serif; }
        .tag-accion { background: #e8f0e9; color: #4a7c5a; }
        .tag-sistema { background: #e8eef8; color: #3a5a8a; }
        .tag-afeccion { background: #f5ede8; color: #8a4a3a; }

        /* Descripción */
        .plant-desc { font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; color: #333; }
        .plant-desc h2 { font-size: 1rem; font-weight: 600; color: #7ba684; margin: 1rem 0 0.5rem; }
        .plant-desc ul { padding-left: 1.2rem; }
        .plant-desc li { margin-bottom: 0.25rem; }

        /* Meta grid */
        .plant-meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem 1.5rem; margin-bottom: 1.5rem; border-top: 1px solid #eee; padding-top: 1rem; }
        .meta-item { display: flex; flex-direction: column; }
        .meta-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #aaa; font-family: system-ui, sans-serif; }
        .meta-value { font-size: 0.85rem; color: #444; }

        /* Secciones */
        .plant-section { margin-bottom: 1rem; }
        .section-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.2em; color: #7ba684; margin: 0 0 0.4rem; font-family: system-ui, sans-serif; }
        .section-text { font-size: 0.85rem; color: #555; margin: 0 0 0.3rem; }
        .section-list { font-size: 0.85rem; color: #555; padding-left: 1.2rem; margin: 0; }
        .section-list li { margin-bottom: 0.2rem; }
        .plant-warning { background: #fff8f0; border-left: 3px solid #e8a87c; padding: 0.75rem 1rem; border-radius: 0 6px 6px 0; }

        /* Botón imprimir — solo en pantalla */
        .print-btn-bar { position: fixed; bottom: 2rem; right: 2rem; z-index: 100; display: flex; gap: 0.75rem; }
        .print-btn {
          background: #7ba684; color: white; border: none; cursor: pointer;
          padding: 0.75rem 1.5rem; border-radius: 9999px; font-size: 0.9rem;
          font-family: system-ui, sans-serif; font-weight: 500;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: background 0.2s;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .print-btn:hover { background: #5a7e62; }

        @media print {
          .print-btn-bar { display: none !important; }
          .cover-page { min-height: auto; }
          body { margin: 0; }
        }
      `}</style>

      <div className="export-root">

        {/* ── Portada ──────────────────────────────────────────────── */}
        <div className="cover-page">
          <div className="cover-symbol">✦</div>
          <h1 className="cover-title">Herbarium</h1>
          <p className="cover-subtitle">Plantas Medicinales</p>
          <p className="cover-desc">
            Un registro botánico de plantas medicinales organizadas por acción terapéutica,
            sistema corporal y uso tradicional. Solo con fines informativos.
            No reemplaza consejo médico.
          </p>
          <div className="cover-stats">
            <div>
              <span className="cover-stat-n">{plantas.length}</span>
              <span className="cover-stat-l">Plantas</span>
            </div>
            <div>
              <span className="cover-stat-n">{afecciones.length}</span>
              <span className="cover-stat-l">Afecciones</span>
            </div>
            <div>
              <span className="cover-stat-n">{acciones.length}</span>
              <span className="cover-stat-l">Acciones</span>
            </div>
            <div>
              <span className="cover-stat-n">{sistemas.length}</span>
              <span className="cover-stat-l">Sistemas</span>
            </div>
          </div>
          <p className="cover-footer">Herbarium · {new Date().getFullYear()}</p>
        </div>

        {/* ── Índice ───────────────────────────────────────────────── */}
        <div className="toc-page">
          <h2 className="toc-title">Índice de plantas</h2>
          <div className="toc-grid">
            {plantas.map((p, i) => (
              <div key={p.slug} className="toc-item">
                <span>
                  <span className="toc-num">{String(i + 1).padStart(2, "0")}. </span>
                  {p.nombre}
                </span>
                <span className="toc-sci">{p.nombreCientifico}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Plantas ──────────────────────────────────────────────── */}
        {plantas.map((planta) => (
          <PlantaPage key={planta.slug} planta={planta} />
        ))}

        {/* ── Botón imprimir ───────────────────────────────────────── */}
        <PrintButton />
      </div>
    </>
  );
}
