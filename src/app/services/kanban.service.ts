import { Injectable, signal, computed } from '@angular/core';
import type { Task, TaskStatus } from '../models/task.model';
import type { KanbanBoard, KanbanColumn } from '../models/kanban.model';
import { DEFAULT_COLUMNS } from '../models/kanban.model';

const STORAGE_KEY = 'kanban-app-data';

interface StoredData {
  boards: KanbanBoard[];
}

@Injectable({ providedIn: 'root' })
export class KanbanService {
  private readonly boardsSignal = signal<KanbanBoard[]>([]);
  private readonly currentBoardIdSignal = signal<string | null>(null);

  readonly boards = this.boardsSignal.asReadonly();
  readonly currentBoardId = this.currentBoardIdSignal.asReadonly();

  readonly board = computed(() => {
    const id = this.currentBoardIdSignal();
    const boards = this.boardsSignal();
    return boards.find((b) => b.id === id) ?? null;
  });

  readonly columns = computed(() => this.board()?.columns ?? []);

  constructor() {
    this.loadFromStorage();
  }

  setCurrentBoard(id: string | null): void {
    this.currentBoardIdSignal.set(id);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (Array.isArray(data.boards)) {
          this.boardsSignal.set(
            data.boards.map((b: KanbanBoard) => this.hydrateBoard(b))
          );
        } else if (data.id && data.columns) {
          this.boardsSignal.set([this.hydrateBoard(data as KanbanBoard)]);
        }
      }
      if (this.boardsSignal().length === 0) {
        this.createBoard('Mi tablero');
      }
    } catch {
      this.createBoard('Mi tablero');
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

  private saveToStorage(): void {
    const boards = this.boardsSignal();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ boards }));
  }

  private updateBoard(boardId: string, updater: (board: KanbanBoard) => KanbanBoard): void {
    this.boardsSignal.update((boards) =>
      boards.map((b) => (b.id === boardId ? updater(b) : b))
    );
    this.saveToStorage();
  }

  createBoard(name: string): KanbanBoard {
    const now = new Date();
    const board: KanbanBoard = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
      columns: DEFAULT_COLUMNS.map((col) => ({ ...col, tasks: [] }))
    };
    this.boardsSignal.update((boards) => [...boards, board]);
    this.saveToStorage();
    return board;
  }

  deleteBoard(boardId: string): void {
    this.boardsSignal.update((boards) => boards.filter((b) => b.id !== boardId));
    if (this.currentBoardIdSignal() === boardId) {
      this.currentBoardIdSignal.set(null);
    }
    this.saveToStorage();
  }

  updateBoardName(boardId: string, name: string): void {
    const now = new Date();
    this.updateBoard(boardId, (b) => ({ ...b, name, updatedAt: now }));
  }

  addTask(
    title: string,
    description: string,
    status: TaskStatus = 'backlog',
    options?: { members?: string[]; estimatedHours?: Task['estimatedHours'] }
  ): Task | null {
    const boardId = this.currentBoardIdSignal();
    if (!boardId) return null;

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

    this.updateBoard(boardId, (board) => {
      const columns = board.columns.map((col) =>
        col.id === status ? { ...col, tasks: [...col.tasks, task] } : col
      );
      return { ...board, columns, updatedAt: now };
    });
    return task;
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    const boardId = this.currentBoardIdSignal();
    if (!boardId) return;

    const now = new Date();
    this.updateBoard(boardId, (board) => {
      let movedTask: Task | null = null;
      const columnsAfterRemove = board.columns.map((col) => {
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
          columns: columnsAfterRemove.map((col) =>
            col.id === newStatus ? { ...col, tasks: [...col.tasks, movedTask!] } : col
          ),
          updatedAt: now
        };
      }
      return board;
    });
  }

  updateTask(
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'members' | 'estimatedHours' | 'status'>>
  ): void {
    const boardId = this.currentBoardIdSignal();
    if (!boardId) return;

    const now = new Date();
    const newStatus = updates.status;

    this.updateBoard(boardId, (board) => {
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
  }

  deleteTask(taskId: string): void {
    const boardId = this.currentBoardIdSignal();
    if (!boardId) return;

    const now = new Date();
    this.updateBoard(boardId, (board) => {
      const columns = board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId)
      }));
      return { ...board, columns, updatedAt: now };
    });
  }

  getTaskById(taskId: string): Task | undefined {
    const board = this.board();
    if (!board) return undefined;
    for (const col of board.columns) {
      const task = col.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  }

  getTotalTasks(board: KanbanBoard): number {
    return board.columns.reduce((sum, col) => sum + col.tasks.length, 0);
  }
}
