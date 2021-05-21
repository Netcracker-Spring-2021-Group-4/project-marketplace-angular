import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthApiService} from "../../../api-services/auth-http.service";
import Labels from "../../../shared/models/labels/labels.constant";
import {Toaster} from "ngx-toast-notifications";
import {Route} from "../../../shared/models/enums/route.enum";
import {FormGroup} from "@angular/forms";
import {UserAuthFormService} from "../services/user-auth-form.service";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-confirm-token',
  templateUrl: './confirm-token.component.html',
  styleUrls: ['./confirm-token.component.scss']
})
export class ConfirmTokenComponent implements OnInit {

  token: string
  currentRoute: Route
  form: FormGroup
  isLoading: boolean

  passwordErrorMessage = ValidationMessages.password
  passwordDontMatchMessage = ValidationMessages.passwordDontMatch

  constructor(
    private userAuthFormService: UserAuthFormService,
    private activatedRoute: ActivatedRoute,
    private authApiService: AuthApiService,
    private toaster: Toaster,
    private router: Router,
  ) {
    this.setCurrentRoute()
    this.activatedRoute.params.subscribe(params => {
      this.token = params.token
    })
    if(this.isFormNeeded) {
      this.form = this.userAuthFormService.newPasswordForm()
    }
  }

  ngOnInit(): void {
    if (!this.isFormNeeded) this.confirmSignUp()
  }

  submit() {
    this.isLoading = true
    const {password} = this.form.value
    if(this.currentRoute === Route.FIRST_PASSWORD) this.confirmFirstPassword(password)
  }

  get isFormNeeded(): boolean {
    return this.currentRoute !== Route.CONFIRM_TOKEN
  }

  private confirmFirstPassword(password: string) {
    this.authApiService.confirmFirstPassword(this.token, password)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( _ => {
      this.toaster.open({
        text: Labels.password.successFirstPassword,
        caption: Labels.caption.success,
        duration: 4000,
        type: 'success'
      });

      this.router.navigate([Route.LOGIN])
    }, err => {
      const text = err.status === 417 ? Labels.register.tokenAlreadyUsed : Labels.register.wrongTokenFormat
      this.toaster.open({
        text,
        caption: Labels.caption.error,
        duration: 4000,
        type: 'danger'
      });
    })
  }

  private confirmSignUp() {
    this.authApiService.confirmSignUp(this.token).subscribe( res => {
      this.toaster.open({
        text: Labels.register.success,
        caption: Labels.caption.success,
        duration: 4000,
        type: 'success'
      });

      this.router.navigate([Route.LOGIN])
    }, err => {
      const text = err.status === 417 ? Labels.register.tokenAlreadyUsed : Labels.register.wrongTokenFormat
      this.toaster.open({
        text,
        caption: Labels.caption.error,
        duration: 4000,
        type: 'danger'
      });
    })
  }

  private setCurrentRoute() {
    const route = this.router.url
    if(route.indexOf('confirm-token') !== -1) {
      this.currentRoute = Route.CONFIRM_TOKEN
    } else if(route.indexOf('new-password') !== -1) {
      this.currentRoute = Route.NEW_PASSWORD
    } else {
      this.currentRoute = Route.FIRST_PASSWORD
    }
  }
}
