import express from "express";
import cors from "cors";
import { peliculasRouter } from "./routes/peliculas.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", peliculasRouter);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
