import {SortOptionEnum} from "../../enums/sort-option.enum";

export class ProductFilterModel {
  nameQuery ?: string;
  minPrice ?: number;
  maxPrice ?: number;
  categoryIds ?: number[];
  sortOption ?:SortOptionEnum

  constructor(init: Partial<ProductFilterModel>) {
    Object.assign(this, init);
  }
}
