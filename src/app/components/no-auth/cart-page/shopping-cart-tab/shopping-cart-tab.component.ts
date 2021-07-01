import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {CartInfoResponse} from "../../../../shared/models/api/receive/cart-info-response.model";
import {CartProductInfo} from "../../../../shared/models/api/receive/cart-product-info.model";
import {CartItemModel} from "../../../../shared/models/api/send/cart-item.model";

@Component({
  selector: 'app-shopping-cart-tab',
  templateUrl: './shopping-cart-tab.component.html',
  styleUrls: ['./shopping-cart-tab.component.scss']
})
export class ShoppingCartTabComponent {

  @Input()
  cart: CartInfoResponse
  @Input()
  prohibitedToAddMoreList: string[]
  @Input()
  reservationExists: boolean
  @Output()
  addQuantityEvent = new EventEmitter<CartItemModel>()
  @Output()
  removeQuantityEvent = new EventEmitter<{ content: CartItemModel, permitProduct: string }>()

  constructor() {
  }


  addQuantity(p: CartProductInfo) {
    let {productId} = p
    this.addQuantityEvent.emit({productId, quantity: 1})
  }

  removeQuantity(p: CartProductInfo, removeAll: boolean = false) {
    let {productId, quantity} = p
    const obj = removeAll ? {productId, quantity} : {productId, quantity: 1}
    this.removeQuantityEvent.emit({content: obj, permitProduct: productId})
  }

  isProhibitedToAdd(productId: string) {
    return this.prohibitedToAddMoreList.indexOf(productId) !== -1
  }

  areDifferentTotals() {
    return this.cart.summaryPrice !== this.cart.summaryPriceWithoutDiscount
  }
}
