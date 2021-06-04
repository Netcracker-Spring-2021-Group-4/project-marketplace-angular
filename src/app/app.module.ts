import {NgModule, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import {AppRoutingModule} from "./app.routing.module";
import {NoAuthModule} from "./components/no-auth/no-auth.module";
import {AuthStoreModule} from "./components/auth-store/auth-store.module";
import {CustomerModule} from "./components/customer/customer.module";
import {ManagerPlusModule} from "./components/manager-plus/manager-plus.module";
import {NotFoundPageComponent} from './components/not-found-page/not-found-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenAppenderInterceptor} from "./auth/token-appender.interceptor";
import {FormsModule} from "@angular/forms";

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: TokenAppenderInterceptor
};

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    NoAuthModule,
    AuthStoreModule,
    CustomerModule,
    ManagerPlusModule,
    BrowserAnimationsModule,
    AppRoutingModule,
  ],
  providers: [INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule {
}
