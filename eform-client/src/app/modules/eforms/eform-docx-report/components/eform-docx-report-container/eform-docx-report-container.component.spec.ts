import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EformDocxReportContainerComponent } from './eform-docx-report-container.component';

describe('EformDocxReportContainerComponent', () => {
  let component: EformDocxReportContainerComponent;
  let fixture: ComponentFixture<EformDocxReportContainerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EformDocxReportContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EformDocxReportContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
