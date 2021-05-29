import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StaffListPageComponent} from './staff-list-page/staff-list-page.component';
import {SharedModule} from "../../shared/shared.module";
import {CreateProductPageComponent} from './create-product-page/create-product-page.component';
import {CreateAuctionPageComponent} from './create-auction-page/create-auction-page.component';
import {StockSetterPageComponent} from './stock-setter-page/stock-setter-page.component';
import {StaffListContentComponent} from './staff-list-page/staff-list-content/staff-list-content.component';
import {StaffListFilterFormComponent} from './staff-list-page/staff-list-filter-form/staff-list-filter-form.component';
import {RouterModule} from "@angular/router";
import {MatPaginatorModule} from "@angular/material/paginator";


@NgModule({
  declarations: [
    StaffListPageComponent,
    CreateProductPageComponent,
    CreateAuctionPageComponent,
    StockSetterPageComponent,
    StaffListContentComponent,
    StaffListFilterFormComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        MatPaginatorModule
    ]
})
export class ManagerPlusModule {
}
