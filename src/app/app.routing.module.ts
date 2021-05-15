import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import NoAuthRoutes from "./routes/no-auth.routes";
import AuthStoreRoutes from "./routes/auth-store.routes";
import CustomerRoutes from "./routes/customer.routes";
import AuthNotAdminRoutes from "./routes/auth-not-admin.routes";
import ManagerPlusRoutes from "./routes/managerPlusRoutes";
import {NotFoundPageComponent} from "./components/not-found-page/not-found-page.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  ...NoAuthRoutes,
  ...AuthStoreRoutes,
  ...CustomerRoutes,
  ...AuthNotAdminRoutes,
  ...ManagerPlusRoutes,
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
