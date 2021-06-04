export class CartProductInfo {
  productId: string
  name: string
  description: string
  imageURL: string
  price: number
  quantity: number
  category: string
  discount: number
  totalPriceWithoutDiscount: number
  totalPrice: number

  constructor(init: Partial<CartProductInfo>) {
    Object.assign(this, init);
  }
}
