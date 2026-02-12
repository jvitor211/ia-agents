import { db } from "../db/client.js";

type ProjectContext = {
  project_id: string;
  content: string;
  updated_at: string;
};

export class ProjectContextRepository {
  upsert(projectId: string, content: string, updatedAt: string) {
    db.prepare(
      `INSERT INTO project_context (project_id, content, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(project_id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at`
    ).run(projectId, content, updatedAt);
  }

  get(projectId: string): ProjectContext | undefined {
    return db.prepare(`SELECT * FROM project_context WHERE project_id = ?`).get(projectId) as
      | ProjectContext
      | undefined;
  }
}
