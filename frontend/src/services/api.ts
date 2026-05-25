import axios from 'axios';
import { MovieListItem, MovieDetail, FilterOptions, DbpediaData } from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const movieService = {
  async getMovies(filters: FilterOptions): Promise<MovieListItem[]> {
    const params = new URLSearchParams();

    if (filters.anioMin !== undefined) params.append('anioMin', filters.anioMin.toString());
    if (filters.anioMax !== undefined) params.append('anioMax', filters.anioMax.toString());
    if (filters.nivelGoreMin !== undefined) params.append('nivelGoreMin', filters.nivelGoreMin.toString());
    if (filters.nivelSuspensoMin !== undefined) params.append('nivelSuspensoMin', filters.nivelSuspensoMin.toString());
    if (filters.puntuacionMin !== undefined) params.append('puntuacionMin', filters.puntuacionMin.toString());
    if (filters.rtMin !== undefined) params.append('rtMin', filters.rtMin.toString());
    if (filters.tipoMonstruo) params.append('tipoMonstruo', filters.tipoMonstruo);
    if (filters.subgenero) params.append('subgenero', filters.subgenero);
    if (filters.plataforma) params.append('plataforma', filters.plataforma);
    if (filters.clasificacionEdad) params.append('clasificacionEdad', filters.clasificacionEdad);
    if (filters.pais) params.append('pais', filters.pais);
    if (filters.idioma) params.append('idioma', filters.idioma);
    if (filters.basadaEnHechosReales !== undefined) params.append('basadaEnHechosReales', filters.basadaEnHechosReales.toString());
    if (filters.q) params.append('q', filters.q);

    const response = await api.get<MovieListItem[]>('/peliculas', { params });
    return response.data;
  },

  async getMovieDetail(id: string): Promise<MovieDetail> {
    const response = await api.get<MovieDetail>(`/peliculas/${id}`);
    return response.data;
  },

  async getMovieDbpedia(id: string, mode: 'online' | 'offline' | 'auto' = 'auto'): Promise<DbpediaData | null> {
    try {
      const response = await api.get<DbpediaData>(`/peliculas/${id}/dbpedia`, {
        params: { mode },
      });
      return response.data;
    } catch {
      return null;
    }
  },

  async sparqlQuery(query: string): Promise<any> {
    const response = await api.post('/sparql', { query });
    return response.data;
  },
};
