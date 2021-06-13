import {Injectable} from '@angular/core';
import {RoleService} from "./role.service";
import {AuthStoreApiService} from "../api-services/auth-store-http.service";
import Labels from "../shared/models/labels/labels.constant";
import {UserRole} from "../shared/models/enums/role.enum";
import {CartItemModel} from "../shared/models/api/send/cart-item.model";
import {ToasterCustomService} from "./toaster-custom.service";
import {Observable, of} from "rxjs";
import {isValidUUID} from "../shared/helpers/util-functions.helper";

@Injectable({
  providedIn: 'root'
})
export class CartManagementService {

  private static readonly CART_STORAGE = 'cart'
  private role: UserRole

  constructor(
    private roleService: RoleService,
    private authStoreApiService: AuthStoreApiService,
    private toaster: ToasterCustomService
  ) {
    this.roleService.currentRole$.subscribe(role => this.role = role)
  }

  get localCart() : CartItemModel[] {
    const cartString = localStorage.getItem(CartManagementService.CART_STORAGE)
    const parsed = JSON.parse(cartString ?? "")
    return parsed === "" ? [] : parsed
  }

  setNewCart(newCart: CartItemModel[]) {
    localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify(newCart))
  }

  emptyLocalCart() {
    localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify([]))
  }

  addToCart(item: CartItemModel) {
    if(!isValidUUID(item.productId)) {
      this.wrongUUIDNotify()
      return
    }
    if( this.role === UserRole.ROLE_CUSTOMER ) {
      this.addToCartServer(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.addToCartLocal(item)
    }
  }

  addToCartObservable(item: CartItemModel): Observable<any>{
    if(!isValidUUID(item.productId)) {
      this.wrongUUIDNotify()
      throw null
    }
    if( this.role === UserRole.ROLE_CUSTOMER ) {
      return this.authStoreApiService.addToCart(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.addToCartLocal(item)
    }
    return of(0)
  }

  removeFromCartObservable(item: CartItemModel) : Observable<any>{
    if(!isValidUUID(item.productId)) {
      this.wrongUUIDNotify();
      throw null
    }
    if( this.role === UserRole.ROLE_CUSTOMER ) {
      return this.authStoreApiService.removeFromCart(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.removeFromCartLocal(item)
    }
    return of(0);
  }

  removeFromCart(item: CartItemModel) {
    if(!isValidUUID(item.productId)) {
      this.wrongUUIDNotify();
      return
    }

    if( this.role === UserRole.ROLE_CUSTOMER ) {
      this.removeFromCartServer(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.removeFromCartLocal(item)
    }
  }

  private wrongUUIDNotify() {
    this.toaster.errorNotification(Labels.cart.wrongFormatUUID)
  }

  private removeFromCartServer(item: CartItemModel) {
    this.authStoreApiService.removeFromCart(item).subscribe(_ => {
      this.toaster.infoNotification(Labels.cart.successfulRemovingFromCart)
    }, err => {
      this.toaster.errorNotification(err.error.message)
    })
  }

  private addToCartServer(item: CartItemModel) {
    this.authStoreApiService.addToCart(item).subscribe(_ => {
      this.toaster.successfulNotification(Labels.cart.successfulAddingToCart)
    }, err => {
      this.toaster.errorNotification(err.error.message)
    })
  }

  private removeFromCartLocal(item: CartItemModel) {
    const cartString = localStorage.getItem(CartManagementService.CART_STORAGE)
    let cart : CartItemModel[] = []
    if(!cartString) {
      this.toaster.errorNotification(Labels.cart.errorRemovingFromEmptyCart)
      return
    } else {
      cart = JSON.parse(cartString)
      const idx = cart.findIndex(i => i.productId === item.productId)
      if(idx === -1) {
        this.toaster.errorNotification(Labels.cart.errorRemovingItemIfCartDoesntHaveIt)
      } else {
        const currentQuantity = cart[idx].quantity
        const quantityToRemove = item.quantity
        const quantityLeft = currentQuantity - quantityToRemove
        if(quantityLeft < 0) {
          this.toaster.errorNotification(Labels.cart.errorRemoveNegativeQuantity)
          return
        }
        else if (quantityLeft === 0) cart = cart.filter(i => i.productId !== item.productId)
        else cart[idx].quantity = quantityLeft
        localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify(cart))
        this.toaster.infoNotification(Labels.cart.successfulRemovingFromCart)
      }
    }
  }

  private addToCartLocal(item: CartItemModel) {
    const cartString = localStorage.getItem(CartManagementService.CART_STORAGE)
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
    localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify(cart))
    this.toaster.successfulNotification(Labels.cart.successfulAddingToCart)
  }
}
