export interface MovieListItem {
  iri: string;
  titulo: string;
  anio: string | null;
}

export interface MovieDetail {
  id: string;
  titulo: string;
  sinopsis: string | null;
  anio: number | null;
  duracion: number | null;
  presupuesto: number | null;
  recaudacion: number | null;
  nivelGore: number | null;
  nivelSuspenso: number | null;
  puntuacion: number | null;
  rt: number | null;
  pais: string | null;
  idioma: string | null;
  clasificacion: string | null;
  basadaEnHechosReales: boolean;
  ambientacion: string | null;
  estiloFotografia: string | null;
  directores: string[];
  actores: string[];
  guionistas: string[];
  subgeneros: string[];
  plataformas: string[];
  monstruos: string[];
}

export interface DbpediaData {
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
  source: 'online' | 'offline' | 'none';
}

export interface FilterOptions {
  anioMin?: number;
  anioMax?: number;
  nivelGoreMin?: number;
  nivelSuspensoMin?: number;
  puntuacionMin?: number;
  rtMin?: number;
  tipoMonstruo?: string;
  subgenero?: string;
  plataforma?: string;
  clasificacionEdad?: string;
  pais?: string;
  idioma?: string;
  basadaEnHechosReales?: boolean;
  q?: string;
}

export const TIPO_MONSTRUO_OPTIONS = [
  'AsesinoSerial',
  'Demonio',
  'Extraterrestre',
  'Fantasma',
  'HombreLobo',
  'Monstruo_Fisico',
  'Vampiro',
  'Zombi',
];

export const SUBGENERO_OPTIONS = [
  'BodyHorror',
  'ComediaTerror',
  'FoundFootage',
  'Slasher',
  'Sobrenatural',
  'TerrorHistorico',
  'TerrorPsicologico',
  'TerrorSupervivencia',
];

export const PLATAFORMA_OPTIONS = [
  'HBOmax',
  'Mubi',
  'Netflix',
  'ParamountPlus',
  'PrimeVideo',
  'Shudder',
  'StarPlus',
];

export const PAIS_OPTIONS = [
  'Alemania',
  'Australia',
  'Bélgica / Estados Unidos',
  'España',
  'Estados Unidos',
  'Francia / Reino Unido',
  'Irlanda / Estados Unidos',
  'Italia',
  'Japón',
  'Reino Unido',
];

export const IDIOMA_OPTIONS = [
  'Alemán',
  'Español',
  'Inglés',
  'Inglés / Lenguaje de señas',
  'Inglés antiguo',
  'Italiano',
  'Japonés',
];

export const CLASIFICACION_OPTIONS = [
  'Mayores de 13',
  'Mayores de 16',
  'Mayores de 18',
  'No apta menores',
  'Todos los públicos',
];
