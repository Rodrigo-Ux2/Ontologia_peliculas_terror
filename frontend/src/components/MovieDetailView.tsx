import { useTranslation } from 'react-i18next';
import { MovieDetail, DbpediaData } from '../types';
import { Icon } from './Icon';

interface MovieDetailViewProps {
  movie: MovieDetail | null;
  loading: boolean;
  dbpediaData?: DbpediaData | null;
  onClose: () => void;
}

function SourceBadge({ source }: { source: 'owl' | 'dbpedia' }) {
  return (
    <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded font-semibold align-middle ${
      source === 'owl'
        ? 'bg-blue-900/80 text-blue-200'
        : 'bg-orange-800/80 text-orange-200'
    }`}>
      {source === 'owl' ? 'OWL' : 'DBpedia'}
    </span>
  );
}

export function MovieDetailView({ movie, loading, dbpediaData, onClose }: MovieDetailViewProps) {
  const { t } = useTranslation();
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
                <p className="text-slate-400">{t('detail.year')}: <span className="text-slate-200">{movie.anio}</span></p>
              )}
            </div>

            {/* Puntuaciones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {movie.puntuacion !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.score')}<SourceBadge source="owl" /></p>
                  <p className="text-2xl font-bold text-yellow-500">{movie.puntuacion}/100</p>
                </div>
              )}
              {movie.rt !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.rottenTomatoes')}<SourceBadge source="owl" /></p>
                  <p className="text-2xl font-bold text-orange-500">{movie.rt}%</p>
                </div>
              )}
              {movie.nivelGore !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.gore')}<SourceBadge source="owl" /></p>
                  <p className="text-2xl font-bold text-red-500">{movie.nivelGore}/10</p>
                </div>
              )}
              {movie.nivelSuspenso !== null && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.suspense')}<SourceBadge source="owl" /></p>
                  <p className="text-2xl font-bold text-purple-500">{movie.nivelSuspenso}/10</p>
                </div>
              )}
            </div>

            {/* Sinopsis */}
            {movie.sinopsis && (
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">{t('detail.synopsis')}<SourceBadge source="owl" /></h2>
                <p className="text-slate-300 leading-relaxed">{movie.sinopsis}</p>
              </div>
            )}

            {/* Detalles técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movie.duracion && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.duration')}<SourceBadge source="owl" /></p>
                  <p className="text-slate-200">{movie.duracion} {t('detail.minutes')}</p>
                </div>
              )}
              {movie.pais && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.country')}<SourceBadge source="owl" /></p>
                  <p className="text-slate-200">{movie.pais}</p>
                </div>
              )}
              {movie.idioma && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.language')}<SourceBadge source="owl" /></p>
                  <p className="text-slate-200">{movie.idioma}</p>
                </div>
              )}
              {movie.clasificacion && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.rating')}<SourceBadge source="owl" /></p>
                  <p className="text-slate-200">{movie.clasificacion}</p>
                </div>
              )}
              {movie.presupuesto && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.budget')}<SourceBadge source="owl" /></p>
                  <p className="text-slate-200">${(movie.presupuesto / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.recaudacion && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.revenue')}<SourceBadge source="owl" /></p>
                  <p className="text-slate-200">${(movie.recaudacion / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>

            {/* Ambientación y estilo */}
            {movie.ambientacion && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.setting')}<SourceBadge source="owl" /></h3>
                <p className="text-slate-300">{movie.ambientacion}</p>
              </div>
            )}
            {movie.estiloFotografia && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.photography')}<SourceBadge source="owl" /></h3>
                <p className="text-slate-300">{movie.estiloFotografia}</p>
              </div>
            )}

            {/* Listas */}
            {movie.subgeneros.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.subgenres')}<SourceBadge source="owl" /></h3>
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
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.monsters')}<SourceBadge source="owl" /></h3>
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
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.availableOn')}<SourceBadge source="owl" /></h3>
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
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.directors')}<SourceBadge source="owl" /></h3>
                <p className="text-slate-300">{movie.directores.join(', ')}</p>
              </div>
            )}

            {movie.actores.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.actors')}<SourceBadge source="owl" /></h3>
                <p className="text-slate-300">{movie.actores.slice(0, 5).join(', ')}</p>
              </div>
            )}

            {movie.guionistas.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.writers')}<SourceBadge source="owl" /></h3>
                <p className="text-slate-300">{movie.guionistas.join(', ')}</p>
              </div>
            )}

            {/* Panel DBpedia */}
            {dbpediaData && (
              <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-orange-400">{t('detail.dbpedia')}</span>
                    <span className="text-slate-400 text-sm font-normal">— {t('detail.linkedData')}</span>
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    dbpediaData.source === 'online'
                      ? 'bg-green-900 text-green-300'
                      : dbpediaData.source === 'offline'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {dbpediaData.source === 'online' ? t('detail.online') : dbpediaData.source === 'offline' ? t('detail.offline') : t('detail.notAvailable')}
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  {dbpediaData.thumbnail && (
                    <img
                      src={dbpediaData.thumbnail}
                      alt={movie.titulo}
                      className="w-28 rounded shadow-lg flex-shrink-0 object-cover"
                    />
                  )}
                  <div className="space-y-2 text-sm flex-1 min-w-0">
                    <p className="text-slate-400 break-all">
                      <span className="text-slate-300 font-medium">{t('detail.uri')} </span>
                      <a
                        href={dbpediaData.dbpediaUri}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-400 hover:underline"
                      >
                        {dbpediaData.dbpediaUri}
                      </a>
                    </p>
                    {dbpediaData.wikiPage && (
                      <p>
                        <a
                          href={dbpediaData.wikiPage}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded transition"
                        >
                          {t('detail.viewOnWikipedia')}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Datos enriquecidos desde DBpedia */}
                {(dbpediaData.abstract || dbpediaData.budget || dbpediaData.gross || dbpediaData.runtime || dbpediaData.country || dbpediaData.language || dbpediaData.genres.length > 0 || dbpediaData.directors.length > 0 || dbpediaData.actors.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                    <h4 className="text-sm font-semibold text-orange-400">{t('detail.enrichedData')}</h4>

                    {dbpediaData.abstract && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">{t('detail.synopsisDbpedia')}<SourceBadge source="dbpedia" /></p>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {dbpediaData.abstract.length > 400
                            ? dbpediaData.abstract.slice(0, 400) + '...'
                            : dbpediaData.abstract}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      {dbpediaData.budget && (
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">{t('detail.budgetDbpedia')}<SourceBadge source="dbpedia" /></p>
                          <p className="text-slate-200 text-sm">${(dbpediaData.budget / 1000000).toFixed(1)}M</p>
                        </div>
                      )}
                      {dbpediaData.gross && (
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">{t('detail.revenueDbpedia')}<SourceBadge source="dbpedia" /></p>
                          <p className="text-slate-200 text-sm">${(dbpediaData.gross / 1000000).toFixed(1)}M</p>
                        </div>
                      )}
                      {dbpediaData.runtime && (
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">{t('detail.durationDbpedia')}<SourceBadge source="dbpedia" /></p>
                          <p className="text-slate-200 text-sm">{dbpediaData.runtime} {t('detail.minutes')}</p>
                        </div>
                      )}
                      {dbpediaData.country && (
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">{t('detail.countryDbpedia')}<SourceBadge source="dbpedia" /></p>
                          <p className="text-slate-200 text-sm">{dbpediaData.country}</p>
                        </div>
                      )}
                      {dbpediaData.language && (
                        <div className="bg-slate-800 rounded p-2">
                          <p className="text-xs text-slate-400">{t('detail.languageDbpedia')}<SourceBadge source="dbpedia" /></p>
                          <p className="text-slate-200 text-sm">{dbpediaData.language}</p>
                        </div>
                      )}
                    </div>

                     {dbpediaData.genres.length > 0 && (
                       <div>
                         <p className="text-xs text-slate-400 mb-1">{t('detail.genresDbpedia')}<SourceBadge source="dbpedia" /></p>
                        <div className="flex flex-wrap gap-1">
                          {dbpediaData.genres.map((g) => (
                            <span key={g} className="bg-orange-900/60 text-orange-200 px-2 py-0.5 rounded text-xs">{g}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {dbpediaData.directors.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">{t('detail.directorsDbpedia')}<SourceBadge source="dbpedia" /></p>
                        <p className="text-slate-300 text-sm">{dbpediaData.directors.join(', ')}</p>
                      </div>
                    )}

                    {dbpediaData.actors.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">{t('detail.actorsDbpedia')}<SourceBadge source="dbpedia" /></p>
                        <p className="text-slate-300 text-sm">{dbpediaData.actors.slice(0, 6).join(', ')}</p>
                      </div>
                    )}

                    {dbpediaData.productionCompanies.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">{t('detail.producersDbpedia')}<SourceBadge source="dbpedia" /></p>
                        <p className="text-slate-300 text-sm">{dbpediaData.productionCompanies.join(', ')}</p>
                      </div>
                    )}

                    {dbpediaData.musicComposers.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">{t('detail.composersDbpedia')}<SourceBadge source="dbpedia" /></p>
                        <p className="text-slate-300 text-sm">{dbpediaData.musicComposers.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
