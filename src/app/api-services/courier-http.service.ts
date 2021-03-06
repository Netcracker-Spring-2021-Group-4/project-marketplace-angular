import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {DeliveryModel} from "../shared/models/api/receive/delivery.model";
import {OrderInfo} from "../shared/models/api/receive/order-info";


@Injectable({
  providedIn: 'root'
})
export class CourierApiService {

  private URL: string;
  private COURIER_URL: string;

  constructor(
    private httpClient: HttpClient
  ) {
    this.URL = `${environment.backURL}`
    this.COURIER_URL = `${this.URL}/api/v1/courier`
  }

  getOrderDetail(orderId: string | null): Observable<OrderInfo>{
    return this.httpClient.get<OrderInfo>(`${this.URL}/api/v1/public/orders/${orderId}`);
  }

 getDeliveries(date:string):Observable<DeliveryModel[]>{
    return this.httpClient.get<DeliveryModel[]>(`${this.COURIER_URL}/${date}`);
 }

 changeStatus(status:string, id:string):Observable<any>{
   let form = new FormData();
   form.set('orderStatus', status)
   return this.httpClient.patch<any>(`${this.COURIER_URL}/orders/${id}`, form);
 }



}
