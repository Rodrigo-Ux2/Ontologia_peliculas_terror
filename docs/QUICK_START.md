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

## Terminal 2: Cargar ontología

```bash
# Desde carpeta del proyecto
cd Ontologia_peliculas_terror

# Convertir OWL a RDF
python3 -c "
from owlready2 import get_ontology
onto = get_ontology('file:///ruta/completa/OntologiaPeliculasTerror.owl').load()
onto.save(file='ontologia.rdf', format='rdfxml')
print(f'Guardado: ontologia.rdf')
"

# Cargar en Fuseki
curl -X POST http://localhost:3030/peliculas/data \
  --upload-file ontologia.rdf \
  -H "Content-Type: application/rdf+xml"

# ✅ Ver respuesta con "tripleCount"
```

**Windows:**
```powershell
python -c "
from owlready2 import get_ontology
onto = get_ontology('file:///C:/ruta/OntologiaPeliculasTerror.owl').load()
onto.save(file='ontologia.rdf', format='rdfxml')
"

Invoke-RestMethod -Uri http://localhost:3030/peliculas/data `
  -Method Post -InFile ontologia.rdf `
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
- ✅ Filtrar películas de terror
- ✅ Ver detalles completos
- ✅ Combinar múltiples criterios
- ✅ Explorar la ontología semántica

---

## Comandos útiles

### Resetear todo
```bash
# Detener Fuseki (Ctrl+C en Terminal 1)
# Reiniciar sin caché

./fuseki-server --update --mem /peliculas

# En Terminal 2, cargar ontología nuevamente
```

### Verificar datos
```bash
# Ver cantidad de películas
curl "http://localhost:4000/api/peliculas" | jq length

# Ver detalle de una película
curl "http://localhost:4000/api/peliculas/TheRing2002" | jq

# Buscar slashers
curl "http://localhost:4000/api/peliculas?subgenero=Slasher" | jq
```

### Desarrollo
```bash
# Backend cambios en vivo
npm run dev

# Frontend cambios en vivo
npm run dev

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
→ Ontología no cargó en Fuseki (Terminal 2 no se ejecutó)

**"Module not found"**
→ `npm install` no se ejecutó en ese directorio

---

## Documentación completa

- 📖 [README.md](../README.md) - Proyecto completo
- 🔌 [API_FILTROS.md](./API_FILTROS.md) - Endpoints disponibles
- 🏗️ [ARQUITECTURA.md](./ARQUITECTURA.md) - Cómo funciona el sistema
- 💻 [Frontend README](../frontend/README.md) - Detalles del frontend
- 🎮 [Frontend USAGE](../frontend/USAGE.md) - Cómo usar la interfaz
