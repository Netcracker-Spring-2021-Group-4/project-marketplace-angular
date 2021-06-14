import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
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

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  currentValue: number;
  product: ProductInfo;
  discount: Discount;
  role: UserRole;
  categoryName: string;
  isLoading = false;

  constructor(private productService: ProductsHttpService,
              private publicApiService: PublicApiService,
              private discountsService: DiscountsHttpService,
              private route: ActivatedRoute,
              private roleService: RoleService,
              private cartManager: CartManagementService,
              private toaster: ToasterCustomService,
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.roleService.currentRole$.subscribe(
      data => {
        this.role = data;
      });
    const productId = this.route.snapshot.paramMap.get('productId');
    this.productService.getProduct(productId).pipe(finalize(() => {
      this.isLoading = false
    })).subscribe(
      data => {
        this.product = data;
      });
    this.discountsService.getActiveDiscount(productId).subscribe(
      data => {
        this.discount = data;
      });
    this.publicApiService.getCategoryName(productId).subscribe(
      data => {
        this.categoryName = (data);
      });

  }

  public OnInput(event: any) {
    this.currentValue = event.target.value;
  }

  addToCart(id: string) {
    if (this.product.inStock == 0)
      this.outOfStockNotify()
    else
      this.cartManager.addToCart(new CartItemModel({quantity:this.currentValue, productId:id}));
  }

  private outOfStockNotify() {
    this.toaster.errorNotification(Labels.cart.outOfStock)
  }

  // addToCompare(id: string) {
  //   this.compareService.addToList(id);
  // }
}
