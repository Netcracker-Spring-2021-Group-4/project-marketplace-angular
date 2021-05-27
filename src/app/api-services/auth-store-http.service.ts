import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {UserUpdateModel} from "../shared/models/api/send/user-update.model";
import {UpdatePasswordWrapper} from "../shared/models/api/send/update-password-wrapper.model";

@Injectable({
  providedIn: 'root'
})
export class AuthStoreApiService {

  private readonly URL: string;
  private readonly AUTH_STORE_URL: string;
  private readonly AUTH_CUSTOMER_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.AUTH_STORE_URL = `${this.URL}/api/v1/auth-store`
    this.AUTH_CUSTOMER_URL = `${this.URL}/api/v1/auth-customer`
  }

  getMyProfile(): Observable<any> {
    return this.httpClient.get(`${this.AUTH_STORE_URL}/me`, {observe: 'response'})
  }

  editCustomerProfile(body: UserUpdateModel): Observable<any> {
    return this.httpClient.put(`${this.AUTH_CUSTOMER_URL}/me/edit`, body)
  }

  changePassword(obj: UpdatePasswordWrapper): Observable<any> {
    return this.httpClient.patch(`${this.AUTH_STORE_URL}/change-password`, obj)
  }
}
