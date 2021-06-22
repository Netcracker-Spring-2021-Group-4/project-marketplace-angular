import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {ProfileModel} from "../shared/models/api/receive/profile.model";
import {UserSearchModel} from "../shared/models/api/send/user-search.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";
import {EagerContentPage} from "../shared/models/api/receive/cotent-page.model";
import {Toaster} from "ngx-toast-notifications";
import Labels from "../shared/models/labels/labels.constant";

@Injectable({
  providedIn: 'root'
})
export class StaffSearchHttpService {

  private readonly BACK_URL: string;

  constructor(private http: HttpClient, private toaster: Toaster) {
    this.BACK_URL = `${environment.backURL}`;
  }

  findStaff(searchCriteria: UserSearchModel, pageNo: number): Observable<EagerContentPage<ProfileModel>> {
    let params = new HttpParams().set('page', pageNo);
    return this.http.post<EagerContentPage<ProfileModel>>(`${this.BACK_URL}/api/v1/admin/staff/find`, searchCriteria, {params: params})
      .pipe(
        catchError(error => {
          const text = error?.message ?? 'Failed to lookup staff.'
          this.toaster.open({
            text,
            caption: Labels.caption.error,
            duration: 4000,
            type: 'danger'
          });
          console.error(error);
          return of(new EagerContentPage<ProfileModel>({content: [], numPages: 0, fullPageSize: 0}))
        })
      );
  }
}
