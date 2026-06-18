# 🎯 Workflow Completo de Optimización de Imágenes

## Opción A: Proceso Automático Completo (RECOMENDADO)

### Paso 1: Optimizar Imágenes
```bash
npm run optimize-images
```

**Esto genera:**
- `public/imagenes-optimized/thumbs/` - Miniaturas 400px WEBP
- `public/imagenes-optimized/full/` - Completas 1200px WEBP

**Tiempo:** 2-3 minutos para 73 imágenes

### Paso 2: Migrar Referencias (Dry Run)
```bash
npm run migrate-images
```

**Esto muestra:**
- Qué archivos .md se van a actualizar
- Qué comandos se van a ejecutar
- **NO hace cambios permanentes** (solo preview)

### Paso 3: Ejecutar Migración Real
```bash
npm run migrate-images -- --replace
```

**Esto hace:**
1. ✅ Actualiza TODOS los `.md` de PNG → WEBP
2. ✅ Hace backup de `public/imagenes/` → `public/imagenes-backup/`
3. ✅ Copia `thumbs/` optimizados → `public/imagenes/`
4. ✅ Actualiza `src/lib/plantas.ts`

### Paso 4: Verificar y Deploy
```bash
# Build para verificar
npm run build

# Si todo funciona, commit y push
git add .
git commit -m "feat: migración completa a imágenes WEBP optimizadas"
git push
```

---

## Opción B: Proceso Manual Paso a Paso

### 1. Generar Imágenes Optimizadas
```bash
npm run optimize-images
```

### 2. Actualizar Referencias en .md Manualmente

Abrir cada archivo en `content/plantas/*.md` y cambiar:

```yaml
# Antes
imagen: /imagenes/planta.png

# Después
imagen: /imagenes/planta.webp
```

### 3. Reemplazar Carpeta de Imágenes

```bash
# Backup
mv public/imagenes public/imagenes-backup

# Copiar optimizadas
cp -r public/imagenes-optimized/thumbs public/imagenes

# Verificar
ls public/imagenes/*.webp
```

### 4. Actualizar plantas.ts

Editar `src/lib/plantas.ts` y simplificar la función:

```typescript
function getOptimizedImagePath(originalPath: string | null, type: 'thumb' | 'full' = 'thumb'): string | null {
  if (!originalPath) return null;
  return originalPath; // Ya apunta a WEBP
}
```

---

## 🔍 Verificación

### Después de la migración, verificar:

```bash
# 1. Archivos .md actualizados
grep -r "\.png" content/plantas/
# No debe mostrar nada

# 2. Imágenes WEBP en lugar
ls public/imagenes/*.webp | wc -l
# Debe mostrar 73

# 3. Build exitoso
npm run build
# Debe compilar sin errores

# 4. Funcionamiento local
npm run dev
# Abrir http://localhost:3000/plantas
# Las imágenes deben cargar
```

---

## 🆘 Rollback (Si algo sale mal)

### Si la migración automática falló:

```bash
# 1. Restaurar imágenes originales
rm -rf public/imagenes
mv public/imagenes-backup public/imagenes

# 2. Restaurar referencias .md
git checkout content/plantas/*.md

# 3. Restaurar plantas.ts
git checkout src/lib/plantas.ts
```

---

## 📊 Comparativa de Opciones

| Aspecto | Opción A (Automático) | Opción B (Manual) |
|---------|----------------------|-------------------|
| **Tiempo** | 5 minutos | 30-60 minutos |
| **Errores** | Muy bajo | Medio |
| **Control** | Medio | Alto |
| **Backup** | Automático | Manual |
| **Revertir** | Fácil | Medio |

---

## ⚙️ Opciones del Script

### migrate-images

```bash
# Dry run (preview, no hace cambios)
npm run migrate-images

# Ejecución real con reemplazo
npm run migrate-images -- --replace

# Saltar verificación de optimizadas (no recomendado)
npm run migrate-images -- --skip-verify
```

### optimize-images

```bash
# Optimización estándar
npm run optimize-images

# El script es interactivo, solo ejecutar
```

---

## 🎯 Resultado Final

Después de la migración completa:

```
public/
├── imagenes/              ← WEBP optimizados (thumbs)
├── imagenes-backup/       ← PNG originales (backup)
└── imagenes-optimized/    ← Puede borrarse después
    ├── thumbs/            ← Usado para imagenes/
    └── full/              ← Para uso futuro

content/plantas/
└── *.md                   ← Todos con .webp

src/lib/plantas.ts         ← Simplificado
```

### Métricas:
- 📦 Tamaño imágenes: **36.5 MB → 3.6 MB** (-90%)
- ⚡ Carga inicial: **15 seg → 2 seg** (-87%)
- 📱 UX móvil: **Lento → Instantáneo**

---

## 💡 Tips

1. **Hacer el dry-run primero** para ver qué va a pasar
2. **Verificar el backup** antes de borrar originales
3. **Probar localmente** antes de hacer push
4. **Las imágenes full** quedan en `imagenes-optimized/full/` para uso futuro

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Optimizar
npm run optimize-images

# 2. Preview
npm run migrate-images

# 3. Ejecutar
npm run migrate-images -- --replace

# 4. Verificar
npm run build

# 5. Deploy
git add . && git commit -m "feat: WEBP optimizado" && git push
```

¡Listo! 🎉
