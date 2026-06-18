import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AccionTerapeutica {
  accion: string;
  sistemas: string[];
  afecciones: string[];
}

export interface Fuente {
  titulo: string;
  tipo: "PDF" | "libro" | "articulo" | "web" | "otro";
  url?: string;
  año?: number;
}

export interface Planta {
  // Identidad
  slug: string;
  nombre: string;
  nombreCientifico: string | null;
  familia: string | null;
  otrosNombres: string[];

  // Botánica
  descripcionBotanica: string | null;
  origen: string | null;
  distribucion: string[];
  habitat: string | null;

  // Medicina tradicional
  acciones: string[];                         // lista plana para badges / filtros
  sistemas: string[];                         // lista plana para filtros
  afecciones: string[];                       // lista plana para filtros
  accionesTerapeuticas: AccionTerapeutica[];  // detalle cruzado

  // Etnobotánica / ecología
  usosEtnobotanicos: string[];
  polinizadores: string[];
  principiosActivos: string[];

  // Seguridad
  precauciones: string[];
  contraindicaciones: string[];
  toxicidad: string | null;

  // Recursos
  imagen: string | null;
  imagenes: string[];
  fuentes: Fuente[];

  // Contenido Markdown procesado
  descripcionHtml: string;
}

// ─── Utilidades internas ──────────────────────────────────────────────────────

const PLANTAS_DIR = path.join(process.cwd(), "content", "plantas");

function arr(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Devuelve todos los slugs disponibles (nombre de archivo sin extensión).
 */
export function getSlugs(): string[] {
  return fs
    .readdirSync(PLANTAS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Lee y parsea un archivo .md por su slug.
 */
export async function getPlantaBySlug(slug: string): Promise<Planta> {
  const filePath = path.join(PLANTAS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkHtml).process(content);

  return {
    slug,
    nombre:             data.nombre ?? slug,
    nombreCientifico:   data.nombreCientifico ?? null,
    familia:            data.familia ?? null,
    otrosNombres:       arr(data.otrosNombres),

    descripcionBotanica: data.descripcionBotanica ?? null,
    origen:             data.origen ?? null,
    distribucion:       arr(data.distribucion),
    habitat:            data.habitat ?? null,

    acciones:           arr(data.acciones),
    sistemas:           arr(data.sistemas),
    afecciones:         arr(data.afecciones),
    // accionesTerapeuticas es un array de objetos — no usar arr()
    accionesTerapeuticas: Array.isArray(data.accionesTerapeuticas)
      ? data.accionesTerapeuticas.map((at: AccionTerapeutica) => ({
          accion:    at.accion    ?? "",
          sistemas:  Array.isArray(at.sistemas)  ? at.sistemas  : [],
          afecciones: Array.isArray(at.afecciones) ? at.afecciones : [],
        }))
      : [],

    usosEtnobotanicos:  arr(data.usosEtnobotanicos),
    polinizadores:      arr(data.polinizadores),
    principiosActivos:  arr(data.principiosActivos),

    precauciones:       arr(data.precauciones),
    contraindicaciones: arr(data.contraindicaciones),
    toxicidad:          data.toxicidad ?? null,

    imagen:             data.imagen ?? null,
    imagenes:           arr(data.imagenes),
    fuentes:            arr(data.fuentes),

    descripcionHtml:    processed.toString(),
  };
}

/**
 * Devuelve todas las plantas ordenadas alfabéticamente.
 */
export async function getAllPlantas(): Promise<Planta[]> {
  const slugs = getSlugs();
  const plantas = await Promise.all(slugs.map(getPlantaBySlug));
  return plantas.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

// ─── Índices invertidos ───────────────────────────────────────────────────────

/**
 * { "Digestiva": [planta, planta, ...], ... }
 */
export async function getPlantasPorAccion(): Promise<Record<string, Planta[]>> {
  const plantas = await getAllPlantas();
  const mapa: Record<string, Planta[]> = {};
  for (const planta of plantas) {
    for (const accion of planta.acciones) {
      if (!mapa[accion]) mapa[accion] = [];
      mapa[accion].push(planta);
    }
  }
  return mapa;
}

/**
 * { "Digestivo": [planta, planta, ...], ... }
 */
export async function getPlantasPorSistema(): Promise<Record<string, Planta[]>> {
  const plantas = await getAllPlantas();
  const mapa: Record<string, Planta[]> = {};
  for (const planta of plantas) {
    for (const sistema of planta.sistemas) {
      if (!mapa[sistema]) mapa[sistema] = [];
      mapa[sistema].push(planta);
    }
  }
  return mapa;
}

/**
 * { "Gastritis": [planta, planta, ...], ... }
 */
export async function getPlantasPorAfeccion(): Promise<Record<string, Planta[]>> {
  const plantas = await getAllPlantas();
  const mapa: Record<string, Planta[]> = {};
  for (const planta of plantas) {
    for (const afeccion of planta.afecciones) {
      if (!mapa[afeccion]) mapa[afeccion] = [];
      mapa[afeccion].push(planta);
    }
  }
  return mapa;
}

// ─── Listas únicas ────────────────────────────────────────────────────────────

export async function getAllAcciones(): Promise<string[]> {
  return Object.keys(await getPlantasPorAccion()).sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

export async function getAllSistemas(): Promise<string[]> {
  return Object.keys(await getPlantasPorSistema()).sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

export async function getAllAfecciones(): Promise<string[]> {
  return Object.keys(await getPlantasPorAfeccion()).sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

// ─── Filtros individuales ─────────────────────────────────────────────────────

export async function getPlantasByAccion(accion: string): Promise<Planta[]> {
  const mapa = await getPlantasPorAccion();
  return mapa[accion] ?? [];
}

export async function getPlantasBySistema(sistema: string): Promise<Planta[]> {
  const mapa = await getPlantasPorSistema();
  return mapa[sistema] ?? [];
}

export async function getPlantasByAfeccion(afeccion: string): Promise<Planta[]> {
  const mapa = await getPlantasPorAfeccion();
  return mapa[afeccion] ?? [];
}
