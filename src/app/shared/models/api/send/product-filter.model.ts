export class ProductFilterModel {
  nameQuery ?: string;
  minPrice ?: number;
  maxPrice ?: number;
  categories ?: number[];
  sortBy ?:string

  constructor(init: Partial<ProductFilterModel>) {
    Object.assign(this, init);
  }
}
