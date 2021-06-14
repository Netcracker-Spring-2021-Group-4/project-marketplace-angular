import {Injectable} from '@angular/core';
import {UserRole} from "../shared/models/enums/role.enum";
import {Subscription} from "rxjs";
import {RoleService} from "./role.service";
import {ToasterCustomService} from "./toaster-custom.service";
import {OrderStatus} from "../shared/models/enums/order-status";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  role: UserRole;
  roleSub: Subscription;
  private readonly BACK_URL: string;

  constructor(private http: HttpClient,
              private roleService: RoleService,
              private toaster: ToasterCustomService) {
    this.BACK_URL = `${environment.backURL}`;
    this.roleSub = this.roleService.currentRole$.subscribe(role => this.role = role);
  }

  public updateOrderState(orderId: string, newStatus : OrderStatus) : void {
    if (this.role === UserRole.ROLE_CUSTOMER) {
      if (newStatus === OrderStatus.CANCELLED) {
        this.http.post<any>(`${this.BACK_URL}/api/v1/auth-customer/orders/cancelled/${orderId}`, {}, {}).pipe(
          catchError<any, any>(error => {
            this.toaster.errorNotification(error?.message ?? 'Could not cancel your order.')
          })
        ).subscribe();
      }
      else this.toaster.errorNotification("Customers can only cancel their orders.")
    }
    if (this.role === UserRole.ROLE_COURIER) {
      let form = new FormData();
      form.set('orderStatus', OrderStatus[newStatus].toString())
      this.http.patch<any>(`${this.BACK_URL}/api/v1/courier/orders/${orderId}`, form).pipe(
        catchError<any, any>(error => {
          this.toaster.errorNotification(error?.message ?? 'Could not cancel change state of the order.')
        })
      ).subscribe();
    }
  }
}
