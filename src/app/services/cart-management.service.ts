import {Injectable} from '@angular/core';
import {RoleService} from "./role.service";
import {AuthStoreApiService} from "../api-services/auth-store-http.service";
import Labels from "../shared/models/labels/labels.constant";
import {UserRole} from "../shared/models/enums/role.enum";
import {CartItemModel} from "../shared/models/api/send/cart-item.model";
import {ToasterCustomService} from "./toaster-custom.service";
import {Observable, of} from "rxjs";
import {isValidUUID} from "../shared/helpers/util-functions.helper";
import {PublicApiService} from "../api-services/public-http.service";
import {Router} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {first} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CartManagementService {

  private static readonly CART_STORAGE = 'cart'
  private role: UserRole

  constructor(
    private roleService: RoleService,
    private authStoreApiService: AuthStoreApiService,
    private publicApiService: PublicApiService,
    private toaster: ToasterCustomService,
    private router: Router,
  ) {
    this.roleService.currentRole$.subscribe(role => this.role = role)
  }

  get localCart(): CartItemModel[] {
    const cartString = localStorage.getItem(CartManagementService.CART_STORAGE)
    const parsed = JSON.parse(cartString ?? "[]")
    return parsed === [] ? [] : parsed
  }

  findItemInCart(id: string): CartItemModel | undefined {
    return this.localCart.find(item => item.productId === id)
  }

  setNewCart(newCart: CartItemModel[]) {
    localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify(newCart))
  }

  emptyLocalCart() {
    localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify([]))
  }

  addToCart(item: CartItemModel) {
    if (!isValidUUID(item.productId)) {
      this.wrongUUIDNotify()
      return
    }
    if (this.role === UserRole.ROLE_CUSTOMER) {
      this.addToCartServer(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.publicApiService.getProductAvailability(item.productId)
        .pipe(first())
        .subscribe(res => {
          const available = res.content
          const error = res.error
          if (error) {
            this.toaster.errorNotification(error)
            return
          } else {
            const itemLocal = this.findItemInCart(item.productId)
            if ((itemLocal && itemLocal.quantity + (+item.quantity) <= available) || (!itemLocal && (+item.quantity) <= available)) {
              this.addToCartLocal(item)
            } else {
              this.toaster.errorNotification("No more available items of the product to add to the cart")
            }
          }
        })
    }
  }

  addToCartObservable(item: CartItemModel): Observable<any> {
    if (!isValidUUID(item.productId)) {
      this.wrongUUIDNotify()
      throw null
    }
    if (this.role === UserRole.ROLE_CUSTOMER) {
      return this.authStoreApiService.addToCart(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.addToCartLocal(item)
    }
    return of({content: true, error: null})
  }

  removeFromCartObservable(item: CartItemModel): Observable<any> {
    if (!isValidUUID(item.productId)) {
      this.wrongUUIDNotify();
      throw null
    }
    if (this.role === UserRole.ROLE_CUSTOMER) {
      return this.authStoreApiService.removeFromCart(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.removeFromCartLocal(item)
    }
    return of(0);
  }

  removeFromCart(item: CartItemModel) {
    if (!isValidUUID(item.productId)) {
      this.wrongUUIDNotify();
      return
    }

    if (this.role === UserRole.ROLE_CUSTOMER) {
      this.removeFromCartServer(item)
    } else if (this.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      this.removeFromCartLocal(item)
    }
  }

  private wrongUUIDNotify() {
    this.toaster.errorNotification(Labels.cart.wrongFormatUUID)
  }

  private removeFromCartServer(item: CartItemModel) {
    this.authStoreApiService.removeFromCart(item)
      .pipe(first())
      .subscribe(_ => {
        this.toaster.infoNotification(Labels.cart.successfulRemovingFromCart)
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

  private addToCartServer(item: CartItemModel) {
    this.authStoreApiService.addToCart(item)
      .pipe(first())
      .subscribe(res => {
        const result = res.content
        const error = res.error
        if (result) {
          if (error) this.toaster.infoNotification(error)
          else this.toaster.successfulNotification(Labels.cart.successfulAddingToCart)
        } else {
          this.toaster.errorNotification(error)
        }
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

  private removeFromCartLocal(item: CartItemModel) {
    const cartString = localStorage.getItem(CartManagementService.CART_STORAGE)
    let cart: CartItemModel[] = []
    if (!cartString) {
      this.toaster.errorNotification(Labels.cart.errorRemovingFromEmptyCart)
      return
    } else {
      cart = JSON.parse(cartString)
      const idx = cart.findIndex(i => i.productId === item.productId)
      if (idx === -1) {
        this.toaster.errorNotification(Labels.cart.errorRemovingItemIfCartDoesntHaveIt)
      } else {
        const currentQuantity = cart[idx].quantity
        const quantityToRemove = item.quantity
        const quantityLeft = currentQuantity - quantityToRemove
        if (quantityLeft < 0) {
          this.toaster.errorNotification(Labels.cart.errorRemoveNegativeQuantity)
          return
        } else if (quantityLeft === 0) cart = cart.filter(i => i.productId !== item.productId)
        else cart[idx].quantity = quantityLeft
        localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify(cart))
        if (!this.isCartRoute()) this.toaster.infoNotification(Labels.cart.successfulRemovingFromCart)
      }
    }
  }

  private addToCartLocal(item: CartItemModel) {
    const cartString = localStorage.getItem(CartManagementService.CART_STORAGE)
    let cart: CartItemModel[] = []
    if (!cartString) {
      cart.push(item)
    } else {
      cart = JSON.parse(cartString)
      const idx = cart.findIndex(i => i.productId === item.productId)
      if (idx === -1) {
        cart.push(item)
      } else {
        cart[idx].quantity += item.quantity
      }
    }
    localStorage.setItem(CartManagementService.CART_STORAGE, JSON.stringify(cart))
    if (!this.isCartRoute()) this.toaster.successfulNotification(Labels.cart.successfulAddingToCart)
  }

  private isCartRoute() {
    return this.router.url.slice(1) === Route.CART
  }
}
