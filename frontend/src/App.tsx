import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterPanel } from './components/FilterPanel';
import { MovieList } from './components/MovieList';
import { MovieDetailView } from './components/MovieDetailView';
import { SparqlConsole } from './components/SparqlConsole';
import { movieService } from './services/api';
import { MovieDetail, FilterOptions, DbpediaData } from './types';
import { Icon } from './components/Icon';
import './App.css';

// Orden importa: frases compuestas primero para que no sean absorbidas por palabras sueltas
const SEMANTIC_MONSTER_MAP: [string, string][] = [
  ['asesino serial', 'AsesinoSerial'],
  ['asesino en serie', 'AsesinoSerial'],
  ['hombre lobo', 'HombreLobo'],
  ['monstruo fisico', 'Monstruo_Fisico'],
  ['monstruo físico', 'Monstruo_Fisico'],
  ['fantasma', 'Fantasma'],
  ['demonio', 'Demonio'],
  ['vampiro', 'Vampiro'],
  ['zombi', 'Zombi'],
  ['zombie', 'Zombi'],
  ['zombies', 'Zombi'],
  ['lobo', 'HombreLobo'],
  ['extraterrestre', 'Extraterrestre'],
  ['alien', 'Extraterrestre'],
  ['asesino', 'AsesinoSerial'],
  ['monstruo', 'Monstruo_Fisico'],
];

const SEMANTIC_SUBGENERO_MAP: [string, string][] = [
  ['body horror', 'BodyHorror'],
  ['found footage', 'FoundFootage'],
  ['terror psicologico', 'TerrorPsicologico'],
  ['terror psicológico', 'TerrorPsicologico'],
  ['terror historico', 'TerrorHistorico'],
  ['terror histórico', 'TerrorHistorico'],
  ['terror supervivencia', 'TerrorSupervivencia'],
  ['comedia terror', 'ComediaTerror'],
  ['slasher', 'Slasher'],
  ['sobrenatural', 'Sobrenatural'],
  ['psicologico', 'TerrorPsicologico'],
  ['psicológico', 'TerrorPsicologico'],
  ['supervivencia', 'TerrorSupervivencia'],
  ['historico', 'TerrorHistorico'],
  ['histórico', 'TerrorHistorico'],
  ['gore', 'BodyHorror'],
];

// Palabras clave de escenario → término de búsqueda que se enviará al backend
const SEMANTIC_ESCENARIO_MAP: [string, string][] = [
  ['bosque oscuro', 'bosque'],
  ['en el bosque', 'bosque'],
  ['en un bosque', 'bosque'],
  ['bosque', 'bosque'],
  ['casa abandonada', 'casa'],
  ['casa embrujada', 'casa'],
  ['en una casa', 'casa'],
  ['en la casa', 'casa'],
  ['mansion', 'mansion'],
  ['mansión', 'mansion'],
  ['hospital', 'hospital'],
  ['manicomio', 'manicomio'],
  ['escuela', 'escuela'],
  ['ciudad', 'ciudad'],
  ['pueblo', 'pueblo'],
  ['espacio', 'espacio'],
  ['nave espacial', 'nave'],
  ['hotel', 'hotel'],
  ['cabaña', 'cabaña'],
  ['cabana', 'cabaña'],
  ['granja', 'granja'],
  ['lago', 'lago'],
  ['submarino', 'submarino'],
  ['oceano', 'oceano'],
  ['océano', 'oceano'],
  ['mar', 'mar'],
];

// Stopwords que no aportan nada como búsqueda libre de título
const STOPWORDS = new Set([
  'año', 'en', 'un', 'una', 'de', 'del', 'el', 'la', 'los', 'las',
  'con', 'y', 'a', 'al', 'que', 'por', 'para', 'se', 'su', 'sus',
  'como', 'pero', 'si', 'no', 'lo', 'le', 'les', 'era', 'fue',
  'sobre', 'entre', 'donde', 'hay', 'esto', 'esta', 'este',
]);

function stripKeyword(text: string, keyword: string): string {
  // Elimina la keyword completa como palabra/frase, no fragmento de palabra
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(?<![\\wáéíóúñ])${escaped}(?![\\wáéíóúñ])`, 'gi'), '');
}

function parseSemanticSearch(query: string): Partial<FilterOptions> {
  const semantic: Partial<FilterOptions> = {};
  let remainder = query.toLowerCase().trim();

  // Detectar subgénero (frases primero)
  for (const [keyword, subgenero] of SEMANTIC_SUBGENERO_MAP) {
    if (remainder.includes(keyword)) {
      semantic.subgenero = subgenero;
      remainder = stripKeyword(remainder, keyword);
      break;
    }
  }

  // Detectar tipo de monstruo (frases compuestas primero)
  for (const [keyword, tipo] of SEMANTIC_MONSTER_MAP) {
    if (remainder.includes(keyword)) {
      semantic.tipoMonstruo = tipo;
      remainder = stripKeyword(remainder, keyword);
      break;
    }
  }

  // Detectar escenario
  for (const [keyword, escenario] of SEMANTIC_ESCENARIO_MAP) {
    if (remainder.includes(keyword)) {
      semantic.escenario = escenario;
      remainder = stripKeyword(remainder, keyword);
      break;
    }
  }

  // Detectar rangos de años: "de 1990 a 2010" o "1990-2010"
  const rangeMatch = remainder.match(/(?:de|from)?\s*(19|20)\d{2}\s*(?:a|to|-)\s*(19|20)\d{2}/);
  if (rangeMatch) {
    const years = rangeMatch[0].match(/(19|20)\d{2}/g)!;
    semantic.anioMin = Math.min(Number(years[0]), Number(years[1]));
    semantic.anioMax = Math.max(Number(years[0]), Number(years[1]));
    remainder = remainder.replace(rangeMatch[0], '');
  } else {
    const yearMatches = Array.from(remainder.matchAll(/\b(19|20)\d{2}\b/g)).map((m) => Number(m[0]));
    if (yearMatches.length >= 2) {
      semantic.anioMin = Math.min(yearMatches[0], yearMatches[1]);
      semantic.anioMax = Math.max(yearMatches[0], yearMatches[1]);
      remainder = remainder.replace(/\b(19|20)\d{2}\b/g, '');
    } else if (yearMatches.length === 1) {
      semantic.anioMin = yearMatches[0];
      semantic.anioMax = yearMatches[0];
      remainder = remainder.replace(/\b(19|20)\d{2}\b/g, '');
    }
  }

  // Eliminar puntuación suelta y stopwords del texto restante
  remainder = remainder.replace(/[,;:.!?¿¡]/g, ' ');
  const meaningfulWords = remainder
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));

  if (meaningfulWords.length > 0) {
    semantic.q = meaningfulWords.join(' ');
  }

  return semantic;
}

function App() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<'movies' | 'sparql'>('movies');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [movies, setMovies] = useState<any[]>([]);
  const [sparqlQuery, setSparqlQuery] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [dbpediaData, setDbpediaData] = useState<DbpediaData | null>(null);
  const [dbpediaMode, setDbpediaMode] = useState<'auto' | 'online' | 'offline'>('auto');

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  const handleFilterChange = (nextFilters: FilterOptions) => {
    if (nextFilters.q !== undefined) {
      // Guarda el texto crudo para mostrarlo en el input sin alterarlo
      setSearchText(nextFilters.q);
      const semantic = parseSemanticSearch(nextFilters.q);
      setFilters({
        ...nextFilters,
        ...semantic,
        // q solo contiene el texto residual con significado (puede ser undefined)
        q: semantic.q,
      });
    } else {
      // Limpiar filtros también vacía el buscador
      setSearchText('');
      setFilters(nextFilters);
    }
  };

  // Buscar películas cuando cambien los filtros
  useEffect(() => {
    const searchMovies = async () => {
      setLoading(true);
      try {
        const results = await movieService.getMovies(filters);
        setMovies(results);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce para evitar demasiadas solicitudes
    const timer = setTimeout(searchMovies, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleMovieClick = async (movieId: string) => {
    setDetailLoading(true);
    setDbpediaData(null);
    try {
      const [detail, dbpedia] = await Promise.all([
        movieService.getMovieDetail(movieId),
        movieService.getMovieDbpedia(movieId, dbpediaMode, i18n.language),
      ]);
      setSelectedMovie(detail);
      setDbpediaData(dbpedia);
    } catch (error) {
      console.error('Error fetching movie detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-900 to-red-800 border-b border-red-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{t('app.title')}</h1>
              <p className="text-red-100">{t('app.subtitle')}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Language selector */}
              <div className="flex items-center gap-1">
                {['es', 'en', 'pt'].map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className={`text-xs px-2 py-1 rounded font-medium transition ${
                      i18n.language === lng
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {lng === 'es' ? 'ES' : lng === 'en' ? 'EN' : 'PT'}
                  </button>
                ))}
              </div>
              <div className="w-px h-6 bg-slate-600" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{t('app.dbpedia')}</span>
                {(['auto', 'online', 'offline'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setDbpediaMode(m)}
                    className={`text-xs px-2 py-1 rounded font-medium transition ${
                      dbpediaMode === m
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {m === 'auto' ? t('app.auto') : m === 'online' ? t('app.online') : t('app.offline')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setTab('movies')}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-lg text-sm font-medium transition ${
                tab === 'movies'
                  ? 'bg-slate-900 text-red-400 border-t border-l border-r border-slate-700'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon type="movie" />
              {t('tab.movies')}
            </button>
            <button
              onClick={() => setTab('sparql')}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-lg text-sm font-medium transition ${
                tab === 'sparql'
                  ? 'bg-slate-900 text-red-400 border-t border-l border-r border-slate-700'
                  : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon type="database" />
              {t('tab.sparql')}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {tab === 'movies' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <FilterPanel filters={filters} searchText={searchText} onFilterChange={handleFilterChange} />
            </div>
            <div className="md:col-span-2">
              <MovieList
                movies={movies}
                loading={loading}
                onMovieClick={handleMovieClick}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-darkish p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-bold text-slate-100 mb-3">{t('examples.title')}</h3>
                <div className="space-y-2">
                  {[
                    { key: 'allMovies', q: 'PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>\nSELECT ?p ?titulo ?anio WHERE { ?p a :Pelicula . OPTIONAL { ?p :titulo ?titulo } OPTIONAL { ?p :añoEstreno ?anio } } ORDER BY DESC(?anio) LIMIT 20' },
                    { key: 'slashersGore', q: 'PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>\nSELECT ?p ?titulo ?gore WHERE { ?p a :Pelicula ; :tieneSubgenero :Slasher ; :nivelGore ?gore . OPTIONAL { ?p :titulo ?titulo } } ORDER BY DESC(?gore)' },
                    { key: 'countBySubgenre', q: 'PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>\nSELECT ?sg (COUNT(?p) AS ?total) WHERE { ?p a :Pelicula ; :tieneSubgenero ?sg } GROUP BY ?sg ORDER BY DESC(?total)' },
                    { key: 'dbpediaLinks', q: 'PREFIX owl: <http://www.w3.org/2002/07/owl#>\nSELECT ?s ?o WHERE { ?s owl:sameAs ?o }' },
                    { key: 'allClasses', q: 'SELECT ?clase (COUNT(?i) AS ?total) WHERE { ?i a ?clase } GROUP BY ?clase ORDER BY DESC(?total)' },
                    { key: 'totalTriples', q: 'SELECT (COUNT(*) AS ?triples) WHERE { ?s ?p ?o }' },
                  ].map((ex) => (
                    <button
                      key={ex.key}
                      onClick={() => { setSparqlQuery(ex.q); setTab('sparql'); }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded transition"
                    >
                      {t(`examples.${ex.key}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <SparqlConsole defaultQuery={sparqlQuery} />
          </div>
        )}
      </main>

      {/* Modal - Detalle de película */}
      <MovieDetailView
        movie={selectedMovie}
        loading={detailLoading}
        dbpediaData={dbpediaData}
        onClose={() => { setSelectedMovie(null); setDbpediaData(null); }}
      />
    </div>
  );
}

export default App;
