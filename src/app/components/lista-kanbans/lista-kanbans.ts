import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';
import type { KanbanBoard } from '../../models/kanban.model';

@Component({
  selector: 'app-lista-kanbans',
  imports: [FormsModule, RouterLink],
  templateUrl: './lista-kanbans.html',
  styleUrl: './lista-kanbans.scss'
})
export class ListaKanbans {
  protected readonly kanbanService = inject(KanbanService);
  readonly showNewBoardForm = signal(false);
  newBoardNameValue = '';

  readonly boards = this.kanbanService.boards;

  openNewBoardForm(): void {
    this.newBoardNameValue = '';
    this.showNewBoardForm.set(true);
  }

  closeNewBoardForm(): void {
    this.showNewBoardForm.set(false);
  }

  createBoard(): void {
    const name = this.newBoardNameValue.trim();
    if (!name) return;
    this.kanbanService.createBoard(name);
    this.closeNewBoardForm();
  }

  deleteBoard(event: Event, boardId: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('¿Eliminar este tablero? Se perderán todas sus tareas.')) {
      this.kanbanService.deleteBoard(boardId);
    }
  }

  getTaskCount(board: KanbanBoard): number {
    return this.kanbanService.getTotalTasks(board);
  }
}
