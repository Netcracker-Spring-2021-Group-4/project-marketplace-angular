import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {UserRole} from "./shared/models/enums/role.enum";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'projectMarketplaceAngular';
  secretMessage = environment.secretMessage;

  constructor(
    ) {
  }

  ngOnInit() {
    console.log(this.secretMessage);
  }

  get roleEnum(): typeof UserRole {
    return UserRole;
  }
}
