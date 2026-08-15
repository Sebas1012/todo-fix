import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CreateTaskInput, TaskCategory, TaskPriority } from '../../../models/task/task.model';

const noWhitespaceValidator = (control: AbstractControl): ValidationErrors | null =>
  control.value.trim().length ? null : { whitespace: true };

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, SelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-form.html',
  styleUrl: './task-form.css',
})
export class TaskFormComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  readonly taskCreated = output<CreateTaskInput>();
  readonly categories: TaskCategory[] = ['FrontEnd', 'BackEnd', 'Docs'];
  readonly priorities: TaskPriority[] = ['Baja', 'Media', 'Urgente'];
  readonly form = this.formBuilder.group({
    title: this.formBuilder.control('', [Validators.required, Validators.maxLength(200), noWhitespaceValidator]),
    category: this.formBuilder.control<TaskCategory>('FrontEnd', Validators.required),
    priority: this.formBuilder.control<TaskPriority>('Media', Validators.required),
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    this.taskCreated.emit({ title: value.title.trim(), category: value.category, priority: value.priority });
    this.form.reset({ title: '', category: 'FrontEnd', priority: 'Media' });
  }
}
