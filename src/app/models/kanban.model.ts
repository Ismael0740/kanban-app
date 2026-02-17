import type { Task, TaskStatus } from './task.model';

export interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export interface KanbanBoard {
  id: string;
  name: string;
  columns: KanbanColumn[];
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'en-proceso', title: 'En proceso' },
  { id: 'bloqueado', title: 'Bloqueado' },
  { id: 'hecho', title: 'Hecho' }
];
