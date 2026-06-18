import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  images: {
    // Las imágenes están en /public/imagenes — son locales, no necesitan remotePatterns
    formats: ["image/webp"],
  },
};

export default nextConfig;
