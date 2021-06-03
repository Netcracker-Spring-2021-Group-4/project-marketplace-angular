export class Category {
  categoryId: number;
  productCategoryName: String;
  productsInCategory: number


  constructor(init: Partial<Category>) {
    Object.assign(this, init);
  }
}
