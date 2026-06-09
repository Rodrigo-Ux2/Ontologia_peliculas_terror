# API — Referencia de filtros y búsquedas

Base URL: `http://localhost:4000/api`

---

## GET /api/peliculas

Devuelve lista de películas. Todos los parámetros son opcionales y combinables entre sí.

### Respuesta

```json
[
  {
    "iri":    "http://...#AQuietPlace2018",
    "titulo": "A Quiet Place",
    "anio":   "2018"
  }
]
```

### Filtros disponibles

#### Rango de año

| Parámetro | Tipo   | Descripción            |
|-----------|--------|------------------------|
| `anioMin` | número | Año de estreno mínimo  |
| `anioMax` | número | Año de estreno máximo  |

```
GET /api/peliculas?anioMin=1980&anioMax=1989
```

---

#### Puntuaciones y niveles

| Parámetro        | Tipo   | Rango | Descripción                   |
|------------------|--------|-------|-------------------------------|
| `nivelGoreMin`   | número | 1–10  | Nivel de gore mínimo          |
| `nivelSuspensoMin` | número | 1–10 | Nivel de suspenso mínimo     |
| `puntuacionMin`  | número | 1–100 | Puntuación propia mínima      |
| `rtMin`          | número | 1–100 | Rotten Tomatoes mínimo        |

```
GET /api/peliculas?nivelGoreMin=8
GET /api/peliculas?rtMin=90&puntuacionMin=75
```

---

#### Tipo de monstruo

| Parámetro      | Tipo   | Valores válidos |
|----------------|--------|-----------------|
| `tipoMonstruo` | string | `AsesinoSerial` `Demonio` `Extraterrestre` `Fantasma` `HombreLobo` `Monstruo_Fisico` `Vampiro` `Zombi` |

```
GET /api/peliculas?tipoMonstruo=Fantasma
GET /api/peliculas?tipoMonstruo=Vampiro&anioMin=1990
```

---

#### Subgénero

| Parámetro   | Tipo   | Valores válidos |
|-------------|--------|-----------------|
| `subgenero` | string | `BodyHorror` `ComediaTerror` `FoundFootage` `Slasher` `Sobrenatural` `TerrorHistorico` `TerrorPsicologico` `TerrorSupervivencia` |

```
GET /api/peliculas?subgenero=Slasher
GET /api/peliculas?subgenero=TerrorPsicologico&rtMin=85
```

---

#### Plataforma de streaming

| Parámetro   | Tipo   | Valores válidos |
|-------------|--------|-----------------|
| `plataforma` | string | `HBOmax` `Mubi` `Netflix` `ParamountPlus` `PrimeVideo` `Shudder` `StarPlus` |

```
GET /api/peliculas?plataforma=Netflix
```

---

#### País de origen

| Parámetro | Tipo   | Valores válidos |
|-----------|--------|-----------------|
| `pais`    | string | `Alemania` `Australia` `Bélgica / Estados Unidos` `España` `Estados Unidos` `Francia / Reino Unido` `Irlanda / Estados Unidos` `Italia` `Japón` `Reino Unido` |

```
GET /api/peliculas?pais=Japón
```

---

#### Idioma

| Parámetro | Tipo   | Valores válidos |
|-----------|--------|-----------------|
| `idioma`  | string | `Alemán` `Español` `Inglés` `Inglés / Lenguaje de señas` `Inglés antiguo` `Italiano` `Japonés` |

```
GET /api/peliculas?idioma=Japonés
```

---

#### Clasificación de edad

| Parámetro          | Tipo   | Valores válidos |
|--------------------|--------|-----------------|
| `clasificacionEdad` | string | `Mayores de 13` `Mayores de 16` `Mayores de 18` `No apta menores` `Todos los públicos` |

```
GET /api/peliculas?clasificacionEdad=Mayores de 18
```

---

#### Basada en hechos reales

| Parámetro               | Tipo    | Valores |
|-------------------------|---------|---------|
| `basadaEnHechosReales`  | boolean | `true` `false` |

```
GET /api/peliculas?basadaEnHechosReales=true
```

---

#### Búsqueda por texto libre (búsqueda semántica)

| Parámetro | Tipo   | Descripción                        |
|-----------|--------|------------------------------------|
| `q`       | string | Busca en **10 campos** mediante palabras sueltas |

**Campos que busca:** título, sinopsis, ambientación, estilo de fotografía, directores, actores, guionistas, subgéneros, monstruos, plataformas.

**Detección semántica desde el texto:**
| Escribes en la caja de búsqueda | Filtro que se aplica |
|--------------------------------|---------------------|
| `1990`, `1980-1989` | `anioMin` / `anioMax` |
| `gore 8` | `nivelGoreMin=8` |
| `suspenso 9` | `nivelSuspensoMin=9` |
| `puntuacion 75` / `score 75` | `puntuacionMin=75` |
| `rt 90` / `rotten tomatoes 90` | `rtMin=90` |
| `slasher` / `sobrenatural` | `subgenero=...` |
| `fantasma` / `vampiro` / `ghost` | `tipoMonstruo=...` |
| `hechos reales` / `true story` | `basadaEnHechosReales=true` |
| `Japón` / `Inglés` | `pais=...` / `idioma=...` |
| `Mayores de 18` | `clasificacionEdad=...` |

```
# Búsqueda por frase completa
GET /api/peliculas?q=Una+familia+debe+vivir+en+completo+silencio

# Búsqueda por director
GET /api/peliculas?q=kubrick

# Búsqueda semántica combinada
GET /api/peliculas?q=ghost+1990+españa
```

---

### Ejemplos combinados

```
# Slashers de los 80s con RT alto
GET /api/peliculas?subgenero=Slasher&anioMin=1980&anioMax=1989&rtMin=80

# Terror japonés
GET /api/peliculas?pais=Japón&tipoMonstruo=Fantasma

# Películas de hechos reales en Netflix con gore extremo
GET /api/peliculas?basadaEnHechosReales=true&plataforma=Netflix&nivelGoreMin=7

# Cine de autor: suspenso alto, puntuación alta, sin gore extremo
GET /api/peliculas?nivelSuspensoMin=9&puntuacionMin=80&nivelGoreMin=1

# Búsqueda semántica: fantasma en los 90
GET /api/peliculas?q=fantasma+1995

# Por director
GET /api/peliculas?q=kubrick

# Frase completa
GET /api/peliculas?q=Una+familia+debe+vivir+en+completo+silencio
```

---

## GET /api/peliculas/:id

Devuelve el detalle completo de una película. El `:id` es el fragmento IRI que aparece en el campo `iri` del listado (todo lo que va después del `#`).

### Ejemplo

```
GET /api/peliculas/AQuietPlace2018
```

### Respuesta

```json
{
  "id":                  "AQuietPlace2018",
  "titulo":              "A Quiet Place",
  "sinopsis":            "Una familia debe vivir en completo silencio...",
  "anio":                2018,
  "duracion":            90,
  "presupuesto":         17000000,
  "recaudacion":         340900000,
  "nivelGore":           5,
  "nivelSuspenso":       10,
  "puntuacion":          80,
  "rt":                  96,
  "pais":                "Estados Unidos",
  "idioma":              "Inglés / Lenguaje de señas",
  "clasificacion":       "Mayores de 13",
  "basadaEnHechosReales": false,
  "ambientacion":        "Granja rural en mundo post-apocalíptico",
  "estiloFotografia":    "Limpia y austera con silencios elocuentes",
  "directores":          ["John Krasinski"],
  "actores":             ["John Krasinski", "Emily Blunt", "Millicent Simmonds"],
  "guionistas":          ["John Krasinski"],
  "subgeneros":          ["BodyHorror", "TerrorSupervivencia"],
  "plataformas":         ["ParamountPlus"],
  "monstruos":           ["MonstruosSonido"]
}
```

### Campos de la respuesta

| Campo                 | Tipo      | Descripción                               |
|-----------------------|-----------|-------------------------------------------|
| `id`                  | string    | Identificador IRI local                   |
| `titulo`              | string    | Título oficial                            |
| `sinopsis`            | string    | Descripción argumental                    |
| `anio`                | number    | Año de estreno                            |
| `duracion`            | number    | Duración en minutos                       |
| `presupuesto`         | number    | Presupuesto en USD                        |
| `recaudacion`         | number    | Recaudación mundial en USD                |
| `nivelGore`           | number    | Nivel de gore (1–10)                      |
| `nivelSuspenso`       | number    | Nivel de suspenso (1–10)                  |
| `puntuacion`          | number    | Puntuación propia (1–100)                 |
| `rt`                  | number    | Puntuación Rotten Tomatoes (1–100)        |
| `pais`                | string    | País de producción                        |
| `idioma`              | string    | Idioma original                           |
| `clasificacion`       | string    | Clasificación de edad                     |
| `basadaEnHechosReales`| boolean   | Si está basada en hechos reales           |
| `ambientacion`        | string    | Descripción del entorno                   |
| `estiloFotografia`    | string    | Estilo cinematográfico                    |
| `directores`          | string[]  | Nombre(s) del director/a                  |
| `actores`             | string[]  | Nombre(s) de actores principales          |
| `guionistas`          | string[]  | Nombre(s) del guionista                   |
| `subgeneros`          | string[]  | Subgéneros de terror asignados            |
| `plataformas`         | string[]  | Plataformas donde está disponible         |
| `monstruos`           | string[]  | Identificadores de los monstruos          |

### Errores

| Código | Causa                                      |
|--------|--------------------------------------------|
| `400`  | `:id` contiene caracteres inválidos        |
| `404`  | No existe una película con ese `:id`       |

---

## `GET /api/peliculas/:id/dbpedia`

Devuelve datos enriquecidos desde DBpedia para una película.

### Parámetros

| Parámetro | Tipo   | Descripción | Default |
|-----------|--------|-------------|---------|
| `mode`    | string | `auto`, `online` o `offline` | `auto` |
| `lang`    | string | `es`, `en`, `pt` | `es` |

### Ejemplo

```
GET /api/peliculas/AQuietPlace2018/dbpedia?mode=online&lang=en
```

### Respuesta

```json
{
  "dbpediaUri": "http://dbpedia.org/resource/A_Quiet_Place",
  "thumbnail": "http://commons.wikimedia.org/...jpg",
  "wikiPage": "http://en.wikipedia.org/wiki/A_Quiet_Place",
  "budget": 17000000,
  "gross": 340900000,
  "runtime": 90,
  "country": "United States",
  "language": "English",
  "directors": ["John Krasinski"],
  "actors": ["Emily Blunt", "John Krasinski", "Millicent Simmonds"],
  "allProperties": [
    { "predicate": "dbo:cinematography", "values": [{ "display": "Charlotte Bruus Christensen" }] },
    { "predicate": "dbo:editing", "values": [{ "display": "Michael P. Shawver" }] }
  ]
}
```

### Modos

| Modo | Comportamiento |
|------|---------------|
| `auto` | Intenta offline (Fuseki), fallback a online (DBpedia) |
| `online` | Consulta DBpedia en vivo (requiere internet) |
| `offline` | Consulta Fuseki (OntologiaPeliculasTerrorDbpedia) |

---

## `GET /api/peliculas/:id/translations`

Devuelve traducciones de los campos de texto de la ontología para un idioma específico.

### Parámetros

| Parámetro | Tipo   | Descripción |
|-----------|--------|-------------|
| `lang`    | string | `en` o `pt` |

### Ejemplo

```
GET /api/peliculas/TheShining1980/translations?lang=en
```

### Respuesta

```json
{
  "sinopsis": "A writer goes progressively insane in an isolated hotel...",
  "ambientacion": "Overlook Hotel in Colorado",
  "estilo": "Symmetrical with steadicam"
}
```

---

## `POST /api/sparql`

Ejecuta consultas SPARQL directamente contra el triplestore Fuseki.

### Cuerpo

```json
{
  "query": "tu consulta SPARQL aquí"
}
```

### Formato

Acepta consultas SELECT, ASK, CONSTRUCT, DESCRIBE, INSERT, DELETE, UPDATE.

### Ejemplos

```bash
# SELECT básico
curl -X POST http://localhost:4000/api/sparql \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 5"}'

# Películas con su año
curl -X POST http://localhost:4000/api/sparql \
  -H "Content-Type: application/json" \
  -d '{"query": "PREFIX : <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#> SELECT ?titulo ?anio WHERE { ?p a :Pelicula . OPTIONAL { ?p :titulo ?titulo } OPTIONAL { ?p :añoEstreno ?anio } }"}'

# INSERT
curl -X POST http://localhost:4000/api/sparql \
  -H "Content-Type: application/json" \
  -d '{"query": "PREFIX : <http://...> INSERT DATA { :TestMovie :titulo \"Test\" }"}'
```

También puedes usar la **Consola SPARQL** integrada en el frontend (pestaña SPARQL).
