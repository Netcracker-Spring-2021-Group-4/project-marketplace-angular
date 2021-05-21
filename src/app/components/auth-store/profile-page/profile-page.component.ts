import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {Route} from "../../../shared/models/enums/route.enum";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {UserAuthFormService} from "../../no-auth/services/user-auth-form.service";
import {ManagerPlusApiService} from "../../../api-services/mgr-plus-http.service";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {Toaster} from "ngx-toast-notifications";
import {RoleService} from "../../../services/role.service";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  currentRoute: Route;
  form: FormGroup;
  isLoading: boolean;
  role: UserRole;
  roleSub: Subscription;

  emailErrorMessage = ValidationMessages.email
  passwordErrorMessage = ValidationMessages.password
  firstNameErrorMessage = ValidationMessages.firstName
  lastNameErrorMessage = ValidationMessages.lastName
  phoneNumberErrorMessage = ValidationMessages.phoneNumber
  titles = [
    {value: 'mng', label: 'Product manager'},
    {value: 'del', label: 'Courier'}
  ]

  constructor(
    private roleService: RoleService,
    private userAuthFormService: UserAuthFormService,
    private managerPlusApiService: ManagerPlusApiService,
    private router: Router,
    private toaster: Toaster
  ) {
    this.setCurrentRoute()
    if(this.currentRoute === Route.STAFF_CREATE) {
      this.form = userAuthFormService.createStaffForm();
    }
  }

  ngOnInit(): void {
    this.roleSub = this.roleService.currentRole.subscribe(role => this.role = role)
  }

  ngOnDestroy(): void {
    this.roleSub.unsubscribe();
  }


  get isFormNeeded() {
    return this.currentRoute !== Route.PROFILE || this.role === UserRole.ROLE_CUSTOMER
  }

  submit() {
    this.isLoading = true
    if(this.currentRoute === Route.STAFF_CREATE) this.submitCreateStaff()
  }

  private submitCreateStaff() {
    const title = this.form.value.title
    const obj = this.form.value
    delete obj.title
    const func = title === 'del' ? this.managerPlusApiService.createCourier(obj) :
      this.managerPlusApiService.createManager(obj)

    func
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( res => {
        this.toaster.open({
          text: Labels.register.successCreatingStaff,
          caption: Labels.caption.success,
          duration: 4000,
          type: 'success'
        });
      }, err => {
        this.toaster.open({
          text: err.error.message,
          caption: Labels.caption.error,
          duration: 4000,
          type: 'danger'
        });
      })
  }

  private setCurrentRoute() {
    const currentRoute = this.router.url.slice(1);
    if (currentRoute.indexOf('admin/staffer') !== -1) {
      this.currentRoute = Route.STAFF_PROFILE
    } else {
      this.currentRoute =  <Route> currentRoute
    }
  }

}
