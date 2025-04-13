import { Component, ElementRef, HostListener, Input, ViewChild, inject } from '@angular/core';
import { PlusIconComponent } from "../../icons/plus-icon/plus-icon.component";
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XmarkIconComponent } from "../../icons/xmark-icon/xmark-icon.component";
import { BoardService } from '../../services/board.service';

interface Task {
  title: string;
  description?: string;
  labels?: string[];
}

interface List {
  title: string;
  cards: Task[];
}

@Component({
    selector: 'app-task-card-list',
    standalone: true,
    templateUrl: './task-card-list.component.html',
    styleUrl: './task-card-list.component.css',
    host: { 'class': 'flex flex-grow' },
    imports: [
        PlusIconComponent,
        FormsModule,
        ReactiveFormsModule,
        XmarkIconComponent
    ]
})
export class TaskCardListComponent {
  @Input({ required: true }) list!: List;
  @Input({ required: true }) listIndex!: number;
  private readonly boardService = inject(BoardService);
  buildTask: boolean = false;

  @ViewChild('taskBuilder') private readonly taskBuilderRef!: ElementRef;

  newTaskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    description: new FormControl(''),
    labels: new FormControl<string[]>([])
  });

  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:keydown.escape', ['$event'])
  onOutsideClick(event: Event): void {
    if (this.buildTask && !this.taskBuilderRef.nativeElement.contains(event.target)) {
      this.createCancel();
    }
  }

  setBoardScroll(value: boolean): void {
    this.boardService.setScroll(value);
  }

  createTask(list: List): void {
    const newTask = this.newTaskForm.getRawValue();
    if (newTask.title) {
      list.cards.push({
        title: newTask.title.trim(),
        description: newTask.description || undefined,
        labels: newTask.labels || undefined
      });
      this.resetTaskForm();
    }
  }

  createCancel(): void {
    this.buildTask = false;
    this.resetTaskForm();
  }

  showTaskBuilder(): void {
    this.buildTask = true;
    this.focusTaskInput();
  }

  private resetTaskForm(): void {
    this.newTaskForm.patchValue({
      title: '',
      description: '',
      labels: []
    });
  }

  private focusTaskInput(): void {
    setTimeout(() => {
      const input = document.getElementById(`${this.listIndex}-task-input`);
      input?.focus();
    });
  }
}
