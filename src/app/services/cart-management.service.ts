import {Injectable} from '@angular/core';
import {RoleService} from "./role.service";
import {AuthStoreApiService} from "../api-services/auth-store-http.service";
import {validate as uuidValidate} from 'uuid';
import {Toaster} from "ngx-toast-notifications";
import Labels from "../shared/models/labels/labels.constant";
import {UserRole} from "../shared/models/enums/role.enum";
import {CartItemModel} from "../shared/models/api/send/cart-item.model";

@Injectable({
  providedIn: 'root'
})
export class CartManagementService {

  private role: UserRole

  constructor(
    private roleService: RoleService,
    private authStoreApiService: AuthStoreApiService,
    private toaster: Toaster
  ) {
    this.roleService.currentRole.subscribe( role => this.role = role)
  }

  static isValidUUID(uuid: string): boolean {
    return uuidValidate(uuid);
  }

  addToCart(item: CartItemModel) {
    if(!CartManagementService.isValidUUID(item.productId)) {
      this.toaster.open({
        text: Labels.cart.wrongFormatUUID,
        caption: Labels.caption.error,
        duration: 4000,
        type: 'danger'
      })
      return
    }
    if( this.role === UserRole.ROLE_CUSTOMER ) {
      this.addToCartServer(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.addToCartLocal(item)
    }
  }

  private addToCartServer(item: CartItemModel) {
    this.authStoreApiService.addToCart(item).subscribe(_ => {
      this.toaster.open({
        text: Labels.cart.successfulAddingToCart,
        caption: Labels.caption.success,
        duration: 4000,
        type: 'success'
      })
    }, err => {
      this.toaster.open({
        text: err.error.message,
        caption: Labels.caption.error,
        duration: 4000,
        type: 'danger'
      })
    })
  }

  private addToCartLocal(item: CartItemModel) {
    const cartString = localStorage.getItem('cart')
    let cart : CartItemModel[] = []
    if(!cartString) {
      cart.push(item)
    } else {
      cart = JSON.parse(cartString)
      const idx = cart.findIndex(i => i.productId === item.productId)
      if (idx === -1 ) {
        cart.push(item)
      } else {
        cart[idx].quantity += item.quantity
      }
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    this.toaster.open({
      text: Labels.cart.successfulAddingToCart,
      caption: Labels.caption.success,
      duration: 4000,
      type: 'success'
    })
  }
}
