# ia-agents — Sprint 1

## Estrutura monorepo

- `apps/web`: frontend Next.js com páginas `/projects` e `/projects/[id]`.
- `apps/api`: backend Express + SQLite com endpoints de projetos e chat.
- `packages/shared`: tipos/contratos Zod compartilhados.
- `data/app.db`: banco SQLite criado automaticamente no boot da API.

## Funcionalidades do Sprint 1

- Criar projeto.
- Carregar detalhes de projeto.
- Salvar contexto do projeto.
- Enviar mensagem no chat por projeto.
- Receber resposta com prompt fixo (system + developer + contexto + histórico).

## Endpoints da API

- `POST /projects`
- `GET /projects`
- `GET /projects/:id`
- `PUT /projects/:id/context`
- `POST /projects/:id/chat`

## Prompt fixo

Os prompts ficam em:

- `apps/api/prompts/system.md`
- `apps/api/prompts/developer.md`

Toda chamada de chat injeta, nesta ordem:

1. system prompt
2. developer prompt
3. contexto do projeto
4. histórico recente
5. mensagem atual do usuário

## Rodar localmente

### 1) Instalar dependências

```bash
npm install
```

### 2) Iniciar API

```bash
npm run dev:api
```

A API sobe em `http://localhost:4000` e cria `data/app.db` automaticamente.

### 3) Iniciar frontend

```bash
npm run dev:web
```

Acesse `http://localhost:3000/projects`.

## Configuração opcional de modelo remoto

Por padrão, sem `OPENAI_API_KEY`, o chat usa fallback local determinístico para manter o fluxo funcional.

Para usar OpenAI:

```bash
export OPENAI_API_KEY="sua-chave"
export OPENAI_MODEL="gpt-4o-mini"
```
