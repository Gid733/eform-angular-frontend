import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserClaimsEnum } from 'src/app/common/const';
import { CaseListModel, CaseModel } from 'src/app/common/models/cases';
import { TemplateDto } from 'src/app/common/models/dto';
import { EformPermissionsSimpleModel } from 'src/app/common/models/security/group-permissions/eform';
import { PageSettingsModel } from 'src/app/common/models/settings';
import { AuthService } from 'src/app/common/services/auth';
import { CasesService } from 'src/app/common/services/cases';
import { EFormService } from 'src/app/common/services/eform';
import { SecurityGroupEformsPermissionsService } from 'src/app/common/services/security';
import { saveAs } from 'file-saver';
import { TableHeaderElementModel } from 'src/app/common/models';
import { CasesStateService } from 'src/app/modules/cases/components/state/cases-state-service';

@Component({
  selector: 'app-cases-table',
  templateUrl: './cases-table.component.html',
})
export class CasesTableComponent implements OnInit {
  @ViewChild('modalRemoveCase', { static: true }) modalRemoveCase;
  currentTemplate: TemplateDto = new TemplateDto();
  eformPermissionsSimpleModel: EformPermissionsSimpleModel = new EformPermissionsSimpleModel();
  caseListModel: CaseListModel = new CaseListModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();

  get userClaims() {
    return this.authService.userClaims;
  }
  get userRole() {
    return this.authService.currentRole;
  }
  get userClaimsEnum() {
    return UserClaimsEnum;
  }

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: '', sortable: true },
    { name: 'done_at', elementId: '', sortable: true },
    { name: 'created_at', elementId: '', sortable: true },
    { name: 'worker_name', elementId: '', sortable: true },
    this.currentTemplate.field1 && this.currentTemplate.field1.label
      ? {
          name: 'field1',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field1.label,
        }
      : null,
    this.currentTemplate.field2 && this.currentTemplate.field2.label
      ? {
          name: 'field2',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field2.label,
        }
      : null,
    this.currentTemplate.field3 && this.currentTemplate.field3.label
      ? {
          name: 'field3',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field3.label,
        }
      : null,
    this.currentTemplate.field4 && this.currentTemplate.field4.label
      ? {
          name: 'field4',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field4.label,
        }
      : null,
    this.currentTemplate.field5 && this.currentTemplate.field5.label
      ? {
          name: 'field5',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field5.label,
        }
      : null,
    this.currentTemplate.field6 && this.currentTemplate.field6.label
      ? {
          name: 'field6',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field6.label,
        }
      : null,
    this.currentTemplate.field7 && this.currentTemplate.field7.label
      ? {
          name: 'field7',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field7.label,
        }
      : null,
    this.currentTemplate.field8 && this.currentTemplate.field8.label
      ? {
          name: 'field8',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field8.label,
        }
      : null,
    this.currentTemplate.field9 && this.currentTemplate.field9.label
      ? {
          name: 'field9',
          elementId: '',
          sortable: true,
          visibleName: this.currentTemplate.field9.label,
        }
      : null,
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private activateRoute: ActivatedRoute,
    private casesService: CasesService,
    private eFormService: EFormService,
    private authService: AuthService,
    private securityGroupEformsService: SecurityGroupEformsPermissionsService,
    public caseStateService: CasesStateService
  ) {
    this.activateRoute.params.subscribe((params) => {
      this.caseStateService.setTemplateId(+params['id']);
    });
  }

  ngOnInit() {
    this.loadTemplateData();
  }

  onLabelInputChanged(label: string) {
    this.caseStateService.updateNameFilter(label);
    this.loadAllCases();
  }

  onDeleteClicked(caseModel: CaseModel) {
    this.modalRemoveCase.show(caseModel, this.currentTemplate.id);
  }

  sortTable(sort: string) {
    this.caseStateService.onSortTable(sort);
    this.loadAllCases();
  }

  loadAllCases() {
    this.caseStateService.getCases().subscribe((operation) => {
      if (operation && operation.success) {
        this.caseListModel = operation.model;
        this.tableHeaders = [
          { name: 'Id', elementId: '', sortable: true },
          { name: 'done_at', elementId: '', sortable: true },
          { name: 'created_at', elementId: '', sortable: true },
          { name: 'worker_name', elementId: '', sortable: true },
          this.currentTemplate.field1 && this.currentTemplate.field1.label
            ? {
              name: 'field1',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field1.label,
            }
            : null,
          this.currentTemplate.field2 && this.currentTemplate.field2.label
            ? {
              name: 'field2',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field2.label,
            }
            : null,
          this.currentTemplate.field3 && this.currentTemplate.field3.label
            ? {
              name: 'field3',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field3.label,
            }
            : null,
          this.currentTemplate.field4 && this.currentTemplate.field4.label
            ? {
              name: 'field4',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field4.label,
            }
            : null,
          this.currentTemplate.field5 && this.currentTemplate.field5.label
            ? {
              name: 'field5',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field5.label,
            }
            : null,
          this.currentTemplate.field6 && this.currentTemplate.field6.label
            ? {
              name: 'field6',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field6.label,
            }
            : null,
          this.currentTemplate.field7 && this.currentTemplate.field7.label
            ? {
              name: 'field7',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field7.label,
            }
            : null,
          this.currentTemplate.field8 && this.currentTemplate.field8.label
            ? {
              name: 'field8',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field8.label,
            }
            : null,
          this.currentTemplate.field9 && this.currentTemplate.field9.label
            ? {
              name: 'field9',
              elementId: '',
              sortable: true,
              visibleName: this.currentTemplate.field9.label,
            }
            : null,
          { name: 'Actions', elementId: '', sortable: false },
        ];
      }
    });
  }

  loadTemplateData() {
    this.caseStateService.loadTemplateData().subscribe((operation) => {
      if (operation && operation.success) {
        this.currentTemplate = operation.model;
        debugger;
        this.loadEformPermissions(this.currentTemplate.id);
        this.loadAllCases();
      }
    });
  }

  downloadFile(caseId: number, fileType: string) {
    this.eFormService
      .downloadEformPDF(this.currentTemplate.id, caseId, fileType)
      .subscribe((data) => {
        const blob = new Blob([data]);
        saveAs(blob, `template_${this.currentTemplate.id}.${fileType}`);
      });
  }

  loadEformPermissions(templateId: number) {
    if (this.securityGroupEformsService.mappedPermissions.length) {
      this.eformPermissionsSimpleModel = this.securityGroupEformsService.mappedPermissions.find(
        (x) => x.templateId === templateId
      );
    } else {
      this.securityGroupEformsService
        .getEformsSimplePermissions()
        .subscribe((data) => {
          if (data && data.success) {
            const foundTemplates = this.securityGroupEformsService.mapEformsSimplePermissions(
              data.model
            );
            if (foundTemplates.length) {
              this.eformPermissionsSimpleModel = foundTemplates.find(
                (x) => x.templateId === templateId
              );
            }
          }
        });
    }
  }

  checkEformPermissions(permissionIndex: number) {
    if (this.eformPermissionsSimpleModel.templateId) {
      return this.eformPermissionsSimpleModel.permissionsSimpleList.find(
        (x) => x === UserClaimsEnum[permissionIndex].toString()
      );
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }

  changePage(offset: number) {
    this.caseStateService.changePage(offset);
    this.loadAllCases();
  }

  onPageSizeChanged(newPageSize: number) {
    this.caseStateService.updatePageSize(newPageSize);
    this.loadAllCases();
  }

  onCaseDeleted() {
    this.caseStateService.onDelete();
    this.loadAllCases();
  }
}
