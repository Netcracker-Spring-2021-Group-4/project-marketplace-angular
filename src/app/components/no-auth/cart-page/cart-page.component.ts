import {Component, OnDestroy, OnInit} from '@angular/core';
import {RoleService} from "../../../services/role.service";
import {AuthStoreApiService} from "../../../api-services/auth-store-http.service";
import {PublicApiService} from "../../../api-services/public-http.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CartInfoResponse} from "../../../shared/models/api/receive/cart-info-response.model";
import {finalize, switchMap, take} from "rxjs/operators";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {CartManagementService} from "../../../services/cart-management.service";
import {CartItemModel} from "../../../shared/models/api/send/cart-item.model";
import {Observable, of, Subscription} from "rxjs";
import Labels from "../../../shared/models/labels/labels.constant";
import {RedirectAuthService} from "../../../services/redirect-auth.service";
import {cartInfoToItemsList, equalCartItems, getDifferenceInCarts, sortCartByName} from './service/utils';
import {CheckoutService} from "../../../services/checkout.service";
import {Router} from "@angular/router";
import {Route} from "../../../shared/models/enums/route.enum";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit, OnDestroy {

  isLoading = false
  cart: CartInfoResponse
  currentRole: UserRole
  prohibitedToAddMoreList: string[] = []
  catalogLink = '/' + Route.CATALOG

  subscriptions: Subscription

  constructor(
    private roleService: RoleService,
    private cartManagementService: CartManagementService,
    private authStoreApiService: AuthStoreApiService,
    private publicApiService: PublicApiService,
    private redirectAuthService: RedirectAuthService,
    private checkoutService: CheckoutService,
    private router: Router,
    private toaster: ToasterCustomService,
    private titleService: Title
  ) {
    this.subscriptions = new Subscription()
    this.titleService.setTitle("Cart")
  }

  ngOnInit(): void {
    this.fetchCartInitial()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  addToCart($event: CartItemModel) {
    this.changeQuantityThenFetchCart(
      this.cartManagementService.addToCartObservable($event), true, $event.productId
    )
  }

  removeFromCart($event: { content: CartItemModel, permitProduct: string }) {
    if (this.prohibitedToAddMoreList.indexOf($event.permitProduct) !== -1) {
      this.prohibitedToAddMoreList = this.prohibitedToAddMoreList.filter(p => p !== $event.permitProduct)
    }
    this.changeQuantityThenFetchCart(
      this.cartManagementService.removeFromCartObservable($event.content)
    )
  }

  get isNoAuthCustomer() {
    return this.currentRole === UserRole.ROLE_NO_AUTH_CUSTOMER
  }

  get reservationExists() {
    return this.checkoutService.isReserved
  }

  isCartEmpty() {
    return !this.cart || this.cart.content.length === 0;
  }

  redirectToAuth(isLogin: boolean) {
    this.redirectAuthService.changeRedirectUrlAndGoAuth(isLogin)
  }

  checkout() {
    this.isLoading = true
    const sub = this.publicApiService
      .makeReservation(cartInfoToItemsList(this.cart.content))
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(_ => {
        this.toaster.successfulNotification(Labels.cart.successfulReservationMade)
        this.checkoutService.setReserved(this.cart)
        this.goToCheckout()
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })

    this.subscriptions.add(sub)
  }

  goToCheckout() {
    this.router.navigate([Route.CHECK_OUT])
  }

  cancelReservation() {
    this.isLoading = true
    const sub = this.publicApiService
      .cancelReservation(this.checkoutService.cart!.content)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(_ => {
        this.toaster.successfulNotification(Labels.cart.successfulReservationRemoved)
        this.checkoutService.removeReservation()
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })

    this.subscriptions.add(sub)
  }

  private changeQuantityThenFetchCart(obs$: Observable<any>, isAdding = false, productId: string = '') {
    const sub = obs$
      .pipe(
        switchMap(res => {
          if (isAdding) {
            const result = res.content
            const error = res.error
            if (result && !error) {
            } else this.toaster.infoNotification(error)
          }

          return this.currentRole === UserRole.ROLE_NO_AUTH_CUSTOMER ?
            this.publicApiService.getCart(this.cartManagementService.localCart)
            : this.authStoreApiService.getCart()
        }),
        take(1)
      )
      .subscribe(res => {
        const cart = res.content
        const localCartItems = cartInfoToItemsList(this.cart.content)
        const serverCartItems = cartInfoToItemsList(cart.content)
        if (equalCartItems(localCartItems, serverCartItems) && isAdding) this.addProductToProhibitedToAdd(productId)
        this.cart = cart
        sortCartByName(this.cart)
        this.setNewLocalCartForNonAuth(cart)
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })

    this.subscriptions.add(sub)
  }

  private fetchCartInitial() {
    this.isLoading = true
    const localCartItems = this.cartManagementService.localCart
    const sub = this.roleService.currentRole$
      .pipe(
        switchMap(role => {
          this.currentRole = role
          return role === UserRole.ROLE_NO_AUTH_CUSTOMER ?
            this.publicApiService.getCart(localCartItems)
            : this.authStoreApiService.getCart()
        }),
        switchMap(cart => {
          this.toaster.infoNotificationList(cart.errors)
          if (this.currentRole !== UserRole.ROLE_CUSTOMER) return of(cart);
          this.cartManagementService.emptyLocalCart();
          const serverItems = cartInfoToItemsList(cart.content.content)
          if (!equalCartItems(serverItems, localCartItems)) {
            const diff = getDifferenceInCarts(serverItems, localCartItems)
            if (diff.length > 0) {
              return this.authStoreApiService.addToCartListIfPossible(diff)
                .pipe(switchMap(res => {
                  this.toaster.infoNotificationList(res)
                  return this.authStoreApiService.getCart()
                }))
            }
          }
          return of(cart)
        }),
        take(1),
        finalize(() => this.isLoading = false)
      ).subscribe(res => {
      const cart = res.content
      this.cart = cart;
      sortCartByName(this.cart)
      this.setNewLocalCartForNonAuth(cart)
    }, err => {
      this.toaster.errorNotification(err.error.message)
    })

    this.subscriptions.add(sub)
  }

  private addProductToProhibitedToAdd(productId: string) {
    const alreadyIn = this.prohibitedToAddMoreList.indexOf(productId) !== -1
    this.prohibitedToAddMoreList = alreadyIn ? [...this.prohibitedToAddMoreList] :
      [...this.prohibitedToAddMoreList, productId]
  }


  private setNewLocalCartForNonAuth(res: CartInfoResponse) {
    if (this.currentRole === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      const newCart = cartInfoToItemsList(res.content)
      this.cartManagementService.setNewCart(newCart)
    }
  }
}
