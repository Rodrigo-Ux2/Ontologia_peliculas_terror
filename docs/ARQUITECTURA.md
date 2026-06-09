# Arquitectura del Sistema

## Visión general

El sistema combina una **ontología OWL** local con datos enriquecidos de **DBpedia**, accesibles mediante consultas **SPARQL**. Soporta múltiples idiomas (ES/EN/PT) y modos online/offline.

---

## Flujo de datos

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               NAVEGADOR DEL USUARIO                               │
│                                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────────┐     │
│  │                     FRONTEND REACT (Puerto 5173)                         │     │
│  │                                                                          │     │
│  │  ┌─────────────────┐ ┌──────────────────┐ ┌────────────────────────┐   │     │
│  │  │ FilterPanel      │ │ MovieList        │ │ SparqlConsole         │   │     │
│  │  │ (filtros +      │ │ (lista resultados)│ │ (editor SPARQL)      │   │     │
│  │  │  busqueda texto) │ │ + MovieCard      │ └────────────────────────┘   │     │
│  │  └────────┬────────┘ └────────┬─────────┘                               │     │
│  │           │                    │                                         │     │
│  │           ▼                    ▼                                         │     │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │     │
│  │  │                         App.tsx                                  │   │     │
│  │  │  - Estado global (filtros, resultados, detalle)                 │   │     │
│  │  │  - parseSemanticSearch() (extracion de keywords del texto)      │   │     │
│  │  │  - Selector idioma (ES/EN/PT) via i18n                          │   │     │
│  │  │  - Selector modo DBpedia (Auto/Online/Offline)                  │   │     │
│  │  └──────────────────────────────────────────────────────────────────┘   │     │
│  │                                                                          │     │
│  │  ┌──────────────────────────────────────────────────────────────────┐   │     │
│  │  │  MovieDetailView (Modal)                                        │   │     │
│  │  │  ┌─────────────────────────────────────┐                        │   │     │
│  │  │  │ Datos OWL [badge OWL]              │ ← siempre del OWL      │   │     │
│  │  │  │ - Puntuaciones, duracion, pais...   │                        │   │     │
│  │  │  ├─────────────────────────────────────┤                        │   │     │
│  │  │  │ Datos DBpedia [badge DBpedia]      │ ← de DBpedia/Fuseki    │   │     │
│  │  │  │ - Presupuesto, recaudacion, etc.   │                        │   │     │
│  │  │  │ - Todas las propiedades DBpedia     │                        │   │     │
│  │  │  └─────────────────────────────────────┘                        │   │     │
│  │  └──────────────────────────────────────────────────────────────────┘   │     │
│  └──────────────────────┬───────────────────────────────────────────────────┘     │
│                         │                                                         │
│                         ▼                                                         │
│              ┌────────────────────────────────────┐                              │
│              │      API HTTP (axios)              │                              │
│              │                                    │                              │
│              │ GET /api/peliculas?q=...&filtros   │                              │
│              │ GET /api/peliculas/:id             │                              │
│              │ GET /api/peliculas/:id/dbpedia     │                              │
│              │ GET /api/peliculas/:id/translations│                              │
│              │ POST /api/sparql                   │                              │
│              └──────────────┬─────────────────────┘                              │
└─────────────────────────────┼─────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND EXPRESS (Puerto 4000)                             │
│                                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐ │
│  │ routes/peliculas.ts  │  │ routes/sparql.ts     │  │ sparql/               │ │
│  │ - /peliculas         │  │ - POST /api/sparql   │  │  client.ts            │ │
│  │ - /peliculas/:id     │  │   (proxy a Fuseki)   │  │  queries.ts           │ │
│  │ - /peliculas/:id/    │  └──────────────────────┘  │  dbpedia.ts           │ │
│  │   dbpedia            │                            │  translations.ts      │ │
│  │ - /peliculas/:id/    │                            └────────────────────────┘ │
│  │   translations       │                                                        │
│  └──────────────────────┘                                                        │
└──────┬──────────────────────────────┬─────────────────────────────────────────────┘
       │                              │
       │ SPARQL                       │ HTTP
       │ (SELECT/ASK/UPDATE)          │ (queries a DBpedia)
       ▼                              ▼
┌─────────────────┐       ┌──────────────────────┐
│ Apache Jena     │       │ DBpedia SPARQL       │
│ Fuseki          │       │ Endpoint (online)    │
│ (Puerto 3030)   │       │ https://dbpedia.org  │
│                 │       └──────────────────────┘
│ 3 ontologias    │              │ offline cache
│ cargadas:       │              ▼
│ 1. Ontologia    │       ┌──────────────────────┐
│    original     │       │ backend/data/        │
│    (4168 triples)│      │  dbpedia-cache.json  │
│ 2. owl:sameAs   │       │  (para regenerar     │
│    (55 enlaces) │       │   ontologia DBpedia)  │
│ 3. Ontologia    │       │                        │
│    DBpedia      │       │ owl-translations.json │
│    (+traducciones)│     │  (para regenerar      │
└─────────────────┘       │   traducciones OWL)   │
                          └──────────────────────┘
```

---

## Componentes del backend

### Módulos SPARQL

| Archivo | Función |
|---------|---------|
| `client.ts` | Cliente HTTP hacia Fuseki (`sparqlSelect`) |
| `queries.ts` | Construcción de queries SPARQL (`buildBusquedaPeliculas`, `buildDetallePelicula`) |
| `dbpedia.ts` | Servicio DBpedia: online (vivo), offline (Fuseki), cache, descarga |
| `translations.ts` | Traducciones OWL: busca en Fuseki via `FILTER(LANG(?val) = "en")` |

### Flujo de búsqueda (GET /api/peliculas)

```
Frontend envía q + filtros
  → Backend parsea (año, gore, monstruo, subgenero, etc.)
  → buildBusquedaPeliculas() genera SPARQL con:
     - Filtros exactos (anio, gore, monstruo, subgenero...)
     - Búsqueda por palabras sueltas en 10 campos (UNION)
     - Stopwords filtradas
  → Fuseki ejecuta query
  → Devuelve resultados
```

### Flujo DBpedia (GET /api/peliculas/:id/dbpedia)

```
Frontend solicita datos DBpedia (mode + lang)
  └→ Auto: intenta offline (Fuseki), fallback a online (DBpedia)
  └→ Online: query SPARQL directo a DBpedia
  └→ Offline: query SPARQL a Fuseki (ontologia DBpedia)

Online query:
  → 3 queries paralelas a DBpedia:
     q1: datos base (thumbnail, abstract, budget, gross...)
        + personas (director, actor, writer)
     q2a: genero, productor, company
     q2b: distribuidor, musica
     + fallback: dbp:budget/gross/runtime
     + allProperties (todas las dbo: y dbp: disponibles)
  → Devuelve resultados estructurados
```

---

## Sistema multi-idioma

### Capas de traducción

| Capa | Qué traduce | Tecnología |
|------|-------------|------------|
| **UI** | Botones, labels, menús | `i18next` + `react-i18next` (JSON) |
| **DBpedia** | Sinopsis, labels de personas/géneros | `FILTER(LANG(?val) = "en")` |
| **OWL** | Sinopsis, ambientación, estilo, clasificación | Google Translate cache (`owl-translations.json`) |

### Diccionarios OWL para valores fijos

Los valores categóricos (clasificación, subgéneros, monstruos) se traducen mediante el cache `owl-translations.json`, generado con `npm run translate-owl`.

---

## Ontologías

### 1. `OntologiaPeliculasTerror.owl` (original)
- Creada con Protégé
- 46 clases, 555 individuos, 4168 triples
- Contiene: gore, suspenso, monstruos, plataformas, subgéneros, etc.

### 2. `dbpedia-links.ttl`
- 55 enlaces `owl:sameAs` entre individuos locales y DBpedia

### 3. `OntologiaPeliculasTerrorDbpedia.owl` (DBpedia)
- Generada automáticamente desde `dbpedia-cache.json`
- Mismo namespace que la original (se fusionan en Fuseki)
- Contiene: sinopsis traducida (es/en/pt), directores, actores, presupuesto, etc.

---

## Stack tecnológico actualizado

| Capa | Tecnología | Propósito |
|------|-----------|----------|
| Frontend | React 18 + TypeScript | UI componentes |
| | Tailwind CSS + Vite | Estilos y bundler |
| | i18next + react-i18next | Traducciones UI |
| | Axios | HTTP client |
| Backend | Express + TypeScript | Servidor web |
| | SPARQL 1.1 | Lenguaje de consulta |
| | Jena Fuseki 6.1.0 | Triplestore RDF |
| Datos externos | DBpedia SPARQL | Enriquecimiento online/offline |
| | Google Translate (@iamtraction) | Traducción OWL (cache) |
| Runtime | Node.js 20+ | Backend y frontend |
| | Java 17+ | Fuseki |

---

## Mejoras ya implementadas

- [x] Consola SPARQL interactiva en frontend
- [x] Endpoint SPARQL proxy (`POST /api/sparql`)
- [x] Datos enriquecidos de DBpedia (presupuesto, directores, actores...)
- [x] Modos auto/online/offline
- [x] Cache offline
- [x] Multi-idioma (es/en/pt)
- [x] Traducción de datos OWL
- [x] Búsqueda semántica en 10 campos
- [x] Búsqueda por palabras sueltas
- [x] Detección semántica desde texto (año, gore, país...)
- [x] Badges de origen (OWL vs DBpedia)
- [x] Todas las propiedades DBpedia (allProperties)
- [x] Ontología DBpedia separada con mismo namespace

## Mejoras futuras

- [ ] Paginación de resultados
- [ ] Ordenamiento (por puntuación, año, etc.)
- [ ] Historial de búsquedas
- [ ] Exportar a CSV/JSON
- [ ] Tests E2E
- [ ] Autenticación y permisos
