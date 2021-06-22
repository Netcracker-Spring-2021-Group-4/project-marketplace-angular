import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {CustomerOrderModel} from "../shared/models/api/receive/customer-order.model";
import {OrderStatus} from "../shared/models/enums/order-status";
import {catchError} from "rxjs/operators";
import {ToasterCustomService} from "../services/toaster-custom.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderHttpService {

  private readonly BACK_URL: string;

  constructor(private http: HttpClient, private toasterService: ToasterCustomService) {
    this.BACK_URL = `${environment.backURL}`;
  }

  getCustomerOrders(): Observable<Array<CustomerOrderModel>> {
    const allStatusesParamValue: string = OrderHttpService.getAllOrderStatusNames().join(',');
    const params = new HttpParams().set('targetStatuses', allStatusesParamValue);
    return this.http.get<Array<CustomerOrderModel>>(`${this.BACK_URL}/api/v1/auth-customer/orders`, {params: params})
      .pipe(catchError(err => {
          this.toasterService.errorNotification(err?.message ?? 'Failed to find your orders.');
          return of([])
        }
      ));
  }

  public static getAllOrderStatusNames(): Array<string> {
    let res: Array<string> = [];
    for (let status in OrderStatus) {
      if (isNaN(Number(status))) {
        res.push(status);
      }
    }
    return res;
  }
}
