import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import { OrderHistoryPageComponent } from './order-history-page/order-history-page.component';
import { OrderPageComponent } from './order-page/order-page.component';



@NgModule({
  declarations: [
    OrderHistoryPageComponent,
    OrderPageComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class CustomerModule { }
