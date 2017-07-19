import {BaseService} from '../base.service';
import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {OperationDataResult, OperationResult} from '../../modules/helpers/helpers.module';
import 'rxjs/add/operator/map';
import {CaseModel, ReplyElement, ReplyRequest} from 'app/models';
import {Router} from '@angular/router';
import {CasesMethods} from 'app/modules/helpers/app.constants';

@Injectable()
export class CasesService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getById = (id: number): Observable<OperationDataResult<ReplyElement>> => {
    return this.getWithOperationDataResult<ReplyElement>(CasesMethods.EditById + '/' + id);
  }

  public getCases = (id: number): Observable<OperationDataResult<Array<CaseModel>>> => {
    return this.getWithOperationDataResult<Array<CaseModel>>(CasesMethods.GetCases + '/' + id);
  }

  public updateCase = (model: ReplyRequest): Observable<OperationResult> => {
    return this.postModelOperationResult<ReplyRequest>(CasesMethods.UpdateCase, model);
  }

}
