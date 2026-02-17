import { Component, input, output, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { KanbanService } from '../../services/kanban.service';
import type { Task as TaskModel, TaskStatus, EstimatedHours } from '../../models/task.model';
import { ESTIMATED_HOURS_OPTIONS } from '../../models/task.model';

const STATUS_LABELS: Record<string, string> = {
  'backlog': 'Backlog',
  'en-proceso': 'En proceso',
  'bloqueado': 'Bloqueado',
  'hecho': 'Hecho'
};

const PRIORITY_OPTIONS = ['baja', 'media', 'alta'] as const;

@Component({
  selector: 'app-task',
  imports: [FormsModule, DatePipe],
  templateUrl: './task.html',
  styleUrl: './task.scss'
})
export class Task {
  private readonly kanbanService = inject(KanbanService);

  readonly task = input.required<TaskModel>();
  readonly close = output<void>();

  readonly editTitle = signal('');
  readonly editDescription = signal('');
  readonly editStatus = signal<TaskStatus>('backlog');
  readonly editPriority = signal<'baja' | 'media' | 'alta'>('media');
  readonly editMembers = signal('');
  readonly editEstimatedHours = signal<number | ''>('');

  readonly statusOptions = [
    { id: 'backlog' as TaskStatus, label: 'Backlog' },
    { id: 'en-proceso' as TaskStatus, label: 'En proceso' },
    { id: 'bloqueado' as TaskStatus, label: 'Bloqueado' },
    { id: 'hecho' as TaskStatus, label: 'Hecho' }
  ];
  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly estimatedHoursOptions = ESTIMATED_HOURS_OPTIONS;

  constructor() {
    effect(() => {
      const t = this.task();
      this.editTitle.set(t.title);
      this.editDescription.set(t.description);
      this.editStatus.set(t.status);
      this.editPriority.set(t.priority ?? 'media');
      this.editMembers.set(t.members?.join(', ') ?? '');
      this.editEstimatedHours.set(t.estimatedHours ?? '');
    });
  }

  getStatusLabel(status: string): string {
    return STATUS_LABELS[status] ?? status;
  }

  onClose(): void {
    this.close.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  save(): void {
    const t = this.task();
    const membersStr = this.editMembers().trim();
    const members = membersStr ? membersStr.split(',').map((m) => m.trim()).filter(Boolean) : [];
    const estimatedHours = this.editEstimatedHours();
    const validHours =
      typeof estimatedHours === 'number' && ESTIMATED_HOURS_OPTIONS.includes(estimatedHours as EstimatedHours)
        ? (estimatedHours as EstimatedHours)
        : undefined;

    this.kanbanService.updateTask(t.id, {
      title: this.editTitle().trim(),
      description: this.editDescription().trim(),
      status: this.editStatus(),
      priority: this.editPriority(),
      members,
      estimatedHours: validHours
    });
    this.onClose();
  }
}
