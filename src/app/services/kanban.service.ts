import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Task, TaskStatus } from '../models/task.model';
import type { KanbanBoard, KanbanColumn } from '../models/kanban.model';
import { DEFAULT_COLUMNS } from '../models/kanban.model';
import { firstValueFrom } from 'rxjs';

const API = '/api/boards';

@Injectable({ providedIn: 'root' })
export class KanbanService {
  private readonly http = inject(HttpClient);

  private readonly boardsSignal = signal<KanbanBoard[]>([]);
  private readonly currentBoardIdSignal = signal<string | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly boards = this.boardsSignal.asReadonly();
  readonly currentBoardId = this.currentBoardIdSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly board = computed(() => {
    const id = this.currentBoardIdSignal();
    const boards = this.boardsSignal();
    return boards.find((b) => b.id === id) ?? null;
  });

  readonly columns = computed(() => this.board()?.columns ?? []);

  setCurrentBoard(id: string | null): void {
    this.currentBoardIdSignal.set(id);
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  private hydrateBoard(b: KanbanBoard): KanbanBoard {
    return {
      ...b,
      createdAt: new Date(b.createdAt),
      updatedAt: new Date(b.updatedAt),
      columns: (b.columns ?? []).map((col) => ({
        ...col,
        tasks: (col.tasks ?? []).map((t) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt)
        }))
      }))
    };
  }

  async loadBoards(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    try {
      const res = await firstValueFrom(this.http.get<{ boards: KanbanBoard[] }>(API));
      this.boardsSignal.set((res.boards ?? []).map((b) => this.hydrateBoard(b)));
    } catch (err) {
      this.errorSignal.set('Error al cargar tableros');
      this.boardsSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private async persistBoard(board: KanbanBoard): Promise<void> {
    await firstValueFrom(
      this.http.put<KanbanBoard>(`${API}/${board.id}`, {
        name: board.name,
        columns: board.columns
      })
    );
  }

  async createBoard(name: string): Promise<KanbanBoard> {
    const res = await firstValueFrom(
      this.http.post<KanbanBoard>(API, { name })
    );
    const board = this.hydrateBoard(res);
    this.boardsSignal.update((boards) => [...boards, board]);
    return board;
  }

  async deleteBoard(boardId: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${API}/${boardId}`));
    this.boardsSignal.update((boards) => boards.filter((b) => b.id !== boardId));
    if (this.currentBoardIdSignal() === boardId) {
      this.currentBoardIdSignal.set(null);
    }
  }

  addTask(
    title: string,
    description: string,
    status: TaskStatus = 'backlog',
    options?: { members?: string[]; estimatedHours?: Task['estimatedHours'] }
  ): Task | null {
    const boardId = this.currentBoardIdSignal();
    const board = this.board();
    if (!boardId || !board) return null;

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

    const updated: KanbanBoard = {
      ...board,
      columns: board.columns.map((col) =>
        col.id === status ? { ...col, tasks: [...col.tasks, task] } : col
      ),
      updatedAt: now
    };
    this.boardsSignal.update((boards) =>
      boards.map((b) => (b.id === boardId ? updated : b))
    );
    this.persistBoard(updated).catch(() => this.errorSignal.set('Error al guardar'));
    return task;
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    const boardId = this.currentBoardIdSignal();
    const board = this.board();
    if (!boardId || !board) return;

    const now = new Date();
    let movedTask: Task | null = null;
    const columnsAfterRemove = board.columns.map((col) => {
      const taskIndex = col.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex >= 0) {
        movedTask = { ...col.tasks[taskIndex], status: newStatus, updatedAt: now };
        return { ...col, tasks: col.tasks.filter((_, i) => i !== taskIndex) };
      }
      return col;
    });
    const updated: KanbanBoard = {
      ...board,
      columns: columnsAfterRemove.map((col) =>
        col.id === newStatus ? { ...col, tasks: [...col.tasks, movedTask!] } : col
      ),
      updatedAt: now
    };
    this.boardsSignal.update((boards) =>
      boards.map((b) => (b.id === boardId ? updated : b))
    );
    this.persistBoard(updated).catch(() => this.errorSignal.set('Error al guardar'));
  }

  updateTask(
    taskId: string,
    updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'members' | 'estimatedHours' | 'status'>>
  ): void {
    const boardId = this.currentBoardIdSignal();
    const board = this.board();
    if (!boardId || !board) return;

    const now = new Date();
    const newStatus = updates.status;
    let updated: KanbanBoard;

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
      updated = {
        ...board,
        columns: columnsAfterRemove.map((col) =>
          col.id === newStatus ? { ...col, tasks: [...col.tasks, movedTask!] } : col
        ),
        updatedAt: now
      };
    } else {
      updated = {
        ...board,
        columns: board.columns.map((col) => ({
          ...col,
          tasks: col.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates, updatedAt: now } : t
          )
        })),
        updatedAt: now
      };
    }
    this.boardsSignal.update((boards) =>
      boards.map((b) => (b.id === boardId ? updated : b))
    );
    this.persistBoard(updated).catch(() => this.errorSignal.set('Error al guardar'));
  }

  deleteTask(taskId: string): void {
    const boardId = this.currentBoardIdSignal();
    const board = this.board();
    if (!boardId || !board) return;

    const now = new Date();
    const updated: KanbanBoard = {
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId)
      })),
      updatedAt: now
    };
    this.boardsSignal.update((boards) =>
      boards.map((b) => (b.id === boardId ? updated : b))
    );
    this.persistBoard(updated).catch(() => this.errorSignal.set('Error al guardar'));
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
