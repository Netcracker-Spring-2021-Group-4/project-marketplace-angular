import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {Discount} from "../../../shared/models/api/receive/discount";
import {filter, finalize} from "rxjs/operators"
import {ProductInfo} from "../../../shared/models/api/receive/productInfo";
import {ProductsHttpService} from "../../../api-services/products-http.service";
import {DiscountsHttpService} from "../../../api-services/discounts-http.service";
import {CartManagementService} from "../../../services/cart-management.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CartItemModel} from "../../../shared/models/api/send/cart-item.model";
import Labels from "../../../shared/models/labels/labels.constant";
import {PublicApiService} from "../../../api-services/public-http.service";
import {forkJoin, Observable, Subscription} from "rxjs";
import {CompareManagementService} from "../../../services/compare-management.service";
import {Product} from "../../../shared/models/api/receive/product";
import {Category} from "../../../shared/models/api/receive/category";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, OnDestroy {

  currentValue: number = 1;
  product: ProductInfo;
  discount: Discount;
  role$: Observable<UserRole>;
  categoryName$: Observable<string>;
  isLoading = false;
  availableQuantity: number;
  currentItem: CartItemModel[];
  currentItemQuantity: number;
  isShown: boolean = false;
  suggestions: Product[];
  private readonly CART_STORAGE = 'cart'
  categories: Category[]

  routeEventSubscription: Subscription

  constructor(private productService: ProductsHttpService,
              private publicApiService: PublicApiService,
              private discountsService: DiscountsHttpService,
              private route: ActivatedRoute,
              private router: Router,
              private roleService: RoleService,
              private cartService: CartManagementService,
              private toaster: ToasterCustomService,
              private compareService: CompareManagementService,
              private titleService: Title
  ) {

    this.routeEventSubscription = router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((val) => {
        this.ngOnInit()

      })

  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.uploadData(productId);
    }
  }

  ngOnDestroy(): void {
    this.routeEventSubscription.unsubscribe();
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  addToCart(id: string) {
    if (this.product.inStock == 0) {
      this.toaster.errorNotification(Labels.cart.outOfStock);
    } else {
      this.cartService.addToCart(new CartItemModel({quantity: this.currentValue, productId: id}));
    }
  }

  addToCompare(id: string) {
    this.compareService.addToList(id);
  }

  removeFromCart(): void {
    this.getItem()
    this.cartService.removeFromCart({quantity: this.currentItemQuantity, productId: this.product.productId})
  }

  get localCart(): CartItemModel[] {
    const cartString = localStorage.getItem(this.CART_STORAGE)
    const parsed = JSON.parse(cartString ?? "[]")
    return parsed === [] ? [] : parsed
  }

  getItem() {
    this.currentItem = this.localCart.filter(obj => obj.productId == this.product.productId)
    this.currentItemQuantity = this.currentItem[0].quantity
  }

  isCopied() {
    this.toaster.successfulNotification('Id copied to clipboard')
  }

  uploadData(productId: string) {
    let suggestions = this.productService.getSuggestions(productId);
    let product = this.productService.getProduct(productId);
    let discount = this.discountsService.getActiveDiscount(productId);
    let categories = this.publicApiService.getListOfCategories();

    this.role$ = this.roleService.currentRole$
    this.isLoading = true;
    forkJoin([product, discount, suggestions, categories])
      .pipe(
        finalize(() => this.isLoading = false)
      ).subscribe(results => {
      this.product = results[0];
      this.titleService.setTitle(`${this.product.name}'s page`)
      if (this.product.description == null) {
        this.product.description = '';
      }
      this.availableQuantity = this.product.inStock - this.product.reserved
      this.discount = results[1];
      this.categoryName$ = this.publicApiService.getCategoryName(productId);
      this.suggestions = results[2];
      this.categories = results[3];
    }, error => {
      console.log({error});
    });
  }
}
