import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {SharedModule} from "../../shared/shared.module";
import { ConfirmTokenComponent } from './confirm-token/confirm-token.component';
import { RecoverPwdComponent } from './recover-pwd/recover-pwd.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ComparePageComponent } from './compare-page/compare-page.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import {NgxCaptchaModule} from "ngx-captcha";
import {NgxMaskModule} from "ngx-mask";
import { HeaderComponent } from './catalog/header/header.component';
import { FiltersComponent } from './catalog/filters/filters.component';
import { ProductsComponent } from './catalog/products/products.component';
import { ProductComponent } from './catalog/products/product/product.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import { NgxSliderModule } from '@angular-slider/ngx-slider';





@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ConfirmTokenComponent,
    RecoverPwdComponent,
    CatalogComponent,
    ProductPageComponent,
    ComparePageComponent,
    CartPageComponent,
    CheckoutPageComponent,
    HeaderComponent,
    FiltersComponent,
    ProductsComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxCaptchaModule,
    NgxMaskModule.forRoot(),
    NgxSliderModule,
    MatPaginatorModule

  ]
})
export class NoAuthModule { }
