# IRIS To-Do API

Backend REST construido con Express 5, TypeScript, Prisma 6 y MongoDB Atlas.

## Instalacion

```bash
pnpm install
copy .env.example .env
pnpm prisma:generate
pnpm prisma:push
pnpm dev
```

Configura `DATABASE_URL` en `.env` con una URI de MongoDB Atlas. Nunca subas ese archivo al repositorio.

## Endpoints

Todos los endpoints de tareas requieren `Authorization: Bearer <token>` en producción. Para desarrollo local puede habilitarse temporalmente `DEV_AUTH_BYPASS=true`; nunca debe activarse en producción.

Las tareas contienen `title`, `category`, `priority`, `completed`, `createdAt` y `updatedAt`. Las categorías válidas son `FrontEnd`, `BackEnd` y `Docs`; las prioridades son `Baja`, `Media` y `Urgente`.

```text
POST   /api/auth/login
GET    /api/tasks?completed=true&page=1&limit=20
GET    /api/tasks/:id
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

La documentación interactiva está disponible en `/docs` y el contrato OpenAPI en `/openapi.json`.

## Arquitectura

El dominio define las interfaces de repositorio. Los casos de uso no dependen de Express ni Prisma. La implementación `PrismaTaskRepository` vive en infraestructura y el composition root conecta las dependencias en `src/app.ts`.

## Verificacion

```bash
pnpm build
pnpm test
```
