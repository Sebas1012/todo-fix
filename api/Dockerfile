FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma
RUN pnpm prisma generate

COPY tsconfig.json openapi.ts ./
COPY src ./src
COPY tests ./tests

EXPOSE 3000

CMD ["pnpm", "dev"]
