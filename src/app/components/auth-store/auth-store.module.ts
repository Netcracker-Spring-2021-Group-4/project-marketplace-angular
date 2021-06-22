import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {AuctionListPageComponent} from './auction-list-page/auction-list-page.component';
import {AuctionPageComponent} from './auction-page/auction-page.component';
import {DeliveriesPageComponent} from './deliveries-page/deliveries-page.component';
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {NgxMaskModule} from "ngx-mask";
import { ProfilePageFormComponent } from './profile-page/profile-page-form/profile-page-form.component';
import { ProfilePageViewComponent } from './profile-page/profile-page-view/profile-page-view.component';
import { ChangePasswordComponent } from './profile-page/change-password/change-password.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from "@angular/material/core";
import {DatePipe} from '@angular/common';
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    AuctionListPageComponent,
    AuctionPageComponent,
    DeliveriesPageComponent,
    ProfilePageComponent,
    ProfilePageFormComponent,
    ProfilePageViewComponent,
    ChangePasswordComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    MatNativeDateModule,
    MatDatepickerModule,
    RouterModule

  ],
  providers: [DatePipe],

})
export class AuthStoreModule { }
