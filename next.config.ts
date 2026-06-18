import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite importar archivos .md como strings si se necesita
  pageExtensions: ["ts", "tsx", "js", "jsx"],
};

export default nextConfig;
