import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import linksMapper from './service/links.mapper';
import {UserRole} from "../../models/enums/role.enum";
import {Link} from "../../models/internal/link.model";
import {MatDrawer} from "@angular/material/sidenav";

class Links {
}

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit{
  @Input()
  role ?: UserRole;
  @ViewChild('drawer') drawer: MatDrawer;

  links: MenuLinkConfig;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.links = linksMapper(this.role ?? UserRole.ROLE_NO_AUTH_CUSTOMER)
    console.log(this.links)
  }

  closeDrawer() {
    this.drawer.close();
  }
}

class MenuLinkConfig {
  main: Link[]
  side: Link[]

  constructor(init: Partial<MenuLinkConfig>) {
    Object.assign(this, init);
  }
}
