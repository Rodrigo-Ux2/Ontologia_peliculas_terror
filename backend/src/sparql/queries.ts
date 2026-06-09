// Solo word-chars y guion bajo para IRI fragments
const SAFE_IRI = /^[\w]+$/;

export function buildDetallePelicula(id: string): string {
  if (!SAFE_IRI.test(id)) throw new Error(`ID de película inválido: "${id}"`);

  return `PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT
  ?titulo ?sinopsis ?anio ?duracion ?presupuesto ?recaudacion
  ?nivelGore ?nivelSuspenso ?puntuacion ?rt
  ?pais ?idioma ?clasificacion ?basadaHechos ?ambientacion ?estilo
  (GROUP_CONCAT(DISTINCT ?dirNombre;  separator="||") AS ?directores)
  (GROUP_CONCAT(DISTINCT ?actNombre;  separator="||") AS ?actores)
  (GROUP_CONCAT(DISTINCT ?guiNombre;  separator="||") AS ?guionistas)
  (GROUP_CONCAT(DISTINCT ?subgFrag;   separator="||") AS ?subgeneros)
  (GROUP_CONCAT(DISTINCT ?platFrag;   separator="||") AS ?plataformas)
  (GROUP_CONCAT(DISTINCT ?monsFrag;   separator="||") AS ?monstruos)
WHERE {
  :${id} a :Pelicula .
  OPTIONAL { :${id} :titulo               ?titulo }
  OPTIONAL { :${id} :sinopsis ?sinopsis . FILTER(LANG(?sinopsis) = "") }
  OPTIONAL { :${id} :añoEstreno           ?anio }
  OPTIONAL { :${id} :duracion             ?duracion }
  OPTIONAL { :${id} :presupuesto          ?presupuesto }
  OPTIONAL { :${id} :recaudacion          ?recaudacion }
  OPTIONAL { :${id} :nivelGore            ?nivelGore }
  OPTIONAL { :${id} :nivelSuspenso        ?nivelSuspenso }
  OPTIONAL { :${id} :puntuacion           ?puntuacion }
  OPTIONAL { :${id} :puntuacionRottenTomatoes ?rt }
  OPTIONAL { :${id} :paisOrigen           ?pais }
  OPTIONAL { :${id} :idioma               ?idioma }
  OPTIONAL { :${id} :clasificacionEdad ?clasificacion . FILTER(LANG(?clasificacion) = "") }
  OPTIONAL { :${id} :basadaEnHechosReales ?basadaHechos }
  OPTIONAL { :${id} :ambientacion ?ambientacion . FILTER(LANG(?ambientacion) = "") }
  OPTIONAL { :${id} :estiloFotografia ?estilo . FILTER(LANG(?estilo) = "") }
  OPTIONAL { :${id} :tieneDirector  ?dir . ?dir  :nombre ?dirNombre }
  OPTIONAL { :${id} :tieneActor     ?act . ?act  :nombre ?actNombre }
  OPTIONAL { :${id} :tieneGuionista ?gui . ?gui  :nombre ?guiNombre }
  OPTIONAL { :${id} :tieneSubgenero ?subg  . BIND(STRAFTER(STR(?subg),  "#") AS ?subgFrag) }
  OPTIONAL { :${id} :disponibleEn   ?plat  . BIND(STRAFTER(STR(?plat),  "#") AS ?platFrag) }
  OPTIONAL { :${id} :tieneMonstruo  ?mons  . BIND(STRAFTER(STR(?mons),  "#") AS ?monsFrag) }
}
GROUP BY
  ?titulo ?sinopsis ?anio ?duracion ?presupuesto ?recaudacion
  ?nivelGore ?nivelSuspenso ?puntuacion ?rt
  ?pais ?idioma ?clasificacion ?basadaHechos ?ambientacion ?estilo`;
}

export type Filtros = {
  // Rango temporal
  anioMin?: number;
  anioMax?: number;
  // Clasificaciones numéricas
  nivelGoreMin?: number;
  nivelSuspensoMin?: number;
  puntuacionMin?: number;
  rtMin?: number;
  // Filtros de texto exacto (whitelist)
  tipoMonstruo?: string;
  subgenero?: string;
  plataforma?: string;
  clasificacionEdad?: string;
  pais?: string;
  idioma?: string;
  // Booleano
  basadaEnHechosReales?: boolean;
  // Búsqueda de escenario (parcial, contra IRI de tieneEscenario y ambientacion)
  escenario?: string;
  // Búsqueda libre (título, sinopsis, ambientacion)
  textoLibre?: string;
};

const WHITELISTS: Record<string, Set<string>> = {
  tipoMonstruo: new Set([
    "AsesinoSerial", "Demonio", "Extraterrestre", "Fantasma",
    "HombreLobo", "Monstruo_Fisico", "Vampiro", "Zombi",
  ]),
  subgenero: new Set([
    "BodyHorror", "ComediaTerror", "FoundFootage", "Slasher",
    "Sobrenatural", "TerrorHistorico", "TerrorPsicologico", "TerrorSupervivencia",
  ]),
  plataforma: new Set([
    "HBOmax", "Mubi", "Netflix", "ParamountPlus",
    "PrimeVideo", "Shudder", "StarPlus",
  ]),
  clasificacionEdad: new Set([
    "Mayores de 13", "Mayores de 16", "Mayores de 18",
    "No apta menores", "Todos los públicos",
  ]),
  pais: new Set([
    "Alemania", "Australia", "Bélgica / Estados Unidos", "España",
    "Estados Unidos", "Francia / Reino Unido", "Irlanda / Estados Unidos",
    "Italia", "Japón", "Reino Unido",
  ]),
  idioma: new Set([
    "Alemán", "Español", "Inglés", "Inglés / Lenguaje de señas",
    "Inglés antiguo", "Italiano", "Japonés",
  ]),
};

function checkWhitelist(field: string, value: string): void {
  if (!WHITELISTS[field]?.has(value)) {
    throw new Error(`Valor inválido para ${field}: "${value}"`);
  }
}

function escapeLiteral(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const PREFIX = `PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>`;

export function buildBusquedaPeliculas(f: Filtros): string {
  const where: string[] = [`?pelicula a :Pelicula .`];

  // Título real (siempre lo pedimos)
  where.push(`OPTIONAL { ?pelicula :titulo ?titulo }`);

  // Año
  if (f.anioMin !== undefined || f.anioMax !== undefined) {
    where.push(`?pelicula :añoEstreno ?anio .`);
    if (f.anioMin !== undefined) where.push(`FILTER(?anio >= ${f.anioMin})`);
    if (f.anioMax !== undefined) where.push(`FILTER(?anio <= ${f.anioMax})`);
  } else {
    where.push(`OPTIONAL { ?pelicula :añoEstreno ?anio }`);
  }

  // Gore
  if (f.nivelGoreMin !== undefined) {
    where.push(`?pelicula :nivelGore ?gore . FILTER(?gore >= ${f.nivelGoreMin})`);
  }

  // Suspenso
  if (f.nivelSuspensoMin !== undefined) {
    where.push(`?pelicula :nivelSuspenso ?suspenso . FILTER(?suspenso >= ${f.nivelSuspensoMin})`);
  }

  // Puntuación
  if (f.puntuacionMin !== undefined) {
    where.push(`?pelicula :puntuacion ?punt . FILTER(?punt >= ${f.puntuacionMin})`);
  }

  // Rotten Tomatoes
  if (f.rtMin !== undefined) {
    where.push(`?pelicula :puntuacionRottenTomatoes ?rt . FILTER(?rt >= ${f.rtMin})`);
  }

  // Tipo de monstruo (IRI whitelist)
  if (f.tipoMonstruo) {
    checkWhitelist("tipoMonstruo", f.tipoMonstruo);
    where.push(`?pelicula :tieneMonstruo ?m . ?m a :${f.tipoMonstruo} .`);
  }

  // Subgénero (IRI whitelist)
  if (f.subgenero) {
    checkWhitelist("subgenero", f.subgenero);
    where.push(`?pelicula :tieneSubgenero :${f.subgenero} .`);
  }

  // Plataforma (IRI whitelist)
  if (f.plataforma) {
    checkWhitelist("plataforma", f.plataforma);
    where.push(`?pelicula :disponibleEn :${f.plataforma} .`);
  }

  // Clasificación de edad (literal whitelist)
  if (f.clasificacionEdad) {
    checkWhitelist("clasificacionEdad", f.clasificacionEdad);
    where.push(`?pelicula :clasificacionEdad "${escapeLiteral(f.clasificacionEdad)}" .`);
  }

  // País (literal whitelist)
  if (f.pais) {
    checkWhitelist("pais", f.pais);
    where.push(`?pelicula :paisOrigen "${escapeLiteral(f.pais)}" .`);
  }

  // Idioma (literal whitelist)
  if (f.idioma) {
    checkWhitelist("idioma", f.idioma);
    where.push(`?pelicula :idioma "${escapeLiteral(f.idioma)}" .`);
  }

  // Basada en hechos reales
  if (f.basadaEnHechosReales !== undefined) {
    const val = f.basadaEnHechosReales ? "true" : "false";
    where.push(`?pelicula :basadaEnHechosReales "${val}"^^xsd:boolean .`);
  }

  // Escenario: busca en el IRI de tieneEscenario y en el literal de ambientacion
  if (f.escenario) {
    const safeEsc = escapeLiteral(f.escenario);
    where.push(`{
    { ?pelicula :tieneEscenario ?_escObj . FILTER(CONTAINS(LCASE(STRAFTER(STR(?_escObj), "#")), LCASE("${safeEsc}"))) }
    UNION
    { ?pelicula :ambientacion ?_ambLit . FILTER(CONTAINS(LCASE(STR(?_ambLit)), LCASE("${safeEsc}"))) }
  }`);
  }

  // Búsqueda libre: busca cada palabra individualmente en múltiples campos
  // STR() permite buscar en literales con language tag
  if (f.textoLibre) {
    const safe = escapeLiteral(f.textoLibre);
    const STOPWORDS = new Set([
      'de','la','el','en','un','una','que','y','a','al','con',
      'por','para','se','su','sus','del','las','los','le','lo',
      'si','no','es','mas','más','muy','o','ni','lo','ya','tu',
      'of','the','and','in','to','is','it','as','at','by','an','or',
      'do','da','em','um','uma','para','com','se','sua','seu','mais','e',
      'os','as','na','no','dos','das','aos','nas',
    ]);
    const words = f.textoLibre
      .split(/\s+/)
      .filter((w) => w.length > 1 && !STOPWORDS.has(w.toLowerCase()))
      .map((w) => escapeLiteral(w));
    if (words.length < 2) words.push(safe);

    const wf = (varName: string): string =>
      `( ${words.map((w) => `CONTAINS(LCASE(STR(${varName})), LCASE("${w}"))`).join(" || ")} )`;

    const fieldSearches = [
      `{ ?pelicula :titulo ?_tSearch . FILTER(${wf("?_tSearch")}) }`,
      `{ ?pelicula :sinopsis ?_sSearch . FILTER(${wf("?_sSearch")}) }`,
      `{ ?pelicula :ambientacion ?_aSearch . FILTER(${wf("?_aSearch")}) }`,
      `{ ?pelicula :estiloFotografia ?_eSearch . FILTER(${wf("?_eSearch")}) }`,
      `{ ?pelicula :tieneDirector ?_dir . ?_dir :nombre ?_dirSearch . FILTER(${wf("?_dirSearch")}) }`,
      `{ ?pelicula :tieneActor ?_act . ?_act :nombre ?_actSearch . FILTER(${wf("?_actSearch")}) }`,
      `{ ?pelicula :tieneGuionista ?_gui . ?_gui :nombre ?_guiSearch . FILTER(${wf("?_guiSearch")}) }`,
      `{ ?pelicula :tieneSubgenero ?_sgSearch . FILTER(${words.map((w) => `CONTAINS(LCASE(STRAFTER(STR(?_sgSearch), "#")), LCASE("${w}"))`).join(" || ")}) }`,
      `{ ?pelicula :tieneMonstruo ?_monSearch . FILTER(${words.map((w) => `CONTAINS(LCASE(STRAFTER(STR(?_monSearch), "#")), LCASE("${w}"))`).join(" || ")}) }`,
      `{ ?pelicula :disponibleEn ?_platSearch . FILTER(${words.map((w) => `CONTAINS(LCASE(STRAFTER(STR(?_platSearch), "#")), LCASE("${w}"))`).join(" || ")}) }`,
    ];

    where.push(`{\n    ${fieldSearches.join("\n    UNION\n    ")}\n  }`);
  }

  return `${PREFIX}
SELECT DISTINCT ?pelicula ?titulo ?anio WHERE {
  ${where.join("\n  ")}
}
ORDER BY DESC(?anio)
LIMIT 100`;
}
