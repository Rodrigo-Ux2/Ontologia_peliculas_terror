# Guía de Uso del Frontend

## Inicio

```bash
cd frontend
npm install
npm run dev
```

Accede a `http://localhost:5173`

---

## Interface

### Panel de Filtros (Izquierda)

**Búsqueda de texto**
- `Buscar película`: Filtra por título

**Rango temporal**
- `Año mínimo` / `Año máximo`: Rango de años de estreno

**Puntuaciones y niveles**
- `Nivel de Gore mínimo` (1-10): Intensidad de violencia gráfica
- `Nivel de Suspenso mínimo` (1-10): Intensidad de suspense
- `Puntuación mínima` (1-100): Valoración del proyecto
- `Rotten Tomatoes mín.` (1-100): Puntuación crítica

**Selecciones categóricas**
- `Tipo de Monstruo`: 8 opciones (Fantasma, Vampiro, Zombi, etc.)
- `Subgénero`: 8 tipos (Slasher, Paranormal, Gore, etc.)
- `Plataforma`: Netflix, Prime, HBO, etc.
- `País`: Alemania, Japón, Estados Unidos, etc.
- `Idioma`: Inglés, Español, Japonés, etc.
- `Clasificación de edad`: Mayores de 13/16/18

**Especiales**
- `Basada en hechos reales`: Checkbox

**Acciones**
- `Limpiar filtros`: Resetea todos los filtros

### Lista de Películas (Centro)

- Muestra cantidad total de resultados
- Cada película es una tarjeta clickeable
- Hover muestra efecto visual y flecha

### Modal de Detalle (Superpuesto)

Al hacer clic en una película se abre un modal con:

**Encabezado**
- Título y año de la película

**Puntuaciones** (4 tarjetas)
- Puntuación propia (1-100)
- Rotten Tomatoes (%)
- Nivel Gore (1-10)
- Nivel Suspenso (1-10)

**Información principal**
- Sinopsis completa
- Datos técnicos: duración, país, idioma, clasificación
- Datos financieros: presupuesto, recaudación
- Ambientación y estilo de fotografía

**Listas clasificadas**
- Subgéneros (badges rojos)
- Tipos de monstruos (badges púrpura)
- Plataformas disponibles (badges azules)
- Directores, actores principales, guionistas

---

## Ejemplos de búsqueda

### Slashers clásicos de los 80s
1. Rango de años: **1980** a **1989**
2. Subgénero: **Slasher**
3. Mira los resultados filtrados

### Terror psicológico moderno con altas puntuaciones
1. Subgénero: **TerrorPsicologico**
2. Puntuación mínima: **75**
3. Rotten Tomatoes: **80**

### Horror sobrenatural en streaming
1. Subgénero: **Sobrenatural**
2. Plataforma: **Netflix** (o cualquier otra)
3. Explora qué hay disponible

### Películas de vampiros europeas
1. Tipo de monstruo: **Vampiro**
2. País: **Francia / Reino Unido** (o selecciona otro)
3. Ver todas las opciones de vampiros

### Acción gore extrema
1. Nivel de Gore mínimo: **8**
2. Nivel de Suspenso mínimo: **7**
3. Descubre lo más intenso

### Terror genuino (basado en hechos)
1. Marca: **Basada en hechos reales**
2. Ordenar por Puntuación o Rotten Tomatoes
3. Encuentra historias verdaderas de terror

### Found footage movies
1. Subgénero: **FoundFootage**
2. Opcional: **anioMin: 2000** (el género es más moderno)

---

## Características de la interfaz

✨ **Búsqueda en tiempo real**: Los resultados se actualizan mientras escribes (con debounce)

🎨 **Tema oscuro**: Diseño oscuro basado en Tailwind CSS, especialmente para películas de terror

⚡ **Responsive**: Funciona en desktop, tablet y mobile

📱 **Modal no bloqueante**: Puedes cerrar el detalle de una película simplemente haciendo clic en la X

🔄 **Múltiples filtros combinados**: Usa todos los que necesites simultáneamente

---

## Tips

- Los filtros con valor "-- Todos --" están desactivados
- El checkbox "Basada en hechos reales" requiere que esté marcado para filtrar
- Usa "Limpiar filtros" para resetear todo y empezar de nuevo
- La búsqueda de texto busca en títulos completos
- Los cambios de filtro tienen un pequeño delay (debounce) para evitar solicitudes excesivas

---

## Troubleshooting

**Las películas no cargan**
- ✅ Verifica que el backend esté corriendo (`npm run dev` en `/backend`)
- ✅ Verifica que Fuseki esté corriendo (`./fuseki-server`)
- ✅ Abre la consola (F12) y busca errores de red

**"Cannot connect to localhost:4000"**
- El backend no está iniciado
- Ejecuta `cd backend && npm run dev`

**Los estilos se ven raros**
- Limpia el caché: Ctrl+Shift+Del (o Cmd+Shift+Del en Mac)
- Reconstruye: `npm run build`

---

## Desarrollo

Para agregar más filtros o funcionalidades, edita:

- `src/types/index.ts` - Define nuevos tipos y opciones
- `src/components/FilterPanel.tsx` - Agrega nuevos controles
- `src/services/api.ts` - Actualiza la construcción de parámetros
