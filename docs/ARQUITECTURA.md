# Arquitectura del Sistema

## Flujo de datos

```
┌─────────────────────────────────────────────────────────────────────┐
│                     NAVEGADOR DEL USUARIO                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  FRONTEND REACT (Puerto 5173)                                │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ FilterPanel: Selecciona criterios de búsqueda      │   │  │
│  │  │ MovieList: Muestra resultados                      │   │  │
│  │  │ MovieDetailView: Modal con detalles                │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └────────────────────┬─────────────────────────────────────────┘  │
│                       │                                              │
│    API HTTP (GET)     │                                              │
│                       ▼                                              │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                 BACKEND EXPRESS (Puerto 4000)               │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │ /api/peliculas       Procesa filtros               │   │  │
│  │  │ /api/peliculas/:id   Devuelve detalles            │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  └────────────────────┬─────────────────────────────────────────┘  │
└─────────────────────────┼─────────────────────────────────────────────┘
                          │
                  SPARQL Query (GET)
                          │
                          ▼
          ┌─────────────────────────────┐
          │ Apache Jena Fuseki          │
          │ (Puerto 3030)               │
          │                             │
          │ - Triplestore RDF           │
          │ - Endpoint SPARQL           │
          │ - Ontología cargada         │
          └─────────────────────────────┘
```

## Componentes principales

### Frontend (React + TypeScript)

**Estructura:**
```
src/
├── App.tsx                 # Estado global, orquestación
├── components/
│   ├── FilterPanel.tsx    # Formulario de búsqueda
│   ├── MovieList.tsx      # Listado de películas
│   ├── MovieCard.tsx      # Tarjeta individual
│   ├── MovieDetailView.tsx # Modal de detalles
│   └── Icon.tsx           # Iconos SVG
├── services/
│   └── api.ts             # Cliente HTTP (axios)
└── types/
    └── index.ts           # Tipos TS y opciones
```

**Flujo de componentes:**
1. `App` gestiona estado global (filtros, películas, detalles)
2. Usuario cambia filtros en `FilterPanel`
3. `App` llama `movieService.getMovies(filtros)`
4. Resultados se muestran en `MovieList`
5. Clic en película dispara `onMovieClick`
6. `App` llama `movieService.getMovieDetail(id)`
7. `MovieDetailView` abre con detalles

### Backend (Express + TypeScript)

**Endpoints:**
```
GET /api/peliculas?filtros
  └─ parsea query params
  └─ construye SPARQL query
  └─ ejecuta en Fuseki
  └─ devuelve JSON

GET /api/peliculas/:id
  └─ construye SPARQL query específica
  └─ ejecuta en Fuseki
  └─ devuelve detalle completo
```

### Triplestore (Apache Jena Fuseki)

**Datos:**
- Ontología OWL convertida a RDF/XML
- ~4,168 triples (películas + relaciones)
- Acceso mediante SPARQL
- En memoria (--mem) o persistente

---

## Tecnologías

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| Frontend | React 18 | UI componentes |
| | TypeScript | Tipado estático |
| | Tailwind CSS | Estilos responsive |
| | Vite | Bundler y dev server |
| | Axios | HTTP client |
| Backend | Express | Servidor web |
| | TypeScript | Tipado estático |
| | CORS | Acceso cross-origin |
| Datos | RDF/XML | Formato de ontología |
| | SPARQL | Lenguaje de consulta |
| | Jena Fuseki | Triplestore RDF |

---

## Flujo de una búsqueda

### Usuario busca: "Slashers de los 80s con RT > 80"

1. **Frontend:** Usuario selecciona filtros
   - Subgénero: Slasher
   - anioMin: 1980
   - anioMax: 1989
   - rtMin: 80

2. **React:** Actualiza estado
   ```typescript
   setFilters({ subgenero: 'Slasher', anioMin: 1980, anioMax: 1989, rtMin: 80 })
   ```

3. **API Call:** Frontend construye URL
   ```
   GET /api/peliculas?subgenero=Slasher&anioMin=1980&anioMax=1989&rtMin=80
   ```

4. **Backend:** Recibe request
   - Parsea query params
   - Construye SPARQL SELECT
   ```sparql
   SELECT ?pelicula ?titulo ?anio
   WHERE {
     ?pelicula rdf:type ont:Pelicula ;
       ont:titulo ?titulo ;
       ont:anioEstreno ?anio ;
       ont:tieneSubgenero [rdf:type ont:Slasher] ;
       ont:rt ?rt .
     FILTER (?anio >= 1980 && ?anio <= 1989 && ?rt >= 80)
   }
   ```

5. **Fuseki:** Ejecuta query
   - Busca películas en triplestore
   - Aplica filtros
   - Retorna resultados

6. **Backend:** Transforma RDF a JSON
   ```json
   [
     {
       "iri": "http://...#AQuietPlace2018",
       "titulo": "A Quiet Place",
       "anio": "2018"
     },
     ...
   ]
   ```

7. **Frontend:** Renderiza resultados
   - MovieList recibe array
   - Renderiza MovieCard por cada película

8. **Usuario hace clic:** Ve detalles
   - Segunda petición: `/api/peliculas/AQuietPlace2018`
   - Modal se abre con información completa

---

## Ventajas de la arquitectura

✅ **Separación de responsabilidades**
- Frontend: UI y UX
- Backend: Lógica de consultas
- Fuseki: Almacenamiento semántico

✅ **Escalabilidad**
- Frontend independiente del backend
- Backend fácil de cambiar para otros datos

✅ **Reutilización**
- API REST disponible para otros clientes
- Mismas consultas SPARQL para múltiples interfaces

✅ **Sem Fuerte tipado end-to-end**
- TypeScript en frontend y backend
- Interfaz clara de tipos

✅ **Búsqueda semántica potente**
- SPARQL permite consultas complejas
- Ontología estructurada facilita búsquedas precisas

---

## Mejoras futuras

- [ ] Caché en frontend (localStorage)
- [ ] Paginación de resultados
- [ ] Ordenamiento (por puntuación, año, etc.)
- [ ] Historial de búsquedas
- [ ] Exportar a CSV/JSON
- [ ] Recomendaciones basadas en similitud
- [ ] GraphQL como alternativa a REST
- [ ] SSR con Next.js
- [ ] Tests E2E
- [ ] Autenticación y permisos
