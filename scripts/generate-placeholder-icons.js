const fs = require('fs');
const path = require('path');

// Script simple para generar iconos SVG placeholder
// Para producción, usa imágenes PNG reales

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Crear directorio si no existe
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo -->
  <rect width="${size}" height="${size}" fill="#7ba684"/>
  
  <!-- Padding interno (10%) -->
  <g transform="translate(${size * 0.1}, ${size * 0.1})">
    <!-- Contenido en el 80% central -->
    <rect width="${size * 0.8}" height="${size * 0.8}" fill="none"/>
    
    <!-- Diamante (símbolo de Herbarium) -->
    <path d="M ${size * 0.4} ${size * 0.1} 
             L ${size * 0.7} ${size * 0.4} 
             L ${size * 0.4} ${size * 0.7} 
             L ${size * 0.1} ${size * 0.4} Z" 
          fill="#fdfaf6" 
          stroke="#fdfaf6" 
          stroke-width="2"
          opacity="0.9"/>
    
    <!-- Letra H estilizada (opcional, comentar si no gusta) -->
    <text x="${size * 0.4}" 
          y="${size * 0.5}" 
          font-family="Georgia, serif" 
          font-size="${size * 0.3}" 
          font-weight="300"
          fill="#fdfaf6" 
          text-anchor="middle" 
          dominant-baseline="middle">H</text>
  </g>
</svg>`;

  const filename = size === 180 
    ? 'apple-touch-icon.png' 
    : size === 150
    ? 'mstile-150x150.png'
    : `icon-${size}x${size}.png`;

  // Guardar como SVG temporalmente (renombrar a .svg si prefieres)
  // Para PWA real, necesitas convertir a PNG
  fs.writeFileSync(
    path.join(iconsDir, filename.replace('.png', '.svg')), 
    svg
  );
  
  console.log(`✓ Generado ${filename.replace('.png', '.svg')}`);
});

// Generar mstile adicional
const svg150 = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
  <rect width="150" height="150" fill="#7ba684"/>
  <path d="M 60 15 L 105 60 L 60 105 L 15 60 Z" fill="#fdfaf6" opacity="0.9"/>
  <text x="60" y="75" font-family="Georgia, serif" font-size="45" font-weight="300" fill="#fdfaf6" text-anchor="middle" dominant-baseline="middle">H</text>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'mstile-150x150.svg'), svg150);

console.log('\n📦 Iconos placeholder generados en public/icons/');
console.log('⚠️  IMPORTANTE: Son SVG temporales. Para producción, convierte a PNG o usa herramientas online.');
console.log('🔗 Recomendado: https://www.pwabuilder.com/imageGenerator\n');
