import { MovieDetail } from '../types';
import { Icon } from './Icon';

interface MovieDetailViewProps {
  movie: MovieDetail | null;
  loading: boolean;
  onClose: () => void;
}

export function MovieDetailView({ movie, loading, onClose }: MovieDetailViewProps) {
  if (!movie && !loading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-darkish border border-slate-700 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition"
        >
          <Icon type="close" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Icon type="loading" />
          </div>
        ) : movie ? (
          <div className="p-8 space-y-6">
            {/* Título y año */}
            <div>
              <h1 className="text-4xl font-bold text-red-500 mb-2">{movie.titulo}</h1>
              {movie.anio && (
                <p className="text-slate-400">Año de estreno: <span className="text-slate-200">{movie.anio}</span></p>
              )}
            </div>

            {/* Puntuaciones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {movie.puntuacion !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Puntuación propia</p>
                  <p className="text-2xl font-bold text-yellow-500">{movie.puntuacion}/100</p>
                </div>
              )}
              {movie.rt !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Rotten Tomatoes</p>
                  <p className="text-2xl font-bold text-orange-500">{movie.rt}%</p>
                </div>
              )}
              {movie.nivelGore !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Nivel Gore</p>
                  <p className="text-2xl font-bold text-red-500">{movie.nivelGore}/10</p>
                </div>
              )}
              {movie.nivelSuspenso !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Nivel Suspenso</p>
                  <p className="text-2xl font-bold text-purple-500">{movie.nivelSuspenso}/10</p>
                </div>
              )}
            </div>

            {/* Sinopsis */}
            {movie.sinopsis && (
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Sinopsis</h2>
                <p className="text-slate-300 leading-relaxed">{movie.sinopsis}</p>
              </div>
            )}

            {/* Detalles técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movie.duracion && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Duración</p>
                  <p className="text-slate-200">{movie.duracion} minutos</p>
                </div>
              )}
              {movie.pais && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">País</p>
                  <p className="text-slate-200">{movie.pais}</p>
                </div>
              )}
              {movie.idioma && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Idioma</p>
                  <p className="text-slate-200">{movie.idioma}</p>
                </div>
              )}
              {movie.clasificacion && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Clasificación</p>
                  <p className="text-slate-200">{movie.clasificacion}</p>
                </div>
              )}
              {movie.presupuesto && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Presupuesto</p>
                  <p className="text-slate-200">${(movie.presupuesto / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.recaudacion && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">Recaudación</p>
                  <p className="text-slate-200">${(movie.recaudacion / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>

            {/* Ambientación y estilo */}
            {movie.ambientacion && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Ambientación</h3>
                <p className="text-slate-300">{movie.ambientacion}</p>
              </div>
            )}
            {movie.estiloFotografia && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Estilo de Fotografía</h3>
                <p className="text-slate-300">{movie.estiloFotografia}</p>
              </div>
            )}

            {/* Listas */}
            {movie.subgeneros.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Subgéneros</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.subgeneros.map((sg) => (
                    <span key={sg} className="bg-red-900 text-red-100 px-3 py-1 rounded-full text-sm">
                      {sg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.monstruos.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Tipos de Monstruos</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.monstruos.map((m) => (
                    <span key={m} className="bg-purple-900 text-purple-100 px-3 py-1 rounded-full text-sm">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.plataformas.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Disponible en</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.plataformas.map((p) => (
                    <span key={p} className="bg-blue-900 text-blue-100 px-3 py-1 rounded-full text-sm">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.directores.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Directores</h3>
                <p className="text-slate-300">{movie.directores.join(', ')}</p>
              </div>
            )}

            {movie.actores.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Actores principales</h3>
                <p className="text-slate-300">{movie.actores.slice(0, 5).join(', ')}</p>
              </div>
            )}

            {movie.guionistas.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">Guionistas</h3>
                <p className="text-slate-300">{movie.guionistas.join(', ')}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
