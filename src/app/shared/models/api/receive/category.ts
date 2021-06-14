export class Category {
  categoryId: number;
  productCategoryName: string;
  productsInCategory: number


  constructor(init: Partial<Category>) {
    Object.assign(this, init);
  }
}
