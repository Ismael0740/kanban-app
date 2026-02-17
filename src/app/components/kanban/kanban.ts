import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';
import { Task } from '../task/task';
import type { Task as TaskModel, TaskStatus, EstimatedHours } from '../../models/task.model';
import { ESTIMATED_HOURS_OPTIONS } from '../../models/task.model';
import type { KanbanColumn } from '../../models/kanban.model';

@Component({
  selector: 'app-kanban',
  imports: [FormsModule, RouterLink, Task],
  templateUrl: './kanban.html',
  styleUrl: './kanban.scss'
})
export class Kanban implements OnInit, OnDestroy {
  protected readonly kanbanService = inject(KanbanService);
  private readonly route = inject(ActivatedRoute);
  private routeSub: ReturnType<ActivatedRoute['paramMap']['subscribe']> | null = null;

  readonly columns = this.kanbanService.columns;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.kanbanService.setCurrentBoard(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.kanbanService.setCurrentBoard(null);
  }
  readonly selectedTask = signal<TaskModel | null>(null);
  readonly showNewTaskForm = signal(false);
  readonly newTaskColumn = signal<TaskStatus>('backlog');

  readonly newTitle = signal('');
  readonly newDescription = signal('');
  readonly newMembers = signal('');
  readonly newEstimatedHours = signal<number | ''>('');

  readonly estimatedHoursOptions = ESTIMATED_HOURS_OPTIONS;

  selectTask(task: TaskModel): void {
    this.selectedTask.set(task);
  }

  closeTaskDetail(): void {
    this.selectedTask.set(null);
  }

  openNewTaskForm(columnId: TaskStatus): void {
    this.newTaskColumn.set(columnId);
    this.newTitle.set('');
    this.newDescription.set('');
    this.newMembers.set('');
    this.newEstimatedHours.set('');
    this.showNewTaskForm.set(true);
  }

  closeNewTaskForm(): void {
    this.showNewTaskForm.set(false);
  }

  createTask(): void {
    const title = this.newTitle().trim();
    if (!title) return;
    const membersStr = this.newMembers().trim();
    const members = membersStr
      ? membersStr.split(',').map((m) => m.trim()).filter(Boolean)
      : [];
    const estimatedHours = this.newEstimatedHours();
    const validHours =
      typeof estimatedHours === 'number' && ESTIMATED_HOURS_OPTIONS.includes(estimatedHours as EstimatedHours)
        ? (estimatedHours as EstimatedHours)
        : undefined;
    this.kanbanService.addTask(title, this.newDescription().trim(), this.newTaskColumn(), {
      members: members.length ? members : undefined,
      estimatedHours: validHours
    });
    this.closeNewTaskForm();
  }

  deleteTask(event: Event, taskId: string): void {
    event.stopPropagation();
    this.kanbanService.deleteTask(taskId);
  }

  moveTask(taskId: string, newStatus: TaskStatus): void {
    this.kanbanService.updateTaskStatus(taskId, newStatus);
  }

  onDragStart(event: DragEvent, task: TaskModel): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', task.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDrop(event: DragEvent, columnId: TaskStatus): void {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text/plain');
    if (taskId) {
      this.moveTask(taskId, columnId);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }
}
