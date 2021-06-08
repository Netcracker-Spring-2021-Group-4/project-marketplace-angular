import {Time} from "@angular/common";

export class DeliveryModel{
  orderId:string
  timeStart:Time
  timeEnd: Time
  phoneNumber: string
  firstName: string
  lastName: string
  city: string
  street:string
  building:string
  flat: number
  statusName: string

  constructor(init: Partial<DeliveryModel>) {
    Object.assign(this, init);
  }

}
