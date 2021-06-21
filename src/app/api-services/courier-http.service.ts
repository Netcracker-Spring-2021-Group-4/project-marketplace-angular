import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {LoginCredentials} from "../shared/models/api/send/credentials.model";
import {Observable} from "rxjs";
import {SignUpCredentials} from "../shared/models/api/send/sign-up-credentials.model";
import {UpdatePasswordWrapper} from "../shared/models/api/send/update-password-wrapper.model";
import {CartItemModel} from "../shared/models/api/send/cart-item.model";
import {CartInfoResponse} from "../shared/models/api/receive/cart-info-response.model";
import {DeliveryModel} from "../shared/models/api/receive/delivery.model";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {OrderStatus} from "../shared/models/enums/order-status";
import {catchError} from "rxjs/operators";

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

 getDeliveries(date:Date):Observable<DeliveryModel[]>{
    let dateParam =this.convertDateToIso(date)
    return this.httpClient.get<DeliveryModel[]>(`${this.COURIER_URL}/${dateParam}`);
 }

 changeStatus(status:string, id:string):Observable<any>{
   let form = new FormData();
   form.set('orderStatus', status)
   return this.httpClient.patch<any>(`${this.COURIER_URL}/orders/${id}`, form);
 }


 private convertDateToIso(date:Date):string{
   let year = date.getFullYear();
   let month = date.getMonth()+1<10? '0'+(date.getMonth()+1):date.getMonth()+1;
   let dt = date.getDate()<10? '0'+date.getDate(): date.getDate();

   return (year+'-' + month + '-'+dt);
 }
}
