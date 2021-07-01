import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {CartInfoResponse} from "../../../../shared/models/api/receive/cart-info-response.model";
import {CartProductInfo} from "../../../../shared/models/api/receive/cart-product-info.model";
import {CartItemModel} from "../../../../shared/models/api/send/cart-item.model";
import {first} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  constructor(private _snackBar: MatSnackBar) {
  }


  addQuantity(p: CartProductInfo) {
    let {productId} = p
    this.addQuantityEvent.emit({productId, quantity: 1})
  }

  removeQuantity(p: CartProductInfo, removeAll: boolean = false) {
    let {productId, name, quantity} = p
    const removingAll = removeAll || (quantity - 1 === 0)
    if (removingAll) {
      let snackBarRef =
        this._snackBar.open(`Deleting from the cart "${name}" `,
          "Undo",
          {
            duration: 700,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
      snackBarRef.afterDismissed()
        .pipe(first())
        .subscribe(event => {
          if (event.dismissedByAction) return
          this.removeQuantityEvent.emit({content: {productId, quantity}, permitProduct: productId})
        })
    } else {
      this.removeQuantityEvent.emit({content: {productId, quantity: 1}, permitProduct: productId})
    }

  }

  isProhibitedToAdd(productId: string) {
    return this.prohibitedToAddMoreList.indexOf(productId) !== -1
  }

  areDifferentTotals() {
    return this.cart.summaryPrice !== this.cart.summaryPriceWithoutDiscount
  }
}
