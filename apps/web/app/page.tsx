"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Project = { id: string; name: string; root_path: string; created_at: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [rootPath, setRootPath] = useState("");

  async function loadProjects() {
    const response = await fetch(`${API_BASE}/projects`);
    const data = await response.json();
    setProjects(data);
  }

  useEffect(() => {
    void loadProjects();
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, root_path: rootPath })
    });
    setName("");
    setRootPath("");
    await loadProjects();
  }

  return (
    <main>
      <h1>ia-agents — Dashboard</h1>
      <div className="card">
        <h2>Novo projeto</h2>
        <form onSubmit={createProject}>
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>root_path</label>
          <input value={rootPath} onChange={(e) => setRootPath(e.target.value)} required />
          <button type="submit">Criar projeto</button>
        </form>
      </div>

      <div className="card">
        <h2>Projetos</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/projects/${project.id}`}>{project.name}</Link> — {project.root_path}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
