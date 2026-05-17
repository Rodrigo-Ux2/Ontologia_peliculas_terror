const ENDPOINT = process.env.FUSEKI_URL ?? "http://localhost:3030/peliculas/query";

export async function sparqlSelect(query: string) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/sparql-query",
      Accept: "application/sparql-results+json",
    },
    body: query,
  });
  if (!res.ok) throw new Error(`SPARQL ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { results: { bindings: unknown[] } };
  return json.results.bindings;
}
