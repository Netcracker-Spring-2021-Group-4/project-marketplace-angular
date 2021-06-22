export class Product {
  productId:string;
  name:string;
  description:string;
  imageUrl:string;
  price:number;
  inStock:number;
  discount:number;
  popularNow:boolean

  constructor(id: string, name: string , description: string, imageUrl: string, price: number, inStock: number, discount: number, popular:boolean) {
    this.productId = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this.inStock = inStock;

    this.discount = discount;
    this.popularNow=popular;
  }
}
