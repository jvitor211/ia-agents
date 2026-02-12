import { Router } from "express";
import { v4 as uuid } from "uuid";
import { chatRequestSchema } from "@ia-agents/shared";
import { ProjectsRepository } from "../repositories/projects-repository.js";
import { ProjectContextRepository } from "../repositories/project-context-repository.js";
import { MessagesRepository } from "../repositories/messages-repository.js";
import { buildPromptPreview, callModel } from "../services/chat-service.js";

const projectsRepository = new ProjectsRepository();
const contextRepository = new ProjectContextRepository();
const messagesRepository = new MessagesRepository();

export const chatRouter = Router();

chatRouter.post("/projects/:id/chat", async (req, res) => {
  const parsed = chatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const project = projectsRepository.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  const now = new Date().toISOString();
  const userMessage = {
    id: uuid(),
    project_id: project.id,
    role: "user" as const,
    content: parsed.data.message,
    created_at: now
  };
  messagesRepository.create(userMessage);

  const context = contextRepository.get(project.id)?.content ?? "";
  const latestMessages = messagesRepository.listLatest(project.id, 12);
  const promptInput = {
    projectContext: context,
    latestMessages,
    userMessage: parsed.data.message
  };

  try {
    const assistantContent = await callModel(promptInput);
    const assistantMessage = {
      id: uuid(),
      project_id: project.id,
      role: "assistant" as const,
      content: assistantContent,
      created_at: new Date().toISOString()
    };
    messagesRepository.create(assistantMessage);

    return res.json({
      message: assistantMessage,
      meta: {
        prompt_preview: buildPromptPreview(promptInput).slice(0, 1200)
      }
    });
  } catch (error) {
    return res.status(502).json({
      error: "Model call failed",
      detail: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
