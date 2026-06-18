/**
 * Script para optimizar imágenes de plantas
 * 
 * Genera dos versiones de cada imagen:
 * - Thumbnail: 400px ancho, WEBP, 40-60KB
 * - Full: 1200px ancho, WEBP, 150-300KB
 * 
 * Usa Sharp (librería de procesamiento de imágenes)
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'imagenes');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'imagenes-optimized');
const THUMBS_DIR = path.join(OUTPUT_DIR, 'thumbs');
const FULL_DIR = path.join(OUTPUT_DIR, 'full');

// Crear directorios si no existen
[OUTPUT_DIR, THUMBS_DIR, FULL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function optimizeImage(inputPath, filename) {
  const nameWithoutExt = path.parse(filename).name;
  
  try {
    // Thumbnail: 400px ancho, quality 75
    await sharp(inputPath)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(path.join(THUMBS_DIR, `${nameWithoutExt}.webp`));
    
    // Full: 1200px ancho, quality 80
    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(FULL_DIR, `${nameWithoutExt}.webp`));
    
    // Stats
    const originalSize = fs.statSync(inputPath).size;
    const thumbSize = fs.statSync(path.join(THUMBS_DIR, `${nameWithoutExt}.webp`)).size;
    const fullSize = fs.statSync(path.join(FULL_DIR, `${nameWithoutExt}.webp`)).size;
    
    const thumbSaving = ((originalSize - thumbSize) / originalSize * 100).toFixed(1);
    const fullSaving = ((originalSize - fullSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ ${filename}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(0)} KB`);
    console.log(`  Thumb:    ${(thumbSize / 1024).toFixed(0)} KB (-${thumbSaving}%)`);
    console.log(`  Full:     ${(fullSize / 1024).toFixed(0)} KB (-${fullSaving}%)`);
    
    return { original: originalSize, thumb: thumbSize, full: fullSize };
  } catch (error) {
    console.error(`✗ Error procesando ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Optimizando imágenes de plantas...\n');
  
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  
  if (files.length === 0) {
    console.log('No se encontraron imágenes en public/imagenes/');
    return;
  }
  
  console.log(`Encontradas ${files.length} imágenes\n`);
  
  let totalOriginal = 0;
  let totalThumb = 0;
  let totalFull = 0;
  let processed = 0;
  
  for (const file of files) {
    const inputPath = path.join(IMAGES_DIR, file);
    const result = await optimizeImage(inputPath, file);
    
    if (result) {
      totalOriginal += result.original;
      totalThumb += result.thumb;
      totalFull += result.full;
      processed++;
    }
    
    console.log(''); // Línea en blanco
  }
  
  // Resumen
  console.log('═══════════════════════════════════════════════════');
  console.log(`✓ Procesadas: ${processed}/${files.length} imágenes`);
  console.log('');
  console.log(`Total Original:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Thumbs:    ${(totalThumb / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Full:      ${(totalFull / 1024 / 1024).toFixed(2)} MB`);
  console.log('');
  const thumbSaving = ((totalOriginal - totalThumb) / totalOriginal * 100).toFixed(1);
  const fullSaving = ((totalOriginal - totalFull) / totalOriginal * 100).toFixed(1);
  console.log(`Ahorro Thumbs:   -${thumbSaving}%`);
  console.log(`Ahorro Full:     -${fullSaving}%`);
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('📁 Salida:');
  console.log(`   Miniaturas: ${THUMBS_DIR}`);
  console.log(`   Full:       ${FULL_DIR}`);
  console.log('');
  console.log('⚠️  SIGUIENTE PASO:');
  console.log('   Revisar las imágenes optimizadas y, si están bien:');
  console.log('   1. Reemplazar public/imagenes/ con las nuevas');
  console.log('   2. Actualizar referencias en los .md a .webp');
  console.log('   3. O usar el script migrate-image-refs.js');
}

main().catch(console.error);
