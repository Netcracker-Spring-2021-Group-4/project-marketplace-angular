export class OrderProductInfo{
  productId: string
  name: string
  imageUrl: string
  price: number
  quantity: number
  totalPrice: number

  constructor(init: Partial<OrderProductInfo>) {
    Object.assign(this, init);
  }
}
