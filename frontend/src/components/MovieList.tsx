import { MovieListItem } from '../types';
import { MovieCard } from './MovieCard';

interface MovieListProps {
  movies: MovieListItem[];
  loading: boolean;
  onMovieClick: (movieId: string) => void;
}

export function MovieList({ movies, loading, onMovieClick }: MovieListProps) {
  if (loading) {
    return (
      <div className="col-span-1 md:col-span-2 flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
          <p className="text-slate-300">Buscando películas...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="col-span-1 md:col-span-2 text-center py-12">
        <p className="text-slate-400 text-lg">No se encontraron películas con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="col-span-1 md:col-span-2">
      <h2 className="text-2xl font-bold text-slate-100 mb-4">{movies.length} películas encontradas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {movies.map((movie) => (
          <MovieCard
            key={movie.iri}
            movie={movie}
            onClick={() => {
              const id = movie.iri.split('#')[1];
              onMovieClick(id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
