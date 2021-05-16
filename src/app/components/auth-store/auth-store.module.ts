import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import { AuctionListPageComponent } from './auction-list-page/auction-list-page.component';
import { AuctionPageComponent } from './auction-page/auction-page.component';
import { DeliveriesPageComponent } from './deliveries-page/deliveries-page.component';



@NgModule({
  declarations: [
    AuctionListPageComponent,
    AuctionPageComponent,
    DeliveriesPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AuthStoreModule { }