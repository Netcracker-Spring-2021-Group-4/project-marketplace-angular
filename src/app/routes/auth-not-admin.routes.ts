import {Routes} from "@angular/router";
import {Route} from "../shared/models/enums/route.enum";
import {ProfilePageComponent} from "../components/profile-page/profile-page.component";

const AuthNotAdminRoutes: Routes = [
  {
    path: Route.PROFILE,
    component: ProfilePageComponent
  }
];

export default AuthNotAdminRoutes;
