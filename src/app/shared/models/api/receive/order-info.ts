import {OrderProductInfo} from "./order-product-info";
import {OrderStatus} from "../../enums/order-status.enum";

export class OrderInfo {
  orderId: string
  placedAt: Date
  phoneNumber: string
  firstName: string
  lastName: string
  city: string
  street: string
  building: string
  flat: number
  statusName: OrderStatus
  comment: string
  content: OrderProductInfo[]
  summaryPrice: number

  constructor(init: Partial<OrderInfo>) {
    Object.assign(this, init);
  }
}
