export type TaskStatus = 'backlog' | 'en-proceso' | 'bloqueado' | 'hecho';

/** Valores de Fibonacci para estimación: 1, 2, 3, 5, 8, 13, 21, 34 */
export const ESTIMATED_HOURS_OPTIONS = [1, 2, 3, 5, 8, 13, 21, 34] as const;

export type EstimatedHours = (typeof ESTIMATED_HOURS_OPTIONS)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  priority?: 'baja' | 'media' | 'alta';
  members?: string[];
  estimatedHours?: EstimatedHours;
}
