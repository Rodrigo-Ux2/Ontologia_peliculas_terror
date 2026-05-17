# Buscador Semántico de Películas de Terror

Buscador facetado construido sobre una ontología OWL de películas de terror. Permite filtrar por año, tipo de monstruo, nivel de gore y búsqueda por texto usando SPARQL como motor de consulta.

**Stack:** Apache Jena Fuseki (triplestore) · Express + TypeScript (API) · React (frontend — en desarrollo)

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
      routes/
        peliculas.ts             # GET /api/peliculas
    tsconfig.json
    package.json
```
