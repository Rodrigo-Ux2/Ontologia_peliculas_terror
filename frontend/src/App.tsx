import { useState, useEffect } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { MovieList } from './components/MovieList';
import { MovieDetailView } from './components/MovieDetailView';
import { movieService } from './services/api';
import { MovieDetail, FilterOptions, DbpediaData } from './types';
import './App.css';

const SEMANTIC_MONSTER_MAP: Record<string, string> = {
  fantasma: 'Fantasma',
  demonio: 'Demonio',
  vampiro: 'Vampiro',
  zombi: 'Zombi',
  hombrelobo: 'HombreLobo',
  extraterrestre: 'Extraterrestre',
  asesinoserial: 'AsesinoSerial',
  monstruo: 'Monstruo_Fisico',
};

const SEMANTIC_SUBGENERO_MAP: Record<string, string> = {
  slasher: 'Slasher',
  sobrenatural: 'Sobrenatural',
  psicologico: 'TerrorPsicologico',
  gore: 'BodyHorror',
  'body horror': 'BodyHorror',
  'found footage': 'FoundFootage',
  'terror historico': 'TerrorHistorico',
  'terror supervivencia': 'TerrorSupervivencia',
  'comedia terror': 'ComediaTerror',
};

function parseSemanticSearch(query: string): Partial<FilterOptions> {
  const semantic: Partial<FilterOptions> = {};
  let remainder = query.toLowerCase().trim();

  // Detectar tipo de monstruo y eliminarlo del texto restante
  for (const [keyword, tipo] of Object.entries(SEMANTIC_MONSTER_MAP)) {
    if (remainder.includes(keyword)) {
      semantic.tipoMonstruo = tipo;
      remainder = remainder.replace(keyword, '');
      break;
    }
  }

  // Detectar subgénero y eliminarlo del texto restante
  for (const [keyword, subgenero] of Object.entries(SEMANTIC_SUBGENERO_MAP)) {
    if (remainder.includes(keyword)) {
      semantic.subgenero = subgenero;
      remainder = remainder.replace(keyword, '');
      break;
    }
  }

  // Detectar rangos de años como "de 1990 a 2010" o "1990-2010" en el texto ya limpio
  const rangeMatch = remainder.match(/(?:de|from)?\s*(19|20)\d{2}\s*(?:a|to|-)\s*(19|20)\d{2}/);
  if (rangeMatch) {
    const years = rangeMatch[0].match(/(19|20)\d{2}/g)!;
    const startYear = Number(years[0]);
    const endYear = Number(years[1]);
    if (!Number.isNaN(startYear) && !Number.isNaN(endYear)) {
      semantic.anioMin = Math.min(startYear, endYear);
      semantic.anioMax = Math.max(startYear, endYear);
      remainder = remainder.replace(rangeMatch[0], '');
    }
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

  // Solo incluir q si queda texto que no sea semántico (p.ej. "ring", "el conjuro")
  const cleanRemainder = remainder.replace(/\s+/g, ' ').trim();
  if (cleanRemainder) {
    semantic.q = cleanRemainder;
  }

  return semantic;
}

function App() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [dbpediaData, setDbpediaData] = useState<DbpediaData | null>(null);

  const handleFilterChange = (nextFilters: FilterOptions) => {
    if (nextFilters.q !== undefined) {
      const semantic = parseSemanticSearch(nextFilters.q);
      setFilters({
        ...nextFilters,
        ...semantic,
        // Sobreescribir q con el texto residual limpio (undefined si fue todo semántico)
        q: semantic.q,
      });
    } else {
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
        movieService.getMovieDbpedia(movieId),
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
      <header className="bg-gradient-to-r from-red-900 to-red-800 border-b border-red-700 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 Buscador Semántico</h1>
          <p className="text-red-100">Películas de Terror - Web Semántica</p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar - Filtros */}
          <div className="md:col-span-1">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Content - Lista de películas */}
          <div>
            <MovieList
              movies={movies}
              loading={loading}
              onMovieClick={handleMovieClick}
            />
          </div>
        </div>
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
