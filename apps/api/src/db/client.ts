import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.resolve(process.cwd(), "../../data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");
export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
