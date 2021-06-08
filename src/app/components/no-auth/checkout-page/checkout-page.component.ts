import {Component, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {TimeSlotModel, TimeSlotModelFront} from "../../../shared/models/api/receive/time-slot.model";
import {RoleService} from "../../../services/role.service";
import {AuthStoreApiService} from "../../../api-services/auth-store-http.service";
import {CheckoutService} from "../../../services/checkout.service";
import {finalize, switchMap, take} from "rxjs/operators";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {of} from "rxjs";
import {CheckoutFormService} from "./service/checkout-form.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {PublicApiService} from "../../../api-services/public-http.service";
import {Router} from "@angular/router";
import {Route} from "../../../shared/models/enums/route.enum";
import {CartInfoResponse} from "../../../shared/models/api/receive/cart-info-response.model";
import {cartInfoToItemsList} from "../cart-page/service/utils";
import Labels from "../../../shared/models/labels/labels.constant";
import {CartManagementService} from "../../../services/cart-management.service";

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {

  isLoading = false;
  currentRole: UserRole;
  firstStepForm: FormGroup;
  secondStepForm: FormGroup;
  timeslots: TimeSlotModelFront[];
  result: any
  cart: CartInfoResponse

  constructor(
    private roleService: RoleService,
    private authStoreApiService: AuthStoreApiService,
    private publicApiService: PublicApiService,
    private checkoutService: CheckoutService,
    private cartManagementService: CartManagementService,
    private checkoutFormService: CheckoutFormService,
    private toaster: ToasterCustomService,
    private router: Router,
  ) {
    this.cart = this.checkoutService.cart!
    this.secondStepForm = this.checkoutFormService.secondStepForm()
  }

  ngOnInit(): void {
    this.isLoading = true
    this.roleService.currentRole$
      .pipe(
        switchMap(role => {
          this.currentRole = role
          if(role === UserRole.ROLE_NO_AUTH_CUSTOMER) {
            return of(this.checkoutFormService.firstStepForm())
          }
          return this.authStoreApiService
            .getMyProfile()
            .pipe(
              switchMap(profile =>
                of(this.checkoutFormService.firstStepForm(profile.body))
              )
            )
        }),
        take(1),
        finalize(() => this.isLoading = false)
      )
      .subscribe(form => {
        this.firstStepForm = form
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

  getSlotsForDate($event: string) {
    this.isLoading = true
    this.publicApiService.getTimeSlots($event)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe((slots: TimeSlotModel[]) => {
        this.timeslots = slots.map(slot => TimeSlotModelFront.setFromTimeSlotModel(slot))
      }, err => {
        this.toaster.errorNotification(err.error.message)
      })
  }

  getReadyForPreview() {
    this.result = {...this.result, ...this.firstStepForm.value}
    this.result.deliverySlot = this.secondStepForm.get('deliverySlot')!.value
    this.result.products = this.checkoutService.cart!.content
  }

  cancelReservation() {
    this.isLoading = true
    this.checkoutService.cancelReservationOnline(() => {
      this.isLoading = false
      this.router.navigate([Route.CART])
    })
  }

  makeOrder() {
    this.result.products = cartInfoToItemsList(this.result.products)
    this.isLoading = true
    this.publicApiService.makeOrder(this.result)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(() => {
        this.toaster.successfulNotification(Labels.checkout.successfulOrderMade)
        this.checkoutService.removeReservation()
        this.cartManagementService.emptyLocalCart()
        const redirect = this.currentRole === UserRole.ROLE_CUSTOMER ? Route.ORDER_HISTORY : Route.CATALOG
        this.router.navigate([redirect])
      }, err => {
        this.toaster.errorNotification(err.error.message)
        this.publicApiService
          .cancelReservation(this.checkoutService.cart!.content)
          .subscribe(_ => this.toaster.successfulNotification("The reservation was removed"));
        this.router.navigate([Route.CART]);
      })
  }
}
