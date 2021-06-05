import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatListModule} from '@angular/material/list';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastNotificationsModule} from "ngx-toast-notifications";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { RoleStripperPipe } from './helpers/pipes/role-stripper.pipe';
import {CategoryPrettifierPipe} from "./helpers/pipes/category-prettifier.pipe";
import {MatTabsModule} from "@angular/material/tabs";
import {CustomCurrencyPipe} from "./helpers/pipes/custom-currency.pipe";
import { CoverLoadingComponent } from './components/cover-loading/cover-loading.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ToastNotificationsModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    LayoutModule,
    MatSidenavModule,
    MatCheckboxModule
  ],
  exports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastNotificationsModule,
    MatTabsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MenuBarComponent,
    MatCheckboxModule,
    RoleStripperPipe,
    CategoryPrettifierPipe,
    CustomCurrencyPipe,
    CoverLoadingComponent
  ],
  declarations: [
    MenuBarComponent,
    RoleStripperPipe,
    CategoryPrettifierPipe,
    CustomCurrencyPipe,
    CoverLoadingComponent
  ]
})
export class SharedModule { }
