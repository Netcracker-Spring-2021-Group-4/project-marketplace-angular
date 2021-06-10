import {Component, Input} from '@angular/core';
import {CartProductInfo} from "../../../shared/models/api/receive/cart-product-info.model";

@Component({
  selector: 'app-product-cart-order-card',
  templateUrl: './product-cart-order-card.component.html',
  styleUrls: ['./product-cart-order-card.component.scss']
})
export class ProductCartOrderCardComponent{

  @Input()
  product: CartProductInfo
  @Input()
  showQuantity: boolean

  discountExist(discount: number) {
    return discount !== -1
  }
}
