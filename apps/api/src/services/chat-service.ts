import fs from "node:fs";
import path from "node:path";
import type { Message } from "@ia-agents/shared";

function readPrompt(fileName: string): string {
  const filePath = path.resolve(process.cwd(), `prompts/${fileName}`);
  return fs.readFileSync(filePath, "utf-8").trim();
}

export type ChatPromptInput = {
  projectContext: string;
  latestMessages: Message[];
  userMessage: string;
};

export function buildPromptSections(input: ChatPromptInput) {
  const systemPrompt = readPrompt("system.md");
  const developerPrompt = readPrompt("developer.md");
  const history = input.latestMessages
    .slice()
    .reverse()
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n");

  const contextSection = input.projectContext.trim().length > 0 ? input.projectContext : "(sem contexto)";

  return {
    systemPrompt,
    developerPrompt,
    contextSection,
    historySection: history || "(sem histórico)",
    userMessage: input.userMessage
  };
}

export function buildPromptPreview(input: ChatPromptInput): string {
  const sections = buildPromptSections(input);
  return [
    "# SYSTEM",
    sections.systemPrompt,
    "",
    "# DEVELOPER",
    sections.developerPrompt,
    "",
    "# PROJECT_CONTEXT",
    sections.contextSection,
    "",
    "# HISTORY",
    sections.historySection,
    "",
    "# USER",
    sections.userMessage
  ].join("\n");
}

export async function callModel(input: ChatPromptInput): Promise<string> {
  const sections = buildPromptSections(input);

  if (!process.env.OPENAI_API_KEY) {
    return [
      "## Plano",
      `- Solicitação recebida: ${input.userMessage}`,
      "- Vou responder no modo arquiteto com base no contexto do projeto.",
      "",
      "## Arquitetura e componentes",
      "- Projeto organizado em web, api e shared para separação de responsabilidades.",
      "- Chat usa prompt fixo (system + developer) e contexto persistido no projeto.",
      "",
      "## Implementação (passo a passo)",
      "1. Confirmar objetivo e restrições.",
      "2. Definir alterações por módulo.",
      "3. Executar implementação incremental.",
      "4. Validar com checks e testes.",
      "",
      "## Trade-offs",
      "- Sem OPENAI_API_KEY, a resposta usa fallback local determinístico para manter o fluxo funcional.",
      "",
      "## Quality Checklist",
      "- [x] Prompt fixo aplicado.",
      "- [x] Contexto do projeto considerado.",
      "- [x] Resposta estruturada.",
      "",
      "## Próximos passos",
      "- Configurar OPENAI_API_KEY para usar modelo remoto real."
    ].join("\n");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: sections.systemPrompt },
        { role: "developer", content: sections.developerPrompt },
        {
          role: "user",
          content: [
            "# PROJECT_CONTEXT",
            sections.contextSection,
            "",
            "# HISTORY",
            sections.historySection,
            "",
            "# USER",
            sections.userMessage
          ].join("\n")
        }
      ]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Model call failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Model call returned empty content");
  }

  return content;
}
