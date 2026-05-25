import express from "express";
import cors from "cors";
import { peliculasRouter } from "./routes/peliculas.js";
import { sparqlRouter } from "./routes/sparql.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", peliculasRouter);
app.use("/api", sparqlRouter);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
