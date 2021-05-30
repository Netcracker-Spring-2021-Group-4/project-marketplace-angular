export class CartItemModel {
  quantity: number;
  productId: string;

  constructor(init: Partial<CartItemModel>) {
    Object.assign(this, init);
  }
}
