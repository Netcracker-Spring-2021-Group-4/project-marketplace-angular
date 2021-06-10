import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
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

  public getCategoryName(productId: string | null):Observable<string>{
    return this.httpClient.request('GET', `${this.PUBLIC_URL}/categories-all/${productId}/category-name`, {responseType:'text'});
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
