import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginCredentials} from "../shared/models/api/send/credentials.model";
import {Observable} from "rxjs";
import {SignUpCredentials} from "../shared/models/api/send/sign-up-credentials.model";
import {UpdatePasswordWrapper} from "../shared/models/api/send/update-password-wrapper.model";

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  private URL: string;
  private PUBLIC_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.PUBLIC_URL = `${this.URL}/api/v1/public`
  }

  getListOfCategories() : Observable<any> {
    return this.httpClient.get(`${this.PUBLIC_URL}/categories-all`)
  }
}
