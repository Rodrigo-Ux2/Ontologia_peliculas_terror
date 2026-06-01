import { useTranslation } from 'react-i18next';
import { MovieListItem } from '../types';

interface MovieCardProps {
  movie: MovieListItem;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onClick}
      className="bg-darkish border border-slate-700 rounded-lg p-4 hover:border-red-500 hover:bg-slate-800 cursor-pointer transition transform hover:scale-105"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-100 hover:text-red-400 transition">
            {movie.titulo}
          </h3>
          {movie.anio && (
            <p className="text-sm text-slate-400 mt-1">
              {t('movies.year')} <span className="text-slate-300">{movie.anio}</span>
            </p>
          )}
        </div>
        <div className="text-red-500 text-xl ml-4">→</div>
      </div>
    </div>
  );
}
