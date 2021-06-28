export class Product {
  productId:string;
  name:string;
  description:string;
  imageUrl:string;
  price:number;
  inStock:number;
  discount:number;
  popularNow:boolean
  categoryId:number

  constructor(init: Partial<Product>) {
    Object.assign(this, init);
  }
}
