import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../services/role.service";
import {AuthStoreApiService} from "../../../api-services/auth-store-http.service";
import {PublicApiService} from "../../../api-services/public-http.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CartInfoResponse} from "../../../shared/models/api/receive/cart-info-response.model";
import {finalize, switchMap, take} from "rxjs/operators";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {CartManagementService} from "../../../services/cart-management.service";
import {CartItemModel} from "../../../shared/models/api/send/cart-item.model";
import {Observable, of} from "rxjs";
import Labels from "../../../shared/models/labels/labels.constant";
import {RedirectAuthService} from "../../../services/redirect-auth.service";
import {getDifferenceInCarts, equalCartItems, cartInfoToItemsList, sortCartByName} from './service/utils';
import {CheckoutService} from "../../../services/checkout.service";
import {Router} from "@angular/router";
import {Route} from "../../../shared/models/enums/route.enum";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {

  isLoading = false
  cart: CartInfoResponse
  currentRole: UserRole
  prohibitedToAddMoreList: string[] = []
  catalogLink = '/' + Route.CATALOG

  constructor(
    private roleService: RoleService,
    private cartManagementService: CartManagementService,
    private authStoreApiService: AuthStoreApiService,
    private publicApiService: PublicApiService,
    private redirectAuthService: RedirectAuthService,
    private checkoutService: CheckoutService,
    private router: Router,
    private toaster: ToasterCustomService
  ) { }

  ngOnInit(): void {
    this.fetchCartInitial()
  }

  addToCart($event: CartItemModel) {
    this.changeQuantityThenFetchCart(
      this.cartManagementService.addToCartObservable($event), true, $event.productId
    )
  }

  removeFromCart($event: {content: CartItemModel, permitProduct: string}) {
    if(this.prohibitedToAddMoreList.indexOf($event.permitProduct) !== -1) {
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
    this.publicApiService
      .makeReservation(cartInfoToItemsList(this.cart.content))
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( _ => {
        this.toaster.successfulNotification(Labels.cart.successfulReservationMade)
        this.checkoutService.setReserved(this.cart)
        this.goToCheckout()
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

  goToCheckout() {
    this.router.navigate([Route.CHECK_OUT])
  }

  cancelReservation() {
    this.isLoading = true
    this.publicApiService
      .cancelReservation(this.checkoutService.cart!.content)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( _ => {
        this.toaster.successfulNotification(Labels.cart.successfulReservationRemoved)
        this.checkoutService.removeReservation()
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

  private changeQuantityThenFetchCart(obs$: Observable<any>, isAdding= false, productId: string = '') {
    this.isLoading = true
    obs$
    .pipe(
      switchMap(successful => {
        if(successful) {
          const text = isAdding? Labels.cart.successfulAddingToCart : Labels.cart.successfulRemovingFromCart
          isAdding ? this.toaster.successfulNotification(text): this.toaster.infoNotification(text)
        }
        return this.currentRole === UserRole.ROLE_NO_AUTH_CUSTOMER ?
          this.publicApiService.getCart(this.cartManagementService.localCart)
          : this.authStoreApiService.getCart()
      }),
      take(1),
      finalize(() => this.isLoading = false)
    )
    .subscribe(res => {
      const localCartItems = cartInfoToItemsList(this.cart.content)
      const serverCartItems = cartInfoToItemsList(res.content)
      if(equalCartItems(localCartItems, serverCartItems) && isAdding) this.addProductToProhibitedToAdd(productId)
      this.cart = res
      sortCartByName(this.cart)
      this.setNewLocalCartForNonAuth(res)
    }, err => {
      this.toaster.errorNotification(err.error.message)
    })
  }

  private fetchCartInitial() {
    this.isLoading = true
    const localCartItems = this.cartManagementService.localCart
    this.roleService.currentRole$
      .pipe(
        switchMap( role => {
          this.currentRole = role
          return role === UserRole.ROLE_NO_AUTH_CUSTOMER ?
            this.publicApiService.getCart(localCartItems)
            : this.authStoreApiService.getCart()
        }),
        switchMap( cart => {
          if(this.currentRole !== UserRole.ROLE_CUSTOMER) return of(cart);
          this.cartManagementService.emptyLocalCart();
          const serverItems = cartInfoToItemsList(cart.content)
          if(!equalCartItems(serverItems, localCartItems)){
            const diff = getDifferenceInCarts(serverItems, localCartItems)
            if(diff.length > 0) {
              return this.authStoreApiService.addToCartListIfPossible(diff)
                .pipe(switchMap(_ => this.authStoreApiService.getCart()))
            }
          }
          return of(cart)
        }),
        take(1),
        finalize(() => this.isLoading = false)
      ).subscribe(res => {
        this.cart = res;
        sortCartByName(this.cart)
        this.setNewLocalCartForNonAuth(res)
      }, err => {
        this.toaster.errorNotification(err.error.message)
    })
  }

  private addProductToProhibitedToAdd(productId: string) {
    const alreadyIn = this.prohibitedToAddMoreList.indexOf(productId) !== -1
    this.prohibitedToAddMoreList = alreadyIn ? [...this.prohibitedToAddMoreList] :
      [...this.prohibitedToAddMoreList, productId]
  }


  private setNewLocalCartForNonAuth(res: CartInfoResponse) {
    if(this.currentRole === UserRole.ROLE_NO_AUTH_CUSTOMER){
      const newCart = cartInfoToItemsList(res.content)
      this.cartManagementService.setNewCart(newCart)
    }
  }
}
