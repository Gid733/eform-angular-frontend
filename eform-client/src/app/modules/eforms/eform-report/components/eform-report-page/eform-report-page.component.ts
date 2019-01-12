import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ChildActivationEnd, Router} from '@angular/router';
import {ReplyElementDto} from 'src/app/common/models/cases';
import {EformFullReportModel} from 'src/app/common/models/eforms/report';
import {CasesService} from 'src/app/common/services/cases';
import {EformReportService} from 'src/app/common/services/eform';

@Component({
  selector: 'app-eform-report-page',
  templateUrl: './eform-report-page.component.html',
  styleUrls: ['./eform-report-page.component.scss']
})
export class EformReportPageComponent implements OnInit {
  selectedEformId: number;
  fullReportModel: EformFullReportModel = new EformFullReportModel();
  spinnerStatus = false;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private casesService: CasesService,
              private eformReportService: EformReportService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedEformId = +params['eformId'];
      this.getReport();
    });
  }

  getReport() {
    this.spinnerStatus = true;
    this.eformReportService.getSingle(this.selectedEformId).subscribe((data) => {
      if (data && data.success) {
        this.fullReportModel = data.model;
      } this.spinnerStatus = false;
    });
  }
}