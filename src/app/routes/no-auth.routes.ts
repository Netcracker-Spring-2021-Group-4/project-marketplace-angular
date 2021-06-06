import {Routes} from "@angular/router";
import {LoginComponent} from "../components/no-auth/login/login.component";
import {RegisterComponent} from "../components/no-auth/register/register.component";
import {ConfirmTokenComponent} from "../components/no-auth/confirm-token/confirm-token.component";
import {Route} from "../shared/models/enums/route.enum";
import {RecoverPwdComponent} from "../components/no-auth/recover-pwd/recover-pwd.component";
import {CatalogComponent} from "../components/no-auth/catalog/catalog.component";
import {ProductPageComponent} from "../components/no-auth/product-page/product-page.component";
import {ComparePageComponent} from "../components/no-auth/compare-page/compare-page.component";
import {CartPageComponent} from "../components/no-auth/cart-page/cart-page.component";
import {CheckoutPageComponent} from "../components/no-auth/checkout-page/checkout-page.component";
import {NonAuthCustomerGuard} from "../guards/role.guards";

const NoAuthRoutes: Routes = [
  {
    path: Route.LOGIN,
    component: LoginComponent,
    canActivate: [NonAuthCustomerGuard]
  },
  {
    path: Route.REGISTER,
    component: RegisterComponent,
    canActivate: [NonAuthCustomerGuard]
  },
  {
    path: Route.CONFIRM_TOKEN,
    component: ConfirmTokenComponent
  },
  {
    path: Route.NEW_PASSWORD,
    component: ConfirmTokenComponent
  },
  {
    path: Route.FIRST_PASSWORD,
    component: ConfirmTokenComponent
  },
  {
    path: Route.PASSWORD,
    component: RecoverPwdComponent
  },
  {
    path: Route.CATALOG,
    component: CatalogComponent
  },
  {
    path: Route.PRODUCT,
    component: ProductPageComponent
  },
  {
    path: Route.COMPARE,
    component: ComparePageComponent
  },
  {
    path: Route.CART,
    component: CartPageComponent
  },
  {
    path: Route.CHECK_OUT,
    component: CheckoutPageComponent
  },
];

export default NoAuthRoutes;
