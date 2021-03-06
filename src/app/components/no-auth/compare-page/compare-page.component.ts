import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, Subscription} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {finalize, map, shareReplay} from "rxjs/operators";
import {PublicApiService} from "../../../api-services/public-http.service";
import {CompareManagementService} from "../../../services/compare-management.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {CartProductInfo} from "../../../shared/models/api/receive/cart-product-info.model";
import {Route} from "../../../shared/models/enums/route.enum";
import {CartManagementService} from "../../../services/cart-management.service";
import {CheckoutService} from "../../../services/checkout.service";
import {Title} from "@angular/platform-browser";
import {RoleService} from "../../../services/role.service";
import {UserRole} from "../../../shared/models/enums/role.enum";

@Component({
  selector: 'app-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.scss']
})
export class ComparePageComponent implements OnInit, OnDestroy {
  isLoading: boolean
  products: CartProductInfo[]
  currentRole: UserRole
  subscription: Subscription

  catalogLink = '/' + Route.CATALOG

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches
      }),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private publicApiService: PublicApiService,
    private compareManagementService: CompareManagementService,
    private cartManagementService: CartManagementService,
    private checkoutService: CheckoutService,
    private toaster: ToasterCustomService,
    private roleService: RoleService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Compare products")
    this.subscription = this.roleService.currentRole$.subscribe( role => this.currentRole = role)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.isLoading = true;
    const mergedObservable = forkJoin([this.publicApiService.getListOfCategories(),
      this.publicApiService.getListForComparison(this.compareManagementService.comparisonList)])
    const sub = mergedObservable
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(res => {
        const categories = res[0]
        const products = res[1]
        this.products = products.map((product: any) => {
          const category = categories.find((c: any) => c.categoryId === product.categoryId)
          return new CartProductInfo({...product, category: category.categoryName})
        })
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })

    this.subscription.add(sub)
  }

  drop($event: CdkDragDrop<string[]>) {
    moveItemInArray(this.products, $event.previousIndex, $event.currentIndex);
  }

  get reservationExists() {
    return this.checkoutService.isReserved
  }

  get addToCartNeeded() {
    return this.currentRole === UserRole.ROLE_NO_AUTH_CUSTOMER || this.currentRole === UserRole.ROLE_CUSTOMER
  }

  addToCart(productId: string) {
    this.cartManagementService.addToCart({productId, quantity: 1})
  }

  removeQuantity(productId: string) {
    this.compareManagementService.removeFromList(productId)
    this.products = this.products.filter(p => p.productId !== productId)
  }
}
