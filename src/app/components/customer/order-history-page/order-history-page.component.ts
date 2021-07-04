import {Component, OnInit} from '@angular/core';
import {CustomerOrderModel} from "../../../shared/models/api/receive/customer-order.model";
import {OrderHttpService} from "../../../api-services/order-http.service";
import {CustomerFormService} from "../services/customer-form.service";
import {FormGroup} from "@angular/forms";
import {OrderStatus} from "../../../shared/models/enums/order-status";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import AutoUnsub from "../../../shared/helpers/decorators/AutoUnsub";

@Component({
  selector: 'app-order-history-page',
  templateUrl: './order-history-page.component.html',
  styleUrls: ['./order-history-page.component.scss']
})
@AutoUnsub()
export class OrderHistoryPageComponent implements OnInit {

  filteredOrders: Array<CustomerOrderModel>;
  private allOrders: Array<CustomerOrderModel>;
  orderForm: FormGroup;
  private orderSubs : Subscription;

  constructor(
    private orderHttp: OrderHttpService,
    private customerForms: CustomerFormService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Order history")
    this.orderForm = customerForms.orderFilterForm();
  }

  ngOnInit(): void {
    this.orderSubs?.unsubscribe();
    this.orderSubs = this.orderHttp.getCustomerOrders().subscribe(orders => {
      this.allOrders = orders;
      this.filteredOrders = orders;
    });
  }

  filterOrders(filter: FormGroup) {
    let freshFiltered = [...this.allOrders];
    if (filter.get('placedDateStart')?.value && filter.get('placedDateEnd')?.value) {
      const placedAfter: number = Date.parse(filter.get('placedDateStart')?.value);
      const placedBefore: number = Date.parse(filter.get('placedDateEnd')?.value);
      freshFiltered = freshFiltered.filter(ord => ord.placedAt >= placedAfter && ord.placedAt <= placedBefore);
    }
    if (filter.get('deliveryDateStart')?.value && filter.get('deliveryDateEnd')?.value) {
      const deliveryAfter: number = Date.parse(filter.get('deliveryDateStart')?.value);
      const deliveryBefore: number = Date.parse(filter.get('deliveryDateEnd')?.value);
      freshFiltered = freshFiltered.filter(ord => ord.deliveryDate >= deliveryAfter && ord.deliveryDate <= deliveryBefore);
    }

    let targetStatuses = new Set<OrderStatus>();
    if (filter.get('isStatusSubmitted')?.value) targetStatuses.add(OrderStatus.SUBMITTED);
    if (filter.get('isStatusInDelivery')?.value) targetStatuses.add(OrderStatus.IN_DELIVERY);
    if (filter.get('isStatusInDelivered')?.value) targetStatuses.add(OrderStatus.DELIVERED);
    if (filter.get('isStatusInCancelled')?.value) targetStatuses.add(OrderStatus.CANCELLED);
    if (filter.get('isStatusInFailed')?.value) targetStatuses.add(OrderStatus.FAILED);

    if (targetStatuses.size !== 0 && targetStatuses.size !== Object.keys(OrderStatus).length / 2) {
      // @ts-ignore
      freshFiltered = freshFiltered.filter(ord => targetStatuses.has(OrderStatus[ord.status]));
    }

    this.filteredOrders = freshFiltered;
  }
}
