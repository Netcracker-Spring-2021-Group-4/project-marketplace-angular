
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffListPageComponent } from './staff-list-page/staff-list-page.component';
import {SharedModule} from "../../shared/shared.module";
import { CreateProductPageComponent } from './create-product-page/create-product-page.component';
import { CreateAuctionPageComponent } from './create-auction-page/create-auction-page.component';
import { StockSetterPageComponent } from './stock-setter-page/stock-setter-page.component';



@NgModule({
  declarations: [
    StaffListPageComponent,
    CreateProductPageComponent,
    CreateAuctionPageComponent,
    StockSetterPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class ManagerPlusModule { }
