import {Component, OnInit, Input, Output} from '@angular/core';
import {Product} from "../../../../../shared/models/api/receive/product";
import {UserRole} from "../../../../../shared/models/enums/role.enum";
import {CartItemModel} from "../../../../../shared/models/api/send/cart-item.model";
import {CartManagementService} from "../../../../../services/cart-management.service";
import Labels from "../../../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../../../services/toaster-custom.service";
import {CompareManagementService} from "../../../../../services/compare-management.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @Input() role: UserRole
  @Input() productItem: Product

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
}