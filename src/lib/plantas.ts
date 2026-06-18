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
  imagenThumb: string | null;  // Nueva: miniatura optimizada
  imagenes: string[];
  fuentes: Fuente[];

  // Ciclo y Porte
  epocaFloracion: string | null;
  epocaFructificacion: string | null;
  tipoCiclo: string | null;

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

/**
 * Convierte ruta de imagen a formato optimizado
 * Después de migrate-image-refs, las imágenes ya son WEBP
 */
function getOptimizedImagePath(originalPath: string | null, type: 'thumb' | 'full' = 'thumb'): string | null {
  if (!originalPath) return null;
  // Las imágenes ya están en /imagenes/ como .webp después de la migración
  return originalPath;
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

  // Procesar Markdown a HTML
  const result = await remark().use(remarkHtml).process(content);
  const descripcionHtml = result.toString();

  // Mapear frontmatter a Planta
  const imagenOriginal = data.imagen ? String(data.imagen) : null;
  
  return {
    slug,
    nombre: data.nombre || slug,
    nombreCientifico: data.nombreCientifico || data.nombre_cientifico || null,
    familia: data.familia || null,
    otrosNombres: arr(data.otrosNombres || data.otros_nombres),

    descripcionBotanica: data.descripcionBotanica || data.descripcion_botanica || null,
    origen: data.origen || null,
    distribucion: arr(data.distribucion),
    habitat: data.habitat || null,

    acciones: arr(data.acciones),
    sistemas: arr(data.sistemas),
    afecciones: arr(data.afecciones),
    accionesTerapeuticas: (data.accionesTerapeuticas || data.acciones_terapeuticas || []).map(
      (a: any) => ({
        accion: a.accion || "",
        sistemas: arr(a.sistemas),
        afecciones: arr(a.afecciones),
      })
    ),

    usosEtnobotanicos: arr(data.usosEtnobotanicos || data.usos_etnobotanicos),
    polinizadores: arr(data.polinizadores),
    principiosActivos: arr(data.principiosActivos || data.principios_activos),

    precauciones: arr(data.precauciones),
    contraindicaciones: arr(data.contraindicaciones),
    toxicidad: data.toxicidad || null,

    imagen: imagenOriginal,
    imagenThumb: getOptimizedImagePath(imagenOriginal, 'thumb'),
    imagenes: arr(data.imagenes),
    fuentes: data.fuentes || [],

    epocaFloracion: data.epocaFloracion || data.epoca_floracion || null,
    epocaFructificacion: data.epocaFructificacion || data.epoca_fructificacion || null,
    tipoCiclo: data.tipoCiclo || data.tipo_ciclo || null,

    descripcionHtml,
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

/**
 * Agrupa plantas por acción terapéutica.
 */
export async function getPlantasPorAccion(): Promise<Record<string, Planta[]>> {
  const todas = await getAllPlantas();
  const map: Record<string, Planta[]> = {};
  todas.forEach((p) => {
    p.acciones.forEach((acc) => {
      if (!map[acc]) map[acc] = [];
      map[acc].push(p);
    });
  });
  return map;
}

/**
 * Obtiene plantas que tienen una acción concreta.
 */
export async function getPlantasConAccion(accion: string): Promise<Planta[]> {
  const todas = await getAllPlantas();
  return todas.filter((p) =>
    p.acciones.some((a) => a.toLowerCase() === accion.toLowerCase())
  );
}

/**
 * Agrupa plantas por afección.
 */
export async function getPlantasPorAfeccion(): Promise<Record<string, Planta[]>> {
  const todas = await getAllPlantas();
  const map: Record<string, Planta[]> = {};
  todas.forEach((p) => {
    p.afecciones.forEach((afec) => {
      if (!map[afec]) map[afec] = [];
      map[afec].push(p);
    });
  });
  return map;
}

/**
 * Obtiene plantas que tratan una afección concreta.
 */
export async function getPlantasConAfeccion(afeccion: string): Promise<Planta[]> {
  const todas = await getAllPlantas();
  return todas.filter((p) =>
    p.afecciones.some((a) => a.toLowerCase() === afeccion.toLowerCase())
  );
}

/**
 * Agrupa plantas por sistema corporal.
 */
export async function getPlantasPorSistema(): Promise<Record<string, Planta[]>> {
  const todas = await getAllPlantas();
  const map: Record<string, Planta[]> = {};
  todas.forEach((p) => {
    p.sistemas.forEach((sis) => {
      if (!map[sis]) map[sis] = [];
      map[sis].push(p);
    });
  });
  return map;
}

/**
 * Busca plantas por texto (nombre, nombre científico, acciones, afecciones)
 */
export async function searchPlantas(query: string): Promise<Planta[]> {
  const todas = await getAllPlantas();
  const q = query.toLowerCase().trim();
  
  if (!q) return todas;
  
  return todas.filter(p => 
    p.nombre.toLowerCase().includes(q) ||
    p.nombreCientifico?.toLowerCase().includes(q) ||
    p.otrosNombres.some(n => n.toLowerCase().includes(q)) ||
    p.acciones.some(a => a.toLowerCase().includes(q)) ||
    p.afecciones.some(a => a.toLowerCase().includes(q)) ||
    p.sistemas.some(s => s.toLowerCase().includes(q))
  );
}


/**
 * Obtiene todas las acciones únicas
 */
export async function getAllAcciones(): Promise<string[]> {
  const todas = await getAllPlantas();
  const accionesSet = new Set<string>();
  todas.forEach(p => p.acciones.forEach(a => accionesSet.add(a)));
  return Array.from(accionesSet).sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Obtiene plantas por acción (alias de getPlantasConAccion)
 */
export async function getPlantasByAccion(accion: string): Promise<Planta[]> {
  return getPlantasConAccion(accion);
}

/**
 * Obtiene todas las afecciones únicas
 */
export async function getAllAfecciones(): Promise<string[]> {
  const todas = await getAllPlantas();
  const afeccionesSet = new Set<string>();
  todas.forEach(p => p.afecciones.forEach(a => afeccionesSet.add(a)));
  return Array.from(afeccionesSet).sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Obtiene plantas por afección (alias de getPlantasConAfeccion)
 */
export async function getPlantasByAfeccion(afeccion: string): Promise<Planta[]> {
  return getPlantasConAfeccion(afeccion);
}

/**
 * Obtiene todos los sistemas únicos
 */
export async function getAllSistemas(): Promise<string[]> {
  const todas = await getAllPlantas();
  const sistemasSet = new Set<string>();
  todas.forEach(p => p.sistemas.forEach(s => sistemasSet.add(s)));
  return Array.from(sistemasSet).sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Obtiene plantas por sistema
 */
export async function getPlantasBySistema(sistema: string): Promise<Planta[]> {
  const todas = await getAllPlantas();
  return todas.filter((p) =>
    p.sistemas.some((s) => s.toLowerCase() === sistema.toLowerCase())
  );
}
