# ia-agents — MVP Cursor particular (Sprint 1)

## Arquitetura (Sprint 1)
- `apps/web`: UI para projetos, contexto e chat.
- `apps/api`: API para projetos, contexto, mensagens e injeção de prompt fixo.
- `packages/shared`: contratos e tipos Zod compartilhados.
- `data/`: SQLite e diretórios de projeto.

## Fluxo atual (sem RAG)
1. UI envia mensagem para `/projects/:id/chat`.
2. API busca contexto do projeto + últimas mensagens.
3. API injeta `system.md` + `developer.md` + contexto + histórico + mensagem do usuário.
4. API gera resposta inicial (placeholder arquitetural) e persiste histórico.

## Rodar localmente
```bash
npm install
npm run dev:api
npm run dev:web
```

## Próximos passos (Sprint 2)
- app `apps/indexer` com index/search.
- injeção de chunks semânticos no chat.
