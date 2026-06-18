# 🌿 Plantas Medicinales

Registro de plantas medicinales organizadas por acción terapéutica, sistema corporal y uso tradicional. Construido con Next.js 15 + TypeScript + Tailwind CSS.

## Estructura del proyecto

```
PlantasMedicinales/
│
├── content/
│   └── plantas/             ← Un archivo .md por planta
│       ├── menta.md
│       ├── manzanilla.md
│       ├── calendula.md
│       └── llanten.md
│
├── src/
│   ├── app/
│   │   ├── page.tsx         ← Inicio con estadísticas
│   │   ├── plantas/
│   │   │   ├── page.tsx     ← Listado de todas las plantas
│   │   │   └── [slug]/
│   │   │       └── page.tsx ← Detalle de planta
│   │   ├── acciones/
│   │   │   ├── page.tsx     ← Listado de acciones terapéuticas
│   │   │   └── [accion]/
│   │   │       └── page.tsx ← Plantas por acción
│   │   └── sistemas/
│   │       └── page.tsx     ← Plantas por sistema corporal
│   │
│   └── lib/
│       └── plantas.ts       ← Capa de datos (lee los .md)
│
└── public/
    └── imagenes/            ← Fotos de las plantas
```

## Instalación

```bash
npm install
npm run dev
```

## Agregar una planta

Crear un nuevo archivo en `content/plantas/nombre-planta.md` siguiendo el frontmatter de las plantas existentes. La página se genera automáticamente.

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/plantas` | Todas las plantas |
| `/plantas/[slug]` | Detalle de una planta |
| `/acciones` | Todas las acciones terapéuticas |
| `/acciones/[accion]` | Plantas con esa acción |
| `/sistemas` | Plantas por sistema corporal |
