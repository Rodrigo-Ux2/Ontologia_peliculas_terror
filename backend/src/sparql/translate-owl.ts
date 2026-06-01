import translate from "@iamtraction/google-translate";
import { sparqlSelect } from "./client.js";
import { saveCache } from "./translations.js";

type TextsMap = Record<string, Set<string>>;

// Valores categoricos fijos que tambien traducimos
const FIXED_TEXTS: Record<string, string[]> = {
  clasificacion: [
    "Mayores de 13", "Mayores de 16", "Mayores de 18",
    "No apta menores", "Todos los públicos",
  ],
  subgeneros: [
    "BodyHorror", "ComediaTerror", "FoundFootage", "Slasher",
    "Sobrenatural", "TerrorHistorico", "TerrorPsicologico", "TerrorSupervivencia",
  ],
  monstruos: [
    "AsesinoSerial", "Demonio", "Extraterrestre", "Fantasma",
    "HombreLobo", "Monstruo_Fisico", "Vampiro", "Zombi",
  ],
};

async function collectTexts(): Promise<TextsMap> {
  const query = `PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>
SELECT ?sinopsis ?ambientacion ?estilo WHERE {
  ?p a :Pelicula .
  OPTIONAL { ?p :sinopsis ?sinopsis }
  OPTIONAL { ?p :ambientacion ?ambientacion }
  OPTIONAL { ?p :estiloFotografia ?estilo }
}`;

  const rows = await sparqlSelect(query);
  const fields: TextsMap = { sinopsis: new Set(), ambientacion: new Set(), estilo: new Set() };

  for (const row of rows as Record<string, { value: string }>[]) {
    if (row.sinopsis?.value) fields.sinopsis.add(row.sinopsis.value);
    if (row.ambientacion?.value) fields.ambientacion.add(row.ambientacion.value);
    if (row.estilo?.value) fields.estilo.add(row.estilo.value);
  }

  return fields;
}

async function translateTexts(texts: string[], target: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const entries = [...texts];
  for (let i = 0; i < entries.length; i++) {
    const text = entries[i];
    if (!text.trim()) continue;
    try {
      console.log(`  [${i + 1}/${entries.length}] Traduciendo (${target}): ${text.slice(0, 60)}...`);
      const res = await translate(text, { from: "es", to: target });
      result[text] = res.text;
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  Error traduciendo: ${text.slice(0, 60)} - ${err instanceof Error ? err.message : err}`);
    }
  }
  return result;
}

const texts = await collectTexts();
console.log(`Textos encontrados en ontologia:`);
console.log(`  Sinopsis:      ${texts.sinopsis.size}`);
console.log(`  Ambientacion:  ${texts.ambientacion.size}`);
console.log(`  Estilo:        ${texts.estilo.size}`);

// Combinar textos libres + categoricos
const allSinopsis = [...texts.sinopsis];
const allAmbientacion = [...texts.ambientacion];
const allEstilo = [...texts.estilo];
const allClasificacion = FIXED_TEXTS.clasificacion;
const allSubgeneros = FIXED_TEXTS.subgeneros;
const allMonstruos = FIXED_TEXTS.monstruos;

console.log(`Textos fijos:`);
console.log(`  Clasificacion: ${allClasificacion.length}`);
console.log(`  Subgeneros:    ${allSubgeneros.length}`);
console.log(`  Monstruos:     ${allMonstruos.length}`);

console.log("\nTraduciendo al ingles...");
const en = {
  sinopsis: await translateTexts(allSinopsis, "en"),
  ambientacion: await translateTexts(allAmbientacion, "en"),
  estilo: await translateTexts(allEstilo, "en"),
  clasificacion: await translateTexts(allClasificacion, "en"),
  subgeneros: await translateTexts(allSubgeneros, "en"),
  monstruos: await translateTexts(allMonstruos, "en"),
};

console.log("\nTraduciendo al portugues...");
const pt = {
  sinopsis: await translateTexts(allSinopsis, "pt"),
  ambientacion: await translateTexts(allAmbientacion, "pt"),
  estilo: await translateTexts(allEstilo, "pt"),
  clasificacion: await translateTexts(allClasificacion, "pt"),
  subgeneros: await translateTexts(allSubgeneros, "pt"),
  monstruos: await translateTexts(allMonstruos, "pt"),
};

const cache = { en, pt };
await saveCache(cache);

const totalEn = Object.keys(en.sinopsis).length + Object.keys(en.ambientacion).length + Object.keys(en.estilo).length
  + Object.keys(en.clasificacion).length + Object.keys(en.subgeneros).length + Object.keys(en.monstruos).length;
const totalPt = Object.keys(pt.sinopsis).length + Object.keys(pt.ambientacion).length + Object.keys(pt.estilo).length
  + Object.keys(pt.clasificacion).length + Object.keys(pt.subgeneros).length + Object.keys(pt.monstruos).length;

console.log(`\nTraducciones guardadas:`);
console.log(`  EN: ${totalEn} textos`);
console.log(`  PT: ${totalPt} textos`);
