import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SiteDto} from 'src/app/common/models/dto';
import {UnitsService} from 'src/app/common/services/advanced';

@Component({
  selector: 'app-new-otp-modal',
  templateUrl: './new-otp-modal.component.html',
  styleUrls: ['./new-otp-modal.component.scss']
})
export class NewOtpModalComponent implements OnInit {
  @Input() selectedSimpleSite: SiteDto = new SiteDto();
  @Output() onNewOtpRequested: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(('frame'), {static: false}) frame;
  spinnerStatus = false;

  constructor(private unitsService: UnitsService) { }

  ngOnInit() {
  }

  show() {
    this.frame.show();
  }

  requestOtp() {
    this.spinnerStatus = true;
    this.unitsService.requestOtp(this.selectedSimpleSite.unitId).subscribe(operation => {
      this.spinnerStatus = false;
      if (operation && operation.success) {
        this.frame.hide();
        this.onNewOtpRequested.emit();
      }
    });
  }
}
