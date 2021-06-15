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
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Product} from "../../../shared/models/api/receive/product";

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {

  currentValue: Number;
  product: ProductInfo;
  discount: Discount;
  role: UserRole;
  categoryName: string;
  isLoading = false;
  amountForm: FormGroup;

  constructor(private productService: ProductsHttpService,
              private publicApiService: PublicApiService,
              private discountsService: DiscountsHttpService,
              private route: ActivatedRoute,
              private roleService: RoleService,
              private cartManager: CartManagementService,
              private toaster: ToasterCustomService,
              private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.amountForm = this.createAmountForm();
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

  public createAmountForm(): FormGroup {
    return this.formBuilder.group({
      quantity: quantity()
    })
  }

  public OnInput(event: any) {
    this.currentValue = event.target.value;
  }

  addToCart(id: string, amount: number) {
    if (this.product.inStock == 0)
      this.outOfStockNotify()
    else
      this.cartManager.addToCart(new CartItemModel({quantity: amount, productId: id,}));
    console.log(amount)
    console.log(CartItemModel)
    console.log(id)
  }

  private outOfStockNotify() {
    this.toaster.errorNotification(Labels.cart.outOfStock)
  }
}

const quantity = (value?: number) => ([value ?? null, [Validators.required, Validators.min(0)]]);
