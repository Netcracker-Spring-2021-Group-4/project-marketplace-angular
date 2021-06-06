import {Injectable} from "@angular/core";
import {Route} from "../shared/models/enums/route.enum";
import {Router} from "@angular/router";
import {JwtTokenService} from "../auth/jwt-token.service";
import {UserRole} from "../shared/models/enums/role.enum";

@Injectable({
  providedIn: 'root'
})
export class RedirectAuthService {
  currentRedirect: string = Route.CATALOG;

  constructor(
    private router: Router
  ){}

  changeRedirectUrl() {
    this.currentRedirect = this.router.url.slice(1)
  }

  changeRedirectUrlAndGoAuth(toLogin: boolean) {
    this.changeRedirectUrl()
    this.router.navigate([toLogin ? Route.LOGIN : Route.REGISTER])
  }

  redirect() {
    this.router.navigate([this.currentRedirect ?? RedirectAuthService.defaultRoute()])
  }

  setDefaultRedirect() {
    this.currentRedirect = RedirectAuthService.defaultRoute();
  }

  static defaultRoute() {
    return JwtTokenService.role === UserRole.ROLE_COURIER ? Route.DELIVERIES : Route.CATALOG;
  }
}
