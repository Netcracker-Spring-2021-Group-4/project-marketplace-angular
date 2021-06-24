import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormGroup} from "@angular/forms";
import {Route} from "../../../shared/models/enums/route.enum";
import {UserAuthFormService} from "../../no-auth/services/user-auth-form.service";
import {ManagerPlusApiService} from "../../../api-services/mgr-plus-http.service";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {RoleService} from "../../../services/role.service";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {Observable, Subscription} from "rxjs";
import {ProfileModel} from "../../../shared/models/api/receive/profile.model";
import {UserStatus} from "../../../shared/models/api/send/change-status.model";
import {UserUpdateModel} from "../../../shared/models/api/send/user-update.model";
import {AuthStoreApiService} from "../../../api-services/auth-store-http.service";
import {ToasterCustomService} from "../../../services/toaster-custom.service";

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
  isFormViewActive: boolean;
  profile: ProfileModel;
  profileId: string;

  constructor(
    private roleService: RoleService,
    private userAuthFormService: UserAuthFormService,
    private managerPlusApiService: ManagerPlusApiService,
    private authStoreApiService: AuthStoreApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toaster: ToasterCustomService
  ) {
    this.setCurrentRoute()
    if (this.isStaffCreateRoute) this.isFormViewActive = true;
    this.activatedRoute.params.subscribe(params => {
      this.profileId = params['id'];
    })
  }

  ngOnInit(): void {
    this.roleSub = this.roleService.currentRole$.subscribe(role => this.role = role)
    let func;
    if (this.isStaffEditRoute) {
      func = this.managerPlusApiService.getStaffer(this.profileId)
    } else if (this.isCustomerProfileRoute || this.isStaffProfileRoute) {
      func = this.authStoreApiService.getMyProfile()
    }
    if(func) {
      this.isLoading = true
      func
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe(res => {
        this.profile = res.body
        if(this.isFormNeeded) this.form = this.pageForm
      }, err => {
        const text = err.error?.message ?? 'Wrong id format'
        this.toaster.errorNotification(text);
        this.router.navigate([Route.STAFF_LIST])
      })
    } else {
      if(this.isFormNeeded) this.form = this.pageForm
    }
  }

  ngOnDestroy(): void {
    this.roleSub.unsubscribe();
  }

  get pageForm()
    : FormGroup {
    return this.isStaffCreateRoute ? this.userAuthFormService.createStaffForm() :
      ( this.isStaffEditRoute ? this.userAuthFormService.editForm(this.profile, true) :
         this.userAuthFormService.editForm(this.profile, false)
      )
  }

  get isFormNeeded() {
    return this.currentRoute !== Route.PROFILE || this.role === UserRole.ROLE_CUSTOMER
  }

  get formTitle()
    : string {
    return this.isCustomerProfileRoute ? 'Edit your profile' :
      (this.isStaffCreateRoute ? 'Add account of staffer' :
        (this.isStaffEditRoute ? 'Edit account of staffer' : '')
      )
  }

  get formBtnMessage()
    : string {
    return this.isCustomerProfileRoute ? 'Change profile' :
      (this.isStaffCreateRoute ? 'Add account' :
          (this.isStaffEditRoute ? 'Change staffer profile' : '')
      )
  }

  get isStaffCreateRoute()
    : boolean {
    return this.currentRoute === Route.STAFF_CREATE
  }

  get isStaffEditRoute()
    : boolean {
    return this.currentRoute === Route.STAFF_PROFILE
  }

  get isCustomerProfileRoute()
    : boolean {
    return this.currentRoute === Route.PROFILE && this.role === UserRole.ROLE_CUSTOMER
  }

  get isStaffProfileRoute()
    : boolean {
    return this.currentRoute === Route.PROFILE
      && (this.role === UserRole.ROLE_COURIER || this.role === UserRole.ROLE_PRODUCT_MGR)
  }

  toggleActiveView() {
    this.isFormViewActive = !this.isFormViewActive
  }

  changePassword() {
    this.router.navigate([Route.CHANGE_PASSWORD])
  }

  submitEditCustomer($event: UserUpdateModel) {
    this.execApiFunc(this.authStoreApiService.editCustomerProfile($event),
      Labels.editProfile.successfulEditCustomer, $event);
    this.toggleActiveView();
  }

  statusChangeStaffer($event: UserStatus) {
    const {email} = this.profile
    const func =
      this.managerPlusApiService.changeStafferStatus({email, userStatus: $event})
    this.execApiFunc(func, Labels.editProfile.successfulStatusChange)
  }

  submitEditStaff($event: UserUpdateModel) {
    this.execApiFunc(this.managerPlusApiService.updateStaffer($event),
      Labels.editProfile.successfulEditStaffer, $event)
    this.toggleActiveView();
  }

  submitCreateStaff($event: any) {
    const title = $event.title
    const obj = $event
    delete obj.title
    const func = title === 'del' ? this.managerPlusApiService.createCourier(obj) :
      this.managerPlusApiService.createManager(obj)

    this.execApiFunc(func, Labels.register.successCreatingStaff)
  }


  private execApiFunc(func: Observable<any>, successText: string, updatedProfile: any = {}) {
    this.isLoading = true
    func
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( _ => {
        if (this.isCustomerProfileRoute || this.isStaffEditRoute) {
          this.profile = {...this.profile, ...updatedProfile}
          if (!updatedProfile.hasOwnProperty('phoneNumber')) this.profile.phoneNumber = undefined
        }
        this.toaster.successfulNotification(successText);
      }, err => {
        const text = err.error.message ?? Object.values(err.error.error).join('\n')
        this.toaster.errorNotification(text);
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
