import { Component, Input, OnInit, inject } from '@angular/core';
import { AppService } from '../../services/app.service';
import { CommonModule } from '@angular/common';
import { XmarkIconComponent } from "../../icons/xmark-icon/xmark-icon.component";
import { TaskIconComponent } from "../../icons/task-icon/task-icon.component";
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextIconComponent } from "../../icons/text-icon/text-icon.component";
import { TrashIconComponent } from "../../icons/trash-icon/trash-icon.component";
import { BoardService } from '../../services/board.service';

interface Task {
  title: string;
  description?: string;
}

interface List {
  title: string;
  cards: Task[];
}

@Component({
    selector: 'app-task-modal',
    standalone: true,
    templateUrl: './task-modal.component.html',
    styleUrl: './task-modal.component.css',
    imports: [
        CommonModule,
        XmarkIconComponent,
        TaskIconComponent,
        FormsModule,
        ReactiveFormsModule,
        TextIconComponent,
        TrashIconComponent
    ]
})
export class TaskModalComponent implements OnInit {
  @Input({ required: true }) taskList!: List;
  @Input({ required: true }) taskIndex!: number;
  task?: Task;
  private readonly appService = inject(AppService);
  private readonly boardService = inject(BoardService);

  updateTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    description: new FormControl('', Validators.pattern(/^(\s*\S+\s*)*(?!\s).*$/m))
  });

  ngOnInit(): void {
    this.appService.getOpenedTask().subscribe({
      next: (task) => {
        this.task = task;
        if (task) {
          this.updateTaskForm.patchValue({
            title: task.title,
            description: task.description || ''
          });
        }
      }
    });
  }

  updateTask(): void {
    const formValue = this.updateTaskForm.getRawValue();
    if (!this.task) return;

    if (formValue.title?.trim()) {
      this.task.title = formValue.title.trim();
    } else {
      this.updateTaskForm.patchValue({ title: this.task.title });
    }

    if (this.updateTaskForm.get('description')?.valid) {
      this.task.description = formValue.description || undefined;
    }
  }

  deleteTask(): void {
    if (this.task) {
      this.appService.deleteTask(this.taskList, this.taskIndex);
    }
  }

  closeModal(): void {
    const modal = document.getElementById('task-modal');
    if (modal) {
      (modal as HTMLDialogElement).close();
    }
  }

  setScroll(): void {
    this.boardService.setScroll(false);
  }
}
