import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../services/role.service";
import {AuthStoreApiService} from "../../../api-services/auth-store-http.service";
import {PublicApiService} from "../../../api-services/public-http.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CartInfoResponse} from "../../../shared/models/api/receive/cart-info-response.model";
import {finalize, switchMap} from "rxjs/operators";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {CartManagementService} from "../../../services/cart-management.service";
import {CartItemModel} from "../../../shared/models/api/send/cart-item.model";
import {CartProductInfo} from "../../../shared/models/api/receive/cart-product-info.model";
import {Observable, of} from "rxjs";
import Labels from "../../../shared/models/labels/labels.constant";

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

  constructor(
    private roleService: RoleService,
    private cartManagementService: CartManagementService,
    private authStoreApiService: AuthStoreApiService,
    private publicApiService: PublicApiService,
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
      finalize(() => this.isLoading = false)
    )
    .subscribe(res => {
      const localCartItems = CartPageComponent.cartInfoToItemsList(this.cart.content)
      const serverCartItems = CartPageComponent.cartInfoToItemsList(res.content)
      if(CartPageComponent.equalCartItems(localCartItems, serverCartItems) && isAdding) this.addProductToProhibitedToAdd(productId)
      this.cart = res
      this.sortCartByName(this.cart)
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
          const serverItems = CartPageComponent.cartInfoToItemsList(cart.content)
          if(!CartPageComponent.equalCartItems(serverItems, localCartItems)){
            const diff = this.getDifferenceInCarts(serverItems, localCartItems)
            if(diff.length > 0) {
              return this.authStoreApiService.addToCartListIfPossible(diff)
                .pipe(switchMap(_ => this.authStoreApiService.getCart()))
            }
          }
          return of(cart)
        }),
        finalize(() => this.isLoading = false)
      ).subscribe(res => {
        this.cart = res;
        this.sortCartByName(this.cart)
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

  private sortCartByName(cart: CartInfoResponse) {
    cart.content.sort((a,b) => a.name > b.name? 1: -1)
  }

  private setNewLocalCartForNonAuth(res: CartInfoResponse) {
    if(this.currentRole === UserRole.ROLE_NO_AUTH_CUSTOMER){
      const newCart = CartPageComponent.cartInfoToItemsList(res.content)
      this.cartManagementService.setNewCart(newCart)
    }
  }

  private static cartInfoToItemsList(cartInfo: CartProductInfo[]): CartItemModel[] {
    return cartInfo.map(item => ({productId: item.productId, quantity: item.quantity}))
  }

  private static equalCartItems(serverItems: CartItemModel[], localItems: CartItemModel[]): boolean {
    const sortFun = (a: CartItemModel, b: CartItemModel) => a.productId > b.productId ? 1 : -1;
    const sortedServer = serverItems.sort(sortFun)
    const sortedLocal = localItems.sort(sortFun)
    return JSON.stringify(sortedServer) === JSON.stringify(sortedLocal)
  }

  private getDifferenceInCarts(serverItems: CartItemModel[], localItems: CartItemModel[]): CartItemModel[] {
    const localProductsList = localItems.map(item => item.productId)
    const temp = serverItems.filter(item => localProductsList.indexOf(item.productId) !== -1)
    if(temp.length === 0) return localItems
    const tempIds = temp.map(item => item.productId)
    localItems.forEach(item =>{
      const idx = tempIds.indexOf(item.productId)
      if ( idx !== -1) {
        const newQuantity = item.quantity - temp[idx].quantity
        if (newQuantity <= 0 ) item.quantity = 0
        else item.quantity = newQuantity
      }
    })
    return localItems.filter(i => i.quantity !== 0)
  }
}
