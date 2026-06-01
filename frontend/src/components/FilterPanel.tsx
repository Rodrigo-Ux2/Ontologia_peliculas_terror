import { useTranslation } from 'react-i18next';
import { FilterOptions, TIPO_MONSTRUO_OPTIONS, SUBGENERO_OPTIONS, PLATAFORMA_OPTIONS, PAIS_OPTIONS, IDIOMA_OPTIONS, CLASIFICACION_OPTIONS } from '../types';

interface FilterPanelProps {
  filters: FilterOptions;
  searchText: string;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterPanel({ filters, searchText, onFilterChange }: FilterPanelProps) {
  const { t } = useTranslation();

  const handleChange = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-darkish p-6 rounded-lg border border-slate-700 space-y-6">
      <h2 className="text-xl font-bold text-red-500 mb-4">{t('filter.title')}</h2>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.searchLabel')}</label>
        <input
          type="text"
          placeholder={t('filter.searchPlaceholder')}
          value={searchText}
          onChange={(e) => handleChange('q', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
        />
        <p className="mt-2 text-xs text-slate-400">
          {t('filter.searchHelp', { example: t('filter.searchExample') })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.yearMin')}</label>
          <input
            type="number"
            placeholder="Ej: 1980"
            value={filters.anioMin || ''}
            onChange={(e) => handleChange('anioMin', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.yearMax')}</label>
          <input
            type="number"
            placeholder="Ej: 2024"
            value={filters.anioMax || ''}
            onChange={(e) => handleChange('anioMax', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.goreMin')}</label>
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
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.suspenseMin')}</label>
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
          <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.scoreMin')}</label>
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
          <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.rtMin')}</label>
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

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.monsterType')}</label>
        <select
          value={filters.tipoMonstruo || ''}
          onChange={(e) => handleChange('tipoMonstruo', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">{t('filter.all')}</option>
          {TIPO_MONSTRUO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.subgenre')}</label>
        <select
          value={filters.subgenero || ''}
          onChange={(e) => handleChange('subgenero', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">{t('filter.all')}</option>
          {SUBGENERO_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.platform')}</label>
        <select
          value={filters.plataforma || ''}
          onChange={(e) => handleChange('plataforma', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">{t('filter.allF')}</option>
          {PLATAFORMA_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.country')}</label>
        <select
          value={filters.pais || ''}
          onChange={(e) => handleChange('pais', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">{t('filter.all')}</option>
          {PAIS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.language')}</label>
        <select
          value={filters.idioma || ''}
          onChange={(e) => handleChange('idioma', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">{t('filter.all')}</option>
          {IDIOMA_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{t('filter.ageRating')}</label>
        <select
          value={filters.clasificacionEdad || ''}
          onChange={(e) => handleChange('clasificacionEdad', e.target.value || undefined)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-red-500"
        >
          <option value="">{t('filter.allF')}</option>
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
          {t('filter.basedOnTrueStory')}
        </label>
      </div>

      <button
        onClick={() => onFilterChange({})}
        className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded font-medium transition"
      >
        {t('filter.clear')}
      </button>
    </div>
  );
}
