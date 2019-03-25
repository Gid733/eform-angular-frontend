import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {RouteConfigLoadEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {Observable} from 'rxjs';
import {UserClaimsEnum} from 'src/app/common/const';
import {CaseEditRequest, ReplyElementDto, ReplyRequest} from 'src/app/common/models/cases';
import {TemplateDto} from 'src/app/common/models/dto';
import {EformPermissionsSimpleModel} from 'src/app/common/models/security/group-permissions/eform';
import {AuthService} from 'src/app/common/services/auth';
import {CasesService} from 'src/app/common/services/cases';
import {EFormService} from 'src/app/common/services/eform';
import {SecurityGroupEformsPermissionsService} from 'src/app/common/services/security';
import {CaseEditElementComponent} from '../case-edit-element/case-edit-element.component';

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.scss']
})
export class CaseEditComponent implements OnInit, OnDestroy {
  @ViewChildren(CaseEditElementComponent) editElements: QueryList<CaseEditElementComponent>;
  @ViewChild('caseConfirmation') caseConfirmation;
  activatedRouteSub: Subscription;
  id: number;
  templateId: number;
  currentTemplate: TemplateDto = new TemplateDto;
  replyElement: ReplyElementDto = new ReplyElementDto();

  requestModels: Array<CaseEditRequest> = [];
  replyRequest: ReplyRequest = new ReplyRequest();
  eformPermissionsSimpleModel: EformPermissionsSimpleModel = new EformPermissionsSimpleModel();

  isNoSaveExitAllowed = false;
  isSaveClicked = false;

  spinnerStatus = false;
  reverseRoute: string;

  get userClaims() {
    return this.authService.userClaims;
  }

  get userClaimsEnum() {
    return UserClaimsEnum;
  }

  constructor(private activateRoute: ActivatedRoute,
              private casesService: CasesService,
              private eFormService: EFormService,
              private router: Router,
              private authService: AuthService,
              private securityGroupEformsService: SecurityGroupEformsPermissionsService) {
    const activatedRouteSub = this.activateRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.templateId = +params['templateId'];
    });
    this.activateRoute.queryParams.subscribe(params => {
      this.reverseRoute = params['reverseRoute'];
    });
  }

  ngOnInit() {
    this.loadTemplateInfo();
  }

  ngOnDestroy() {

  }

  loadCase() {
    if (!this.id || this.id === 0) {
      return;
    }
    this.casesService.getById(this.id, this.currentTemplate.id).subscribe(operation => {
      if (operation && operation.success) {
        this.replyElement = operation.model;
      }
      this.spinnerStatus = false;
    });
  }

  saveCase() {
    this.spinnerStatus = true;
    this.requestModels = [];
    this.editElements.forEach(x => {
      x.extractData();
      this.requestModels.push(x.requestModel);
    });
    this.replyRequest.id = this.replyElement.id;
    this.replyRequest.label = this.replyElement.label;
    this.replyRequest.elementList = this.requestModels;
    this.casesService.updateCase(this.replyRequest, this.currentTemplate.id).subscribe(operation => {
      if (operation && operation.success) {
        this.replyElement = new ReplyElementDto();
        this.spinnerStatus = false;
        this.isNoSaveExitAllowed = true;
        if (this.isSaveClicked) {
          this.navigateToReverse();
        }
      }
      this.spinnerStatus = false;
    });
  }

  loadTemplateInfo() {
    if (this.templateId) {
      this.spinnerStatus = true;
      this.eFormService.getSingle(this.templateId).subscribe(operation => {
        if (operation && operation.success) {
          this.currentTemplate = operation.model;
          this.loadEformPermissions(this.currentTemplate.id);
          this.loadCase();
        }
        // this.spinnerStatus = false; // This is commented as loadCase is in 99% of the time the slowest
      });
    }
  }

  goToSection(location: string): void {
    window.location.hash = location;
    setTimeout(() => {
      document.querySelector(location).parentElement.scrollIntoView();
    });
  }

  confirmExit(keepData: boolean): void {
    this.caseConfirmation.navigateAwaySelection$.next(true);
    if (keepData) {
      this.saveCase();
    } else {
      this.isNoSaveExitAllowed = true;
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.isNoSaveExitAllowed && this.checkEformPermissions(UserClaimsEnum.caseUpdate)) {
      this.caseConfirmation.show();
      return this.caseConfirmation.navigateAwaySelection$;
    }
    return true;
  }

  navigateToReverse() {
    if (this.reverseRoute) {
      this.router.navigate([this.reverseRoute]).then();
    } else {
      this.router.navigate(['/cases/', this.currentTemplate.id]).then();
    }
  }

  loadEformPermissions(templateId: number) {
    if (this.securityGroupEformsService.mappedPermissions.length) {
      this.eformPermissionsSimpleModel = this.securityGroupEformsService.mappedPermissions.find(x => x.templateId == templateId);
    } else {
      this.spinnerStatus = true;
      this.securityGroupEformsService.getEformsSimplePermissions().subscribe((data => {
        if (data && data.success) {
          const foundTemplates = this.securityGroupEformsService.mapEformsSimplePermissions(data.model);
          if (foundTemplates.length) {
            this.eformPermissionsSimpleModel = foundTemplates.find(x => x.templateId == templateId);
          }
          // this.spinnerStatus = false; // This is commented as loadCase is in 99% of the time the slowest
        }
      }));
    }
  }

  checkEformPermissions(permissionIndex: number) {
    if (this.eformPermissionsSimpleModel.templateId) {
      return this.eformPermissionsSimpleModel.permissionsSimpleList.find(x => x == UserClaimsEnum[permissionIndex].toString());
    } else {
      return this.userClaims[UserClaimsEnum[permissionIndex].toString()];
    }
  }
}
