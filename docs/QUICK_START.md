# 🚀 Quick Start - 5 minutos

## Prerequisitos instalados

- ✅ Java (17+)
- ✅ Node.js (20+)  
- ✅ Python 3.8+ con `pip install owlready2`

---

## Terminal 1: Fuseki (Triplestore)

```bash
# Descarga (primera vez)
cd ~
wget https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-6.1.0.zip
unzip apache-jena-fuseki-6.1.0.zip

# Inicia Fuseki
cd ~/apache-jena-fuseki-6.1.0
./fuseki-server --update --mem /peliculas

# ✅ Ver: http://localhost:3030
```

**Windows:**
```powershell
cd $HOME
Invoke-WebRequest https://dlcdn.apache.org/jena/binaries/apache-jena-fuseki-6.1.0.zip -OutFile fuseki.zip
Expand-Archive fuseki.zip .
cd apache-jena-fuseki-6.1.0
java -jar fuseki-server.jar --update --mem /peliculas
```

---

## Terminal 2: Cargar datos en Fuseki

```bash
# Desde carpeta del proyecto
cd Ontologia_peliculas_terror

# 1. Convertir OWL a RDF
python3 -c "
from owlready2 import get_ontology
onto = get_ontology('OntologiaPeliculasTerror.owl').load()
onto.save(file='ontologia.rdf', format='rdfxml')
print(f'Guardado: ontologia.rdf')
"

# 2. Cargar ontologia original
curl -X POST http://localhost:3030/peliculas/data \
  --upload-file ontologia.rdf \
  -H "Content-Type: application/rdf+xml"

# 3. Cargar enlaces owl:sameAs a DBpedia
curl -X POST http://localhost:3030/peliculas/data \
  --upload-file backend/dbpedia-links.ttl \
  -H "Content-Type: text/turtle"

# 4. Cargar ontologia DBpedia con traducciones
curl -X POST http://localhost:3030/peliculas/data \
  --upload-file OntologiaPeliculasTerrorDbpedia.owl \
  -H "Content-Type: application/rdf+xml"
```

**Windows:**
```powershell
python -c "
from owlready2 import get_ontology
onto = get_ontology('OntologiaPeliculasTerror.owl').load()
onto.save(file='ontologia.rdf', format='rdfxml')
"

Invoke-RestMethod -Uri http://localhost:3030/peliculas/data `
  -Method Post -InFile ontologia.rdf `
  -ContentType application/rdf+xml

Invoke-RestMethod -Uri http://localhost:3030/peliculas/data `
  -Method Post -InFile backend/dbpedia-links.ttl `
  -ContentType text/turtle

Invoke-RestMethod -Uri http://localhost:3030/peliculas/data `
  -Method Post -InFile OntologiaPeliculasTerrorDbpedia.owl `
  -ContentType application/rdf+xml
```

---

## Terminal 3: Backend API

```bash
cd backend
npm install
npm run dev

# ✅ Ver: http://localhost:4000
# ✅ Prueba: curl http://localhost:4000/api/peliculas?subgenero=Slasher
```

---

## Terminal 4: Frontend

```bash
cd frontend
npm install
npm run dev

# ✅ Abre: http://localhost:5173
```

---

## ¡Listo! 🎉

Ya puedes:
- ✅ Filtrar películas por 13 criterios simultáneamente
- ✅ Ver detalles completos con datos enriquecidos de DBpedia
- ✅ Cambiar idioma (ES/EN/PT) en el header
- ✅ Usar la consola SPARQL desde la pestaña SPARQL
- ✅ Buscar por descripciones, directores, actores en cualquier idioma
- ✅ Alternar modo DBpedia (Auto/Online/Offline)

---

## Verificar funcionalidades

### Búsqueda semántica
```bash
# Por descripción
curl "http://localhost:4000/api/peliculas?q=asesino+serial+adolescentes"

# Por director
curl "http://localhost:4000/api/peliculas?q=kubrick"

# Por frase completa
curl "http://localhost:4000/api/peliculas?q=Una+familia+debe+vivir+en+completo+silencio"
```

### DBpedia online
```bash
curl "http://localhost:4000/api/peliculas/TheShining1980/dbpedia?mode=online"
```

### Traducciones
```bash
curl "http://localhost:4000/api/peliculas/TheShining1980/translations?lang=en"
```

### Consola SPARQL
```bash
curl -X POST http://localhost:4000/api/sparql \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT ?p ?titulo WHERE { ?p a <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#Pelicula> . OPTIONAL { ?p <http://www.semanticweb.org/terror/ontologies/2026/PeliculasTerror#titulo> ?titulo } } LIMIT 5"}'
```

---

## Comandos útiles

### Scripts disponibles (en backend/)
| Comando | Función | Requiere internet |
|---------|---------|-------------------|
| `npm run download-dbpedia` | Regenerar cache DBpedia | ✅ Sí |
| `npm run translate-owl` | Regenerar traducciones OWL | ✅ Sí |
| `npm run create-owl-dbpedia` | Regenerar ontologia DBpedia | ❌ No (usa cache local) |

### Resetear todo
```bash
# Detener Fuseki (Ctrl+C en Terminal 1)
# Reiniciar sin caché
./fuseki-server --update --mem /peliculas

# En Terminal 2, cargar ontologías nuevamente
```

### Verificar datos
```bash
# Ver cantidad de películas
curl "http://localhost:4000/api/peliculas" | jq length

# Ver detalle de una película
curl "http://localhost:4000/api/peliculas/TheShining1980" | jq

# Buscar slashers
curl "http://localhost:4000/api/peliculas?subgenero=Slasher" | jq
```

### Desarrollo
```bash
# Backend cambios en vivo
cd backend && npm run dev

# Frontend cambios en vivo
cd frontend && npm run dev

# Build para producción
npm run build
```

---

## Problemas comunes

**"Cannot connect to localhost:3030"**
→ Fuseki no está corriendo

**"Cannot connect to localhost:4000"**
→ Backend no está corriendo

**"0 movies found"**
→ Ontología no cargó en Fuseki

**"No DBpedia data"**
→ dbpedia-links.ttl no está cargado en Fuseki

**"Module not found"**
→ `npm install` no se ejecutó en ese directorio

**English/Portuguese search returns all movies**
→ La ontología DBpedia no está cargada (paso 4 de Terminal 2)

---

## Documentación completa

- 📖 [README.md](../README.md) - Proyecto completo
- 🔌 [API_FILTROS.md](./API_FILTROS.md) - Endpoints disponibles
- 🏗️ [ARQUITECTURA.md](./ARQUITECTURA.md) - Cómo funciona el sistema
- 📋 [CHECKLIST.md](./CHECKLIST.md) - Verificación de instalación
- 💻 [Frontend README](../frontend/README.md) - Detalles del frontend
- 🎮 [Frontend USAGE](../frontend/USAGE.md) - Cómo usar la interfaz
