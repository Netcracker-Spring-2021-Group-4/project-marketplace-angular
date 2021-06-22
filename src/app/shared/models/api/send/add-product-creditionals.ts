export class AddProductCreditionals {
  productName : string
  description ?: string
  price : number
  inStock : number
  categoryId ?: number
  file: File


  constructor(init: Partial<AddProductCreditionals>) {
    Object.assign(this, init);
  }
}
