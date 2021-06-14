export class Category {
  categoryId: number;
  categoryName: string;
  productsInCategory: number;

  constructor(init: Partial<Category>) {
    Object.assign(this, init);
  }
}
