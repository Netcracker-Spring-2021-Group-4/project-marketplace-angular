import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {ProfilePageComponent} from "../components/profile-page/profile-page.component";
import {StaffListPageComponent} from "../components/manager-plus/staff-list-page/staff-list-page.component";
import {CreateProductPageComponent} from "../components/manager-plus/create-product-page/create-product-page.component";
import {CreateAuctionPageComponent} from "../components/manager-plus/create-auction-page/create-auction-page.component";
import {StockSetterPageComponent} from "../components/manager-plus/stock-setter-page/stock-setter-page.component";

const ManagerPlusRoutes: Routes = [
  {
    path: Route.STAFF_LIST,
    component: StaffListPageComponent
  },
  {
    path: Route.STAFF_PROFILE,
    component: ProfilePageComponent
  },
  {
    path: Route.CREATE_PRODUCT,
    component: CreateProductPageComponent
  },
  {
    path: Route.CREATE_AUCTION,
    component: CreateAuctionPageComponent
  },
  {
    path: Route.STOCK,
    component: StockSetterPageComponent
  },
];

export default ManagerPlusRoutes;
