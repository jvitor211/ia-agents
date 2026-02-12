"use client";

import { useEffect, useState } from "react";

type ProjectDetails = {
  id: string;
  name: string;
  root_path: string;
  context: string;
};

type AssistantResponse = {
  message: { content: string };
  meta: { prompt_preview: string };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [promptPreview, setPromptPreview] = useState("");

  async function loadProject() {
    const response = await fetch(`${API_BASE}/projects/${params.id}`);
    const data = await response.json();
    setProject(data);
    setContext(data.context || "");
  }

  useEffect(() => {
    void loadProject();
  }, [params.id]);

  async function saveContext() {
    await fetch(`${API_BASE}/projects/${params.id}/context`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: context })
    });
    await loadProject();
  }

  async function sendChat(e: React.FormEvent) {
    e.preventDefault();
    const response = await fetch(`${API_BASE}/projects/${params.id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data: AssistantResponse = await response.json();
    setAssistantReply(data.message.content);
    setPromptPreview(data.meta.prompt_preview);
    setMessage("");
  }

  if (!project) return <main>Carregando...</main>;

  return (
    <main>
      <h1>{project.name}</h1>
      <p>root_path: {project.root_path}</p>

      <div className="card">
        <h2>Contexto do projeto</h2>
        <textarea rows={10} value={context} onChange={(e) => setContext(e.target.value)} />
        <button onClick={saveContext}>Salvar contexto</button>
      </div>

      <div className="card">
        <h2>Chat</h2>
        <form onSubmit={sendChat}>
          <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
          <button type="submit">Enviar</button>
        </form>
      </div>

      <div className="card">
        <h2>Resposta</h2>
        <pre>{assistantReply || "Sem resposta ainda."}</pre>
      </div>

      <div className="card">
        <h2>Prompt preview (injeção)</h2>
        <pre>{promptPreview || "Sem envio ainda."}</pre>
      </div>
    </main>
  );
}
