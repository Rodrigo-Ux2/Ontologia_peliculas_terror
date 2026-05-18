import { useState, useEffect } from 'react';
import { FilterPanel } from './components/FilterPanel';
import { MovieList } from './components/MovieList';
import { MovieDetailView } from './components/MovieDetailView';
import { movieService } from './services/api';
import { MovieDetail, FilterOptions } from './types';
import './App.css';

function App() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

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
    try {
      const detail = await movieService.getMovieDetail(movieId);
      setSelectedMovie(detail);
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
            <FilterPanel filters={filters} onFilterChange={setFilters} />
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
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}

export default App;
