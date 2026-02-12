import { db } from "../db/client.js";
import type { Project } from "@ia-agents/shared";

export class ProjectsRepository {
  create(project: Project) {
    db.prepare(
      `INSERT INTO projects (id, name, root_path, created_at) VALUES (?, ?, ?, ?)`
    ).run(project.id, project.name, project.root_path, project.created_at);
  }

  findAll(): Project[] {
    return db.prepare(`SELECT * FROM projects ORDER BY created_at DESC`).all() as Project[];
  }

  findById(id: string): Project | undefined {
    return db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id) as Project | undefined;
  }
}
