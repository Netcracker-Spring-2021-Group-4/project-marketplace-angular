import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {AuthNotAdminGuard} from "../guards/role.guards";
import {ProfilePageComponent} from "../components/auth-store/profile-page/profile-page.component";

const AuthNotAdminRoutes: Routes = [
  {
    path: Route.PROFILE,
    component: ProfilePageComponent,
    canActivate: [AuthNotAdminGuard]
  }
];

export default AuthNotAdminRoutes;
