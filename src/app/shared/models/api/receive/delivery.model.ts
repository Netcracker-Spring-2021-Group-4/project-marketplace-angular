import {Time} from "@angular/common";
import {OrderStatus} from "../../enums/order-status.enum";

export class DeliveryModel{
  orderId:string
  timeStart:Date
  timeEnd: Date
  phoneNumber: string
  firstName: string
  lastName: string
  city: string
  street:string
  building:string
  flat: number
  statusName: OrderStatus

  constructor(init: Partial<DeliveryModel>) {
    Object.assign(this, init);
  }

}
