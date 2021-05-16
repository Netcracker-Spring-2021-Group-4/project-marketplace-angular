import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {ProfilePageComponent} from "../components/profile-page/profile-page.component";
import {AuthNotAdminGuard} from "../guards/role.guards";

const AuthNotAdminRoutes: Routes = [
  {
    path: Route.PROFILE,
    component: ProfilePageComponent,
    canActivate: [AuthNotAdminGuard]
  }
];

export default AuthNotAdminRoutes;
