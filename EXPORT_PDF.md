# 📄 Exportación a PDF — Metodologías Evaluadas

## Resumen ejecutivo

Este documento registra las metodologías evaluadas para exportar contenido a PDF
en la aplicación Herbarium. Se evaluaron dos enfoques principales:

1. **Libro completo** — Ruta especial `/export` que renderiza todas las plantas en un solo documento
2. **Por página** — Cada ruta exporta solo su contenido actual con `window.print()` (✅ implementado)

---

## El problema

Exportar a PDF en una app Next.js con múltiples rutas dinámicas no es trivial.
Las opciones más comunes tienen limitaciones importantes:

| Método | Resultado |
|--------|-----------|
| `window.print()` por página | Solo la ruta activa |
| `html2canvas` + `jsPDF` | Lento, texto no seleccionable, imágenes pixeladas |
| Playwright recorriendo todas las rutas | Complejo, lento, difícil de mantener |
| **`/export` + `window.print()`** | ✅ Todo en uno, texto seleccionable, rápido |

---

## Metodología 1: Libro completo con `/export`

### Descripción
Crear una ruta especial que renderiza **todo el contenido** en un solo HTML largo,
luego usar `window.print()` una sola vez para generar el PDF completo.

### Arquitectura

```
Base de datos (archivos .md)
        ↓
  getAllPlantas()
        ↓
  /export (Server Component)
        ↓
  HTML largo: portada + índice + 74 plantas
        ↓
  window.print() → Guardar como PDF
        ↓
  Libro PDF completo (74 páginas)
```

### Archivos involucrados

```
src/app/export/
  page.tsx        ← Server Component, obtiene datos y renderiza todo
  PrintButton.tsx ← Client Component, solo el botón onClick

src/components/
  ExportPDF.tsx   ← Botón flotante en el layout (Link → /export)
```

### Ventajas
- ✅ Un solo PDF con todo el contenido
- ✅ Portada e índice profesionales
- ✅ Control total de la paginación con CSS
- ✅ Saltos de página entre plantas
- ✅ Texto seleccionable, imágenes nítidas
- ✅ Sin dependencias externas

### Desventajas
- ❌ Carga inicial más lenta (74 plantas de golpe)
- ❌ Consume más memoria del navegador
- ❌ No permite exportar secciones específicas fácilmente
- ❌ Layout diferente al del sitio (diseño de "libro")

### CSS crítico

```css
/* Cada planta empieza en página nueva */
.plant-page {
  page-break-before: always;
}

/* Portada e índice terminan su página */
.cover-page,
.toc-page {
  page-break-after: always;
}

/* Evitar que los cards se corten */
.plant-page {
  break-inside: avoid;
}

/* Preservar colores al imprimir */
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

---

## Metodología 2: Por página (implementada) ✅

### Descripción
Cada ruta/sección exporta **solo su propio contenido** usando `window.print()`.
El usuario presiona el botón flotante y descarga exactamente lo que está viendo.

### Arquitectura

```
Usuario en /plantas
        ↓
  Click en botón PDF
        ↓
  window.print()
        ↓
  PDF de /plantas solamente

Usuario en /plantas/manzanilla
        ↓
  Click en botón PDF
        ↓
  window.print()
        ↓
  PDF de manzanilla solamente
```

### Archivos involucrados

```
src/components/
  ExportPDF.tsx   ← Botón flotante, llama window.print()

src/app/
  globals.css     ← Estilos @media print globales
```

### Implementación

```tsx
// src/components/ExportPDF.tsx
"use client";

export default function ExportPDF() {
  return (
    <button
      onClick={() => window.print()}
      className="fixed bottom-6 right-20 z-40 w-12 h-12 rounded-full
                 bg-humo-600 hover:bg-humo-700 text-hueso-50 shadow-lg
                 print:hidden"
      aria-label="Exportar a PDF"
    >
      <svg>...</svg>
    </button>
  );
}
```

```css
/* src/app/globals.css */
@media print {
  header,
  footer,
  .print\:hidden {
    display: none !important;
  }

  main {
    padding-top: 0 !important;
  }

  body {
    background: white !important;
  }

  /* Evitar cortes en cards */
  .card-herbarium,
  [class*="rounded-xl"] {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* Preservar colores */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

### Ventajas
- ✅ Simple y directo
- ✅ Cero configuración por página
- ✅ Mantiene el mismo layout que el sitio
- ✅ Cada usuario exporta solo lo que necesita
- ✅ Rápido (no carga datos extras)
- ✅ Funciona en todas las rutas sin cambios

### Desventajas
- ❌ No genera un libro completo
- ❌ No tiene portada ni índice
- ❌ Requiere múltiples exportaciones si se quiere todo el contenido

---

## Comparación de metodologías

| Aspecto | Libro completo `/export` | Por página `window.print()` |
|---------|-------------------------|----------------------------|
| **Complejidad** | Alta | Baja |
| **Archivos nuevos** | 3 archivos | 1 componente |
| **Carga inicial** | Lenta (74 plantas) | Rápida |
| **Control de layout** | Total | Limitado |
| **Uso típico** | Descargar una vez | Exportar sección específica |
| **Portada/índice** | ✅ Sí | ❌ No |
| **Flexibilidad** | ❌ Todo o nada | ✅ Lo que ves es lo que exportas |

---

## Decisión final

Se optó por **Metodología 2: Por página** porque:

1. **Simplicidad**: Un solo componente, funciona en todas las rutas
2. **Flexibilidad**: Cada usuario exporta solo lo que necesita
3. **Rendimiento**: No carga datos innecesarios
4. **Mantenibilidad**: Cero configuración adicional por página

Si en el futuro se necesita un "libro completo", la Metodología 1 está documentada
y puede implementarse en paralelo sin afectar la funcionalidad actual.

---

La idea es simple: en lugar de intentar unir múltiples rutas en un PDF,
se crea **una sola página especial** que renderiza todo el contenido junto.

```
Base de datos (archivos .md)
        ↓
  getAllPlantas()
        ↓
  /export (Server Component)
        ↓
  HTML largo: portada + índice + 74 plantas
        ↓
  window.print() → Guardar como PDF
        ↓
  Libro PDF completo
```

---

## Arquitectura de archivos

```
src/app/export/
  page.tsx        ← Server Component, obtiene datos y renderiza todo
  PrintButton.tsx ← Client Component, solo el botón onClick

src/components/
  ExportPDF.tsx   ← Botón flotante en el layout (Link → /export)

src/app/
  globals.css     ← Estilos @media print globales
```

### ¿Por qué separar PrintButton?

`page.tsx` es un Server Component (para poder usar `async/await` con los datos).
El evento `onClick` requiere un Client Component (`"use client"`).
Separar solo el botón mantiene el resto como Server Component,
lo que es más eficiente y evita hidratar toda la página en el cliente.

---

## Estructura del libro generado

```
┌─────────────────────────────┐
│         PORTADA             │  ← Título, estadísticas, año
├─────────────────────────────┤
│         ÍNDICE              │  ← 74 plantas en 2 columnas, con nombre científico
├─────────────────────────────┤
│  Planta 1 (página propia)   │  ← Imagen, tags, descripción, datos, precauciones
├─────────────────────────────┤
│  Planta 2 (página propia)   │
├─────────────────────────────┤
│         ...                 │
├─────────────────────────────┤
│  Planta 74                  │
└─────────────────────────────┘
```

---

## CSS de impresión

El control de la paginación se hace con propiedades CSS estándar:

```css
/* Cada planta empieza en página nueva */
.plant-page {
  page-break-before: always;
}

/* Portada e índice terminan su página */
.cover-page,
.toc-page {
  page-break-after: always;
}

/* Evitar que los cards se corten */
.plant-page {
  break-inside: avoid;
}

/* Preservar colores de fondo al imprimir */
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

### Ocultar elementos de navegación al imprimir

En `globals.css`:

```css
@media print {
  header,
  footer,
  .print\:hidden {
    display: none !important;
  }

  main {
    padding-top: 0 !important;
  }
}
```

La clase `.print:hidden` (Tailwind) se aplica a cualquier elemento
que no deba aparecer en el PDF: botones flotantes, nav, etc.

---

## Estilos inline vs globals.css

Los estilos del libro se definen con `<style>` inline dentro del componente
en lugar de Tailwind o globals.css. Esto es intencional:

- **Portabilidad**: la página `/export` tiene su propio sistema visual (tipografía serif, layout de libro)
  distinto al resto de la app
- **Aislamiento**: no interfieren con los estilos del sitio principal
- **Sin dependencias**: no requiere clases de Tailwind; el CSS es autocontenido

> ⚠️ No usar `<style jsx global>` — no es compatible con el App Router de Next.js 15.
> Usar `<style>` estándar dentro del JSX del Server Component funciona correctamente.

---

## Flujo de usuario

1. El usuario ve el ícono de descarga (📥) flotante en cualquier página del sitio
2. Hace clic → se abre `/export` en una pestaña nueva
3. La página carga con todo el contenido del herbarium
4. Hace clic en **"⬇ Descargar PDF"**
5. El navegador abre el diálogo de impresión
6. Selecciona **"Guardar como PDF"** → descarga directa

En Chrome/Edge, si el usuario tiene configurado PDF como destino predeterminado,
la descarga es automática sin interacción adicional.

---

## Consideraciones de rendimiento

- La página `/export` es un Server Component: los datos se resuelven en el servidor,
  no hay hidratación pesada en el cliente
- Las imágenes usan `<img>` nativo (no `next/image`) para evitar restricciones
  de dominio y simplificar la ruta con `BASE_PATH`
- Con 74 plantas, el HTML generado pesa ~300–500 KB, manejable para cualquier navegador

---

## Extensiones posibles

### Exportación por categoría
Crear rutas como `/export/sistemas/digestivo` que filtren plantas
antes de pasarlas al mismo componente de layout.

### Generación automática con Playwright
Si se necesita generación sin interacción del usuario (ej: descarga directa):

```ts
// scripts/generate-pdf.ts
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:3000/export");
await page.pdf({
  path: "herbarium.pdf",
  format: "A4",
  printBackground: true,
});
await browser.close();
```

Esto requiere instalar Playwright (`npm install -D playwright`)
y ejecutarlo como script independiente, no como ruta de la app.

### Agregar número de páginas
Con CSS puro, usando contadores:

```css
@page {
  @bottom-right {
    content: counter(page) " / " counter(pages);
  }
}
```

Nota: el soporte varía entre navegadores. Chromium lo implementa correctamente.
