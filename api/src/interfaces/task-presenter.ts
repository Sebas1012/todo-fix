import type { Task } from '../domain/tasks/task.js';

const colombiaDate = (value: Date): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);

  const result = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${result.year}-${result.month}-${result.day}`;
};

export const presentTask = (task: Task) => ({
  ...task,
  createdAt: colombiaDate(task.createdAt),
  updatedAt: colombiaDate(task.updatedAt),
});
