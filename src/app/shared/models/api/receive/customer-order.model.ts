import {OrderStatus} from "../../enums/order-status";
import {AddressModel} from "./address.model";

export class CustomerOrderModel {
  orderId: string;
  deliveryDate: number;
  timeStart: number;
  timeEnd: number;
  deliveryAddress: AddressModel
  phoneNumber: string
  firstName: string;
  lastName: string;
  status: OrderStatus;
  comment: string;
  placedAt: number;

  constructor(init: Partial<CustomerOrderModel>) {
    Object.assign(this, init);
  }
}
