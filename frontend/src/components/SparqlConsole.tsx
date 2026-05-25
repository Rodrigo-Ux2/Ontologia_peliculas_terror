import { useState, useEffect } from 'react';
import { movieService } from '../services/api';
import { Icon } from './Icon';

type ResultType = 'table' | 'message' | 'error' | null;

export function SparqlConsole({ defaultQuery }: { defaultQuery?: string }) {
  const [query, setQuery] = useState(defaultQuery ?? `PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#>
SELECT ?pelicula ?titulo ?anio WHERE {
  ?pelicula a :Pelicula .
  OPTIONAL { ?pelicula :titulo ?titulo }
  OPTIONAL { ?pelicula :añoEstreno ?anio }
}
ORDER BY DESC(?anio)
LIMIT 10`);

  useEffect(() => {
    if (defaultQuery !== undefined) {
      setQuery(defaultQuery);
    }
  }, [defaultQuery]);
  const [resultType, setResultType] = useState<ResultType>(null);
  const [bindings, setBindings] = useState<Record<string, { value: string; type?: string; datatype?: string }>[]>([]);
  const [variables, setVariables] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const runQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResultType(null);
    try {
      const data = await movieService.sparqlQuery(query);
      if (data.results?.bindings) {
        const vars = data.head?.vars || [];
        setVariables(vars);
        setBindings(data.results.bindings);
        setResultType('table');
      } else if (data.success === true) {
        setMessage('Consulta de actualización ejecutada correctamente.');
        setResultType('message');
      } else if (data.boolean !== undefined) {
        setMessage(data.boolean ? 'Verdadero' : 'Falso');
        setResultType('message');
      } else {
        setMessage(JSON.stringify(data, null, 2));
        setResultType('message');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Error de conexión';
      setMessage(msg);
      setResultType('error');
    } finally {
      setLoading(false);
    }
  };

  const cellValue = (val: { value: string; type?: string; datatype?: string } | undefined): string => {
    if (!val) return '';
    if (val.type === 'uri') {
      const fragment = val.value.split('#')[1];
      return fragment || val.value;
    }
    return val.value;
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <div className="bg-darkish border border-slate-700 rounded-lg">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-red-500 mb-4">Consola SPARQL</h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded text-slate-100 font-mono text-sm focus:outline-none focus:border-red-500 resize-y"
            placeholder="Escribe tu consulta SPARQL aquí..."
          />
          <button
            onClick={runQuery}
            disabled={loading || !query.trim()}
            className="mt-3 flex items-center gap-2 px-5 py-2 bg-red-700 hover:bg-red-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded transition"
          >
            {loading ? (
              <Icon type="loading" />
            ) : (
              <Icon type="play" />
            )}
            {loading ? 'Ejecutando...' : 'Ejecutar'}
          </button>
        </div>

        <div className="p-4">
          {resultType === 'table' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-200 border-collapse">
                <thead>
                  <tr className="bg-slate-800">
                    {variables.map((v) => (
                      <th key={v} className="px-3 py-2 text-left font-semibold text-red-400 border-b border-slate-600 whitespace-nowrap">
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bindings.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 even:bg-slate-800/30">
                      {variables.map((v) => (
                        <td key={v} className="px-3 py-2 border-b border-slate-700 text-slate-300 max-w-xs truncate">
                          {row[v]?.type === 'uri' ? (
                            <a
                              href={row[v]!.value}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {cellValue(row[v])}
                            </a>
                          ) : (
                            cellValue(row[v])
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-slate-500 text-xs mt-2">{bindings.length} fila(s)</p>
            </div>
          )}

          {resultType === 'message' && (
            <div className="bg-slate-800 rounded p-4 text-slate-200">
              <pre className="whitespace-pre-wrap font-mono text-sm">{message}</pre>
            </div>
          )}

          {resultType === 'error' && (
            <div className="bg-red-900/50 border border-red-700 rounded p-4 text-red-200">
              <p className="font-bold mb-1">Error:</p>
              <pre className="whitespace-pre-wrap font-mono text-sm">{message}</pre>
            </div>
          )}

          {resultType === null && !loading && (
            <p className="text-slate-500 text-sm">Escribe una consulta SPARQL y presiona "Ejecutar".</p>
          )}
        </div>
      </div>
    </div>
  );
}
