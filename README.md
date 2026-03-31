# credito-poc-web (Next.js)

Console em **Next.js 15** + **Tailwind** que consome o BFF Nest em `/api/v1/*` (proxy para Rails).

- Tipos: `src/lib/types/rails-entities.ts` (manter alinhado com `credito-poc-nestjs/src/domain/rails-entities.ts`).
- Variáveis: [`.env.example`](.env.example).

## Regra: não use `npm` no host

Instalação de dependências e `npm run dev` / `build` devem correr **dentro do Docker** (o Compose monta o código e usa o volume `web_node_modules`). Na **raiz do monorepo**:

```bash
docker compose up --build   # sobe infra + Rails + Nest + web (Next)
```

O serviço `web` expõe **http://localhost:3001** (porta do host → 3000 no contentor). Copie [`.env.example`](.env.example) para `.env.local` se precisar de overrides (opcional).

**Equivalentes ao que seria `npm` no host** (a partir da raiz, com stack já definida no [compose.yml](../compose.yml)):

```bash
# Instalar dependências no contentor (raramente necessário à mão — o build do Dockerfile já faz)
docker compose run --rm web npm install

# Build de produção (ou use `make web-ci` na raiz — ver DOCKER.md)
docker compose run --rm web npm run build
```

Para desenvolvimento sem stack completa, não há fluxo oficial só com Node no host; alinhe com [README da raiz](../README.md) e [DOCKER.md](../DOCKER.md).
