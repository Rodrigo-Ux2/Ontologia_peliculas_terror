import { Router, Request, Response } from "express";

const FUSEKI_QUERY = process.env.FUSEKI_URL ?? "http://localhost:3030/peliculas/query";
const FUSEKI_UPDATE = process.env.FUSEKI_UPDATE ?? "http://localhost:3030/peliculas/update";

const UPDATE_KEYWORDS = /^\s*(INSERT|DELETE|CLEAR|DROP|CREATE|LOAD|PREFIX\s+\w+:\s*<[^>]+>\s*)*(INSERT|DELETE|CLEAR|DROP|CREATE|LOAD)/im;

function isUpdate(query: string): boolean {
  return UPDATE_KEYWORDS.test(query.trim());
}

export const sparqlRouter = Router();

sparqlRouter.post("/sparql", async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      res.status(400).json({ error: "Se requiere el campo 'query' (string)" });
      return;
    }

    const isUpdateQuery = isUpdate(query);
    const endpoint = isUpdateQuery ? FUSEKI_UPDATE : FUSEKI_QUERY;

    const headers: Record<string, string> = {
      "Content-Type": "application/sparql-query",
    };
    if (!isUpdateQuery) {
      headers["Accept"] = "application/sparql-results+json";
    }

    const fuseRes = await fetch(endpoint, {
      method: "POST",
      headers,
      body: query,
    });

    if (!fuseRes.ok) {
      const text = await fuseRes.text();
      res.status(fuseRes.status).json({ error: `Fuseki ${fuseRes.status}: ${text}` });
      return;
    }

    if (isUpdateQuery) {
      res.json({ success: true });
      return;
    }

    const contentType = fuseRes.headers.get("content-type") || "";

    if (contentType.includes("application/sparql-results+json")) {
      const json = await fuseRes.json();
      res.json(json);
    } else {
      const text = await fuseRes.text();
      res.type("text/plain").send(text);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});
