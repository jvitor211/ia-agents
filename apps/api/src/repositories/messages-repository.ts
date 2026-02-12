import { db } from "../db/client.js";
import type { Message } from "@ia-agents/shared";

export class MessagesRepository {
  create(message: Message) {
    db.prepare(
      `INSERT INTO messages (id, project_id, role, content, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).run(message.id, message.project_id, message.role, message.content, message.created_at);
  }

  listLatest(projectId: string, limit = 12): Message[] {
    return db
      .prepare(
        `SELECT * FROM messages WHERE project_id = ? ORDER BY created_at DESC LIMIT ?`
      )
      .all(projectId, limit) as Message[];
  }
}
