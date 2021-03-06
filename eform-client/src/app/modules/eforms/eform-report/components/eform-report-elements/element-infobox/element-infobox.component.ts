import {Component, Input} from '@angular/core';
import {FieldValueDto} from 'src/app/common/models';

@Component({
  selector: 'report-element-infobox',
  templateUrl: './element-infobox.component.html',
  styleUrls: ['./element-infobox.component.scss']
})
export class ElementInfoboxComponent {
  fieldValueObj: FieldValueDto = new FieldValueDto();

  @Input()
  get fieldValue() {
    return this.fieldValueObj;
  }

  set fieldValue(val) {
    this.fieldValueObj = val;
  }

  constructor() {
  }

}
