import { FilterOptions, TIPO_MONSTRUO_OPTIONS, SUBGENERO_OPTIONS, PLATAFORMA_OPTIONS, PAIS_OPTIONS, IDIOMA_OPTIONS, CLASIFICACION_OPTIONS } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  searchText: string;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, searchText, onFilterChange }: FilterPanelProps) {
  const handleChange = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-darkish p-6 rounded-lg border border-slate-700 space-y-6">
      <h2 className="text-xl font-bold text-red-500 mb-4">Filtros de Búsqueda</h2>

      {/* Búsqueda por texto */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Buscar película</label>
        <input
          type="text"
          placeholder="Ej: año 2013, asesino en un bosque"
          value={searchText}
          onChange={(e) => handleChange('q', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
        <p className="mt-2 text-xs text-slate-400">Escribe palabras clave y años (por ejemplo: <span className="text-slate-200">fantasma 1990-2010</span>).</p>
      </div>

      {/* Rango de años */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Año mínimo</label>
          <input
            type="number"
            placeholder="Ej: 1980"
            value={filters.anioMin || ''}
            onChange={(e) => handleChange('anioMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Año máximo</label>
          <input
            type="number"
            placeholder="Ej: 2024"
            value={filters.anioMax || ''}
            onChange={(e) => handleChange('anioMax', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Puntuaciones y niveles */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Nivel de Gore mínimo</label>
        <input
          type="number"
          min="1"
          max="10"
          placeholder="1-10"
          value={filters.nivelGoreMin || ''}
          onChange={(e) => handleChange('nivelGoreMin', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Nivel de Suspenso mínimo</label>
        <input
          type="number"
          min="1"
          max="10"
          placeholder="1-10"
          value={filters.nivelSuspensoMin || ''}
          onChange={(e) => handleChange('nivelSuspensoMin', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Puntuación mínima</label>
          <input
            type="number"
            min="1"
            max="100"
            placeholder="1-100"
            value={filters.puntuacionMin || ''}
            onChange={(e) => handleChange('puntuacionMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Rotten Tomatoes mín.</label>
          <input
            type="number"
            min="1"
            max="100"
            placeholder="1-100"
            value={filters.rtMin || ''}
            onChange={(e) => handleChange('rtMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Dropdowns */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Tipo de Monstruo</label>
        <select
          value={filters.tipoMonstruo || ''}
          onChange={(e) => handleChange('tipoMonstruo', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">-- Todos --</option>
          {TIPO_MONSTRUO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Subgénero</label>
        <select
          value={filters.subgenero || ''}
          onChange={(e) => handleChange('subgenero', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">-- Todos --</option>
          {SUBGENERO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Plataforma</label>
        <select
          value={filters.plataforma || ''}
          onChange={(e) => handleChange('plataforma', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">-- Todas --</option>
          {PLATAFORMA_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">País</label>
        <select
          value={filters.pais || ''}
          onChange={(e) => handleChange('pais', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">-- Todos --</option>
          {PAIS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Idioma</label>
        <select
          value={filters.idioma || ''}
          onChange={(e) => handleChange('idioma', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">-- Todos --</option>
          {IDIOMA_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Clasificación de edad</label>
        <select
          value={filters.clasificacionEdad || ''}
          onChange={(e) => handleChange('clasificacionEdad', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">-- Todas --</option>
          {CLASIFICACION_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="basadaHechos"
          checked={filters.basadaEnHechosReales || false}
          onChange={(e) => handleChange('basadaEnHechosReales', e.target.checked || undefined)}
          className="w-4 h-4 bg-slate-800 border border-slate-600 rounded accent-red-500"
        />
        <label htmlFor="basadaHechos" className="text-sm font-medium text-slate-200">
          Basada en hechos reales
        </label>
      </div>

      <button
        onClick={() => onFilterChange({})}
        className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded font-medium transition"
      >
        Limpiar filtros
      </button>
    </div>
  );
}
