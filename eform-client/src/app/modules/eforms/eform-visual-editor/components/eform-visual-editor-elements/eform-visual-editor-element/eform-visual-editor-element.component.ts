import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CollapseComponent } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';
import {
  EformVisualEditorFieldModel,
  EformVisualEditorModel,
} from 'src/app/common/models';
import { EformVisualEditorService } from 'src/app/common/services';

@Component({
  selector: 'app-eform-visual-editor-element',
  templateUrl: './eform-visual-editor-element.component.html',
  styleUrls: ['./eform-visual-editor-element.component.scss'],
})
export class EformVisualEditorElementComponent implements OnInit, OnDestroy {
  @ViewChild('collapse', { static: true }) collapse: CollapseComponent;
  @Input() checklist: EformVisualEditorModel;
  @Input() field: EformVisualEditorFieldModel;
  @Input() elementIndex: number;
  @Output() addNewChecklist: EventEmitter<any> = new EventEmitter<any>();
  @Output() addNewField: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  editorElementChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteElement: EventEmitter<number> = new EventEmitter<number>();

  collapseSub$: Subscription;

  constructor(
    private translateService: TranslateService,
    private visualEditorService: EformVisualEditorService
  ) {}

  ngOnInit() {
    this.collapseSub$ = this.visualEditorService.collapse.subscribe(
      (collapsed) => {
        if (!collapsed && this.checklist && this.checklist.collapsed) {
          this.checklist.collapsed = false;
          this.collapse.toggle();
        }
        if (collapsed && this.checklist && !this.checklist.collapsed) {
          this.checklist.collapsed = true;
          this.collapse.toggle();
        }
      }
    );
  }

  onAddNewChecklist(position: number) {
    this.addNewChecklist.emit(position);
  }

  onAddNewField(position: number) {
    this.addNewChecklist.emit(position);
  }

  deleteChecklist(position: number) {
    this.deleteElement.emit(position);
  }

  ngOnDestroy(): void {}
}
