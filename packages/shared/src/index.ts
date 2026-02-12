import { z } from "zod";

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  root_path: z.string().min(1),
  created_at: z.string()
});

export const createProjectSchema = z.object({
  name: z.string().min(1),
  root_path: z.string().min(1)
});

export const updateProjectContextSchema = z.object({
  content: z.string()
});

export const chatRequestSchema = z.object({
  message: z.string().min(1)
});

export const messageSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  created_at: z.string()
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProjectContext = z.infer<typeof updateProjectContextSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type Message = z.infer<typeof messageSchema>;
