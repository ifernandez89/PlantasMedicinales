/**
 * Script para migrar referencias de imágenes PNG a WEBP
 * 
 * 1. Actualiza todos los archivos .md en content/plantas/
 * 2. Cambia /imagenes/planta.png → /imagenes/planta.webp
 * 3. Opcionalmente reemplaza la carpeta public/imagenes/
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'plantas');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'imagenes');
const OPTIMIZED_DIR = path.join(__dirname, '..', 'public', 'imagenes-optimized');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Actualiza referencias de imágenes en archivos markdown
 */
function updateMarkdownReferences() {
  log('blue', '\n📝 Actualizando referencias en archivos .md...\n');
  
  if (!fs.existsSync(CONTENT_DIR)) {
    log('red', `✗ Directorio no encontrado: ${CONTENT_DIR}`);
    return { updated: 0, errors: 0 };
  }
  
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  let updated = 0;
  let errors = 0;
  
  files.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Reemplazar /imagenes/*.png por /imagenes/*.webp
      content = content.replace(
        /\/imagenes\/([^.\s'"]+)\.png/g,
        '/imagenes/$1.webp'
      );
      
      // Reemplazar imagenes/*.png por imagenes/*.webp (sin slash inicial)
      content = content.replace(
        /imagenes\/([^.\s'"]+)\.png/g,
        'imagenes/$1.webp'
      );
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        log('green', `✓ ${file}`);
        updated++;
      } else {
        log('yellow', `○ ${file} (sin cambios)`);
      }
    } catch (error) {
      log('red', `✗ Error en ${file}: ${error.message}`);
      errors++;
    }
  });
  
  return { updated, errors, total: files.length };
}

/**
 * Verifica que las imágenes optimizadas existan
 */
function verifyOptimizedImages() {
  log('blue', '\n🔍 Verificando imágenes optimizadas...\n');
  
  const thumbsDir = path.join(OPTIMIZED_DIR, 'thumbs');
  
  if (!fs.existsSync(thumbsDir)) {
    log('red', '✗ No se encontró el directorio de thumbnails.');
    log('yellow', '  Ejecutá primero: npm run optimize-images');
    return false;
  }
  
  const webpFiles = fs.readdirSync(thumbsDir).filter(f => f.endsWith('.webp'));
  
  if (webpFiles.length === 0) {
    log('red', '✗ No hay archivos WEBP en thumbs/');
    log('yellow', '  Ejecutá primero: npm run optimize-images');
    return false;
  }
  
  log('green', `✓ Encontrados ${webpFiles.length} archivos WEBP`);
  return true;
}

/**
 * Reemplaza la carpeta de imágenes
 */
function replaceImagesFolder(dryRun = true) {
  log('blue', '\n📁 Preparando reemplazo de carpeta imagenes/...\n');
  
  const thumbsDir = path.join(OPTIMIZED_DIR, 'thumbs');
  const backupDir = path.join(__dirname, '..', 'public', 'imagenes-backup');
  
  if (dryRun) {
    log('yellow', '  [DRY RUN - No se hacen cambios]');
    log('yellow', '  Comandos que se ejecutarían:\n');
    console.log(`  1. Backup: mv "${IMAGES_DIR}" "${backupDir}"`);
    console.log(`  2. Copiar:  cp -r "${thumbsDir}" "${IMAGES_DIR}"`);
    console.log(`  3. Renombrar: .webp → .webp (mantener extensión)\n`);
    
    log('yellow', '  Para ejecutar de verdad, usá: --replace');
    return;
  }
  
  try {
    // 1. Hacer backup de originales
    if (fs.existsSync(IMAGES_DIR) && !fs.existsSync(backupDir)) {
      log('blue', '1. Haciendo backup de imágenes originales...');
      fs.renameSync(IMAGES_DIR, backupDir);
      log('green', `✓ Backup guardado en: ${backupDir}`);
    }
    
    // 2. Copiar thumbs optimizados a imagenes/
    log('blue', '2. Copiando imágenes optimizadas...');
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    
    const webpFiles = fs.readdirSync(thumbsDir);
    webpFiles.forEach(file => {
      const src = path.join(thumbsDir, file);
      const dest = path.join(IMAGES_DIR, file);
      fs.copyFileSync(src, dest);
    });
    
    log('green', `✓ Copiados ${webpFiles.length} archivos WEBP`);
    
    log('green', '\n✓ ¡Reemplazo completado!');
    log('yellow', `  Backup original en: ${backupDir}`);
    
  } catch (error) {
    log('red', `✗ Error durante reemplazo: ${error.message}`);
  }
}

/**
 * Actualiza plantas.ts para usar imágenes directas
 */
function updatePlantasConfig() {
  log('blue', '\n⚙️  Actualizando src/lib/plantas.ts...\n');
  
  const plantasPath = path.join(__dirname, '..', 'src', 'lib', 'plantas.ts');
  
  if (!fs.existsSync(plantasPath)) {
    log('red', `✗ No se encontró: ${plantasPath}`);
    return false;
  }
  
  let content = fs.readFileSync(plantasPath, 'utf8');
  
  // Reemplazar la función getOptimizedImagePath para devolver la ruta directa
  const oldFunction = /function getOptimizedImagePath\([^}]+\{[^}]+\}/s;
  const newFunction = `function getOptimizedImagePath(originalPath: string | null, type: 'thumb' | 'full' = 'thumb'): string | null {
  if (!originalPath) return null;
  // Después de migrate-image-refs, las imágenes ya están en /imagenes/ como .webp
  return originalPath;
}`;
  
  if (oldFunction.test(content)) {
    content = content.replace(oldFunction, newFunction);
    fs.writeFileSync(plantasPath, content, 'utf8');
    log('green', '✓ plantas.ts actualizado');
    return true;
  } else {
    log('yellow', '○ plantas.ts ya estaba actualizado o tiene formato diferente');
    return false;
  }
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2);
  const shouldReplace = args.includes('--replace');
  const skipVerify = args.includes('--skip-verify');
  
  console.log('═══════════════════════════════════════════════════');
  log('blue', '🖼️  Migración de Referencias de Imágenes');
  console.log('═══════════════════════════════════════════════════\n');
  
  console.log('Args recibidos:', args);
  console.log('shouldReplace:', shouldReplace);
  console.log('');
  
  // 1. Verificar imágenes optimizadas
  if (!skipVerify && !verifyOptimizedImages()) {
    log('red', '\n✗ Abortado: Primero ejecutá npm run optimize-images');
    process.exit(1);
  }
  
  // 2. Actualizar .md
  const mdResult = updateMarkdownReferences();
  
  console.log('\n───────────────────────────────────────────────────');
  log('blue', `📊 Archivos .md procesados:`);
  console.log(`   Total:      ${mdResult.total}`);
  console.log(`   ${colors.green}Actualizados: ${mdResult.updated}${colors.reset}`);
  console.log(`   Sin cambios: ${mdResult.total - mdResult.updated - mdResult.errors}`);
  if (mdResult.errors > 0) {
    console.log(`   ${colors.red}Errores:     ${mdResult.errors}${colors.reset}`);
  }
  console.log('───────────────────────────────────────────────────\n');
  
  // 3. Reemplazar carpeta (dry-run por defecto)
  replaceImagesFolder(!shouldReplace);
  
  // 4. Actualizar plantas.ts si se hizo el reemplazo
  if (shouldReplace) {
    updatePlantasConfig();
  }
  
  // Resumen final
  console.log('\n═══════════════════════════════════════════════════');
  if (!shouldReplace) {
    log('yellow', '⚠️  MODO DRY-RUN');
    log('yellow', '   Los archivos .md fueron actualizados');
    log('yellow', '   Pero las carpetas NO fueron reemplazadas');
    log('yellow', '\n   Para ejecutar el reemplazo completo:');
    log('blue', '   node scripts/migrate-image-refs.js --replace');
  } else {
    log('green', '✓ MIGRACIÓN COMPLETA');
    log('green', '  • Referencias .md actualizadas');
    log('green', '  • Carpeta imagenes/ reemplazada con WEBP');
    log('green', '  • plantas.ts actualizado');
    log('yellow', '\n  Próximos pasos:');
    console.log('  1. npm run build');
    console.log('  2. Verificar que todo funciona');
    console.log('  3. git add . && git commit -m "feat: migración a WEBP"');
  }
  console.log('═══════════════════════════════════════════════════\n');
}

main();
