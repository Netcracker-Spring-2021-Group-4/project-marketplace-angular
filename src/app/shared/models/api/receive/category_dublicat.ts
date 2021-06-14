export class Category_DUBLICAT {
  categoryId: number;
  categoryName: string;
  productsInCategory: number;

  constructor(init: Partial<Category_DUBLICAT>) {
    Object.assign(this, init);
  }
}
