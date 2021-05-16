import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {OrderPageComponent} from "../components/customer/order-page/order-page.component";
import {OrderHistoryPageComponent} from "../components/customer/order-history-page/order-history-page.component";
import {CustomerGuard} from "../guards/role.guards";

const CustomerRoutes: Routes = [
  {
    path: Route.ORDER_HISTORY,
    component: OrderHistoryPageComponent,
    canActivate: [CustomerGuard]
  },
  {
    path: Route.ORDER_PAGE,
    component: OrderPageComponent,
    canActivate: [CustomerGuard]
  }
];

export default CustomerRoutes;
