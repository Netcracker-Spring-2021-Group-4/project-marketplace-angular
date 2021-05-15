import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {AppRoutingModule} from "./app.routing.module";
import {NoAuthModule} from "./components/no-auth/no-auth.module";
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import {AuthStoreModule} from "./components/auth-store/auth-store.module";
import {CustomerModule} from "./components/customer/customer.module";
import {ManagerPlusModule} from "./components/manager-plus/manager-plus.module";
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    NoAuthModule,
    AuthStoreModule,
    CustomerModule,
    ManagerPlusModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
