export class CategoryInfo {
  categoryId: number;
  categoryName: string;
  productsInCategory: number;

  constructor(init: Partial<CategoryInfo>) {
    Object.assign(this, init);
  }
}
