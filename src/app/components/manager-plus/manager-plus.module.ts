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
import {EditProductPageComponent} from "./edit-product-page/edit-product-page.component";
import {DiscountPageComponent} from "./edit-product-page/discount-page/discount-page.component";
import {NgxMaskModule} from "ngx-mask";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import { DiscountContentComponent } from './edit-product-page/discount-page/discount-content/discount-content.component';



@NgModule({
  declarations: [
    StaffListPageComponent,
    CreateProductPageComponent,
    CreateAuctionPageComponent,
    StockSetterPageComponent,
    StaffListContentComponent,
    StaffListFilterFormComponent,
    EditProductPageComponent,
    DiscountPageComponent,
    DiscountContentComponent,

  ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        MatPaginatorModule,
        NgxMaterialTimepickerModule,
        NgxMaskModule.forRoot(),
    ],
    providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class ManagerPlusModule {
}
