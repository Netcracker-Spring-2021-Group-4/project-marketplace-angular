import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {AuctionListPageComponent} from "../components/auth-store/auction-list-page/auction-list-page.component";
import {AuctionPageComponent} from "../components/auth-store/auction-page/auction-page.component";
import {DeliveriesPageComponent} from "../components/auth-store/deliveries-page/deliveries-page.component";
import {
  AuthCustomerAndCourierGuard,
  AuthStoreGuard,
  AuthStoreWoCourierGuard,
  CourierGuard
} from "../guards/role.guards";
import {ChangePasswordComponent} from "../components/auth-store/profile-page/change-password/change-password.component";
import {OrderDetailsComponent} from "../components/auth-store/order-details/order-details.component";

const AuthStoreRoutes: Routes = [
  {
    path: Route.AUCTIONS,
    component: AuctionListPageComponent,
    canActivate: [AuthStoreWoCourierGuard]
  },
  {
    path: Route.AUCTION_PAGE,
    component: AuctionPageComponent,
    canActivate: [AuthStoreWoCourierGuard]
  },
  {
    path: Route.DELIVERIES,
    component: DeliveriesPageComponent,
    canActivate: [CourierGuard]
  },
  {
    path: Route.ORDER_DETAILS,
    component: OrderDetailsComponent,
    canActivate: [AuthCustomerAndCourierGuard]
  },
  {
    path: Route.CHANGE_PASSWORD,
    component: ChangePasswordComponent,
    canActivate: [AuthStoreGuard]
  }
];

export default AuthStoreRoutes;
