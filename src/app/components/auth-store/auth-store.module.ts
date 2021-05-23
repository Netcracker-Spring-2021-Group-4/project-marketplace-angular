import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import { AuctionListPageComponent } from './auction-list-page/auction-list-page.component';
import { AuctionPageComponent } from './auction-page/auction-page.component';
import { DeliveriesPageComponent } from './deliveries-page/deliveries-page.component';
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {NgxMaskModule} from "ngx-mask";
import { ProfilePageFormComponent } from './profile-page/profile-page-form/profile-page-form.component';
import { ProfilePageViewComponent } from './profile-page/profile-page-view/profile-page-view.component';



@NgModule({
  declarations: [
    AuctionListPageComponent,
    AuctionPageComponent,
    DeliveriesPageComponent,
    ProfilePageComponent,
    ProfilePageFormComponent,
    ProfilePageViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxMaskModule.forRoot(),
  ]
})
export class AuthStoreModule { }
