import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {SignUpCredentials} from "../shared/models/api/send/sign-up-credentials.model";
import {UserUpdateModel} from "../shared/models/api/send/user-update.model";
import {ChangeStatusModel} from "../shared/models/api/send/change-status.model";

@Injectable({
  providedIn: 'root'
})
export class ManagerPlusApiService {

  private readonly URL: string;
  private readonly ADMIN_URL: string;
  private readonly ADMIN_STAFF_URL: string;
  private readonly MANAGER_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.ADMIN_URL = `${this.URL}/api/v1/admin`
    this.ADMIN_STAFF_URL = `${this.ADMIN_URL}/staff`
    this.MANAGER_URL = `${this.URL}/api/v1/manager`
  }

  dummy(): Observable<any> {
    return this.httpClient.get(`${this.ADMIN_URL}/demo`)
  }

  createManager(body: SignUpCredentials): Observable<any> {
    return this.httpClient.post(`${this.ADMIN_STAFF_URL}/product-manager`, body)
  }

  createCourier(body: SignUpCredentials): Observable<any> {
    return this.httpClient.post(`${this.ADMIN_STAFF_URL}/courier`, body)
  }

  getStaffer(id: string): Observable<any> {
    return this.httpClient.get(`${this.ADMIN_STAFF_URL}/${id}`, {observe: 'response'})
  }

  updateStaffer(body: UserUpdateModel): Observable<any> {
    return this.httpClient.put(`${this.ADMIN_STAFF_URL}/edit`, body)
  }

  changeStafferStatus(body: ChangeStatusModel): Observable<any> {
    return this.httpClient.patch(`${this.ADMIN_STAFF_URL}/change-status`, body)
  }

  createAuction(body: any): Observable<any> {
    return this.httpClient.post(`${this.MANAGER_URL}/auction`, body);
  }
}
