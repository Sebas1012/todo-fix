import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
const makeIntegrationDependencies = () => {
    const users = new Map();
    const tasks = new Map();
    let userSequence = 0;
    let taskSequence = 0;
    const userRepository = {
        findByEmail: async (email) => [...users.values()].find((user) => user.email === email) ?? null,
        findById: async (id) => users.get(id) ?? null,
        create: async (input) => {
            const user = { id: `user-${++userSequence}`, ...input };
            users.set(user.id, user);
            return user;
        },
    };
    const taskRepository = {
        create: async (userId, input) => {
            const now = new Date('2026-08-15T00:00:00.000Z');
            const task = { id: `${++taskSequence}`.padStart(24, '0'), userId, ...input, completed: input.completed ?? false, createdAt: now, updatedAt: now };
            tasks.set(task.id, task);
            return task;
        },
        findMany: async (userId, input) => {
            const items = [...tasks.values()].filter((task) => task.userId === userId && (input.completed === undefined || task.completed === input.completed));
            return { items: items.slice(input.skip, input.skip + input.take), total: items.length };
        },
        findById: async (userId, id) => tasks.get(id)?.userId === userId ? tasks.get(id) : null,
        update: async (userId, id, input) => {
            const task = tasks.get(id);
            if (!task || task.userId !== userId)
                return null;
            const updated = { ...task, ...input, updatedAt: new Date('2026-08-16T00:00:00.000Z') };
            tasks.set(id, updated);
            return updated;
        },
        delete: async (userId, id) => {
            const task = tasks.get(id);
            if (!task || task.userId !== userId)
                return false;
            tasks.delete(id);
            return true;
        },
    };
    const passwords = {
        hash: async (value) => `hash:${value}`,
        compare: async (value, hash) => hash === `hash:${value}`,
    };
    const tokens = {
        sign: (userId) => `session:${userId}`,
        verify: (token) => {
            if (!token.startsWith('session:'))
                throw new Error('Invalid token');
            return token.replace('session:', '');
        },
    };
    return { users: userRepository, tasks: taskRepository, passwords, tokens };
};
describe('HTTP integration', () => {
    it('registers, restores and closes a cookie session', async () => {
        const app = createApp(makeIntegrationDependencies());
        const client = request.agent(app);
        const register = await client.post('/api/auth/register').send({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'password' });
        expect(register.status).toBe(201);
        expect(register.body.data.user.email).toBe('ada@example.com');
        expect(register.body.data.token).toBeUndefined();
        expect(register.headers['set-cookie'][0]).toContain('iris_auth=');
        const me = await client.get('/api/auth/me');
        expect(me.status).toBe(200);
        expect(me.body.data.user.email).toBe('ada@example.com');
        const logout = await client.post('/api/auth/logout');
        expect(logout.status).toBe(204);
        expect(logout.headers['set-cookie'][0]).toContain('Max-Age=0');
    });
    it('protects task routes without a cookie', async () => {
        const response = await request(createApp(makeIntegrationDependencies())).get('/api/tasks');
        expect(response.status).toBe(401);
        expect(response.body.error).toMatchObject({ code: 'HTTP_401' });
    });
    it('keeps task lists isolated between authenticated users', async () => {
        const app = createApp(makeIntegrationDependencies());
        const userA = request.agent(app);
        const userB = request.agent(app);
        await userA.post('/api/auth/register').send({ fullName: 'User A', email: 'a@example.com', password: 'password' });
        await userB.post('/api/auth/register').send({ fullName: 'User B', email: 'b@example.com', password: 'password' });
        const created = await userA.post('/api/tasks').send({ title: 'Private task', category: 'Docs', priority: 'Media' });
        expect(created.status).toBe(201);
        const taskId = created.body.data.id;
        const listA = await userA.get('/api/tasks');
        const listB = await userB.get('/api/tasks');
        expect(listA.body.data).toHaveLength(1);
        expect(listB.body.data).toHaveLength(0);
        expect((await userB.get(`/api/tasks/${taskId}`)).status).toBe(404);
        expect((await userB.patch(`/api/tasks/${taskId}`).send({ completed: true })).status).toBe(404);
        expect((await userB.delete(`/api/tasks/${taskId}`)).status).toBe(404);
        expect((await userA.patch(`/api/tasks/${taskId}`).send({ completed: true })).status).toBe(200);
        expect((await userA.delete(`/api/tasks/${taskId}`)).status).toBe(204);
    });
    it('returns validation errors with the shared error shape', async () => {
        const client = request.agent(createApp(makeIntegrationDependencies()));
        await client.post('/api/auth/register').send({ fullName: 'User', email: 'user@example.com', password: 'password' });
        const response = await client.post('/api/tasks').send({ title: '', category: 'Invalid', priority: 'Media' });
        expect(response.status).toBe(400);
        expect(response.body.error).toMatchObject({ code: 'HTTP_400', message: 'Validation failed' });
    });
});
