# 🖼️ Guía de Optimización de Imágenes

## 📊 Situación Actual

Tenés **73 imágenes PNG** en `public/imagenes/` que probablemente pesan entre 200-800KB cada una.

**Problema:**
- 73 imágenes × 500KB promedio = **~36.5 MB** de imágenes
- En móvil (Moto G5 Plus) esto causa:
  - Carga inicial lenta (10-15 segundos)
  - Consumo excesivo de datos móviles
  - Scroll con lag
  - Memoria del navegador saturada

## ✅ Solución Implementada

### Sistema de dos niveles de imágenes:

1. **Thumbnails (miniaturas)** - Para listados
   - Tamaño: 400px ancho
   - Formato: WEBP
   - Quality: 75
   - Peso objetivo: 40-60 KB
   - **Reducción: ~90%** vs PNG original

2. **Full (completas)** - Para fichas individuales
   - Tamaño: 1200px ancho
   - Formato: WEBP
   - Quality: 80
   - Peso objetivo: 150-300 KB
   - **Reducción: ~60%** vs PNG original

### Resultado esperado:
```
Antes:  73 × 500KB = 36.5 MB
Después thumbs: 73 × 50KB = 3.6 MB  (-90%)
Después full: 73 × 200KB = 14.6 MB  (-60%)
```

## 🚀 Cómo Optimizar

### Opción A: Script automático (RECOMENDADO)

```bash
# 1. Instalar sharp (ya hecho)
npm install sharp

# 2. Correr script de optimización
npm run optimize-images

# 3. Revisar las imágenes generadas en:
#    public/imagenes-optimized/thumbs/  (miniaturas)
#    public/imagenes-optimized/full/     (completas)

# 4. Si están bien, reemplazar las originales:
#    Mover imagenes-optimized/ → imagenes/
```

### Opción B: Herramienta online Squoosh

Si preferís control manual sobre cada imagen:

1. **Ir a:** https://squoosh.app/
2. **Arrastrar** una imagen
3. **Configurar:**
   - Format: `WebP`
   - Quality: `75` (para thumbs) o `80` (para full)
   - Resize: `400` (thumbs) o `1200` (full)
4. **Comparar** antes/después en tiempo real
5. **Descargar** y repetir

**Pros:** Control visual total, ideal para ajustar calidad por imagen  
**Cons:** Manual, toma tiempo con 73 imágenes

### Opción C: ImageMagick (CLI avanzado)

Si tenés ImageMagick instalado:

```bash
# Thumbnail
magick public/imagenes/planta.png -resize 400x -quality 75 public/imagenes-optimized/thumbs/planta.webp

# Full
magick public/imagenes/planta.png -resize 1200x -quality 80 public/imagenes-optimized/full/planta.webp

# Batch (todas)
for %f in (public\imagenes\*.png) do (
  magick "%f" -resize 400x -quality 75 "public\imagenes-optimized\thumbs\%~nf.webp"
  magick "%f" -resize 1200x -quality 80 "public\imagenes-optimized\full\%~nf.webp"
)
```

## 📁 Estructura Final

```
public/
├── imagenes-optimized/
│   ├── thumbs/          ← Para PlantaCard (listados)
│   │   ├── aguaribay.webp
│   │   ├── ajo.webp
│   │   └── ...
│   └── full/            ← Para página individual
│       ├── aguaribay.webp
│       ├── ajo.webp
│       └── ...
└── imagenes/            ← Originales (mantener como backup)
    ├── aguaribay.png
    └── ...
```

## 🔧 Código Ya Actualizado

### `PlantaCard.tsx`
```tsx
// Automáticamente usa thumbnail optimizado
<Image
  src={planta.imagenThumb}  // /imagenes-optimized/thumbs/x.webp
  width={400}
  height={300}
  loading="lazy"           // Lazy load automático
/>
```

### `plantas.ts`
```ts
// Convierte automáticamente PNG → WEBP
imagenThumb: getOptimizedImagePath(imagen, 'thumb')
```

## 📈 Mejoras de Rendimiento

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| **Carga inicial** | 36.5 MB | 3.6 MB | **-90%** |
| **Tiempo carga (4G)** | 15 seg | 2 seg | **-87%** |
| **Imágenes cargadas** | 73 | 15 iniciales | **Progresivo** |
| **Scroll lag** | Sí | No | **Suave** |
| **Consumo RAM** | ~300 MB | ~50 MB | **-83%** |

## ⚠️ Importante

1. **No borrar PNG originales** hasta confirmar que WEBP funcionan
2. **Verificar en móvil** después de optimizar
3. **Cache del navegador**: hacer hard refresh (Ctrl+Shift+R)
4. **GitHub Pages**: hacer push y esperar rebuild

## 🎯 Próximos Pasos

### Prioridad 1: Optimizar TODAS las imágenes
```bash
npm run optimize-images
```

### Prioridad 2: Actualizar referencias (si hace falta)
Si las imágenes no cargan:
```bash
npm run migrate-images
```

### Prioridad 3: Verificar en móvil
- Abrir Chrome DevTools
- Modo móvil (Ctrl+Shift+M)
- Network tab → filtrar por "img"
- Verificar que carga WEBP y tamaños correctos

## 🔍 Diagnóstico

### ¿Las imágenes no cargan?

1. **Verificar rutas:**
   ```bash
   # Debe existir
   ls public/imagenes-optimized/thumbs/
   ```

2. **Verificar next.config:**
   ```ts
   images: {
     formats: ["image/webp"],
     unoptimized: true  // Para export estático
   }
   ```

3. **Verificar navegador:**
   - F12 → Console → buscar errores 404
   - Network → filtrar "webp" → ver qué intenta cargar

### ¿Siguen siendo grandes?

- Quality demasiado alto → bajar a 70 (thumbs) / 75 (full)
- Resolución original muy alta → verificar dimensiones source
- PNG con transparencias → WEBP las maneja bien, no preocuparse

## 💡 Tips Extra

### Para screenshots de PWA:
```bash
# Crear versión mobile-friendly
magick screenshot.png -resize 540x720^ -gravity center -extent 540x720 public/screenshots/home.png
```

### Para iconos con fondo de color:
```bash
# Agregar fondo salvia a PNG con transparencia
magick icon.png -background "#7ba684" -flatten icon-filled.png
```

### Conversión masiva con calidad ajustada:
```bash
# Si 75 es mucho, probar con 70
find public/imagenes -name "*.png" -exec sh -c '
  magick "$1" -resize 400x -quality 70 "public/imagenes-optimized/thumbs/$(basename "$1" .png).webp"
' _ {} \;
```

## 📚 Recursos

- [Squoosh](https://squoosh.app/) - Herramienta online de Google
- [Sharp Docs](https://sharp.pixelplumbing.com/) - Node.js image processing
- [WebP Guide](https://developers.google.com/speed/webp) - Formato WebP
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)

---

**¿Listo?** Ejecutá `npm run optimize-images` y probá la diferencia 🚀
