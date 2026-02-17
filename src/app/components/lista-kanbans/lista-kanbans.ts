import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { KanbanService } from '../../services/kanban.service';
import type { KanbanBoard } from '../../models/kanban.model';

@Component({
  selector: 'app-lista-kanbans',
  imports: [FormsModule, RouterLink],
  templateUrl: './lista-kanbans.html',
  styleUrl: './lista-kanbans.scss'
})
export class ListaKanbans implements OnInit {
  protected readonly auth = inject(AuthService);
  protected readonly kanbanService = inject(KanbanService);
  readonly showNewBoardForm = signal(false);
  newBoardNameValue = '';

  readonly boards = this.kanbanService.boards;

  ngOnInit(): void {
    this.kanbanService.loadBoards();
  }

  openNewBoardForm(): void {
    this.newBoardNameValue = '';
    this.showNewBoardForm.set(true);
  }

  closeNewBoardForm(): void {
    this.showNewBoardForm.set(false);
  }

  async createBoard(): Promise<void> {
    const name = this.newBoardNameValue.trim();
    if (!name) return;
    try {
      await this.kanbanService.createBoard(name);
      this.closeNewBoardForm();
    } catch {
      // Error handled by service
    }
  }

  async deleteBoard(event: Event, boardId: string): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('¿Eliminar este tablero? Se perderán todas sus tareas.')) {
      try {
        await this.kanbanService.deleteBoard(boardId);
      } catch {
        // Error handled by service
      }
    }
  }

  getTaskCount(board: KanbanBoard): number {
    return this.kanbanService.getTotalTasks(board);
  }
}
