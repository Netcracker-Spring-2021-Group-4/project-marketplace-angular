import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {JwtTokenService} from "../auth/jwt-token.service";
import {UserRole} from "../shared/models/enums/role.enum";
import {Route} from "../shared/models/enums/route.enum";
import {RedirectAuthService} from "../services/redirect-auth.service";
import {CheckoutService} from "../services/checkout.service";

@Injectable({providedIn: 'root'})
export class AuthStoreGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JwtTokenService.role !== UserRole.ROLE_NO_AUTH_CUSTOMER) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class AuthStoreWoCourierGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JwtTokenService.role !== UserRole.ROLE_NO_AUTH_CUSTOMER &&
        JwtTokenService.role !== UserRole.ROLE_COURIER) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class CustomerGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JwtTokenService.role === UserRole.ROLE_CUSTOMER) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class NonAuthCustomerGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JwtTokenService.role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
      return true;
    }
    this.router.navigate([RedirectAuthService.defaultRoute()]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class AuthCustomerAndCourierGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permitted = [UserRole.ROLE_CUSTOMER, UserRole.ROLE_COURIER]
    if (permitted.indexOf(JwtTokenService.role) !== -1) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class CourierGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JwtTokenService.role === UserRole.ROLE_COURIER) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}



@Injectable({providedIn: 'root'})
export class AllButCourierGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JwtTokenService.role !== UserRole.ROLE_COURIER) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}


@Injectable({providedIn: 'root'})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JwtTokenService.role === UserRole.ROLE_ADMIN) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class AuthNotAdminGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permitted = [UserRole.ROLE_CUSTOMER, UserRole.ROLE_COURIER, UserRole.ROLE_PRODUCT_MGR]
    if (permitted.indexOf(JwtTokenService.role) !== -1) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class ManagerPlusGuard implements CanActivate {

  constructor(private router: Router) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permitted = [UserRole.ROLE_PRODUCT_MGR, UserRole.ROLE_ADMIN]
    if (permitted.indexOf(JwtTokenService.role) !== -1) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}

@Injectable({providedIn: 'root'})
export class ClientsGuard implements CanActivate {

  constructor(
    private router: Router
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permitted = [UserRole.ROLE_NO_AUTH_CUSTOMER, UserRole.ROLE_CUSTOMER]
    if (permitted.indexOf(JwtTokenService.role) !== -1) {
      return true;
    }
    this.router.navigate([Route.LOGIN]);
    return false;
  }
}


@Injectable({providedIn: 'root'})
export class CheckoutGuard implements CanActivate {

  constructor(
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const permitted = [UserRole.ROLE_NO_AUTH_CUSTOMER, UserRole.ROLE_CUSTOMER]
    const isReserved = this.checkoutService.isReserved
    if(!isReserved) {
      this.router.navigate([Route.CART])
      return false;
    }
    return isReserved && permitted.indexOf(JwtTokenService.role) !== -1
  }
}
