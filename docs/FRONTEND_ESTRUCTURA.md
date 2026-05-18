# 📁 Estructura del Frontend

```
frontend/
│
├── 📄 package.json                 # Dependencias y scripts
├── 📄 tsconfig.json                # Configuración TypeScript
├── 📄 tsconfig.node.json           # TS config para Vite
├── 📄 vite.config.ts               # Vite: bundler + dev server
├── 📄 tailwind.config.js           # Estilos Tailwind
├── 📄 postcss.config.js            # PostCSS plugins
├── 📄 index.html                   # HTML base
├── 📄 README.md                    # Documentación
├── 📄 USAGE.md                     # Guía de uso
├── 📄 .gitignore                   # Git ignore rules
├── 📄 .env.example                 # Variables de entorno
│
└── src/                            # Código fuente
    │
    ├── 📄 main.tsx                 # Punto de entrada React
    ├── 📄 App.tsx                  # Componente principal
    │                               # Gestiona estado global
    ├── 📄 App.css                  # Estilos de App
    ├── 📄 index.css                # Estilos globales
    │
    ├── components/                 # Componentes React
    │   ├── 📄 FilterPanel.tsx      # Panel de filtros
    │   │                           # - Búsqueda de texto
    │   │                           # - 13 filtros diferentes
    │   │                           # - Botón limpiar
    │   │
    │   ├── 📄 MovieList.tsx        # Lista de películas
    │   │                           # - Renderiza películas
    │   │                           # - Estado de carga
    │   │                           # - Mensaje vacío
    │   │
    │   ├── 📄 MovieCard.tsx        # Tarjeta de película
    │   │                           # - Título y año
    │   │                           # - Hover interactivo
    │   │
    │   ├── 📄 MovieDetailView.tsx  # Modal de detalles
    │   │                           # - Puntuaciones (4 tarjetas)
    │   │                           # - Sinopsis
    │   │                           # - Detalles técnicos/financieros
    │   │                           # - Listas de credits
    │   │
    │   └── 📄 Icon.tsx             # Iconos SVG
    │                               # - close, search, loading
    │
    ├── services/                   # Servicios (lógica de negocio)
    │   └── 📄 api.ts               # Cliente HTTP
    │                               # - movieService.getMovies()
    │                               # - movieService.getMovieDetail()
    │
    └── types/                      # Tipos TypeScript
        └── 📄 index.ts             # Interfaces y constantes
                                    # - MovieListItem
                                    # - MovieDetail
                                    # - FilterOptions
                                    # - 6 listas de opciones
```

## Archivos por categoría

### 🎯 Configuración
- `package.json` - Dependencias y scripts npm
- `tsconfig.json` - Configuración de TypeScript
- `vite.config.ts` - Bundler Vite con proxy a API
- `tailwind.config.js` - Configuración de Tailwind (colores, tema)
- `postcss.config.js` - PostCSS para Tailwind

### 🎨 Estilos
- `src/index.css` - Global styles con Tailwind
- `src/App.css` - Estilos específicos de App
- Configuración de scrollbar y animaciones

### 📄 React + TypeScript
- `src/main.tsx` - Bootstrap React DOM
- `src/App.tsx` - Componente root
  - Gestiona estado de filtros, películas, detalles
  - Orquesta llamadas a API
  - Layout principal (grid de 3 columnas)

### 🧩 Componentes
| Archivo | Responsabilidad |
|---------|-----------------|
| FilterPanel.tsx | Formulario con 13 filtros |
| MovieList.tsx | Lista de películas + carga/vacío |
| MovieCard.tsx | Tarjeta individual (clickeable) |
| MovieDetailView.tsx | Modal con detalles completos |
| Icon.tsx | Iconos SVG reutilizables |

### 🔌 Servicios
- `api.ts` - Cliente Axios
  - Gestiona parámetros de query
  - Dos métodos: getMovies, getMovieDetail

### 📦 Tipos
- `index.ts` - TypeScript interfaces
  - Tipos de datos principales
  - Arrays de opciones (6 dropdowns)

## Conexiones principales

```
App.tsx
├── Estado: filtros, películas, selectedMovie
├── Efecto: watchEffect en filtros
│   └── → movieService.getMovies(filtros)
│       └── → setMovies(resultados)
│
├── Handler: handleMovieClick(movieId)
│   └── → movieService.getMovieDetail(movieId)
│       └── → setSelectedMovie(detalle)
│
├── Render: <FilterPanel> → onChange → setFilters
├── Render: <MovieList> → onMovieClick → handleMovieClick
└── Render: <MovieDetailView> → onClose → setSelectedMovie(null)
```

## Stack de tecnologías

```
Frontend Stack
│
├── Build & Dev
│   ├── Vite 5 (bundler)
│   ├── Node.js 20+ (runtime)
│   └── npm (package manager)
│
├── Frameworks
│   ├── React 18 (UI library)
│   ├── TypeScript 5.3 (tipado)
│   └── Tailwind CSS 3.3 (styling)
│
├── HTTP & Async
│   ├── Axios (HTTP client)
│   └── Fetch API (alternativa)
│
└── Utilities
    ├── PostCSS (CSS preprocessing)
    ├── Autoprefixer (browser compatibility)
    └── React DOM (rendering)
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
npm run build    # Producción (minificado)
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
- ✅ Proxy configurado en Vite (simplifica URLs)
- ✅ Debounce (500ms) para evitar spam de requests
- ✅ Responsive: mobile, tablet, desktop
- ✅ Tema oscuro optimizado para terror
- ✅ Modal no bloqueante (se cierra con X)
- ✅ Manejo de errores en API calls
- ✅ Estados de carga y vacío
