import { buildBusquedaPeliculas } from './dist/sparql/queries.js';

const q = buildBusquedaPeliculas({ textoLibre: 'test' });
const res = await fetch('http://localhost:3030/peliculas/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/sparql-query', Accept: 'application/sparql-results+json' },
  body: q,
});
console.log('Status:', res.status);
if (!res.ok) {
  const text = await res.text();
  console.log('Error:', text.slice(0, 600));
} else {
  const data = await res.json();
  console.log('Results:', data.results.bindings.length);
}
