# 📖 Índice de documentación

## 🚀 Inicio (Empieza aquí)

1. **[QUICK_START.md](QUICK_START.md)** - 5 minutos para tener todo corriendo
   - Requisitos mínimos
   - Pasos exactos para Terminal 1-4
   - Verificación rápida

2. **[CHECKLIST.md](CHECKLIST.md)** - Verificar que todo funciona
   - Paso a paso de setup
   - Pruebas funcionales
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
  - GET /api/peliculas (con parámetros)
  - GET /api/peliculas/:id (detalles)
  - Filtros disponibles
  - Ejemplos con curl

---

## 🏗️ Arquitectura y diseño

- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Cómo funciona el sistema completo
  - Flujo de datos (diagrama ASCII)
  - Componentes principales
  - Tecnologías por capa
  - Flujo de una búsqueda paso a paso
  - Ventajas de la arquitectura

- **[FRONTEND_ESTRUCTURA.md](FRONTEND_ESTRUCTURA.md)** - Detalles del código del frontend
  - Árbol de carpetas
  - Archivos por categoría
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

**Terminal 2: Cargar ontología**
```bash
cd Ontologia_peliculas_terror
python3 -c "from owlready2 import get_ontology; ..."
curl -X POST http://localhost:3030/peliculas/data --upload-file ontologia.rdf
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
| Texto | `q` | `?q=ring` |
| Año | `anioMin`, `anioMax` | `?anioMin=1980&anioMax=1989` |
| Gore | `nivelGoreMin` | `?nivelGoreMin=7` |
| Suspenso | `nivelSuspensoMin` | `?nivelSuspensoMin=8` |
| Rating | `rtMin`, `puntuacionMin` | `?rtMin=80&puntuacionMin=75` |
| Categoría | `subgenero`, `tipoMonstruo` | `?subgenero=Slasher` |
| Plataforma | `plataforma` | `?plataforma=Netflix` |
| Origen | `pais`, `idioma` | `?pais=Japón&idioma=Japonés` |
| Edad | `clasificacionEdad` | `?clasificacionEdad=Mayores de 18` |
| Booleano | `basadaEnHechosReales` | `?basadaEnHechosReales=true` |

---

## 🛠️ Desarrollo

### Estructura de carpetas del proyecto

```
Ontologia_peliculas_terror/
├── OntologiaPeliculasTerror.owl    # Ontología (Protégé)
├── README.md                        # Este archivo
├── backend/                         # API REST (Express + TS)
├── frontend/                        # UI (React + TS)
└── docs/                            # Documentación
    ├── QUICK_START.md              # ← Empieza aquí
    ├── CHECKLIST.md                # Verificar setup
    ├── README.md                   # (enlace arriba)
    ├── API_FILTROS.md              # Endpoints
    ├── ARQUITECTURA.md             # Diseño del sistema
    ├── FRONTEND_ESTRUCTURA.md      # Código del frontend
    └── INDICE.md                   # Este archivo
```

### Cómo agregar una nueva película

1. Editar `OntologiaPeliculasTerror.owl` en Protégé
2. Convertir a RDF: `python3 script.py`
3. Cargar en Fuseki: `curl -X POST ...`
4. Frontend automáticamente la mostrará

### Cómo agregar un nuevo filtro

1. Actualizar `src/types/index.ts` (agregar opción)
2. Actualizar `src/components/FilterPanel.tsx` (agregar control)
3. Actualizar `src/services/api.ts` (agregar parámetro)
4. Backend automáticamente lo procesará

---

## 🆘 Ayuda rápida

**¿Por dónde empiezo?**
→ [QUICK_START.md](QUICK_START.md)

**¿Algo no funciona?**
→ [CHECKLIST.md](CHECKLIST.md) → sección Troubleshooting

**¿Cómo uso la interfaz?**
→ [frontend/USAGE.md](../frontend/USAGE.md)

**¿Cómo funciona todo?**
→ [ARQUITECTURA.md](ARQUITECTURA.md)

**¿Cómo llamo a la API?**
→ [API_FILTROS.md](API_FILTROS.md)

**¿Cómo es el código del frontend?**
→ [FRONTEND_ESTRUCTURA.md](FRONTEND_ESTRUCTURA.md)

---

## 📞 Información de contacto/Recursos

- Ontología: `OntologiaPeliculasTerror.owl`
- Triplestore: Apache Jena Fuseki 6.1.0
- Backend: Express 5.2+, TypeScript 5.3+
- Frontend: React 18.2+, Tailwind CSS 3.3+

---

## 📋 Resumen de características

| Característica | Descripción |
|---|---|
| 🔍 **13 filtros** | Búsqueda facetada combinable |
| 🎨 **Interfaz moderna** | React + Tailwind CSS |
| 📊 **Semántica** | OWL + RDF + SPARQL |
| ⚡ **Tiempo real** | Debounce 500ms |
| 📱 **Responsive** | Mobile, tablet, desktop |
| 🎬 **4168 triples** | Ontología completa |
| 🔗 **API REST** | 2 endpoints + múltiples parámetros |

---

## 📝 Versiones

- **Frontend**: React 18.2+, TypeScript 5.3+, Vite 5.0+, Tailwind 3.3+
- **Backend**: Express 5.2+, TypeScript 5.3+
- **Datos**: Apache Jena Fuseki 6.1.0
- **Runtime**: Node.js 20+, Java 17+

---

## ✅ Checklist de documentación

- [x] QUICK_START.md - Guía de 5 minutos
- [x] CHECKLIST.md - Verificación completa
- [x] README.md - Descripción general
- [x] API_FILTROS.md - Endpoints
- [x] ARQUITECTURA.md - Diseño del sistema
- [x] FRONTEND_ESTRUCTURA.md - Código del frontend
- [x] frontend/README.md - Frontend docs
- [x] frontend/USAGE.md - Guía de uso
- [x] INDICE.md - Este archivo

**Última actualización**: Mayo 2026

---

## 🎯 Ejemplos rápidos

### CLI: Buscar slashers de los 80s
```bash
curl "http://localhost:4000/api/peliculas?subgenero=Slasher&anioMin=1980&anioMax=1989"
```

### CLI: Ver detalles de película
```bash
curl "http://localhost:4000/api/peliculas/TheRing2002"
```

### Browser: Acceder al frontend
```
http://localhost:5173
```

---

**¿Listo para empezar? → [QUICK_START.md](QUICK_START.md)** 🚀
