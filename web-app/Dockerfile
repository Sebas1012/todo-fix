FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY angular.json tsconfig*.json .postcssrc.json .prettierrc ./
COPY public ./public
COPY src ./src

EXPOSE 4200

CMD ["pnpm", "exec", "ng", "serve", "--host", "0.0.0.0", "--allowed-hosts"]
