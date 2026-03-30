# credito-poc-web (Next.js)

Console em **Next.js 15** + **Tailwind** que consome o BFF Nest em `/api/v1/*` (proxy para Rails).

- Tipos: `src/lib/types/rails-entities.ts` (manter alinhado com `credito-poc-nestjs/src/domain/rails-entities.ts`).
- Variáveis: [`.env.example`](.env.example).

```bash
npm install
cp .env.example .env.local   # opcional
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) em dev local; com Docker Compose na raiz do monorepo, o serviço `web` publica **3001 → 3000**.
