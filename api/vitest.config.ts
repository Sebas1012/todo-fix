import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/server.ts',
        'src/app.ts',
        'src/infrastructure/**',
        'src/interfaces/http/async-handler.ts',
        'src/modules/tasks/interfaces/controllers/**',
        'src/modules/**/interfaces/routes/**',
        'src/modules/**/infrastructure/prisma-*.ts',
        'src/modules/auth/infrastructure/bcrypt-password-hasher.ts',
      ],
    },
  },
});
