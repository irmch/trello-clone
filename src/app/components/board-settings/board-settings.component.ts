import { Component, Input, OnInit, inject } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { CommonModule } from '@angular/common';
import { ChevronIconComponent } from "../../icons/chevron-icon/chevron-icon.component";
import { SettingsMenu } from '../../enums/BoardSettingsMenu';
import { XmarkIconComponent } from "../../icons/xmark-icon/xmark-icon.component";
import { ArchiveIconComponent } from "../../icons/archive-icon/archive-icon.component";
import { LabelIconComponent } from "../../icons/label-icon/label-icon.component";
import { MinusIconComponent } from "../../icons/minus-icon/minus-icon.component";
import { ChangeBackgroundComponent } from "./change-background/change-background.component";
import { LabelsComponent } from "./labels/labels.component";
import { AppService } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-board-settings',
    standalone: true,
    templateUrl: './board-settings.component.html',
    styleUrl: './board-settings.component.css',
    imports: [
        CommonModule,
        ChevronIconComponent,
        XmarkIconComponent,
        ArchiveIconComponent,
        LabelIconComponent,
        MinusIconComponent,
        ChangeBackgroundComponent,
        LabelsComponent
    ]
})
export class BoardSettingsComponent implements OnInit {

  @Input({required: true}) board: any;
  @Input({ required: true }) workspace: any;

  boardService = inject(BoardService);
  appService = inject(AppService);
  router = inject(Router);
  settings: any;

  settingsMenu = SettingsMenu;
  activeMenu: SettingsMenu = SettingsMenu.DEFAULT;

  ngOnInit(): void {
    this.settings = this.boardService.getSettingsSidebar();
  }

  setSettings(value: boolean) {
    this.boardService.setSettingsSidebar(value);
  }

  setActiveMenu(value: SettingsMenu) {
    this.activeMenu = value;
  }

  closeBoard() {
    this.appService.closeBoard(this.workspace.id, this.board.id);
    this.router.navigate(['/']);
  }

}
