import { Router } from "express";
import { v4 as uuid } from "uuid";
import { createProjectSchema, updateProjectContextSchema } from "@ia-agents/shared";
import { ProjectsRepository } from "../repositories/projects-repository.js";
import { ProjectContextRepository } from "../repositories/project-context-repository.js";

const projectsRepository = new ProjectsRepository();
const contextRepository = new ProjectContextRepository();

export const projectsRouter = Router();

projectsRouter.post("/projects", (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const now = new Date().toISOString();
  const project = {
    id: uuid(),
    name: parsed.data.name,
    root_path: parsed.data.root_path,
    created_at: now
  };

  projectsRepository.create(project);
  contextRepository.upsert(project.id, "", now);

  return res.status(201).json(project);
});

projectsRouter.get("/projects", (_req, res) => {
  return res.json(projectsRepository.findAll());
});

projectsRouter.get("/projects/:id", (req, res) => {
  const project = projectsRepository.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const context = contextRepository.get(project.id);
  return res.json({ ...project, context: context?.content ?? "" });
});

projectsRouter.put("/projects/:id/context", (req, res) => {
  const parsed = updateProjectContextSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const project = projectsRepository.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const now = new Date().toISOString();
  contextRepository.upsert(project.id, parsed.data.content, now);
  return res.json({ project_id: project.id, content: parsed.data.content, updated_at: now });
});
