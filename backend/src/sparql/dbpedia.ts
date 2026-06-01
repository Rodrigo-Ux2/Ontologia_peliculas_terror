import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { request as httpsRequest } from "https";
import { request as httpRequest } from "http";
import { URL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = join(__dirname, "..", "..", "data");
const CACHE_FILE = join(CACHE_DIR, "dbpedia-cache.json");

const DBPEDIA_ENDPOINT = "https://dbpedia.org/sparql";

function httpFetch(url: string, options: {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
}): Promise<{ ok: boolean; status: number; text(): Promise<string>; json(): Promise<any> }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === "https:" ? httpsRequest : httpRequest;
    const body = options.body || "";
    const req = mod({
      hostname: u.hostname,
      port: u.port || (u.protocol === "https:" ? 443 : 80),
      path: u.pathname + u.search,
      method: options.method || "GET",
      family: 4,
      headers: {
        ...(body ? { "Content-Length": Buffer.byteLength(body).toString() } : {}),
        ...options.headers,
      },
      timeout: options.timeout || 15000,
    }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk: Buffer) => chunks.push(chunk));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf-8");
        resolve({
          ok: res.statusCode! >= 200 && res.statusCode! < 300,
          status: res.statusCode!,
          text: async () => text,
          json: async () => JSON.parse(text),
        });
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    if (body) req.write(body);
    req.end();
  });
}

export type DbpediaMode = "online" | "offline" | "auto";

export type DbpediaResult = {
  dbpediaUri: string;
  thumbnail: string | null;
  wikiPage: string | null;
  abstract: string | null;
  budget: number | null;
  gross: number | null;
  runtime: number | null;
  country: string | null;
  language: string | null;
  directors: string[];
  actors: string[];
  writers: string[];
  genres: string[];
  producers: string[];
  productionCompanies: string[];
  distributors: string[];
  musicComposers: string[];
  source: "online" | "offline" | "none";
};

// Mapa local ID → URI en DBpedia
export const DBPEDIA_LINKS: Record<string, string> = {
  AQuietPlace2018:       "http://dbpedia.org/resource/A_Quiet_Place",
  Alien1979:             "http://dbpedia.org/resource/Alien_(film)",
  Annabelle2014:         "http://dbpedia.org/resource/Annabelle_(film)",
  Audition1999:          "http://dbpedia.org/resource/Audition_(1999_film)",
  BarbHorror2023:        "http://dbpedia.org/resource/Evil_Dead_Rise",
  Blair1999:             "http://dbpedia.org/resource/The_Blair_Witch_Project",
  CabinetCaligari1920:   "http://dbpedia.org/resource/The_Cabinet_of_Dr._Caligari",
  Dracula1931:           "http://dbpedia.org/resource/Dracula_(1931_film)",
  Drag2009:              "http://dbpedia.org/resource/Drag_Me_to_Hell",
  Frankenstein1931:      "http://dbpedia.org/resource/Frankenstein_(1931_film)",
  GetOut2017:            "http://dbpedia.org/resource/Get_Out",
  Halloween1978:         "http://dbpedia.org/resource/Halloween_(1978_film)",
  Hellraiser1987:        "http://dbpedia.org/resource/Hellraiser",
  Hereditary2018:        "http://dbpedia.org/resource/Hereditary_(film)",
  HostFoundFootage2020:  "http://dbpedia.org/resource/Host_(film)",
  HotelInferno2013:      "http://dbpedia.org/resource/Oculus_(film)",
  HouseOfWax1953:        "http://dbpedia.org/resource/House_of_Wax_(1953_film)",
  Insidious2010:         "http://dbpedia.org/resource/Insidious_(film)",
  ItFollows2014:         "http://dbpedia.org/resource/It_Follows",
  Longlegs2024:          "http://dbpedia.org/resource/Longlegs",
  M3GAN2023:             "http://dbpedia.org/resource/M3GAN",
  Mandy2018:             "http://dbpedia.org/resource/Mandy_(2018_film)",
  MenA242022:            "http://dbpedia.org/resource/Men_(2022_film)",
  Midsommar2019:         "http://dbpedia.org/resource/Midsommar",
  MidsommarRitual:       "http://dbpedia.org/resource/Apostle_(film)",
  NightLivingDead1968:   "http://dbpedia.org/resource/Night_of_the_Living_Dead",
  NightmareElmStreet1984:"http://dbpedia.org/resource/A_Nightmare_on_Elm_Street",
  Nosferatu1922:         "http://dbpedia.org/resource/Nosferatu",
  NosferatuRemake2024:   "http://dbpedia.org/resource/Nosferatu_(2024_film)",
  ParanormalActivity2007:"http://dbpedia.org/resource/Paranormal_Activity",
  PearlX2022:            "http://dbpedia.org/resource/Pearl_(2022_film)",
  Psycho1960:            "http://dbpedia.org/resource/Psycho_(1960_film)",
  REC2007:               "http://dbpedia.org/resource/Rec_(film)",
  Ringu1998:             "http://dbpedia.org/resource/Ring_(film)",
  RosemarysBaby1968:     "http://dbpedia.org/resource/Rosemary%27s_Baby",
  Saw2004:               "http://dbpedia.org/resource/Saw_(film)",
  Scream1996:            "http://dbpedia.org/resource/Scream_(1996_film)",
  SilenceLambs1991:      "http://dbpedia.org/resource/The_Silence_of_the_Lambs_(film)",
  Smile2022:             "http://dbpedia.org/resource/Smile_(2022_film)",
  SuspiriaDario1977:     "http://dbpedia.org/resource/Suspiria",
  TalkToMe2022:          "http://dbpedia.org/resource/Talk_to_Me_(2022_film)",
  Terrifier2022:         "http://dbpedia.org/resource/Terrifier_2",
  TheConjuring2013:      "http://dbpedia.org/resource/The_Conjuring",
  TheDescent2005:        "http://dbpedia.org/resource/The_Descent",
  TheExorcist1973:       "http://dbpedia.org/resource/The_Exorcist",
  TheFirstOmen2024:      "http://dbpedia.org/resource/The_First_Omen",
  TheFly1986:            "http://dbpedia.org/resource/The_Fly_(1986_film)",
  TheLostBoys1987:       "http://dbpedia.org/resource/The_Lost_Boys",
  TheRing2002:           "http://dbpedia.org/resource/The_Ring_(2002_film)",
  TheShining1980:        "http://dbpedia.org/resource/The_Shining_(film)",
  TheStrangers2008:      "http://dbpedia.org/resource/The_Strangers_(2008_film)",
  TheSubstance2024:      "http://dbpedia.org/resource/The_Substance",
  TheThing1982:          "http://dbpedia.org/resource/The_Thing_(1982_film)",
  TheWitch2015:          "http://dbpedia.org/resource/The_Witch_(2015_film)",
  UsJordanPeele2019:     "http://dbpedia.org/resource/Us_(2019_film)",
};

// ─── Property alignment: ontología local ↔ DBpedia ───
export const PROPERTY_ALIGNMENT: Record<string, { dbpedia: string; label: string }> = {
  titulo:               { dbpedia: "rdfs:label",          label: "Título" },
  añoEstreno:           { dbpedia: "dbo:releaseDate",     label: "Año de estreno" },
  duracion:             { dbpedia: "dbo:runtime",         label: "Duración" },
  presupuesto:          { dbpedia: "dbo:budget",          label: "Presupuesto" },
  recaudacion:          { dbpedia: "dbo:gross",           label: "Recaudación" },
  paisOrigen:           { dbpedia: "dbo:country",         label: "País" },
  idioma:               { dbpedia: "dbo:language",        label: "Idioma" },
  tieneDirector:        { dbpedia: "dbo:director",        label: "Director" },
  tieneActor:           { dbpedia: "dbo:starring",        label: "Actor" },
  tieneGuionista:       { dbpedia: "dbo:writer",          label: "Guionista" },
  tieneSubgenero:       { dbpedia: "dbo:genre",           label: "Género" },
  producidaPor:         { dbpedia: "dbo:productionCompany", label: "Productora" },
  sinopsis:             { dbpedia: "dbo:abstract",        label: "Sinopsis" },
};

type CacheEntry = Record<string, unknown>;

function emptyResult(uri: string): DbpediaResult {
  return {
    dbpediaUri: uri,
    thumbnail: null, wikiPage: null, abstract: null,
    budget: null, gross: null, runtime: null,
    country: null, language: null,
    directors: [], actors: [], writers: [], genres: [],
    producers: [], productionCompanies: [], distributors: [], musicComposers: [],
    source: "none",
  };
}

function parseCurrency(val: string | undefined): number | null {
  if (!val) return null;
  const n = Number(val);
  if (!isNaN(n)) return Math.round(n);
  const cleaned = val.replace(/[^0-9.]/g, "");
  return cleaned ? Math.round(Number(cleaned)) : null;
}

function parseRuntime(val: string | undefined): number | null {
  if (!val) return null;
  const n = Number(val);
  if (!isNaN(n)) {
    // DBpedia a veces da runtime en segundos (>500) o minutos (<500)
    return n > 500 ? Math.round(n / 60) : Math.round(n);
  }
  const match = val.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function split(val: string | undefined): string[] {
  if (!val) return [];
  return val.split("||").map((s) => s.trim()).filter(Boolean);
}

// ─── Online: query DBpedia SPARQL endpoint ───
export async function queryDbpediaOnline(uri: string, lang: string = "en"): Promise<DbpediaResult> {
  const TIMEOUT = 20000;

  function makeQuery(_vars: string, pattern: string): string {
    return `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?thumbnail ?wikiPage ?abstract ?budget ?gross ?runtime ?country ?language ${_vars}
WHERE {
  BIND(<${uri}> AS ?movie)
  OPTIONAL { ?movie dbo:thumbnail ?thumbnail }
  OPTIONAL { ?movie foaf:isPrimaryTopicOf ?wikiPage }
  OPTIONAL { ?movie dbo:abstract ?abstract . FILTER(LANG(?abstract) = "${lang}") }
  OPTIONAL { ?movie dbo:budget ?budget }
  OPTIONAL { ?movie dbo:gross ?gross }
  OPTIONAL { ?movie dbo:runtime ?runtime }
  OPTIONAL { ?movie dbo:country ?country }
  OPTIONAL { ?movie dbo:countryOfOrigin ?country }
  OPTIONAL { ?movie dbo:language ?language }
  ${pattern}
}`;
  }

  const vars1 = "?directorLabel ?actorLabel ?writerLabel";
  const pat1 = `
  OPTIONAL { ?movie dbo:director ?d . ?d rdfs:label ?directorLabel . FILTER(LANG(?directorLabel) = "${lang}") }
  OPTIONAL { ?movie dbo:starring ?a . ?a rdfs:label ?actorLabel . FILTER(LANG(?actorLabel) = "${lang}") }
  OPTIONAL { ?movie dbo:writer ?w . ?w rdfs:label ?writerLabel . FILTER(LANG(?writerLabel) = "${lang}") }
`;
  const query1 = makeQuery(vars1, pat1);

  const vars2a = "?genreLabel ?producerLabel ?companyLabel";
  const pat2a = `
  OPTIONAL { ?movie dbo:genre ?g . ?g rdfs:label ?genreLabel . FILTER(LANG(?genreLabel) = "${lang}") }
  OPTIONAL { ?movie dbo:producer ?p . ?p rdfs:label ?producerLabel . FILTER(LANG(?producerLabel) = "${lang}") }
  OPTIONAL { ?movie dbo:productionCompany ?c . ?c rdfs:label ?companyLabel . FILTER(LANG(?companyLabel) = "${lang}") }
`;
  const query2a = makeQuery(vars2a, pat2a);

  const vars2b = "?distributorLabel ?musicLabel";
  const pat2b = `
  OPTIONAL { ?movie dbo:distributor ?dist . ?dist rdfs:label ?distributorLabel . FILTER(LANG(?distributorLabel) = "${lang}") }
  OPTIONAL { ?movie dbo:musicBy ?m . ?m rdfs:label ?musicLabel . FILTER(LANG(?musicLabel) = "${lang}") }
`;
  const query2b = makeQuery(vars2b, pat2b);

  async function runQuery(q: string, label: string): Promise<{ bindings: Record<string, { value: string }>[] } | null> {
    try {
      const body = new URLSearchParams({ query: q, format: "json" });
      const res = await httpFetch(DBPEDIA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        timeout: TIMEOUT,
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error(`      [${label}] HTTP ${res.status}: ${txt.slice(0, 200)}`);
        return null;
      }
      const json = await res.json() as { results: { bindings: Record<string, { value: string }>[] } };
      return json.results;
    } catch (err) {
      console.error(`      [${label}] Error: ${err instanceof Error ? err.message : err} ${err instanceof Error && err.cause ? String(err.cause) : ""}`);
      return null;
    }
  }

  const [r1, r2a, r2b] = await Promise.all([
    runQuery(query1, "q1"),
    runQuery(query2a, "q2a"),
    runQuery(query2b, "q2b"),
  ]);

  if (!r1 && !r2a && !r2b) return { ...emptyResult(uri), source: "none" };

  const allRows: Record<string, { value: string }>[] = [];
  if (r1) allRows.push(...r1.bindings);
  if (r2a) allRows.push(...r2a.bindings);
  if (r2b) allRows.push(...r2b.bindings);

  const firstVal = (key: string): string | undefined =>
    allRows.map((r) => r[key]?.value).find((v) => v !== undefined);

  // Fallback: intentar dbp:budget/gross/runtime si dbo no encontró
  let fbRow: Record<string, { value: string }> | undefined;
  if (!firstVal("budget") || !firstVal("gross") || !firstVal("runtime")) {
    const fallbackQuery = `PREFIX dbp: <http://dbpedia.org/property/>
  SELECT ?budget ?gross ?runtime
  WHERE {
    BIND(<${uri}> AS ?movie)
    OPTIONAL { ?movie dbp:budget ?budget }
    OPTIONAL { ?movie dbp:gross ?gross }
    OPTIONAL { ?movie dbp:runtime ?runtime }
  }`;
    const fbResult = await runQuery(fallbackQuery, "fb");
    fbRow = (fbResult?.bindings ?? []).find(Boolean);
  }

  const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

  const directors   = unique(allRows.map((r) => r.directorLabel?.value).filter(Boolean));
  const actors      = unique(allRows.map((r) => r.actorLabel?.value).filter(Boolean));
  const writers     = unique(allRows.map((r) => r.writerLabel?.value).filter(Boolean));
  const genres      = unique(allRows.map((r) => r.genreLabel?.value).filter(Boolean));
  const producers   = unique(allRows.map((r) => r.producerLabel?.value).filter(Boolean));
  const companies   = unique(allRows.map((r) => r.companyLabel?.value).filter(Boolean));
  const distributors = unique(allRows.map((r) => r.distributorLabel?.value).filter(Boolean));
  const musicComposers = unique(allRows.map((r) => r.musicLabel?.value).filter(Boolean));

  const budgetVal    = parseCurrency(firstVal("budget"))    ?? parseCurrency(fbRow?.budget?.value);
  const grossVal     = parseCurrency(firstVal("gross"))     ?? parseCurrency(fbRow?.gross?.value);
  const runtimeVal   = parseRuntime(firstVal("runtime"))    ?? parseRuntime(fbRow?.runtime?.value);
  const countryVal   = firstVal("country")                  ?? null;
  const langVal      = firstVal("language")                 ?? null;
  const thumbVal     = firstVal("thumbnail")                ?? null;
  const wikiVal      = firstVal("wikiPage")                 ?? null;
  const abstractVal  = firstVal("abstract")                 ?? null;

  return {
    dbpediaUri: uri,
    thumbnail: thumbVal,
    wikiPage: wikiVal,
    abstract: abstractVal,
    budget: budgetVal,
    gross: grossVal,
    runtime: runtimeVal,
    country: countryVal,
    language: langVal,
    directors,
    actors,
    writers,
    genres,
    producers,
    productionCompanies: companies,
    distributors,
    musicComposers,
    source: "online",
  };
}

// ─── Offline: read from local JSON cache ───
let cacheData: CacheEntry[] | null = null;

async function loadCache(): Promise<CacheEntry[]> {
  if (cacheData) return cacheData;
  try {
    const raw = await readFile(CACHE_FILE, "utf-8");
    cacheData = JSON.parse(raw);
    return cacheData!;
  } catch {
    return [];
  }
}

async function queryDbpediaOffline(uri: string): Promise<DbpediaResult> {
  const cache = await loadCache();
  const entry = cache.find((e: any) => e.dbpediaUri === uri) as Record<string, unknown> | undefined;
  if (!entry) return { ...emptyResult(uri), source: "none" };

  const e = (key: string): string | undefined => (entry[key] as string) ?? undefined;
  const eNum = (key: string): number | null => (entry[key] as number) ?? null;
  const eArr = (key: string): string[] => Array.isArray(entry[key]) ? entry[key] as string[] : [];

  return {
    dbpediaUri: uri,
    thumbnail: e("thumbnail") ?? null,
    wikiPage: e("wikiPage") ?? null,
    abstract: e("abstract") ?? null,
    budget: eNum("budget"),
    gross: eNum("gross"),
    runtime: eNum("runtime"),
    country: e("country") ?? null,
    language: e("language") ?? null,
    directors: eArr("directors"),
    actors: eArr("actors"),
    writers: eArr("writers"),
    genres: eArr("genres"),
    producers: eArr("producers"),
    productionCompanies: eArr("productionCompanies"),
    distributors: eArr("distributors"),
    musicComposers: eArr("musicComposers"),
    source: "offline",
  };
}

// ─── Main fetch function ───
export async function fetchDbpediaData(
  movieId: string,
  mode: DbpediaMode = "auto",
  lang: string = "es",
): Promise<DbpediaResult | null> {
  const uri = DBPEDIA_LINKS[movieId];
  if (!uri) return null;

  if (mode === "online") {
    return queryDbpediaOnline(uri, lang);
  }
  if (mode === "offline") {
    return queryDbpediaOffline(uri);
  }

  // auto: try offline first, fallback to online
  const offline = await queryDbpediaOffline(uri);
  if (offline.source === "offline") return offline;
  const online = await queryDbpediaOnline(uri, lang);
  return online.source === "online" ? online : offline.source === "none" ? { ...emptyResult(uri), source: "none" } : offline;
}

// ─── Download cache (for offline mode) ───
export async function downloadDbpediaCache(): Promise<{ total: number; success: number; failed: string[] }> {
  if (!existsSync(CACHE_DIR)) {
    await mkdir(CACHE_DIR, { recursive: true });
  }

  const entries: CacheEntry[] = [];
  const failed: string[] = [];
  const ids = Object.keys(DBPEDIA_LINKS);

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const uri = DBPEDIA_LINKS[id];
    console.log(`[${i + 1}/${ids.length}] ${id}...`);
    try {
      const result = await queryDbpediaOnline(uri);
      if (result.source === "online") {
        entries.push({ ...result, localId: id });
      } else {
        failed.push(id);
      }
    } catch {
      failed.push(id);
    }
  }

  await writeFile(CACHE_FILE, JSON.stringify(entries, null, 2), "utf-8");
  return { total: ids.length, success: entries.length, failed };
}
