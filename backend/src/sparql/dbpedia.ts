const DBPEDIA_ENDPOINT = "https://dbpedia.org/sparql";

// Mapa local ID → URI en DBpedia (espeja los owl:sameAs del ontologia.rdf)
const DBPEDIA_LINKS: Record<string, string> = {
  AQuietPlace2018:       "http://dbpedia.org/resource/A_Quiet_Place_(film)",
  Alien1979:             "http://dbpedia.org/resource/Alien_(film)",
  Annabelle2014:         "http://dbpedia.org/resource/Annabelle_(film)",
  Audition1999:          "http://dbpedia.org/resource/Audition_(film)",
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
  HostFoundFootage2020:  "http://dbpedia.org/resource/Host_(2020_film)",
  HotelInferno2013:      "http://dbpedia.org/resource/Oculus_(film)",
  HouseOfWax1953:        "http://dbpedia.org/resource/House_of_Wax_(1953_film)",
  Insidious2010:         "http://dbpedia.org/resource/Insidious_(film)",
  ItFollows2014:         "http://dbpedia.org/resource/It_Follows",
  Longlegs2024:          "http://dbpedia.org/resource/Longlegs_(film)",
  M3GAN2023:             "http://dbpedia.org/resource/M3GAN",
  Mandy2018:             "http://dbpedia.org/resource/Mandy_(film)",
  MenA242022:            "http://dbpedia.org/resource/Men_(film)",
  Midsommar2019:         "http://dbpedia.org/resource/Midsommar",
  MidsommarRitual:       "http://dbpedia.org/resource/Apostle_(film)",
  NightLivingDead1968:   "http://dbpedia.org/resource/Night_of_the_Living_Dead",
  NightmareElmStreet1984:"http://dbpedia.org/resource/A_Nightmare_on_Elm_Street",
  Nosferatu1922:         "http://dbpedia.org/resource/Nosferatu",
  NosferatuRemake2024:   "http://dbpedia.org/resource/Nosferatu_(2024_film)",
  ParanormalActivity2007:"http://dbpedia.org/resource/Paranormal_Activity",
  PearlX2022:            "http://dbpedia.org/resource/Pearl_(2022_film)",
  Psycho1960:            "http://dbpedia.org/resource/Psycho_(1960_film)",
  REC2007:               "http://dbpedia.org/resource/%5BRec%5D",
  Ringu1998:             "http://dbpedia.org/resource/Ring_(1998_film)",
  RosemarysBaby1968:     "http://dbpedia.org/resource/Rosemary%27s_Baby_(film)",
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
  TheStrangers2008:      "http://dbpedia.org/resource/The_Strangers_(film)",
  TheSubstance2024:      "http://dbpedia.org/resource/The_Substance",
  TheThing1982:          "http://dbpedia.org/resource/The_Thing_(1982_film)",
  TheWitch2015:          "http://dbpedia.org/resource/The_Witch_(film)",
  UsJordanPeele2019:     "http://dbpedia.org/resource/Us_(film)",
};

export type DbpediaResult = {
  dbpediaUri: string;
  thumbnail: string | null;
  wikiPage: string | null;
};

export async function fetchDbpediaData(movieId: string): Promise<DbpediaResult | null> {
  const uri = DBPEDIA_LINKS[movieId];
  if (!uri) return null;

  const query = `PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?thumbnail ?wikiPage WHERE {
  BIND(<${uri}> AS ?movie)
  OPTIONAL { ?movie dbo:thumbnail ?thumbnail }
  OPTIONAL { ?movie foaf:isPrimaryTopicOf ?wikiPage }
}
LIMIT 1`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const body = new URLSearchParams({ query, format: "application/sparql-results+json" });
    const res = await fetch(DBPEDIA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return { dbpediaUri: uri, thumbnail: null, wikiPage: null };

    type Binding = Record<string, { value: string } | undefined>;
    const json = (await res.json()) as { results: { bindings: Binding[] } };
    const row = json.results.bindings[0];

    return {
      dbpediaUri: uri,
      thumbnail: row?.thumbnail?.value ?? null,
      wikiPage:  row?.wikiPage?.value ?? null,
    };
  } catch {
    clearTimeout(timer);
    return { dbpediaUri: uri, thumbnail: null, wikiPage: null };
  }
}
