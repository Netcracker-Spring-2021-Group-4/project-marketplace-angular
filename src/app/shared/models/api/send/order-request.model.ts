import {CartItemModel} from "./cart-item.model";

export class OrderRequest {
  phoneNumber: string
  deliverySlot: string
  address: {
    city: string
    street: string
    building: string
    flat: number
  }
  comment: string
  products: CartItemModel[]

  constructor(init: Partial<OrderRequest>) {
    Object.assign(this, init);
  }
}
