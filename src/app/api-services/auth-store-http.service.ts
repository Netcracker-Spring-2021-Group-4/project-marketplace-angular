import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthStoreApiService {

  private readonly URL: string;
  private readonly AUTH_STORE_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.AUTH_STORE_URL = `${this.URL}/api/v1/auth-store`
  }

  getMyProfile(): Observable<any> {
    return this.httpClient.get(`${this.AUTH_STORE_URL}/me`, {observe: 'response'})
  }
}
