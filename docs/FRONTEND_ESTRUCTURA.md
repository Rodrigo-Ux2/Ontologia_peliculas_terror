# 📁 Estructura del Frontend

```
frontend/
│
├── 📄 package.json                 # Dependencias y scripts
├── 📄 tsconfig.json                # Configuración TypeScript
├── 📄 tsconfig.node.json           # TS config para Vite
├── 📄 vite.config.ts               # Vite: bundler + dev server + proxy
├── 📄 tailwind.config.js           # Estilos Tailwind
├── 📄 postcss.config.js            # PostCSS plugins
├── 📄 index.html                   # HTML base
├── 📄 README.md                    # Documentación
├── 📄 USAGE.md                     # Guía de uso
├── 📄 .gitignore                   # Git ignore rules
│
└── src/                            # Código fuente
    │
    ├── 📄 main.tsx                 # Punto de entrada React (importa i18n)
    ├── 📄 App.tsx                  # Componente principal
    │                               # - Estado global (filtros, películas, detalle)
    │                               # - parseSemanticSearch() 10+ keywords
    │                               # - Maneja pestañas Películas/SPARQL
    │                               # - Selector idioma + DBpedia mode
    ├── 📄 App.css                  # Estilos de App
    ├── 📄 index.css                # Estilos globales Tailwind
    │
    ├── i18n/                       # Internacionalización
    │   ├── 📄 index.ts             # Configuración i18next
    │   ├── 📄 es.json              # Traducciones español
    │   ├── 📄 en.json              # Traducciones inglés
    │   └── 📄 pt.json              # Traducciones portugués
    │
    ├── components/                 # Componentes React
    │   ├── 📄 FilterPanel.tsx      # Panel de filtros
    │   │                           # - Búsqueda semántica (texto libre)
    │   │                           # - 13 filtros facetados
    │   │                           # - Botón limpiar
    │   │
    │   ├── 📄 MovieList.tsx        # Lista de películas
    │   │                           # - Grid de 2 columnas
    │   │                           # - Estados: carga, vacío, resultados
    │   │
    │   ├── 📄 MovieCard.tsx        # Tarjeta de película
    │   │                           # - Título, año
    │   │                           # - Hover interactivo
    │   │
    │   ├── 📄 MovieDetailView.tsx  # Modal de detalles
    │   │                           # - Puntuaciones OWL [badge OWL]
    │   │                           # - Sinopsis traducida
    │   │                           # - Detalles técnicos/financieros OWL
    │   │                           # - Listas de créditos OWL
    │   │                           # - Panel DBpedia [badge DBpedia]
    │   │                           #   - Datos enriquecidos (budget, gross...)
    │   │                           #   - Todas las propiedades (allProperties)
    │   │                           #   - Badge online/offline
    │   │
    │   ├── 📄 SparqlConsole.tsx    # Consola SPARQL
    │   │                           # - Editor de texto
    │   │                           # - Botón ejecutar
    │   │                           # - Resultados en tabla
    │   │                           # - Soporte SELECT/ASK/UPDATE
    │   │
    │   └── 📄 Icon.tsx             # Iconos SVG
    │                               # - close, search, loading, play, database, movie
    │
    ├── services/                   # Servicios (lógica de negocio)
    │   └── 📄 api.ts               # Cliente HTTP (axios)
    │                               # - getMovies(filtros, lang?)
    │                               # - getMovieDetail(id)
    │                               # - getMovieDbpedia(id, mode, lang)
    │                               # - getTranslations(id, lang)
    │                               # - sparqlQuery(query)
    │
    └── types/                      # Tipos TypeScript
        └── 📄 index.ts             # Interfaces y constantes
                                    # - MovieListItem, MovieDetail
                                    # - DbpediaData, DbpediaProperty
                                    # - FilterOptions
                                    # - 6 listas de opciones dropdown
```

## Archivos por categoría

### 🎯 Configuración
- `package.json` - Dependencias y scripts npm
- `tsconfig.json` - Configuración de TypeScript
- `vite.config.ts` - Bundler Vite con proxy a API y React plugin
- `tailwind.config.js` - Configuración de Tailwind (colores, tema oscuro)
- `postcss.config.js` - PostCSS para Tailwind

### 🌐 Multi-idioma (i18n)
- `src/i18n/index.ts` - Configuración de i18next con react-i18next
- `src/i18n/es.json` - ~100 claves de traducción en español
- `src/i18n/en.json` - Traducciones al inglés
- `src/i18n/pt.json` - Traducciones al portugués

### 🧩 Componentes

| Archivo | Responsabilidad |
|---------|-----------------|
| FilterPanel.tsx | Formulario con 13 filtros + búsqueda semántica |
| MovieList.tsx | Lista de películas (grid 2 cols) |
| MovieCard.tsx | Tarjeta individual (clickeable, hover) |
| MovieDetailView.tsx | Modal con datos OWL + DBpedia + source badges |
| SparqlConsole.tsx | Editor SPARQL con resultados en tabla |
| Icon.tsx | SVG: close, search, loading, play, database, movie |

### 🔌 Servicios (`api.ts`)

| Método | Endpoint | Propósito |
|--------|----------|-----------|
| `getMovies(filters)` | `GET /api/peliculas` | Búsqueda con filtros |
| `getMovieDetail(id)` | `GET /api/peliculas/:id` | Detalle OWL |
| `getMovieDbpedia(id, mode, lang)` | `GET /api/peliculas/:id/dbpedia` | Datos DBpedia |
| `getTranslations(id, lang)` | `GET /api/peliculas/:id/translations` | Traducciones OWL |
| `sparqlQuery(query)` | `POST /api/sparql` | Consulta SPARQL directa |

### 📦 Tipos (`index.ts`)

| Interfaz | Campos principales |
|----------|-------------------|
| `MovieListItem` | iri, titulo, anio |
| `MovieDetail` | id, titulo, sinopsis, directores, actores... |
| `DbpediaData` | budget, gross, directors, actors, **allProperties**, source |
| `DbpediaProperty` | predicate, values[] |
| `FilterOptions` | anioMin, nivelGoreMin, tipoMonstruo, subgenero, q... |

## Conexiones principales

```
App.tsx
├── Estado global
│   ├── filters (FilterOptions)
│   ├── movies (MovieListItem[])
│   ├── selectedMovie (MovieDetail)
│   ├── dbpediaData (DbpediaData | null)
│   ├── dbpediaMode (auto | online | offline)
│   ├── tab (movies | sparql)
│   └── lang (es | en | pt via i18n)
│
├── Efecto: watchEffect en filtros
│   └── → getMovies(filters) → setMovies
│
├── Handler: handleMovieClick(movieId)
│   └── Promise.all([
│         getMovieDetail(movieId),
│         getMovieDbpedia(movieId, dbpediaMode, lang)
│       ])
│   └── → setSelectedMovie + setDbpediaData
│
├── Handler: handleFilterChange(nextFilters)
│   └── parseSemanticSearch(nextFilters.q)
│       → extrae: año, gore, monstruo, subgenero, escenario,
│                  país, idioma, clasificación, hechos reales
│       → setFilters({ ...filtros exactos, q: texto_limpio })
│
├── Render > Pestaña Películas
│   ├── <FilterPanel>
│   ├── <MovieList> → onMovieClick
│   └── <MovieDetailView> (modal, recibe movie + dbpediaData)
│
└── Render > Pestaña SPARQL
    └── <SparqlConsole> + ejemplos rápidos
```

## Stack de tecnologías

```
Frontend Stack
│
├── Build & Dev
│   ├── Vite 5 (bundler + HMR)
│   ├── Node.js 20+
│   └── npm
│
├── Frameworks
│   ├── React 18 (UI)
│   ├── TypeScript 5.3 (tipado)
│   └── Tailwind CSS 3.3 (estilos)
│
├── HTTP & Async
│   └── Axios (HTTP client)
│
├── Internacionalización
│   ├── i18next
│   └── react-i18next
│
└── Utilities
    ├── PostCSS + Autoprefixer
    └── React DOM
```

## URLs importantes

| Componente | URL | Propósito |
|-----------|-----|----------|
| Frontend | http://localhost:5173 | App React |
| Backend | http://localhost:4000 | API REST |
| Fuseki | http://localhost:3030 | Triplestore RDF |

## Scripts disponibles

```bash
npm run dev      # Desarrollo (hot reload)
npm run build    # Producción (tsc + vite build)
npm run preview  # Previsualizar build
```

## Instalación típica

```bash
# 1. Entrar a directorio
cd frontend

# 2. Instalar dependencias (primera vez)
npm install

# 3. Desarrollo
npm run dev
```

## Notas de implementación

- ✅ Todos los tipos están tipados en TypeScript
- ✅ Proxy configurado en Vite (`/api` → `localhost:4000`)
- ✅ Debounce (500ms) en búsqueda para evitar spam de requests
- ✅ Responsive: mobile, tablet, desktop
- ✅ Tema oscuro optimizado para terror
- ✅ Modal no bloqueante (se cierra con X)
- ✅ Manejo de errores en API calls
- ✅ Estados de carga y vacío
- ✅ Búsqueda por palabras sueltas (con stopwords)
- ✅ Detección semántica de año, gore, suspenso, país, idioma, etc.
- ✅ Selector de idioma ES/EN/PT en header
- ✅ Selector modo DBpedia Auto/Online/Offline
- ✅ Badges de origen OWL vs DBpedia en detalle
- ✅ Traducciones de datos OWL desde endpoint
- ✅ Consola SPARQL integrada
