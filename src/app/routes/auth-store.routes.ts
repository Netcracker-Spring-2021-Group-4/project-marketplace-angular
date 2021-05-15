import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {AuctionListPageComponent} from "../components/auth-store/auction-list-page/auction-list-page.component";
import {AuctionPageComponent} from "../components/auth-store/auction-page/auction-page.component";
import {DeliveriesPageComponent} from "../components/auth-store/deliveries-page/deliveries-page.component";

const AuthStoreRoutes : Routes = [
  {
    path: Route.AUCTIONS,
    component: AuctionListPageComponent
  },
  {
    path: Route.AUCTION_PAGE,
    component: AuctionPageComponent
  },
  {
    path: Route.DELIVERIES,
    component: DeliveriesPageComponent
  }
];

export default AuthStoreRoutes;
