import {Component, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
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
export class MenuBarComponent implements OnInit{
  role : UserRole;
  @ViewChild('drawer') drawer: MatDrawer;

  links: MenuLinkConfig;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private roleService: RoleService,
    private redirectAuthService: RedirectAuthService
  ){}

  ngOnInit() {
    this.roleService.currentRole$.subscribe(r => {
      this.role = r
      this.links = linksMapper(this.role ?? UserRole.ROLE_NO_AUTH_CUSTOMER)
    })
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
    if(label.toUpperCase() === "LOGIN" || label.toUpperCase() === "SIGN UP"){
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
