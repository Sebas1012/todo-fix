import { describe, expect, it } from 'vitest';
import { presentTask } from '../../../src/modules/tasks/interfaces/task-presenter.js';
import { makeTask } from '../../helpers/task-fakes.js';
describe('task presenter', () => {
    it('formats dates in Colombia timezone', () => {
        const result = presentTask(makeTask({ createdAt: new Date('2026-08-15T03:00:00.000Z'), updatedAt: new Date('2026-08-16T04:00:00.000Z') }));
        expect(result.createdAt).toBe('2026-08-14');
        expect(result.updatedAt).toBe('2026-08-15');
    });
});
