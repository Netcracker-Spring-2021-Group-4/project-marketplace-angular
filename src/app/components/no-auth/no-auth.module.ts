import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
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


import { ShoppingCartTabComponent } from './cart-page/shopping-cart-tab/shopping-cart-tab.component';
import { CheckoutStepOneComponent } from './checkout-page/checkout-step-one/checkout-step-one.component';
import { CheckoutStepTwoComponent } from './checkout-page/checkout-step-two/checkout-step-two.component';
import { CheckoutStepThreeComponent } from './checkout-page/checkout-step-three/checkout-step-three.component';
import {RouterModule} from "@angular/router";
import { ProductCartOrderCardComponent } from './product-cart-order-card/product-cart-order-card.component';
import {DragDropModule} from "@angular/cdk/drag-drop";

import {CarouselModule} from 'primeng/carousel';
import { CarouselComponent } from './catalog/carousel/carousel.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';




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
    ShoppingCartTabComponent,
    CheckoutPageComponent,
    HeaderComponent,
    FiltersComponent,
    ProductsComponent,
    ProductComponent,
    ShoppingCartTabComponent,
    CheckoutStepOneComponent,
    CheckoutStepTwoComponent,
    CheckoutStepThreeComponent,
    CarouselComponent,
    ProductCartOrderCardComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgxCaptchaModule,
    NgxMaskModule.forRoot(),
    NgxSliderModule,
    MatPaginatorModule,
    CarouselModule,
    RouterModule,
    IvyCarouselModule,
    DragDropModule
  ]

})
export class NoAuthModule { }
