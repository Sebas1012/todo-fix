export type TaskCategory = 'FrontEnd' | 'BackEnd' | 'Docs';
export type TaskPriority = 'Baja' | 'Media' | 'Urgente';

export type Task = {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskFilter = boolean | undefined;

export interface TaskRepository {
  create(input: { title: string; category: TaskCategory; priority: TaskPriority; completed?: boolean }): Promise<Task>;
  findMany(input: { completed?: boolean; skip: number; take: number }): Promise<{ items: Task[]; total: number }>;
  findById(id: string): Promise<Task | null>;
  update(id: string, input: { title?: string; category?: TaskCategory; priority?: TaskPriority; completed?: boolean }): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
