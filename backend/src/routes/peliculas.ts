import { Router, Request, Response } from "express";
import { sparqlSelect } from "../sparql/client.js";
import { buildBusquedaPeliculas, buildDetallePelicula } from "../sparql/queries.js";
import { fetchDbpediaData } from "../sparql/dbpedia.js";
import { translateMovieField } from "../sparql/translations.js";

export const peliculasRouter = Router();

function parseIntParam(val: unknown): number | undefined {
  if (val === undefined || val === "") return undefined;
  const n = Number(val);
  return Number.isFinite(n) ? n : undefined;
}

function parseStr(val: unknown): string | undefined {
  return typeof val === "string" && val !== "" ? val : undefined;
}

function parseBool(val: unknown): boolean | undefined {
  if (val === "true") return true;
  if (val === "false") return false;
  return undefined;
}

peliculasRouter.get("/peliculas/:id/dbpedia", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const mode = (req.query.mode as string) || "auto";
    const lang = (req.query.lang as string) || "es";
    if (!["online", "offline", "auto"].includes(mode)) {
      res.status(400).json({ error: 'Modo inválido. Usar: online, offline o auto' });
      return;
    }
    const data = await fetchDbpediaData(id, mode as any, lang);
    if (!data) {
      res.status(404).json({ error: "Sin enlace a DBpedia para esta película" });
      return;
    }
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});

peliculasRouter.get("/peliculas/:id", async (req: Request, res: Response) => {
  try {
    const query = buildDetallePelicula(String(req.params.id));
    const rows = await sparqlSelect(query);

    if (!rows.length) {
      res.status(404).json({ error: "Película no encontrada" });
      return;
    }

    type Row = Record<string, { value: string } | undefined>;
    const r = rows[0] as Row;

    const split = (field: string) =>
      r[field]?.value ? r[field]!.value.split("||").filter(Boolean) : [];

    res.json({
      id:            req.params.id,
      titulo:        r.titulo?.value ?? req.params.id,
      sinopsis:      r.sinopsis?.value ?? null,
      anio:          r.anio?.value ? Number(r.anio.value) : null,
      duracion:      r.duracion?.value ? Number(r.duracion.value) : null,
      presupuesto:   r.presupuesto?.value ? Number(r.presupuesto.value) : null,
      recaudacion:   r.recaudacion?.value ? Number(r.recaudacion.value) : null,
      nivelGore:     r.nivelGore?.value ? Number(r.nivelGore.value) : null,
      nivelSuspenso: r.nivelSuspenso?.value ? Number(r.nivelSuspenso.value) : null,
      puntuacion:    r.puntuacion?.value ? Number(r.puntuacion.value) : null,
      rt:            r.rt?.value ? Number(r.rt.value) : null,
      pais:          r.pais?.value ?? null,
      idioma:        r.idioma?.value ?? null,
      clasificacion: r.clasificacion?.value ?? null,
      basadaEnHechosReales: r.basadaHechos?.value === "true",
      ambientacion:  r.ambientacion?.value ?? null,
      estiloFotografia: r.estilo?.value ?? null,
      directores:    split("directores"),
      actores:       split("actores"),
      guionistas:    split("guionistas"),
      subgeneros:    split("subgeneros"),
      plataformas:   split("plataformas"),
      monstruos:     split("monstruos"),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    res.status(400).json({ error: message });
  }
});

peliculasRouter.get("/peliculas/:id/translations", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const lang = (req.query.lang as string) || "en";
    if (!["en", "pt"].includes(lang)) {
      res.json({});
      return;
    }

    const fields = ["sinopsis", "ambientacion", "estilo"];
    const result: Record<string, string | null> = {};

    for (const field of fields) {
      const key = field === "estilo" ? "estiloFotografia" : field;
      result[key] = await translateMovieField(id, field, lang);
    }

    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    res.status(500).json({ error: message });
  }
});

peliculasRouter.get("/peliculas", async (req: Request, res: Response) => {
  try {
    const filtros = {
      anioMin:             parseIntParam(req.query.anioMin),
      anioMax:             parseIntParam(req.query.anioMax),
      nivelGoreMin:        parseIntParam(req.query.nivelGoreMin),
      nivelSuspensoMin:    parseIntParam(req.query.nivelSuspensoMin),
      puntuacionMin:       parseIntParam(req.query.puntuacionMin),
      rtMin:               parseIntParam(req.query.rtMin),
      tipoMonstruo:        parseStr(req.query.tipoMonstruo),
      subgenero:           parseStr(req.query.subgenero),
      plataforma:          parseStr(req.query.plataforma),
      clasificacionEdad:   parseStr(req.query.clasificacionEdad),
      pais:                parseStr(req.query.pais),
      idioma:              parseStr(req.query.idioma),
      basadaEnHechosReales: parseBool(req.query.basadaEnHechosReales),
      escenario:           parseStr(req.query.escenario),
      textoLibre:          parseStr(req.query.q),
    };

    const query = buildBusquedaPeliculas(filtros);
    const rows = await sparqlSelect(query);

    res.json(
      (rows as Array<Record<string, { value: string }>>) .map((r) => ({
        iri:    r.pelicula.value,
        titulo: r.titulo?.value ?? r.pelicula.value.split("#")[1],
        anio:   r.anio?.value ?? null,
      }))
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    res.status(400).json({ error: message });
  }
});
