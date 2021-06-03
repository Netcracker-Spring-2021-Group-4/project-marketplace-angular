export class Product {
  id:String;
  name:String;
  description:String;
  imageUrl:String;
  price:number;
  inStock:number;
  reserved:number;
  discount:number;

  constructor(id: String, name: String , description: String, imageUrl: String, price: number, inStock: number, reserved: number , discount: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this.inStock = inStock;
    this.reserved = reserved;
    this.discount = discount;
  }
}
