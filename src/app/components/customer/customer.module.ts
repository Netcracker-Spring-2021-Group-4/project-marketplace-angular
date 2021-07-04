import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import { OrderHistoryPageComponent } from './order-history-page/order-history-page.component';
import { OrderFiltersComponent } from './order-history-page/order-filters/order-filters.component';
import { OrdersPreviewListingComponent } from './order-history-page/orders-preview-listing/orders-preview-listing.component';
import {RouterModule} from "@angular/router";
import {MatPaginatorModule} from "@angular/material/paginator";



@NgModule({
  declarations: [
    OrderHistoryPageComponent,
    OrderFiltersComponent,
    OrdersPreviewListingComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        MatPaginatorModule
    ]
})
export class CustomerModule { }
