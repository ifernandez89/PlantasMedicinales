# 🚀 Instrucciones Rápidas - Optimización de Imágenes

## ⚠️ IMPORTANTE: Optimizar Imágenes

Las imágenes optimizadas **NO** están generadas todavía. Por eso ves errores 404:

```
GET /imagenes-optimized/thumb/cucurbita.webp 404
```

## ✅ Solución en 2 Pasos

### Paso 1: Generar Imágenes Optimizadas

```bash
# Asegurate de tener sharp instalado (ya está)
npm install sharp

# Ejecutar script de optimización (toma 2-3 minutos)
npm run optimize-images
```

**Esto va a:**
- Leer todas las imágenes de `public/imagenes/`
- Generar versiones optimizadas en `public/imagenes-optimized/`
- Crear thumbnails (400px) y full (1200px) en WEBP
- Reducir el peso en ~90%

### Paso 2: Activar Uso de Imágenes Optimizadas

Una vez generadas, descomentar en `src/lib/plantas.ts`:

```typescript
function getOptimizedImagePath(originalPath: string | null, type: 'thumb' | 'full' = 'thumb'): string | null {
  if (!originalPath) return null;
  
  if (originalPath.includes('imagenes-optimized')) return originalPath;
  
  // DESCOMENTAR ESTAS LÍNEAS:
  const parsed = path.parse(originalPath);
  const nameWithoutExt = parsed.name;
  return `/imagenes-optimized/${type}/${nameWithoutExt}.webp`;
  
  // COMENTAR O BORRAR ESTA:
  // return originalPath;
}
```

## 📊 Resultado Esperado

```bash
npm run optimize-images

# Output esperado:
🖼️  Optimizando imágenes de plantas...

Encontradas 73 imágenes

✓ aguaribay.png
  Original: 523 KB
  Thumb:    48 KB (-90.8%)
  Full:     187 KB (-64.2%)

✓ ajo.png
  Original: 612 KB
  Thumb:    52 KB (-91.5%)
  Full:     198 KB (-67.6%)

... (todas las demás)

═══════════════════════════════════════
✓ Procesadas: 73/73 imágenes

Total Original:  36.47 MB
Total Thumbs:    3.59 MB
Total Full:      14.32 MB

Ahorro Thumbs:   -90.2%
Ahorro Full:     -60.7%
═══════════════════════════════════════

📁 Salida:
   Miniaturas: C:\...\public\imagenes-optimized\thumbs
   Full:       C:\...\public\imagenes-optimized\full
```

## 🔄 Workflow Completo

```bash
# 1. Optimizar imágenes
npm run optimize-images

# 2. Verificar que se crearon
ls public/imagenes-optimized/thumbs/  # Debe mostrar 73 archivos .webp

# 3. Activar en código (descomentar en plantas.ts)

# 4. Rebuild
npm run build

# 5. Probar localmente
npm run dev

# 6. Deploy
git add .
git commit -m "feat: imágenes optimizadas"
git push
```

## ⚡ Ahora Mismo (Sin Optimización)

El código **ya está funcionando** con las imágenes originales PNG.

- ✅ PWA funcionando
- ✅ Buscador funcionando
- ✅ Infinite scroll funcionando
- ⚠️ Imágenes pesadas (pero funcionan)

## 🎯 Después de Optimizar

- ✅ Todo lo anterior
- ✅ Imágenes 90% más livianas
- ✅ Carga 10x más rápida
- ✅ Ahorro masivo de datos móviles

## 🆘 Si tenés problemas

### Error: sharp no funciona
```bash
npm uninstall sharp
npm install sharp --build-from-source
```

### Error: script no encuentra imágenes
```bash
# Verificar que existen
ls public/imagenes/*.png

# Debe mostrar ~73 archivos
```

### Prefiero herramienta online
1. Ir a https://squoosh.app/
2. Arrastrar una imagen
3. Configurar: WebP, Quality 75, Resize 400
4. Descargar y repetir con las demás

---

**TL;DR:** Ejecutá `npm run optimize-images` y después descomentá las líneas en `plantas.ts` 🚀
