# 📖 Índice de documentación

## 🚀 Inicio (Empieza aquí)

1. **[QUICK_START.md](QUICK_START.md)** - 5 minutos para tener todo corriendo
   - Requisitos mínimos
   - Pasos exactos para Terminal 1-4
   - Verificación de DBpedia, i18n y SPARQL

2. **[CHECKLIST.md](CHECKLIST.md)** - Verificar que todo funciona
   - Paso a paso de setup (incluye DBpedia)
   - 15 pruebas funcionales
   - Troubleshooting

3. **[README.md](../README.md)** - Descripción general del proyecto
   - Contexto y objetivos
   - Stack tecnológico
   - Estructura del proyecto

---

## 💻 Usando el sistema

### 🎮 Frontend (Interfaz de usuario)
- **[frontend/README.md](../frontend/README.md)** - Documentación completa del frontend
  - Características
  - Instalación y configuración
  - Tecnologías usadas
  - Troubleshooting

- **[frontend/USAGE.md](../frontend/USAGE.md)** - Guía práctica de uso
  - Descripción de la interfaz
  - Ejemplos de búsquedas
  - Tips y trucos
  - Desarrollo

### 🔌 API REST (Backend)
- **[API_FILTROS.md](API_FILTROS.md)** - Referencia de endpoints
  - GET /api/peliculas (búsqueda semántica en 10 campos)
  - GET /api/peliculas/:id (detalles OWL)
  - GET /api/peliculas/:id/dbpedia (datos DBpedia)
  - GET /api/peliculas/:id/translations (traducciones)
  - POST /api/sparql (consola SPARQL)
  - Detección semántica desde texto

---

## 🏗️ Arquitectura y diseño

- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Cómo funciona el sistema completo
  - Flujo de datos (diagrama ASCII con DBpedia e i18n)
  - Componentes principales
  - Sistema multi-idioma (3 capas de traducción)
  - 3 ontologías cargadas en Fuseki
  - Mejoras implementadas vs futuras

- **[FRONTEND_ESTRUCTURA.md](FRONTEND_ESTRUCTURA.md)** - Detalles del código del frontend
  - Árbol de carpetas (incluye i18n, SparqlConsole)
  - 5 servicios API vs 2 originales
  - Conexiones entre componentes
  - Notas de implementación

---

## 📚 Referencia rápida

### Comandos principales

**Terminal 1: Fuseki**
```bash
cd ~/apache-jena-fuseki-6.1.0
./fuseki-server --update --mem /peliculas
```

**Terminal 2: Cargar 3 ontologías en Fuseki**
```bash
cd Ontologia_peliculas_terror
# 1. Ontología original (4168 triples)
curl -X POST http://localhost:3030/peliculas/data --upload-file ontologia.rdf -H "Content-Type: application/rdf+xml"
# 2. Enlaces DBpedia
curl -X POST http://localhost:3030/peliculas/data --upload-file backend/dbpedia-links.ttl -H "Content-Type: text/turtle"
# 3. Ontología DBpedia con traducciones
curl -X POST http://localhost:3030/peliculas/data --upload-file OntologiaPeliculasTerrorDbpedia.owl -H "Content-Type: application/rdf+xml"
```

**Terminal 3: Backend**
```bash
cd backend
npm install
npm run dev
```

**Terminal 4: Frontend**
```bash
cd frontend
npm install
npm run dev
```

### URLs de acceso

| Componente | URL |
|-----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:4000 |
| Fuseki Admin | http://localhost:3030 |

### Parámetros de búsqueda principales

| Tipo | Parámetro | Ejemplo |
|------|-----------|---------|
| Texto semántico | `q` | `?q=ghost+1990+españa` |
| Año | `anioMin`, `anioMax` | `?anioMin=1980&anioMax=1989` |
| Gore | `nivelGoreMin` | `?nivelGoreMin=7` |
| Suspenso | `nivelSuspensoMin` | `?nivelSuspensoMin=8` |
| Rating | `rtMin`, `puntuacionMin` | `?rtMin=80&puntuacionMin=75` |
| Categoría | `subgenero`, `tipoMonstruo` | `?subgenero=Slasher` |
| Plataforma | `plataforma` | `?plataforma=Netflix` |
| Origen | `pais`, `idioma` | `?pais=Japón&idioma=Japonés` |
| Edad | `clasificacionEdad` | `?clasificacionEdad=Mayores de 18` |
| Booleano | `basadaEnHechosReales` | `?basadaEnHechosReales=true` |

### Scripts útiles (backend)

| Comando | Función |
|---------|---------|
| `npm run download-dbpedia` | Regenerar cache DBpedia |
| `npm run translate-owl` | Regenerar traducciones OWL |
| `npm run create-owl-dbpedia` | Regenerar ontología DBpedia |

---

## 🛠️ Desarrollo

### Estructura de carpetas del proyecto

```
Ontologia_peliculas_terror/
├── OntologiaPeliculasTerror.owl       # Ontología original (Protégé)
├── OntologiaPeliculasTerrorDbpedia.owl # Ontología DBpedia (generada)
├── README.md                          # Documentación principal
├── scripts/
│   └── crear-ontologia-dbpedia.py     # Script generación ontología DBpedia
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── peliculas.ts           # Endpoints REST
│   │   │   └── sparql.ts              # Proxy SPARQL
│   │   └── sparql/
│   │       ├── client.ts              # Cliente Fuseki
│   │       ├── queries.ts             # Constructor SPARQL
│   │       ├── dbpedia.ts             # Servicio DBpedia (online/offline)
│   │       └── translations.ts        # Traducciones OWL
│   ├── data/
│   │   ├── dbpedia-cache.json         # Cache DBpedia (55 películas)
│   │   └── owl-translations.json      # Traducciones OWL
│   └── dbpedia-links.ttl              # 55 enlaces owl:sameAs
├── frontend/
│   └── src/
│       ├── i18n/                      # Traducciones UI (es/en/pt)
│       ├── components/
│       │   ├── SparqlConsole.tsx       # Consola SPARQL
│       │   ├── MovieDetailView.tsx     # Modal con badges OWL/DBpedia
│       │   └── ...                     # FilterPanel, MovieList, etc.
│       └── services/
│           └── api.ts                 # 5 métodos vs 2 originales
└── docs/
    ├── QUICK_START.md              # ← Empieza aquí
    ├── CHECKLIST.md                # Verificar setup
    ├── API_FILTROS.md              # Endpoints
    ├── ARQUITECTURA.md             # Diseño del sistema
    ├── FRONTEND_ESTRUCTURA.md      # Código del frontend
    └── INDICE.md                   # Este archivo
```

---

## 🆘 Ayuda rápida

**¿Por dónde empiezo?**
→ [QUICK_START.md](QUICK_START.md)

**¿Algo no funciona?**
→ [CHECKLIST.md](CHECKLIST.md) → Troubleshooting

**¿Cómo uso la interfaz?**
→ [frontend/USAGE.md](../frontend/USAGE.md)

**¿Cómo funciona todo?**
→ [ARQUITECTURA.md](ARQUITECTURA.md)

**¿Cómo llamo a la API?**
→ [API_FILTROS.md](API_FILTROS.md)

**¿Cómo es el código del frontend?**
→ [FRONTEND_ESTRUCTURA.md](FRONTEND_ESTRUCTURA.md)

---

## 📋 Resumen de características

| Característica | Estado |
|---|---|
| 🔍 **Búsqueda facetada** (13 filtros) | ✅ |
| 🎨 **Interfaz React + Tailwind CSS** | ✅ |
| 📊 **OWL + RDF + SPARQL** | ✅ |
| 🔗 **DBpedia online** (datos enriquecidos) | ✅ |
| 📁 **DBpedia offline** (desde Fuseki) | ✅ |
| 🏷️ **Badges OWL vs DBpedia** | ✅ |
| 🌐 **Multi-idioma** (es/en/pt) | ✅ |
| 📝 **Traducción de datos OWL** | ✅ |
| 📋 **Todas las propiedades DBpedia** | ✅ |
| 🖥️ **Consola SPARQL integrada** | ✅ |
| 🔎 **Búsqueda semántica** (10 campos) | ✅ |
| 🧠 **Detección semántica desde texto** (año, gore, país...) | ✅ |
| 🗃️ **Ontología DBpedia separada** | ✅ |
| ⚡ **Tiempo real** (debounce 500ms) | ✅ |
| 📱 **Responsive** | ✅ |
| 🔗 **API REST** (5 endpoints) | ✅ |

---

## 📝 Versiones

- **Frontend**: React 18.2+, TypeScript 5.3+, Vite 5.0+, Tailwind 3.3+
- **Backend**: Express 5.2+, TypeScript 5.3+
- **Datos**: Apache Jena Fuseki 6.1.0, DBpedia SPARQL
- **Runtime**: Node.js 20+, Java 17+
- **Multi-idioma**: i18next + react-i18next
- **Traducción OWL**: Google Translate (cache)

---

## ✅ Checklist de documentación

- [x] QUICK_START.md - Guía de 5 minutos (actualizado con DBpedia)
- [x] CHECKLIST.md - 15 pruebas funcionales
- [x] README.md - Descripción general
- [x] API_FILTROS.md - 5 endpoints + detección semántica
- [x] ARQUITECTURA.md - Diagrama completo con DBpedia e i18n
- [x] FRONTEND_ESTRUCTURA.md - Código del frontend actualizado
- [x] frontend/README.md - Frontend docs
- [x] frontend/USAGE.md - Guía de uso
- [x] INDICE.md - Este archivo

**Última actualización**: Junio 2026

---

## 🎯 Ejemplos rápidos

### CLI: Búsqueda semántica
```bash
curl "http://localhost:4000/api/peliculas?q=ghost+1990+españa"
```

### CLI: DBpedia online
```bash
curl "http://localhost:4000/api/peliculas/TheShining1980/dbpedia?mode=online&lang=en"
```

### CLI: Traducciones
```bash
curl "http://localhost:4000/api/peliculas/TheShining1980/translations?lang=pt"
```

### CLI: Consola SPARQL
```bash
curl -X POST http://localhost:4000/api/sparql \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT ?p ?t WHERE { ?p a <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#Pelicula> OPTIONAL { ?p <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#titulo> ?t } } LIMIT 5"}'
```

### Browser: Acceder al frontend
```
http://localhost:5173
```

---

**¿Listo para empezar? → [QUICK_START.md](QUICK_START.md)** 🚀
