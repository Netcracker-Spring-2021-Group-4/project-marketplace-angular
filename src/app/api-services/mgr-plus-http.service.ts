import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginCredentials} from "../shared/models/api/send/credentials.model";
import {Observable} from "rxjs";
import {SignUpCredentials} from "../shared/models/api/send/sign-up-credentials.model";

@Injectable({
  providedIn: 'root'
})
export class ManagerPlusApiService {

  private readonly URL: string;
  private readonly ADMIN_URL: string;
  private readonly ADMIN_STAFF_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.ADMIN_URL = `${this.URL}/api/v1/admin`
    this.ADMIN_STAFF_URL = `${this.ADMIN_URL}/staff`
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
}
