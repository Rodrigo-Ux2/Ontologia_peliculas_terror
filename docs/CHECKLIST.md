# ✅ Checklist de Setup

Use esta lista para verificar que todo está correctamente configurado.

---

## 🖥️ Requisitos del sistema

### Java
```bash
java -version
```
- [ ] Salida: OpenJDK o similar, versión 17+

### Node.js
```bash
node --version
npm --version
```
- [ ] Salida: v20 o superior
- [ ] npm: 9 o superior

### Python (opcional, solo para primera carga)
```bash
python3 --version
python3 -c "import owlready2; print('✓')"
```
- [ ] Salida: Python 3.8+
- [ ] owlready2 instalado

---

## 📦 Frontend - Instalación

### 1. Dependencias
```bash
cd frontend
npm install
```
- [ ] Sin errores
- [ ] Se creó `node_modules/`
- [ ] Se creó `package-lock.json`

### 2. Verificar archivos
```bash
ls -la src/
```
- [ ] `App.tsx` existe
- [ ] `main.tsx` existe
- [ ] `index.css` existe
- [ ] Carpeta `components/` existe
- [ ] Carpeta `services/` existe
- [ ] Carpeta `types/` existe

### 3. Archivos de configuración
```bash
ls -la
```
- [ ] `tsconfig.json` ✓
- [ ] `vite.config.ts` ✓
- [ ] `tailwind.config.js` ✓
- [ ] `postcss.config.js` ✓
- [ ] `tailwind.config.js` ✓
- [ ] `index.html` ✓

---

## 🚀 Ejecución - Paso 1: Fuseki

### Terminal 1
```bash
cd ~/apache-jena-fuseki-6.1.0
./fuseki-server --update --mem /peliculas
```

Esperar a ver:
```
[INFO] Fuseki Server started
```

- [ ] Fuseki está corriendo
- [ ] Accede a http://localhost:3030
- [ ] Se ve "Apache Jena Fuseki" en navegador

---

## 🚀 Ejecución - Paso 2: Cargar ontologías en Fuseki

### Terminal 2
```bash
cd Ontologia_peliculas_terror

# 1. Convertir OWL a RDF
python3 -c "
from owlready2 import get_ontology
onto = get_ontology('OntologiaPeliculasTerror.owl').load()
onto.save(file='ontologia.rdf', format='rdfxml')
print('✓ Guardado: ontologia.rdf')
"
```

- [ ] Se creó `ontologia.rdf`
- [ ] Archivo contiene RDF/XML

### Cargar ontología original
```bash
curl -X POST http://localhost:3030/peliculas/data \
  --upload-file ontologia.rdf \
  -H "Content-Type: application/rdf+xml"
```

Respuesta esperada:
```json
{"tripleCount": 4168, ...}
```

- [ ] HTTP 200
- [ ] `tripleCount` > 0
- [ ] Ontología cargada en Fuseki

### Cargar enlaces DBpedia
```bash
curl -X POST http://localhost:3030/peliculas/data \
  --upload-file backend/dbpedia-links.ttl \
  -H "Content-Type: text/turtle"
```

- [ ] HTTP 200
- [ ] 55 enlaces owl:sameAs cargados

### Cargar ontología DBpedia con traducciones
```bash
curl -X POST http://localhost:3030/peliculas/data \
  --upload-file OntologiaPeliculasTerrorDbpedia.owl \
  -H "Content-Type: application/rdf+xml"
```

- [ ] HTTP 200
- [ ] Ontología DBpedia cargada

---

## 🚀 Ejecución - Paso 3: Backend

### Terminal 3
```bash
cd backend
npm install
npm run dev
```

Esperar a ver:
```
API en http://localhost:4000
```

- [ ] Backend compiló sin errores
- [ ] Escuchando en puerto 4000
- [ ] Accede a http://localhost:4000

### Prueba de endpoint
```bash
curl http://localhost:4000/api/peliculas?subgenero=Slasher
```

Respuesta esperada:
```json
[
  {"iri": "http://...", "titulo": "...", "anio": "..."},
  ...
]
```

- [ ] HTTP 200
- [ ] Array de películas
- [ ] Campos: iri, titulo, anio

### Prueba de detalle
```bash
curl http://localhost:4000/api/peliculas/TheRing2002
```

- [ ] HTTP 200
- [ ] Objeto con detalles completos
- [ ] Campos: titulo, sinopsis, puntajes, etc.

---

## 🚀 Ejecución - Paso 4: Frontend

### Terminal 4
```bash
cd frontend
npm run dev
```

Esperar a ver:
```
  ➜  Local:   http://localhost:5173/
```

- [ ] Vite compiló sin errores
- [ ] Escuchando en puerto 5173
- [ ] Sin warnings importantes

### Acceso en navegador
Abre http://localhost:5173

- [ ] Página carga
- [ ] Ve encabezado "🎬 Buscador Semántico"
- [ ] Panel de filtros visible (izquierda)
- [ ] Área de películas visible (centro)
- [ ] Sin errores en consola (F12)

---

## 🔍 Pruebas funcionales

### Test 1: Búsqueda básica
1. Abre http://localhost:5173
2. Espera a que cargue
3. Verifica que aparecen películas
- [ ] Mínimo 1 película visible
- [ ] Muestra título y año
- [ ] Cuenta total en la parte superior

### Test 2: Filtro por subgénero
1. En panel izquierdo, selecciona `Subgénero: Slasher`
2. Espera a que actualice
- [ ] Resultados filtrados
- [ ] Cambio dentro de ~500ms
- [ ] Cantidad de resultados cambió

### Test 3: Filtro por año
1. Selecciona `Año mínimo: 1980`
2. Selecciona `Año máximo: 1989`
- [ ] Resultados actualizan
- [ ] Muestra películas solo de los 80s

### Test 4: Combinar filtros
1. Mantén año 1980-1989
2. Agrega `Subgénero: Slasher`
3. Agrega `Rotten Tomatoes: 80`
- [ ] Filtros se combinan (AND lógico)
- [ ] Resultados más restringidos

### Test 5: Ver detalle
1. Haz clic en una película
2. Espera a que abra modal
- [ ] Modal abre sin bloquear fondo
- [ ] Muestra puntuaciones, sinopsis, etc.
- [ ] Botón X cierra modal

### Test 6: Limpiar filtros
1. Aplica varios filtros
2. Haz clic en "Limpiar filtros"
- [ ] Todos los campos se vacían
- [ ] Resultados vuelven al inicial

### Test 7: Búsqueda de texto
1. En `Buscar película`, escribe "ring"
2. Espera a que actualice
- [ ] Filtra por título que contiene "ring"
- [ ] Resultados específicos

### Test 8: Búsqueda semántica por frase completa
1. Busca "Una familia debe vivir en completo silencio"
2. Busca "kubrick"
3. Busca "ghost 1990"
- [ ] La frase larga encuentra la película exacta
- [ ] "kubrick" encuentra The Shining
- [ ] "ghost" en inglés detecta tipo de monstruo

### Test 9: Búsqueda por niveles desde texto
1. Busca "gore 8"
2. Busca "puntuacion 80"
3. Busca "rt 90"
- [ ] Filtra por nivel de gore mínimo
- [ ] Filtra por puntuación mínima
- [ ] Filtra por Rotten Tomatoes mínimo

### Test 10: DBpedia online
1. Haz clic en una película
2. Espera a que cargue el modal
- [ ] Panel DBpedia visible (abajo)
- [ ] Muestra datos: budget, gross, etc.
- [ ] Badge "Online" en verde
- [ ] Sección "Todas las propiedades DBpedia" con datos adicionales

### Test 11: DBpedia offline
1. Cambia modo DBpedia a "Offline" en el header
2. Abre una película
- [ ] Panel DBpedia muestra datos (desde Fuseki)
- [ ] Badge "Offline" en azul

### Test 12: Multi-idioma UI
1. Cambia idioma a EN en el header
2. Cambia idioma a PT
- [ ] Todos los textos de la interfaz cambian (filtros, botones, títulos)
- [ ] Selector de idioma resalta el activo

### Test 13: Traducción de datos
1. Cambia idioma a EN
2. Abre una película
- [ ] Sinopsis se muestra en inglés (badge OWL o DBpedia)
- [ ] Clasificación de edad traducida (ej: "Not suitable for minors")
- [ ] Ambientación traducida (ej: "Overlook Hotel in Colorado")
- [ ] Photography Style traducido

### Test 14: Consola SPARQL
1. Ve a la pestaña SPARQL
2. Haz clic en "Todas las películas" (ejemplo)
3. Haz clic en "Ejecutar"
- [ ] Editor muestra la consulta
- [ ] Resultados aparecen en tabla
- [ ] Muestra cantidad de filas

### Test 15: Badges de origen
1. Abre una película en español
- [ ] Datos principales tienen badge [OWL] azul
- [ ] Panel DBpedia tiene badge [DBpedia] naranja

---

## 📊 Verificaciones adicionales

### Consola del navegador (F12)
- [ ] No hay errores rojos
- [ ] No hay CORS warnings
- [ ] Network requests van a localhost:4000

### Rendimiento
- [ ] Frontend carga en < 2 segundos
- [ ] Cambios de filtro < 500ms
- [ ] Detalle de película < 1 segundo

### Responsive
- [ ] Redimensiona a 320px (móvil): funciona
- [ ] Redimensiona a 768px (tablet): funciona
- [ ] Redimensiona a 1920px (desktop): funciona

---

## 🆘 Si algo no funciona

### "Cannot reach localhost:3030"
- [ ] ¿Está Fuseki corriendo? (Terminal 1)
- [ ] ¿Java está instalado? (`java -version`)
- [ ] ¿Puerto 3030 no está bloqueado?

### "Cannot reach localhost:4000"
- [ ] ¿Está backend corriendo? (Terminal 3, `npm run dev`)
- [ ] ¿Se completó `npm install`?
- [ ] ¿No hay errores de compilación TypeScript?

### "0 películas encontradas"
- [ ] ¿Se cargó ontología en Fuseki? (Terminal 2)
- [ ] ¿La respuesta de curl tiene `tripleCount > 0`?
- [ ] ¿Los datos están en Fuseki? (revisa http://localhost:3030)

### Frontend no carga
- [ ] ¿Está frontend corriendo? (Terminal 4, `npm run dev`)
- [ ] ¿Se completó `npm install` en frontend?
- [ ] ¿Limpiaste caché del navegador? (Ctrl+Shift+Del)

### Estilos se ven raros
- [ ] ¿Se ejecutó `npm install` en frontend?
- [ ] ¿Tailwind está compilando? (revisa consola Vite)
- [ ] ¿Limpiaste caché del navegador?

---

## 🎉 ¡TODO FUNCIONA!

Si completaste todos los checks:

- ✅ Fuseki está cargado con las 3 ontologías
- ✅ Backend devuelve películas con datos enriquecidos
- ✅ Frontend se conecta y muestra resultados
- ✅ Filtros funcionan en tiempo real
- ✅ Detalles se cargan correctamente
- ✅ DBpedia online y offline funcionan
- ✅ Multi-idioma (ES/EN/PT) traduce interfaz y datos
- ✅ Consola SPARQL ejecuta consultas personalizadas
- ✅ Búsqueda semántica por palabras sueltas y frases completas
- ✅ Badges muestran origen de cada dato (OWL vs DBpedia)

**Felicidades! Disfruta explorando películas de terror! 🎬👻**

---

## 📚 Siguientes pasos

- Explora diferentes combinaciones de filtros
- Lee [QUICK_START.md](QUICK_START.md) para comandos útiles
- Revisa [ARQUITECTURA.md](ARQUITECTURA.md) para entender cómo funciona
- Consulta [API_FILTROS.md](API_FILTROS.md) para requests cURL
