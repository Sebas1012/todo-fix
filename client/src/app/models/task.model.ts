export type TaskCategory = 'Backend' | 'Frontend' | 'DevOps' | 'Docs';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'All' | 'Pending' | 'Completed';
export type TaskSort = 'Due date' | 'Priority';

export interface Task {
  readonly id: number;
  readonly title: string;
  readonly category: TaskCategory;
  readonly priority: TaskPriority;
  readonly date: string;
  readonly completed: boolean;
}

export interface CreateTaskInput {
  readonly title: string;
  readonly category: TaskCategory;
  readonly priority: TaskPriority;
  readonly date: string;
}
