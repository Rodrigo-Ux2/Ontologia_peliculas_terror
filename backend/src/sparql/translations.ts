import { sparqlSelect } from "./client.js";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, "..", "..", "data");
const CACHE_FILE = join(CACHE_DIR, "owl-translations.json");

const PREFIX = `PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>`;

const FIELD_MAP: Record<string, string> = {
  sinopsis: "sinopsis",
  ambientacion: "ambientacion",
  estilo: "estiloFotografia",
};

export async function translateMovieField(
  movieId: string,
  field: string,
  lang: string,
): Promise<string | null> {
  if (lang === "es" || !field) return null;
  const prop = FIELD_MAP[field];
  if (!prop) return null;

  const query = `${PREFIX}
SELECT ?val WHERE {
  :${movieId} :${prop} ?val .
  FILTER(LANG(?val) = "${lang}")
}
LIMIT 1`;
  const rows = await sparqlSelect(query).catch(() => []);
  return (rows as Record<string, { value: string }>[])[0]?.val?.value ?? null;
}

// ─── Para script translate-owl.ts ───

export type TranslationCache = {
  en: Record<string, Record<string, string>>;
  pt: Record<string, Record<string, string>>;
};

let cache: TranslationCache | null = null;

async function loadCache(): Promise<TranslationCache> {
  if (cache) return cache;
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    cache = JSON.parse(raw) as TranslationCache;
    return cache!;
  } catch {
    return { en: {}, pt: {} };
  }
}

export async function translateField(
  field: string,
  value: string,
  lang: string,
): Promise<string | null> {
  if (lang === "es" || !value) return null;
  const c = await loadCache();
  const dict = c[lang as keyof TranslationCache]?.[field];
  return dict?.[value] ?? null;
}

export async function saveCache(newCache: TranslationCache): Promise<void> {
  if (!existsSync(CACHE_DIR)) {
    await mkdir(CACHE_DIR, { recursive: true });
  }
  cache = newCache;
  await writeFile(CACHE_FILE, JSON.stringify(newCache, null, 2), "utf-8");
}
