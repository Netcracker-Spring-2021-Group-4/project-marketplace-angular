import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../../services/role.service";
import {AuthStoreApiService} from "../../../api-services/auth-store-http.service";
import {PublicApiService} from "../../../api-services/public-http.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CartInfoResponse} from "../../../shared/models/api/receive/cart-info-response.model";
import {switchMap} from "rxjs/operators";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {CartManagementService} from "../../../services/cart-management.service";
import {CartItemModel} from "../../../shared/models/api/send/cart-item.model";
import {CartProductInfo} from "../../../shared/models/api/receive/cart-product-info.model";
import {of} from "rxjs";

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {

  isLoading = false
  cart: CartInfoResponse
  currentRole: UserRole

  constructor(
    private roleService: RoleService,
    private cartManagementService: CartManagementService,
    private authStoreApiService: AuthStoreApiService,
    private publicApiService: PublicApiService,
    private toaster: ToasterCustomService
  ) { }

  ngOnInit(): void {
    const localCartItems = this.cartManagementService.cart
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
          const serverItems = CartPageComponent.cartInfoToItemsList(cart.content)
          if(!CartPageComponent.equalCartItems(serverItems, localCartItems)){
            const diff = this.getDifferenceInCarts(serverItems, localCartItems)
            if(diff.length > 0) {
              return this.authStoreApiService.addToCartIfPossible(diff)
                .pipe(switchMap(_ => this.authStoreApiService.getCart()))
            }
          }
          return of(cart)
        })
      ).subscribe(res => console.log(res))
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
        item.quantity = newQuantity
      }
    })
    return localItems.filter(i => i.quantity !== 0)
  }

}
