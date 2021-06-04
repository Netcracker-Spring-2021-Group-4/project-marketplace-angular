import {CartProductInfo} from "./cart-product-info.model";

export class CartInfoResponse {
  content: CartProductInfo[]
  summaryPriceWithoutDiscount: number
  summaryPrice: number

  constructor(init: Partial<CartInfoResponse>) {
    Object.assign(this, init);
  }
}
