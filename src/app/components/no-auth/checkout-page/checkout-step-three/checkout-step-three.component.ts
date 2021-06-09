import {Component, Input, EventEmitter, Output} from '@angular/core';
import { DatePipe } from '@angular/common';
import {OrderRequest} from "../../../../shared/models/api/send/order-request.model";
import {CartInfoResponse} from "../../../../shared/models/api/receive/cart-info-response.model";

@Component({
  selector: 'app-checkout-step-three',
  templateUrl: './checkout-step-three.component.html',
  styleUrls: ['./checkout-step-three.component.scss'],
  providers: [DatePipe]
})
export class CheckoutStepThreeComponent{

  @Input()
  result: OrderRequest
  @Input()
  cart: CartInfoResponse
  @Output()
  makeOrderEvent = new EventEmitter<void>()

  constructor(
    private datePipe: DatePipe
  ) { }

  getPrettifiedDate(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-YYYY HH:mm:ss') ?? ''
  }

  makeOrder() {
    this.makeOrderEvent.emit()
  }
}
