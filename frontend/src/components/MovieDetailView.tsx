import { useTranslation } from 'react-i18next';
import { MovieDetail, DbpediaData } from '../types';
import { Icon } from './Icon';

interface MovieDetailViewProps {
  movie: MovieDetail | null;
  loading: boolean;
  dbpediaData?: DbpediaData | null;
  onClose: () => void;
}

// Diccionarios de traduccion para valores OWL que no tienen equivalente en DBpedia
const OWL_TRANSLATIONS: Record<string, Record<string, Record<string, string>>> = {
  clasificacion: {
    es: { 'Mayores de 13': 'Mayores de 13', 'Mayores de 16': 'Mayores de 16', 'Mayores de 18': 'Mayores de 18', 'No apta menores': 'No apta menores', 'Todos los públicos': 'Todos los públicos' },
    en: { 'Mayores de 13': '13+', 'Mayores de 16': '16+', 'Mayores de 18': '18+', 'No apta menores': 'Not suitable for minors', 'Todos los públicos': 'All ages' },
    pt: { 'Mayores de 13': 'Maiores de 13', 'Mayores de 16': 'Maiores de 16', 'Mayores de 18': 'Maiores de 18', 'No apta menores': 'Não recomendado para menores', 'Todos los públicos': 'Livre para todos os públicos' },
  },
  subgeneros: {
    es: { 'Slasher': 'Slasher', 'Sobrenatural': 'Sobrenatural', 'TerrorPsicologico': 'Terror Psicológico', 'BodyHorror': 'Body Horror', 'FoundFootage': 'Falso Documental', 'TerrorHistorico': 'Terror Histórico', 'TerrorSupervivencia': 'Terror de Supervivencia', 'ComediaTerror': 'Comedia de Terror' },
    en: { 'Slasher': 'Slasher', 'Sobrenatural': 'Supernatural', 'TerrorPsicologico': 'Psychological', 'BodyHorror': 'Body Horror', 'FoundFootage': 'Found Footage', 'TerrorHistorico': 'Historical Horror', 'TerrorSupervivencia': 'Survival Horror', 'ComediaTerror': 'Horror Comedy' },
    pt: { 'Slasher': 'Slasher', 'Sobrenatural': 'Sobrenatural', 'TerrorPsicologico': 'Terror Psicológico', 'BodyHorror': 'Body Horror', 'FoundFootage': 'Falso Documentário', 'TerrorHistorico': 'Terror Histórico', 'TerrorSupervivencia': 'Terror de Sobrevivência', 'ComediaTerror': 'Comédia de Terror' },
  },
  monstruos: {
    es: { 'Fantasma': 'Fantasma', 'Vampiro': 'Vampiro', 'Zombi': 'Zombi', 'Demonio': 'Demonio', 'HombreLobo': 'Hombre Lobo', 'Extraterrestre': 'Extraterrestre', 'AsesinoSerial': 'Asesino Serial', 'Monstruo_Fisico': 'Monstruo Físico' },
    en: { 'Fantasma': 'Ghost', 'Vampiro': 'Vampire', 'Zombi': 'Zombie', 'Demonio': 'Demon', 'HombreLobo': 'Werewolf', 'Extraterrestre': 'Alien', 'AsesinoSerial': 'Serial Killer', 'Monstruo_Fisico': 'Monster' },
    pt: { 'Fantasma': 'Fantasma', 'Vampiro': 'Vampiro', 'Zombi': 'Zumbi', 'Demonio': 'Demônio', 'HombreLobo': 'Lobisomem', 'Extraterrestre': 'Extraterrestre', 'AsesinoSerial': 'Assassino Serial', 'Monstruo_Fisico': 'Monstro' },
  },
};

function translateOWL(dictName: string, value: string, lang: string): string {
  return OWL_TRANSLATIONS[dictName]?.[lang]?.[value] ?? value;
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
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Cuando el idioma no es español, prefiere datos de DBpedia (traducidos)
  const useDbpedia = lang !== 'es' && dbpediaData != null;

  const owlOrDbpedia = <T,>(owl: T, dbpedia: T | null | undefined): T =>
    useDbpedia && dbpedia != null ? dbpedia : owl;

  const owlOrDbpediaArr = (owl: string[], dbpedia: string[] | undefined): string[] =>
    useDbpedia && dbpedia != null && dbpedia.length > 0 ? dbpedia : owl;

  const srcBadge = (fromDbpedia: boolean): 'owl' | 'dbpedia' =>
    fromDbpedia && useDbpedia ? 'dbpedia' : 'owl';

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
            {(movie.sinopsis || (useDbpedia && dbpediaData?.abstract)) && (
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">{t('detail.synopsis')}<SourceBadge source={srcBadge(true)} /></h2>
                <p className="text-slate-300 leading-relaxed">
                  {owlOrDbpedia(movie.sinopsis, dbpediaData?.abstract)}
                </p>
              </div>
            )}

            {/* Detalles técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(movie.duracion || (useDbpedia && dbpediaData?.runtime)) && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.duration')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.runtime))} /></p>
                  <p className="text-slate-200">{owlOrDbpedia(movie.duracion, dbpediaData?.runtime)} {t('detail.minutes')}</p>
                </div>
              )}
              {(movie.pais || (useDbpedia && dbpediaData?.country)) && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.country')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.country))} /></p>
                  <p className="text-slate-200">{owlOrDbpedia(movie.pais, dbpediaData?.country)}</p>
                </div>
              )}
              {(movie.idioma || (useDbpedia && dbpediaData?.language)) && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.language')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.language))} /></p>
                  <p className="text-slate-200">{owlOrDbpedia(movie.idioma, dbpediaData?.language)}</p>
                </div>
              )}
              {movie.clasificacion && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.rating')}<SourceBadge source="owl" /></p>
                  <p className="text-slate-200">{translateOWL('clasificacion', movie.clasificacion, lang)}</p>
                </div>
              )}
              {(movie.presupuesto || (useDbpedia && dbpediaData?.budget)) && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.budget')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.budget))} /></p>
                  <p className="text-slate-200">${(owlOrDbpedia(movie.presupuesto, dbpediaData?.budget)! / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {(movie.recaudacion || (useDbpedia && dbpediaData?.gross)) && (
                <div className="bg-slate-800 rounded p-4">
                  <p className="text-slate-400 text-sm">{t('detail.revenue')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.gross))} /></p>
                  <p className="text-slate-200">${(owlOrDbpedia(movie.recaudacion, dbpediaData?.gross)! / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>

            {/* Ambientación y estilo */}
            {movie.ambientacion && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.setting')}<SourceBadge source="owl" /></h3>
                <p className="text-slate-300">{movie.ambientacion}</p>
                {lang !== 'es' && <p className="text-xs text-slate-500 mt-1 italic">Solo disponible en español</p>}
              </div>
            )}
            {movie.estiloFotografia && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.photography')}<SourceBadge source="owl" /></h3>
                <p className="text-slate-300">{movie.estiloFotografia}</p>
                {lang !== 'es' && <p className="text-xs text-slate-500 mt-1 italic">Solo disponible en español</p>}
              </div>
            )}

            {/* Listas */}
            {movie.subgeneros.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.subgenres')}<SourceBadge source="owl" /></h3>
                <div className="flex flex-wrap gap-2">
                  {movie.subgeneros.map((sg) => (
                    <span key={sg} className="bg-red-900 text-red-100 px-3 py-1 rounded-full text-sm">
                      {translateOWL('subgeneros', sg, lang)}
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
                      {translateOWL('monstruos', m, lang)}
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

            {(movie.directores.length > 0 || (useDbpedia && (dbpediaData?.directors?.length ?? 0) > 0)) && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.directors')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.directors?.length))} /></h3>
                <p className="text-slate-300">{owlOrDbpediaArr(movie.directores, dbpediaData?.directors).join(', ')}</p>
              </div>
            )}

            {(movie.actores.length > 0 || (useDbpedia && (dbpediaData?.actors?.length ?? 0) > 0)) && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.actors')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.actors?.length))} /></h3>
                <p className="text-slate-300">{owlOrDbpediaArr(movie.actores, dbpediaData?.actors).slice(0, 5).join(', ')}</p>
              </div>
            )}

            {(movie.guionistas.length > 0 || (useDbpedia && (dbpediaData?.writers?.length ?? 0) > 0)) && (
              <div>
                <h3 className="font-bold text-slate-100 mb-2">{t('detail.writers')}<SourceBadge source={srcBadge(Boolean(dbpediaData?.writers?.length))} /></h3>
                <p className="text-slate-300">{owlOrDbpediaArr(movie.guionistas, dbpediaData?.writers).join(', ')}</p>
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
