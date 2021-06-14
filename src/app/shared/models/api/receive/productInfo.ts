export interface ProductInfo {
  productId: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  inStock: number;
  reserved: number;
  availabilityDate: Date;
  isActive: boolean;
  categoryId: number;
}
