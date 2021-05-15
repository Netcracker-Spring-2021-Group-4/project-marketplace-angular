import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginCredentials} from "../shared/models/api/send/credentials.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.httpClient.post(`${this.URL}/login`, credentials, {observe: 'response'})
  }
}
