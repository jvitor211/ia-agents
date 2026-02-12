import cors from "cors";
import express from "express";
import { initializeSchema } from "./db/schema.js";
import { projectsRouter } from "./routes/projects-routes.js";
import { chatRouter } from "./routes/chat-routes.js";

initializeSchema();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(projectsRouter);
app.use(chatRouter);

const port = Number(process.env.API_PORT || 4000);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
