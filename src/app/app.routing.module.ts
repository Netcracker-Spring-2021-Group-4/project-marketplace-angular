import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import NoAuthRoutes from "./routes/no-auth.routes";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  ...NoAuthRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
