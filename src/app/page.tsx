import Link from "next/link";
import {
  getAllPlantas,
  getAllAcciones,
  getAllSistemas,
  getAllAfecciones,
} from "@/lib/plantas";
import PlantaCard from "@/components/PlantaCard";

export default async function HomePage() {
  const [plantas, acciones, sistemas, afecciones] = await Promise.all([
    getAllPlantas(),
    getAllAcciones(),
    getAllSistemas(),
    getAllAfecciones(),
  ]);

  return (
    <div className="space-y-24">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex flex-col justify-center py-16">

        {/* Decoración tipográfica de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
          <span className="absolute -top-8 -right-12 font-display text-[22vw] font-light
                           text-salvia-500/[0.035] leading-none tracking-tighter">
            Herb.
          </span>
        </div>

        <div className="relative z-10 bloom-1">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-salvia-500 mb-6">
            Un herbarium emocional moderno
          </p>
          <h1 className="font-display text-6xl sm:text-8xl font-light text-humo-800
                         leading-[0.9] tracking-tight mb-8">
            Plantas<br />
            <span className="italic text-salvia-500">Medicinales</span>
          </h1>
          <p className="font-body text-base font-light text-humo-500 max-w-md leading-relaxed mb-10">
            Cada planta cuenta un ciclo — desde el brote hasta la marchitez.
            Un registro botánico organizado por acción terapéutica,
            sistema corporal y uso tradicional.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/plantas"
                  className="group flex items-center gap-2
                             bg-salvia-600 hover:bg-salvia-700
                             text-hueso-50 font-body text-sm font-medium
                             px-6 py-3 rounded-full
                             transition-all duration-400">
              <span>Explorar plantas</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link href="/afecciones"
                  className="flex items-center gap-2
                             border border-humo-300 hover:border-salvia-400
                             text-humo-600 hover:text-salvia-600
                             font-body text-sm
                             px-6 py-3 rounded-full
                             transition-all duration-400">
              Buscar por afección
            </Link>
          </div>
        </div>

        {/* Línea decorativa */}
        <div className="absolute bottom-0 left-0 right-0 h-px
                        bg-gradient-to-r from-transparent via-salvia-200 to-transparent" />
      </section>

      {/* ── Ciclo vital (leyenda) ─────────────────────────────────── */}
      <section className="bloom-2">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-6">
          Ciclo de vida
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-2xl">
          {[
            { icon: "🌱", label: "Brote",     desc: "Propiedades básicas · fácil uso",           color: "border-salvia-200 bg-salvia-50/50" },
            { icon: "🌸", label: "Floración", desc: "Múltiples acciones · plena potencia",       color: "border-petal-200 bg-petal-50/50" },
            { icon: "🍂", label: "Precaución",desc: "Toxicidad · contraindicaciones",            color: "border-humo-200 bg-humo-50/50" },
          ].map(({ icon, label, desc, color }) => (
            <div key={label} className={`rounded-xl border p-4 ${color}`}>
              <div className="text-2xl mb-2">{icon}</div>
              <p className="font-display text-base font-medium text-humo-700">{label}</p>
              <p className="font-body text-xs text-humo-400 mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="bloom-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { n: plantas.length,   label: "Plantas" },
            { n: afecciones.length,label: "Afecciones" },
            { n: acciones.length,  label: "Acciones" },
            { n: sistemas.length,  label: "Sistemas" },
          ].map(({ n, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-5xl font-light text-salvia-600">{n}</p>
              <p className="font-body text-xs tracking-widest uppercase text-humo-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider-organic" />

      {/* ── Ejes de navegación ───────────────────────────────────── */}
      <section className="bloom-3">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-8">
          Explorar por
        </p>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { href: "/afecciones", icon: "🩺", title: "Afección",        desc: "Tengo tos, insomnio, dolor de estómago…" },
            { href: "/acciones",   icon: "⚗️",  title: "Acción terapéutica", desc: "Digestiva, expectorante, adaptógena…" },
            { href: "/sistemas",   icon: "🫀",  title: "Sistema corporal", desc: "Digestivo, respiratorio, nervioso…" },
          ].map(({ href, icon, title, desc }) => (
            <Link key={href} href={href}
                  className="group card-herbarium p-6 flex flex-col gap-3">
              <span className="text-3xl transition-transform duration-400 group-hover:scale-110 inline-block">
                {icon}
              </span>
              <div>
                <h2 className="font-display text-xl font-light text-humo-800">{title}</h2>
                <p className="font-body text-sm text-humo-400 mt-1 leading-relaxed">{desc}</p>
              </div>
              <span className="font-body text-xs text-salvia-500 mt-auto
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explorar →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Grid de plantas ──────────────────────────────────────── */}
      <section>
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="font-body text-xs tracking-[0.25em] uppercase text-humo-400 mb-1">
              El registro
            </p>
            <h2 className="font-display text-3xl font-light text-humo-800">
              Todas las plantas
            </h2>
          </div>
          <Link href="/plantas"
                className="font-body text-sm text-salvia-500 hover:text-salvia-700
                           transition-colors duration-300">
            Ver todas →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {plantas.map((planta, i) => (
            <PlantaCard key={planta.slug} planta={planta} priority={i < 6} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
