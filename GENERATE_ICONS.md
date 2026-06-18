# Generación de Iconos PWA

Para completar la PWA, necesitas generar los iconos en diferentes tamaños.

## Opción 1: Usar herramienta online (más fácil)

1. Visita: https://www.pwabuilder.com/imageGenerator
2. Sube una imagen cuadrada de alta resolución (512x512 o mayor)
3. Descarga el paquete de iconos
4. Extrae los archivos a `public/icons/`

## Opción 2: Usar ImageMagick (línea de comandos)

Si tienes ImageMagick instalado, crea un archivo `source-icon.png` de 512x512 en la raíz y ejecuta:

```bash
# Crear directorio
mkdir -p public/icons

# Generar todos los tamaños
magick source-icon.png -resize 72x72 public/icons/icon-72x72.png
magick source-icon.png -resize 96x96 public/icons/icon-96x96.png
magick source-icon.png -resize 128x128 public/icons/icon-128x128.png
magick source-icon.png -resize 144x144 public/icons/icon-144x144.png
magick source-icon.png -resize 152x152 public/icons/icon-152x152.png
magick source-icon.png -resize 192x192 public/icons/icon-192x192.png
magick source-icon.png -resize 384x384 public/icons/icon-384x384.png
magick source-icon.png -resize 512x512 public/icons/icon-512x512.png

# Apple touch icon
magick source-icon.png -resize 180x180 public/icons/apple-touch-icon.png

# MS Tile
magick source-icon.png -resize 150x150 public/icons/mstile-150x150.png

# Favicon
magick source-icon.png -resize 32x32 public/favicon.ico
```

## Opción 3: Crear iconos temporales para testing

Puedes crear iconos simples con un script Node.js o usar emojis como placeholder:

```bash
# Crear placeholder con emoji (requiere node-canvas)
npm install canvas
node scripts/generate-placeholder-icons.js
```

## Iconos necesarios:

✅ Manifest icons (8 tamaños): 72, 96, 128, 144, 152, 192, 384, 512
✅ Apple touch icon: 180x180
✅ MS Tile: 150x150
✅ Favicon: 32x32
✅ Shortcuts (opcionales): 96x96 cada uno

## Diseño recomendado:

- Fondo: Color salvia (#7ba684) o hueso (#fdfaf6)
- Símbolo: ✦ (diamante) o 🌱 (brote)
- Texto opcional: "H" estilizada o "Herbarium"
- Márgenes: 10% padding para modo "maskable"
