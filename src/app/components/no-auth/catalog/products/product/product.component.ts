import {Component, OnInit, Input, Output} from '@angular/core';
import {Product} from "../../../../../shared/models/api/receive/product";
import {UserRole} from "../../../../../shared/models/enums/role.enum";
import {CartItemModel} from "../../../../../shared/models/api/send/cart-item.model";
import {CartManagementService} from "../../../../../services/cart-management.service";
import Labels from "../../../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../../../services/toaster-custom.service";
import {CompareManagementService} from "../../../../../services/compare-management.service";
import {Route} from "../../../../../shared/models/enums/route.enum";
import {Category} from "../../../../../shared/models/api/receive/category";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() role: UserRole
  @Input() productItem: Product
  @Input() categories:Category[]

  constructor(private cartManager:CartManagementService,
              private toaster: ToasterCustomService,
              private compareService: CompareManagementService
  ) {
  }



  ngOnInit(): void {
  }

  addToCart(id: string) {
    if(this.productItem.inStock==0)
      this.outOfStockNotify()
    else
     this.cartManager.addToCart(new CartItemModel({quantity:1,productId:id}));
     }

  addToCompare(id: string) {
      this.compareService.addToList(id);
  }

  private outOfStockNotify() {
    this.toaster.errorNotification(Labels.cart.outOfStock)
  }

  getProductLink(productId: string) : string {
    return '/' + Route.PRODUCT.replace(':productId', productId);
  }

  getCategory(categoryId:number): string {
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].categoryId == categoryId)
        return this.categories[i].productCategoryName;
    }
    return 'unknown category';
  }
}
