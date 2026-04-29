FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS development
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV WATCHPACK_POLLING=true
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM deps AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_RAILS_URL=http://127.0.0.1:3000
ENV NEXT_PUBLIC_RAILS_URL=$NEXT_PUBLIC_RAILS_URL
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
