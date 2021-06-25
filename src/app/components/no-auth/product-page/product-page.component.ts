import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RoleService} from "../../../services/role.service";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {Discount} from "../../../shared/models/api/receive/discount";
import {finalize} from "rxjs/operators"
import {ProductInfo} from "../../../shared/models/api/receive/productInfo";
import {ProductsHttpService} from "../../../api-services/products-http.service";
import {DiscountsHttpService} from "../../../api-services/discounts-http.service";
import {CartManagementService} from "../../../services/cart-management.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {CartItemModel} from "../../../shared/models/api/send/cart-item.model";
import Labels from "../../../shared/models/labels/labels.constant";
import {PublicApiService} from "../../../api-services/public-http.service";
import {Observable} from "rxjs";
import {CompareManagementService} from "../../../services/compare-management.service";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  currentValue: number = 1;
  product: ProductInfo;
  discount:Discount;
  role$: Observable<UserRole>;
  categoryName$: Observable<string>;
  isLoading = false;
  availableQuantity: number;
  currentItem: any;
  currentItemQuantity: any;
  private readonly CART_STORAGE = 'cart'
  isShown: boolean = false;

  constructor(private productService: ProductsHttpService,
              private publicApiService: PublicApiService,
              private discountsService: DiscountsHttpService,
              private route: ActivatedRoute,
              private roleService: RoleService,
              private cartService: CartManagementService,
              private toaster: ToasterCustomService,
              private compareService: CompareManagementService,
  ) {

  }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    this.isLoading = true;
    this.role$ = this.roleService.currentRole$
    this.productService.getProduct(productId).pipe(finalize(() => {
    })).subscribe(
      data => {
        this.product = data;
        this.availableQuantity = this.product.inStock - this.product.reserved
        this.discountsService.getActiveDiscount(productId).subscribe(
          data =>{
            this.discount = data;
            this.categoryName$ = this.publicApiService.getCategoryName(productId)
            this.isLoading = false
          })
      });


  }
  toggleShow() {
    this.isShown = ! this.isShown;
  }

  addToCart(id: string) {
    if (this.product.inStock == 0)
      this.toaster.errorNotification(Labels.cart.outOfStock);
    else
      this.cartService.addToCart(new CartItemModel({quantity: this.currentValue, productId: id}));
  }

  addToCompare(id: string) {
    this.compareService.addToList(id);
  }

  removeFromCart(): void{
    this.getItem()
    this.cartService.removeFromCart({quantity:this.currentItemQuantity, productId:this.product.productId})
  }

  get localCart() : CartItemModel[] {
    const cartString = localStorage.getItem(this.CART_STORAGE)
    const parsed = JSON.parse(cartString ?? "[]")
    return parsed === [] ? [] : parsed
  }

  getItem(){
    this.currentItem = this.localCart.filter(obj => obj.productId == this.product.productId)
    this.currentItemQuantity = this.currentItem[0].quantity
  }

  isCopied() {
     this.toaster.successfulNotification('Id copied to clipboard')
  }
}
