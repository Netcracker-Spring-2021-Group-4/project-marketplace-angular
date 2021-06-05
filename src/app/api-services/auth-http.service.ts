import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginCredentials} from "../shared/models/api/send/credentials.model";
import {Observable} from "rxjs";
import {SignUpCredentials} from "../shared/models/api/send/sign-up-credentials.model";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private URL: string;
  private PUBLIC_USER_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.PUBLIC_USER_URL = `${this.URL}/api/v1/public/user`
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.httpClient.post(`${this.URL}/login`, credentials, {observe: 'response'})
  }

  requestSignUp(signUpCreds: SignUpCredentials): Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_USER_URL}/request-signup`, signUpCreds)
  }

  confirmSignUp(token: string): Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_USER_URL}/confirm-signup/${token}`,{})
  }

  confirmFirstPassword(token: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_USER_URL}/confirm-first-password/${token}`, {password})
  }

  requestResetPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_USER_URL}/password-reset/${email}`, {})
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.httpClient.patch(`${this.PUBLIC_USER_URL}/password/${token}`, {password})
  }

  getPasswordTokenValidity(token: string): Observable<any> {
    return this.httpClient.get(`${this.PUBLIC_USER_URL}/password-token-validity/${token}`)
  }
}
