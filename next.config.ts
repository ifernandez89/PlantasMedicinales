import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";

// Cambiar por el nombre del repositorio de GitHub si no se usa dominio propio
const repoName = "PlantasMedicinales";
const basePath = isGithubActions ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  images: {
    unoptimized: true,
    formats: ["image/webp"],
  },
};

export default nextConfig;
