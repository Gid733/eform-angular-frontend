import {Component, Input} from '@angular/core';
import {DataItemDto} from 'src/app/common/models';

@Component({
  selector: 'report-element-container',
  templateUrl: './element-container.component.html',
  styleUrls: ['./element-container.component.scss']
})
export class ElementContainerComponent  {
  dataItemList: Array<DataItemDto> = [];
  isCollapsed = true;
  @Input() dataItemLabel: string;
  @Input()
  get fieldValue() {
    return this.dataItemList;
  }
  set fieldValue(val) {
    this.dataItemList = val;
  }

  constructor() {
  }

}
