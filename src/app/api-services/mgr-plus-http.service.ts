import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginCredentials} from "../shared/models/api/send/credentials.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ManagerPlusApiService {

  private URL: string;
  private ADMIN_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.ADMIN_URL = `${this.URL}/api/v1/admin`
  }

  dummy(): Observable<any> {
    return this.httpClient.get(`${this.ADMIN_URL}/demo`)
  }
}
