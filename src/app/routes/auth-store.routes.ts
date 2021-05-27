import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {AuctionListPageComponent} from "../components/auth-store/auction-list-page/auction-list-page.component";
import {AuctionPageComponent} from "../components/auth-store/auction-page/auction-page.component";
import {DeliveriesPageComponent} from "../components/auth-store/deliveries-page/deliveries-page.component";
import {AuthStoreGuard, CourierGuard} from "../guards/role.guards";
import {ChangePasswordComponent} from "../components/auth-store/profile-page/change-password/change-password.component";

const AuthStoreRoutes : Routes = [
  {
    path: Route.AUCTIONS,
    component: AuctionListPageComponent,
    canActivate: [AuthStoreGuard]
  },
  {
    path: Route.AUCTION_PAGE,
    component: AuctionPageComponent,
    canActivate: [AuthStoreGuard]
  },
  {
    path: Route.DELIVERIES,
    component: DeliveriesPageComponent,
    canActivate: [CourierGuard]
  },
  {
    path: Route.CHANGE_PASSWORD,
    component: ChangePasswordComponent,
    canActivate: [AuthStoreGuard]
  }
];

export default AuthStoreRoutes;
