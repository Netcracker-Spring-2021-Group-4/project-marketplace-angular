import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {StaffListPageComponent} from "../components/manager-plus/staff-list-page/staff-list-page.component";
import {CreateProductPageComponent} from "../components/manager-plus/create-product-page/create-product-page.component";
import {CreateAuctionPageComponent} from "../components/manager-plus/create-auction-page/create-auction-page.component";
import {StockSetterPageComponent} from "../components/manager-plus/stock-setter-page/stock-setter-page.component";
import {AdminGuard, ManagerPlusGuard} from "../guards/role.guards";
import {ProfilePageComponent} from "../components/auth-store/profile-page/profile-page.component";
import {EditProductPageComponent} from "../components/manager-plus/edit-product-page/edit-product-page.component";
import {DiscountPageComponent} from "../components/manager-plus/edit-product-page/discount-page/discount-page.component";

const ManagerPlusRoutes: Routes = [
  {
    path: Route.STAFF_LIST,
    component: StaffListPageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: Route.STAFF_PROFILE,
    component: ProfilePageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: Route.STAFF_CREATE,
    component: ProfilePageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: Route.EDIT_PRODUCT,
    component: EditProductPageComponent,
    canActivate: [ManagerPlusGuard]
  },
  {
    path: Route.CREATE_PRODUCT,
    component: CreateProductPageComponent,
    canActivate: [ManagerPlusGuard]
  },
  {
    path: Route.CREATE_AUCTION,
    component: CreateAuctionPageComponent,
    canActivate: [ManagerPlusGuard]
  },
  {
    path: Route.STOCK,
    component: StockSetterPageComponent,
    canActivate: [ManagerPlusGuard]
  },
  {
    path: Route.DISCOUNTS,
    component: DiscountPageComponent,
    canActivate: [ManagerPlusGuard]
  },
];

export default ManagerPlusRoutes;
