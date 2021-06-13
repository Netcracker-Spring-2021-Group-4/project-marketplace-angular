import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginCredentials} from "../shared/models/api/send/credentials.model";
import {Observable} from "rxjs";
import {SignUpCredentials} from "../shared/models/api/send/sign-up-credentials.model";
import {UpdatePasswordWrapper} from "../shared/models/api/send/update-password-wrapper.model";
import {CartItemModel} from "../shared/models/api/send/cart-item.model";
import {CartInfoResponse} from "../shared/models/api/receive/cart-info-response.model";
import {OrderRequest} from "../shared/models/api/send/order-request.model";

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  private URL: string;
  private PUBLIC_URL: string;
  private PUBLIC_ORDERS: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.PUBLIC_URL = `${this.URL}/api/v1/public`
    this.PUBLIC_ORDERS = `${this.PUBLIC_URL}/orders`
  }

  getListOfCategories() : Observable<any> {
    return this.httpClient.get(`${this.PUBLIC_URL}/categories-all`)
  }

  getListForComparison(ids: string[]) : Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_URL}/list-comparison`, ids)
  }

  getCart(list: CartItemModel[]): Observable<CartInfoResponse> {
    return this.httpClient.post<CartInfoResponse>(`${this.PUBLIC_URL}/cart`, list)
  }

  makeReservation(list: CartItemModel[]): Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_URL}/reserve`, list)
  }

  cancelReservation(list: CartItemModel[]): Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_URL}/cancel-reservation`, list)
  }

  getTimeSlots(date: string): Observable<any> {
    return this.httpClient.get(`${this.PUBLIC_ORDERS}/timeslots/${date}`)
  }

  makeOrder(obj: OrderRequest): Observable<any> {
    return this.httpClient.post(`${this.PUBLIC_ORDERS}`, obj)
  }
}
