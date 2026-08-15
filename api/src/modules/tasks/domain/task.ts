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
  create(userId: string, input: { title: string; category: TaskCategory; priority: TaskPriority; completed?: boolean }): Promise<Task>;
  findMany(userId: string, input: { completed?: boolean; skip: number; take: number }): Promise<{ items: Task[]; total: number }>;
  findById(userId: string, id: string): Promise<Task | null>;
  update(userId: string, id: string, input: { title?: string; category?: TaskCategory; priority?: TaskPriority; completed?: boolean }): Promise<Task | null>;
  delete(userId: string, id: string): Promise<boolean>;
}
