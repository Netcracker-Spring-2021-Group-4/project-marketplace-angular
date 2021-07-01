import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Observable, Subscription} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import linksMapper from './service/links.mapper';
import {UserRole} from "../../models/enums/role.enum";
import {Link} from "../../models/internal/link.model";
import {MatDrawer} from "@angular/material/sidenav";
import {RoleService} from "../../../services/role.service";
import {JwtTokenService} from "../../../auth/jwt-token.service";
import {RedirectAuthService} from "../../../services/redirect-auth.service";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit, OnDestroy {
  role: UserRole;
  @ViewChild('drawer') drawer: MatDrawer;

  links: MenuLinkConfig;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 959.98px)')
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  subscription: Subscription

  constructor(
    private breakpointObserver: BreakpointObserver,
    private roleService: RoleService,
    private redirectAuthService: RedirectAuthService
  ) {
  }

  ngOnInit() {
    this.subscription = this.roleService.currentRole$.subscribe(r => {
      this.role = r
      this.links = linksMapper(this.role ?? UserRole.ROLE_NO_AUTH_CUSTOMER)
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  closeDrawer(label: string) {
    this.checkForLogOut(label)
    this.drawer.close()
  }

  checkForLogOut(label: string) {
    this.logOut(label)
    this.setAuthRedirect(label)
  }

  setAuthRedirect(label: string) {
    if (label.toUpperCase() === "LOGIN" || label.toUpperCase() === "SIGN UP") {
      const toLogin = label.toUpperCase() === "LOGIN"
      this.redirectAuthService.changeRedirectUrlAndGoAuth(toLogin)
    }
  }

  logOut(label: string) {
    if (label.toUpperCase() === 'LOGOUT') {
      JwtTokenService.deleteToken()
      this.roleService.changeRole(UserRole.ROLE_NO_AUTH_CUSTOMER)
    }
  }
}

class MenuLinkConfig {
  main: Link[]
  side: Link[]

  constructor(init: Partial<MenuLinkConfig>) {
    Object.assign(this, init);
  }
}
