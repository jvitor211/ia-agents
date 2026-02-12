import fs from "node:fs";
import path from "node:path";
import type { Message } from "@ia-agents/shared";

function readPrompt(fileName: string): string {
  const filePath = path.resolve(process.cwd(), `src/prompts/${fileName}`);
  return fs.readFileSync(filePath, "utf-8");
}

export type ChatPromptInput = {
  projectContext: string;
  latestMessages: Message[];
  userMessage: string;
};

export function buildPrompt(input: ChatPromptInput): string {
  const systemPrompt = readPrompt("system.md");
  const developerPrompt = readPrompt("developer.md");
  const history = input.latestMessages
    .slice()
    .reverse()
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n");

  return [
    "# SYSTEM",
    systemPrompt,
    "",
    "# DEVELOPER",
    developerPrompt,
    "",
    "# PROJECT_CONTEXT",
    input.projectContext,
    "",
    "# HISTORY",
    history || "(sem histórico)",
    "",
    "# USER",
    input.userMessage
  ].join("\n");
}

export function generateAssistantReply(userMessage: string): string {
  return [
    "## Plano",
    `- Entendi a solicitação: ${userMessage}`,
    "- Vou decompor o problema, definir arquitetura e orientar implementação incremental.",
    "",
    "## Arquitetura e componentes",
    "- API orquestra contexto e histórico para resposta consistente.",
    "- Web exibe chat e edição de contexto por projeto.",
    "",
    "## Implementação (passo a passo)",
    "1. Validar requisitos e restrições.",
    "2. Definir contratos e persistência.",
    "3. Implementar endpoint e fluxo de dados.",
    "4. Validar com testes e checks.",
    "",
    "## Trade-offs",
    "- MVP prioriza simplicidade e clareza sobre automações avançadas.",
    "",
    "## Quality Checklist",
    "- [x] Plano explícito.",
    "- [x] Arquitetura descrita.",
    "- [x] Passos objetivos de implementação.",
    "",
    "## Próximos passos",
    "- Integrar LLM real e RAG no Sprint 2."
  ].join("\n");
}
