# Buscador Semántico de Películas de Terror

Buscador facetado construido sobre una ontología OWL de películas de terror. Permite filtrar por año, tipo de monstruo, nivel de gore y búsqueda por texto usando SPARQL como motor de consulta.

**Stack:** Apache Jena Fuseki (triplestore) · Express + TypeScript (API) · React + TypeScript + Tailwind CSS (frontend)

Referencia completa de la API: [`docs/API_FILTROS.md`](docs/API_FILTROS.md)

---

## Requisitos

| Herramienta | Versión mínima |
|-------------|---------------|
| Java (JRE)  | 17            |
| Node.js     | 20            |
| Python      | 3.8 (solo para conversión inicial del OWL) |

---

## Instalación

### Linux (Ubuntu/Debian)

```bash
# Java
sudo apt install -y openjdk-21-jre

# Node.js (si no lo tienes)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Python + owlready2 (para convertir el OWL a RDF)
sudo apt install -y python3-pip
pip3 install owlready2 --break-system-packages
```

### Windows

1. **Java:** descarga e instala [OpenJDK 21](https://adoptium.net/) — marca "Add to PATH" en el instalador.
2. **Node.js:** descarga e instala [Node.js 20 LTS](https://nodejs.org/).
3. **Python:** descarga e instala [Python 3.11+](https://www.python.org/downloads/) — marca "Add Python to PATH".
   Luego en PowerShell:
   ```powershell
   pip install owlready2
   ```

---

## Puesta en marcha

### 1. Descargar Apache Jena Fuseki

**Linux:**
```bash
cd ~
wget https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-6.1.0.zip
unzip apache-jena-fuseki-6.1.0.zip
```

**Windows (PowerShell):**
```powershell
cd $HOME
Invoke-WebRequest https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-6.1.0.zip -OutFile fuseki.zip
Expand-Archive fuseki.zip .
```

### 2. Arrancar Fuseki

**Linux:**
```bash
cd ~/apache-jena-fuseki-6.1.0
./fuseki-server --update --mem /peliculas
```

**Windows (PowerShell):**
```powershell
cd $HOME\apache-jena-fuseki-6.1.0
java -jar fuseki-server.jar --update --mem /peliculas
```

Fuseki queda disponible en `http://localhost:3030`.

### 3. Convertir y cargar la ontología

Convierte el archivo OWL al formato que entiende Fuseki:

```bash
# Linux
python3 - <<'EOF'
from owlready2 import get_ontology
onto = get_ontology("file:///ruta/al/proyecto/OntologiaPeliculasTerror.owl").load()
onto.save(file="/ruta/al/proyecto/ontologia.rdf", format="rdfxml")
print(f"Clases: {len(list(onto.classes()))}, Individuos: {len(list(onto.individuals()))}")
EOF
```

```powershell
# Windows (PowerShell)
python -c "
from owlready2 import get_ontology
onto = get_ontology('file:///C:/ruta/al/proyecto/OntologiaPeliculasTerror.owl').load()
onto.save(file='C:/ruta/al/proyecto/ontologia.rdf', format='rdfxml')
print(f'Clases: {len(list(onto.classes()))}, Individuos: {len(list(onto.individuals()))}')
"
```

Luego carga el RDF en Fuseki:

**Linux:**
```bash
curl -X POST "http://localhost:3030/peliculas/data" \
  --upload-file ontologia.rdf \
  -H "Content-Type: application/rdf+xml"
```

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3030/peliculas/data" `
  -Method Post `
  -InFile "ontologia.rdf" `
  -ContentType "application/rdf+xml"
```

Deberías ver `"tripleCount": 4168` en la respuesta.

### 4. Instalar y arrancar el backend

```bash
cd backend
npm install
npm run dev
```

La API queda disponible en `http://localhost:4000`.

### 5. Cargar enlaces owl:sameAs a DBpedia

Conecta cada película de la ontología con su recurso en DBpedia:

**Linux:**
```bash
curl -X POST "http://localhost:3030/peliculas/data" \
  --upload-file backend/dbpedia-links.ttl \
  -H "Content-Type: text/turtle"
```

**Windows (PowerShell):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3030/peliculas/data" `
  -Method Post `
  -InFile "backend/dbpedia-links.ttl" `
  -ContentType "text/turtle"
```

---

## API — Endpoints disponibles

Ver referencia completa en [`docs/API_FILTROS.md`](docs/API_FILTROS.md).

### `GET /api/peliculas`

Devuelve lista filtrada de películas. Soporta 13 filtros combinables:

| Categoría       | Parámetros                                              |
|-----------------|---------------------------------------------------------|
| Temporal        | `anioMin`, `anioMax`                                    |
| Niveles         | `nivelGoreMin`, `nivelSuspensoMin`, `puntuacionMin`, `rtMin` |
| Clasificadores  | `tipoMonstruo`, `subgenero`, `plataforma`, `clasificacionEdad` |
| Origen          | `pais`, `idioma`                                        |
| Booleano        | `basadaEnHechosReales`                                  |
| Texto libre     | `q`                                                     |

```bash
curl "http://localhost:4000/api/peliculas?subgenero=Slasher&anioMin=1980&rtMin=80"
```

### `GET /api/peliculas/:id`

Devuelve el detalle completo de una película: sinopsis, director, actores, presupuesto, plataformas, etc.

```bash
curl "http://localhost:4000/api/peliculas/AQuietPlace2018"
```

El `:id` se obtiene del campo `iri` del listado (fragmento después del `#`).

### `POST /api/sparql`

Ejecuta consultas SPARQL directamente contra Fuseki desde la API.

**Cuerpo:** `{ "query": "..." }` (JSON)
**Soporta:** SELECT, ASK, CONSTRUCT, DESCRIBE, INSERT, DELETE, UPDATE

```bash
curl -X POST "http://localhost:4000/api/sparql" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT ?s ?p ?o WHERE { ?s ?p ?o } LIMIT 5"}'
```

También puedes usar la **Consola SPARQL** integrada desde el frontend (pestaña SPARQL) con ejemplos precargados.

---

## Integración con DBpedia

El proyecto se conecta con [DBpedia](https://dbpedia.org) para enriquecer los datos de cada película. Cada recurso local está vinculado mediante `owl:sameAs` a su equivalente en DBpedia.

### Modos de consulta

Usa el selector **Auto / Online / Offline** en el header del frontend:

| Modo | Comportamiento |
|------|---------------|
| **Auto** (default) | Intenta leer del cache local; si no hay datos, consulta DBpedia en vivo |
| **Online** | Consulta DBpedia en vivo siempre (requiere internet) |
| **Offline** | Lee solo del cache local (sin internet) |

### Datos recuperados

| Campo | Propiedad DBpedia | Descripción |
|-------|-------------------|-------------|
| Thumbnail | `dbo:thumbnail` | Póster o imagen representativa |
| Wikipedia | `foaf:isPrimaryTopicOf` | Enlace al artículo de Wikipedia |
| Abstract | `dbo:abstract` | Sinopsis (inglés) |
| Presupuesto | `dbo:budget` / `dbp:budget` | Presupuesto de producción |
| Recaudación | `dbo:gross` / `dbp:gross` | Recaudación mundial |
| Duración | `dbo:runtime` / `dbp:runtime` | Duración en minutos |
| País | `dbo:country` / `dbo:countryOfOrigin` | País de origen |
| Idioma | `dbo:language` | Idioma original |
| Directores | `dbo:director` | Nombre(s) del director |
| Actores | `dbo:starring` | Reparto principal |
| Guionistas | `dbo:writer` | Guionista(s) |
| Géneros | `dbo:genre` | Género(s) cinematográfico(s) |
| Productores | `dbo:producer` | Productor(es) |
| Productoras | `dbo:productionCompany` | Compañía(s) productora(s) |
| Distribuidores | `dbo:distributor` | Distribuidora(s) |
| Compositores | `dbo:musicBy` | Compositor(es) musical(es) |

> **Nota:** No todas las películas tienen todos los campos. DBpedia es incompleto y algunas consultas pueden exceder el tiempo de espera (20s) para películas con muchos datos asociados. Los campos vacíos no indican necesariamente un error.

### Cache offline

Para usar el modo offline sin conexión a internet, descarga previamente los datos:

```bash
cd backend
npm run download-dbpedia
```

Esto genera `backend/data/dbpedia-cache.json` con los datos de todas las películas. La descarga requiere internet una sola vez.

---

## Estructura del proyecto

```
Ontologia_peliculas_terror/
  OntologiaPeliculasTerror.owl   # Ontología fuente (Protégé)
  ontologia.rdf                  # Ontología convertida para Fuseki
   backend/
     src/
       index.ts                   # Servidor Express en :4000
       sparql/
         client.ts                # Cliente HTTP hacia Fuseki
         queries.ts               # Constructores de queries SPARQL
         dbpedia.ts               # Servicio DBpedia (online/offline)
         download-dbpedia.ts      # Script para precargar cache offline
       routes/
         peliculas.ts             # GET /api/peliculas, GET /api/peliculas/:id, /:id/dbpedia
         sparql.ts                # POST /api/sparql (proxy a Fuseki)
     dbpedia-links.ttl            # 55 enlaces owl:sameAs a DBpedia
     data/
       dbpedia-cache.json         # Cache offline de DBpedia
     tsconfig.json
     package.json
   frontend/
     src/
       components/
         FilterPanel.tsx          # Panel de filtros facetados
         MovieList.tsx            # Lista de películas
         MovieCard.tsx            # Tarjeta individual
         MovieDetailView.tsx      # Modal con detalles + panel DBpedia
         SparqlConsole.tsx        # Consola SPARQL interactiva
         Icon.tsx                 # Iconos reutilizables
       services/
         api.ts                   # Cliente HTTP hacia backend
       types/
         index.ts                 # Tipos TypeScript y constantes
       App.tsx                    # Componente principal (tabs + selector DBpedia)
       main.tsx                   # Entrada de React
     tsconfig.json
     package.json
     vite.config.ts               # Configuración de Vite
     tailwind.config.js           # Configuración de Tailwind
   docs/
     API_FILTROS.md              # Documentación de la API REST
```

---

## Uso rápido (3 pasos)

### 1. Backend (API + SPARQL)

```bash
# Terminal 1: Inicia Fuseki (ver requisitos)
cd ~/apache-jena-fuseki-6.1.0
./fuseki-server --update --mem /peliculas

# Terminal 2: Instala y corre backend
cd backend
npm install
npm run dev
```

La API estará en `http://localhost:4000`.

### 2. Frontend (Interfaz de usuario)

```bash
# Terminal 3
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

### 3. Explora películas

- Usa los filtros en el panel izquierdo
- Haz clic en una película para ver detalles completos
- Combina múltiples filtros para búsquedas precisas

---

## 📚 Documentación

### Inicio rápido
- [🚀 Quick Start (5 min)](docs/QUICK_START.md) — Guía paso a paso
- [🎮 Uso del Frontend](frontend/USAGE.md) — Cómo usar la interfaz

### Referencias técnicas
- [🔌 API REST](docs/API_FILTROS.md) — Endpoints disponibles y ejemplos
- [🏗️ Arquitectura del Sistema](docs/ARQUITECTURA.md) — Cómo funciona todo
- [📁 Estructura Frontend](docs/FRONTEND_ESTRUCTURA.md) — Detalles del código

### Desarrollo
- [Frontend README](frontend/README.md) — Desarrollo del frontend
- [Backend README](backend/README.md) — Desarrollo del backend (si existe)

---

## 🎯 Características principales

✅ **Búsqueda facetada**: Filtra por 13 criterios simultáneamente
✅ **Interfaz moderna**: React + Tailwind CSS con tema oscuro
✅ **Ontología semántica**: OWL + RDF + SPARQL
✅ **API REST**: Express + TypeScript
✅ **Triplestore**: Apache Jena Fuseki
✅ **Responsive**: Funciona en desktop, tablet y mobile
✅ **Tipado completo**: TypeScript en frontend y backend
✅ **Consola SPARQL**: Editor de consultas SPARQL integrado en el frontend
✅ **DBpedia online/offline**: Datos enriquecidos desde DBpedia con modo offline
✅ **Enlace semántico**: Conexión owl:sameAs entre ontología local y DBpedia

---

## 💡 Ejemplos de búsquedas

**Slashers clásicos de los 80s con RT alto**
```
Año: 1980-1989
Subgénero: Slasher
Rotten Tomatoes: 80+
```

**Terror sobrenatural en Netflix**
```
Subgénero: Sobrenatural
Plataforma: Netflix
Nivel Suspenso: 8+
```

**Películas intensas basadas en hechos reales**
```
Basada en hechos reales: ✓
Nivel Gore: 7+
Nivel Suspenso: 8+
```

---

## 🔍 Explorando la ontología

La ontología incluye:

| Concepto | Ejemplos |
|----------|----------|
| **Películas** | The Ring, A Quiet Place, Hereditary, etc. |
| **Subgéneros** | Slasher, Paranormal, Psicológico, Gore, BodyHorror, etc. |
| **Monstruos** | Fantasmas, Vampiros, Zombis, Demonios, etc. |
| **Plataformas** | Netflix, Prime Video, HBO Max, Shudder, etc. |
| **Países** | Estados Unidos, Japón, Francia, España, etc. |
| **Clasificaciones** | Mayores de 13/16/18, No apta menores, Todos públicos |

Cada película está conectada semánticamente con sus características, permitiendo búsquedas complejas y precisas.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Triplestore** | Apache Jena Fuseki | 6.1.0 |
| **Backend** | Express | 5.2+ |
| | TypeScript | 5.3+ |
| | SPARQL | 1.1 |
| **Frontend** | React | 18.2+ |
| | TypeScript | 5.3+ |
| | Tailwind CSS | 3.3+ |
| | Vite | 5.0+ |
| **Enlace de datos** | DBpedia SPARQL | Online / Offline |
| **Runtime** | Node.js | 20+ |
| | Java (JRE) | 17+ |

---

## 📝 Licencia


- Express.js (Licencia MIT)
- React (Licencia MIT)
- Tailwind CSS (Licencia MIT)
