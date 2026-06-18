import Link from "next/link";
import {
  getAllPlantas,
  getAllAcciones,
  getAllSistemas,
  getAllAfecciones,
} from "@/lib/plantas";

export default async function HomePage() {
  const [plantas, acciones, sistemas, afecciones] = await Promise.all([
    getAllPlantas(),
    getAllAcciones(),
    getAllSistemas(),
    getAllAfecciones(),
  ]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-verde-900">
          🌿 Plantas Medicinales
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Registro botánico organizado por acción terapéutica, sistema corporal,
          afección y uso tradicional.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/plantas"
            className="bg-verde-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-verde-900 transition-colors"
          >
            Ver todas las plantas
          </Link>
          <Link
            href="/afecciones"
            className="border border-verde-700 text-verde-700 px-5 py-2 rounded-full text-sm font-medium hover:bg-verde-100 transition-colors"
          >
            Buscar por afección
          </Link>
          <Link
            href="/acciones"
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Ver acciones terapéuticas
          </Link>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="card-planta">
          <p className="text-3xl font-bold text-verde-700">{plantas.length}</p>
          <p className="text-sm text-gray-500 mt-1">Plantas</p>
        </div>
        <div className="card-planta">
          <p className="text-3xl font-bold text-verde-700">{afecciones.length}</p>
          <p className="text-sm text-gray-500 mt-1">Afecciones</p>
        </div>
        <div className="card-planta">
          <p className="text-3xl font-bold text-verde-700">{acciones.length}</p>
          <p className="text-sm text-gray-500 mt-1">Acciones</p>
        </div>
        <div className="card-planta">
          <p className="text-3xl font-bold text-verde-700">{sistemas.length}</p>
          <p className="text-sm text-gray-500 mt-1">Sistemas</p>
        </div>
      </section>

      {/* Ejes de exploración */}
      <section className="grid sm:grid-cols-3 gap-6">
        <Link href="/afecciones" className="card-planta block text-center space-y-2 hover:border-verde-500">
          <div className="text-3xl">🩺</div>
          <h2 className="font-semibold text-verde-800">Por afección</h2>
          <p className="text-sm text-gray-500">
            Tengo dolor de estómago, tos, insomnio… ¿qué planta uso?
          </p>
        </Link>
        <Link href="/acciones" className="card-planta block text-center space-y-2 hover:border-verde-500">
          <div className="text-3xl">⚗️</div>
          <h2 className="font-semibold text-verde-800">Por acción terapéutica</h2>
          <p className="text-sm text-gray-500">
            Digestiva, expectorante, antibiótica, adaptógena…
          </p>
        </Link>
        <Link href="/sistemas" className="card-planta block text-center space-y-2 hover:border-verde-500">
          <div className="text-3xl">🫀</div>
          <h2 className="font-semibold text-verde-800">Por sistema corporal</h2>
          <p className="text-sm text-gray-500">
            Digestivo, respiratorio, nervioso, hepático…
          </p>
        </Link>
      </section>

      {/* Plantas del registro */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold text-verde-900">Plantas en el registro</h2>
          <Link href="/plantas" className="text-sm text-verde-700 hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {plantas.map((planta) => (
            <Link
              key={planta.slug}
              href={`/plantas/${planta.slug}`}
              className="card-planta block space-y-2"
            >
              <h3 className="font-semibold text-verde-800">{planta.nombre}</h3>
              {planta.nombreCientifico && (
                <p className="text-xs italic text-gray-400">
                  {planta.nombreCientifico}
                </p>
              )}
              <div className="flex flex-wrap gap-1 pt-1">
                {planta.acciones.slice(0, 3).map((a) => (
                  <span key={a} className="badge-accion">
                    {a}
                  </span>
                ))}
                {planta.acciones.length > 3 && (
                  <span className="badge-accion">
                    +{planta.acciones.length - 3}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
