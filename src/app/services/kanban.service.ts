import { Injectable, signal, computed } from '@angular/core';
import type { Task, TaskStatus } from '../models/task.model';
import type { KanbanBoard, KanbanColumn } from '../models/kanban.model';
import { DEFAULT_COLUMNS } from '../models/kanban.model';

const STORAGE_KEY = 'kanban-app-data';

@Injectable({ providedIn: 'root' })
export class KanbanService {
  private readonly boardSignal = signal<KanbanBoard | null>(null);

  readonly board = this.boardSignal.asReadonly();
  readonly columns = computed(() => this.boardSignal()?.columns ?? []);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as KanbanBoard;
        this.boardSignal.set(this.hydrateBoard(data));
      } else {
        this.initDefaultBoard();
      }
    } catch {
      this.initDefaultBoard();
    }
  }

  private hydrateBoard(data: KanbanBoard): KanbanBoard {
    const columns: KanbanColumn[] = DEFAULT_COLUMNS.map((col) => ({
      ...col,
      tasks: (data.columns?.find((c) => c.id === col.id)?.tasks ?? []).map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }))
    }));
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      columns
    };
  }

  private initDefaultBoard(): void {
    const now = new Date();
    const board: KanbanBoard = {
      id: crypto.randomUUID(),
      name: 'Mi tablero',
      createdAt: now,
      updatedAt: now,
      columns: DEFAULT_COLUMNS.map((col) => ({
        ...col,
        tasks: []
      }))
    };
    this.boardSignal.set(board);
    this.saveToStorage();
  }

  private saveToStorage(): void {
    const board = this.boardSignal();
    if (board) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }
  }

  addTask(
    title: string,
    description: string,
    status: TaskStatus = 'backlog',
    options?: { members?: string[]; estimatedHours?: Task['estimatedHours'] }
  ): Task {
    const now = new Date();
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status,
      createdAt: now,
      updatedAt: now,
      priority: 'media',
      members: options?.members ?? [],
      estimatedHours: options?.estimatedHours
    };

    this.boardSignal.update((board) => {
      if (!board) return board;
      const columns = board.columns.map((col) =>
        col.id === status ? { ...col, tasks: [...col.tasks, task] } : col
      );
      return { ...board, columns, updatedAt: now };
    });
    this.saveToStorage();
    return task;
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    const now = new Date();
    this.boardSignal.update((board) => {
      if (!board) return board;
      let movedTask: Task | null = null;
      const columns = board.columns.map((col) => {
        const taskIndex = col.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex >= 0) {
          movedTask = { ...col.tasks[taskIndex], status: newStatus, updatedAt: now };
          return { ...col, tasks: col.tasks.filter((_, i) => i !== taskIndex) };
        }
        return col;
      });
      if (movedTask) {
        return {
          ...board,
          columns: columns.map((col) =>
            col.id === newStatus
              ? { ...col, tasks: [...col.tasks, movedTask!] }
              : col
          ),
          updatedAt: now
        };
      }
      return board;
    });
    this.saveToStorage();
  }

  updateTask(
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'members' | 'estimatedHours' | 'status'>>
  ): void {
    const now = new Date();
    const newStatus = updates.status;

    this.boardSignal.update((board) => {
      if (!board) return board;

      if (newStatus) {
        let movedTask: Task | null = null;
        const columnsAfterRemove = board.columns.map((col) => {
          const taskIndex = col.tasks.findIndex((t) => t.id === taskId);
          if (taskIndex >= 0) {
            movedTask = { ...col.tasks[taskIndex], ...updates, status: newStatus, updatedAt: now };
            return { ...col, tasks: col.tasks.filter((_, i) => i !== taskIndex) };
          }
          return col;
        });
        if (movedTask) {
          return {
            ...board,
            columns: columnsAfterRemove.map((col) =>
              col.id === newStatus ? { ...col, tasks: [...col.tasks, movedTask!] } : col
            ),
            updatedAt: now
          };
        }
      }

      const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates, updatedAt: now } : t
        )
      }));
      return { ...board, columns, updatedAt: now };
    });
    this.saveToStorage();
  }

  deleteTask(taskId: string): void {
    const now = new Date();
    this.boardSignal.update((board) => {
      if (!board) return board;
      const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId)
      }));
      return { ...board, columns, updatedAt: now };
    });
    this.saveToStorage();
  }

  getTaskById(taskId: string): Task | undefined {
    const board = this.boardSignal();
    if (!board) return undefined;
    for (const col of board.columns) {
      const task = col.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  }
}
