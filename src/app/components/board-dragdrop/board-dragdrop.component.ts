import { Component, Input, inject } from '@angular/core';
import { TaskCardListComponent } from "../task-card-list/task-card-list.component";
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragPlaceholder, CdkDragPreview, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListOptionsComponent } from "../list-options/list-options.component";
import { TaskModalComponent } from "../task-modal/task-modal.component";
import { PencilIconComponent } from "../../icons/pencil-icon/pencil-icon.component";
import { AppService } from '../../services/app.service';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { TextIconComponent } from "../../icons/text-icon/text-icon.component";

interface Task {
  title: string;
  description?: string;
}

interface List {
  title: string;
  cards: Task[];
}

interface Board {
  lists: List[];
}

@Component({
    selector: 'app-board-dragdrop',
    standalone: true,
    templateUrl: './board-dragdrop.component.html',
    styleUrl: './board-dragdrop.component.css',
    host: { 'class': 'h-full' },
    imports: [
        ReactiveFormsModule,
        FormsModule,
        TaskCardListComponent,
        CdkDrag,
        CdkDropList,
        CdkDropListGroup,
        CdkDragHandle,
        CdkDragPlaceholder,
        CdkDragPreview,
        ListOptionsComponent,
        TaskModalComponent,
        PencilIconComponent,
        CdkMenu,
        CdkMenuItem,
        TextIconComponent
    ]
})
export class BoardDragdropComponent {
  @Input({ required: true }) board!: Board;
  private readonly appService = inject(AppService);
  private readonly boardService = inject(BoardService);
  
  listTitleEdit: number = -1;
  isList: boolean = false;
  isTask: boolean = false;
  taskList: List = { title: '', cards: [] };
  taskIndex: number = -1;

  updateListTitleForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
  });

  showTitleInput(listIndex: number, listTitle: string): void {
    this.updateListTitleForm.patchValue({ title: listTitle });
    this.listTitleEdit = listIndex;
    this.focusTitleInput(listIndex);
  }

  private focusTitleInput(listIndex: number): void {
    setTimeout(() => {
      const input = document.getElementById(`${listIndex}-title-input`);
      if (input) {
        input.focus();
        (input as HTMLInputElement).select();
      }
    });
  }

  submitTitle(list: List): void {
    this.listTitleEdit = -1;
    const newTitle = this.updateListTitleForm.getRawValue().title;
    if (newTitle?.trim()) {
      list.title = newTitle.trim();
    }
  }

  moveTask(event: CdkDragDrop<List>): void {
    const { previousContainer, container, previousIndex, currentIndex } = event;
    const isSameContainer = previousContainer === container;

    if (isSameContainer && previousIndex === currentIndex) {
      return;
    }

    isSameContainer
      ? this.boardService.reorderTask(container.data, previousIndex, currentIndex)
      : this.boardService.transferTask({
          fromList: previousContainer.data,
          toList: container.data,
          fromIndex: previousIndex,
          toIndex: currentIndex
        });
  }

  moveList(event: CdkDragDrop<List[]>): void {
    const { previousIndex, currentIndex } = event;
    if (previousIndex === currentIndex) {
      return;
    }
    this.boardService.moveList(this.board, previousIndex, currentIndex);
  }

  setOpenedTask(task: Task, list: List, index: number): void {
    this.taskList = list;
    this.taskIndex = index;
    this.appService.setOpenedTask(task);
    const modal = document.getElementById('task-modal');
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  }
}
