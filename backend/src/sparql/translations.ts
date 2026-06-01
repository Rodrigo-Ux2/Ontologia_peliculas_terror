import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, "..", "..", "data");
const CACHE_FILE = join(CACHE_DIR, "owl-translations.json");

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
