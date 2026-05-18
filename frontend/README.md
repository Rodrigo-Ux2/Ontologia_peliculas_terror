# Frontend - Buscador Semántico de Películas de Terror

Frontend interactivo en React + TypeScript para explorar películas de terror usando una ontología OWL y consultas SPARQL.

## Características

- 🔍 **Búsqueda facetada**: Filtra películas por múltiples criterios simultáneamente
- 🎬 **Detalles completos**: Visualiza información completa de cada película
- 📊 **Puntuaciones**: Muestra Gore, Suspenso, Puntuación propia y Rotten Tomatoes
- 🌐 **Filtros semánticos**: País, idioma, plataforma, subgénero, tipo de monstruo
- ⚡ **Búsqueda en tiempo real**: Filtros con debounce para mejor rendimiento
- 🎨 **Interfaz moderna**: Diseño oscuro con Tailwind CSS

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── FilterPanel.tsx  # Panel de filtros
│   │   ├── MovieList.tsx    # Lista de películas
│   │   ├── MovieCard.tsx    # Tarjeta de película
│   │   ├── MovieDetailView.tsx # Modal de detalle
│   │   └── Icon.tsx         # Iconos reutilizables
│   ├── services/
│   │   └── api.ts           # Servicio HTTP a la API
│   ├── types/
│   │   └── index.ts         # Tipos TypeScript
│   ├── App.tsx              # Componente principal
│   ├── App.css              # Estilos de App
│   ├── index.css            # Estilos globales
│   └── main.tsx             # Entrada de React
├── index.html               # HTML base
├── package.json
├── tsconfig.json
├── vite.config.ts           # Configuración de Vite
└── tailwind.config.js       # Configuración de Tailwind
```

## Instalación

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar la API

El frontend se conecta a `http://localhost:4000/api` por defecto. Asegúrate de que:
- El backend esté corriendo en puerto 4000
- Fuseki esté disponible en el endpoint configurado

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Accede a `http://localhost:5173` en tu navegador.

### 4. Construir para producción

```bash
npm run build
npm run preview
```

## Filtros Disponibles

### Búsqueda de texto
- **q**: Busca en el título de la película

### Rango de años
- **anioMin**: Año mínimo de estreno
- **anioMax**: Año máximo de estreno

### Puntuaciones y niveles
- **nivelGoreMin**: Nivel de gore mínimo (1-10)
- **nivelSuspensoMin**: Nivel de suspenso mínimo (1-10)
- **puntuacionMin**: Puntuación mínima (1-100)
- **rtMin**: Rotten Tomatoes mínimo (1-100)

### Categorías
- **tipoMonstruo**: AsesinoSerial, Demonio, Extraterrestre, Fantasma, HombreLobo, Monstruo_Fisico, Vampiro, Zombi
- **subgenero**: BodyHorror, ComediaTerror, FoundFootage, Slasher, Sobrenatural, TerrorHistorico, TerrorPsicologico, TerrorSupervivencia
- **plataforma**: HBOmax, Mubi, Netflix, ParamountPlus, PrimeVideo, Shudder, StarPlus
- **pais**: Alemania, Australia, España, Estados Unidos, Francia, Italia, Japón, Reino Unido, etc.
- **idioma**: Alemán, Español, Inglés, Italiano, Japonés, etc.
- **clasificacionEdad**: Mayores de 13, Mayores de 16, Mayores de 18, No apta menores, Todos los públicos

### Especiales
- **basadaEnHechosReales**: Películas basadas en hechos reales

## Ejemplos de Búsquedas

### Slashers de los años 80 con excelentes críticas
1. Establece `anioMin: 1980` y `anioMax: 1989`
2. Selecciona `subgenero: Slasher`
3. Establece `rtMin: 80`

### Terror japonés sobrenatural
1. Selecciona `pais: Japón`
2. Selecciona `tipoMonstruo: Fantasma`

### Películas intensas en Netflix
1. Selecciona `plataforma: Netflix`
2. Establece `nivelGoreMin: 7`
3. Establece `nivelSuspensoMin: 8`

### Películas basadas en hechos reales
1. Marca el checkbox "Basada en hechos reales"

## Componentes Principales

### FilterPanel
Panel lateral con todos los filtros disponibles. Los cambios se aplican automáticamente con debounce.

### MovieList
Muestra la lista de películas encontradas. Permite clickear en una película para ver detalles.

### MovieCard
Tarjeta individual de película con título y año. Hover interactivo.

### MovieDetailView
Modal que muestra todos los detalles de una película:
- Puntuaciones (propia, RT, Gore, Suspenso)
- Sinopsis
- Información técnica (duración, país, idioma, clasificación)
- Datos económicos (presupuesto, recaudación)
- Listas de directores, actores, guionistas
- Subgéneros, tipos de monstruos, plataformas

## Tecnologías

- **React 18**: Framework UI
- **TypeScript**: Tipado estático
- **Vite**: Bundler y dev server
- **Tailwind CSS**: Framework de estilos
- **Axios**: Cliente HTTP
- **PostCSS**: Procesador de CSS

## API Endpoints

El frontend consume los siguientes endpoints:

```
GET /api/peliculas?filtros       # Lista de películas
GET /api/peliculas/:id            # Detalle de película
```

Ver [API_FILTROS.md](../docs/API_FILTROS.md) para documentación completa.

## Desarrollo

### Agregar un nuevo filtro

1. Actualiza `FilterOptions` en `src/types/index.ts`
2. Agrega la opción a `FilterPanel.tsx`
3. Actualiza `movieService.getMovies()` en `src/services/api.ts`

### Personalizar estilos

Usa Tailwind CSS classes. Los colores principales están configurados en `tailwind.config.js`.

## Troubleshooting

**Error: "Cannot reach API"**
- Verifica que el backend esté corriendo en puerto 4000
- Comprueba la configuración de CORS en el backend

**Las películas no cargan**
- Asegúrate de que Fuseki esté disponible
- Revisa la consola del navegador para errores específicos

**Estilos no aplicados**
- Ejecuta `npm run build` para reconstruir
- Limpia el caché del navegador

## Próximas Mejoras

- [ ] Agregar ordenamiento de resultados
- [ ] Implementar paginación
- [ ] Guardar búsquedas favoritas
- [ ] Exportar resultados a CSV/JSON
- [ ] Dark/Light mode toggle
- [ ] Soporte multiidioma
