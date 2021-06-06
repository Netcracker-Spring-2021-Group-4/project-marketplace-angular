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
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {PublicApiService} from "../../../api-services/public-http.service";
import {OrderRequest} from "../../../shared/models/api/send/order-request.model";

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {

  isLoading = false;
  currentRole: UserRole;
  firstStepForm: FormGroup;
  timeslots: TimeSlotModelFront[];
  result = new OrderRequest({})


  constructor(
    private roleService: RoleService,
    private authStoreApiService: AuthStoreApiService,
    private publicApiService: PublicApiService,
    private checkoutService: CheckoutService,
    private checkoutFormService: CheckoutFormService,
    private toaster: ToasterCustomService
  ) { }

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
                of(this.checkoutFormService.firstStepForm({phoneNumber: profile.body.phoneNumber}))
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

  saveTimeOfDelivery($event: string) {
    this.result.deliverySlot = $event
    console.log(this.result)
  }
}
