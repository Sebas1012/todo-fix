export type TaskCategory = 'FrontEnd' | 'BackEnd' | 'Docs';
export type TaskPriority = 'Baja' | 'Media' | 'Urgente';
export type TaskStatus = 'Todos' | 'Pendientes' | 'Completadas';
export type TaskSort = 'Fecha de creación' | 'Prioridad';

export interface Task {
  readonly id: string;
  readonly title: string;
  readonly category: TaskCategory;
  readonly priority: TaskPriority;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly completed: boolean;
}

export interface CreateTaskInput {
  readonly title: string;
  readonly category: TaskCategory;
  readonly priority: TaskPriority;
}
