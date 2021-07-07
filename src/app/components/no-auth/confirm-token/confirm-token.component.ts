import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthApiService} from "../../../api-services/auth-http.service";
import Labels from "../../../shared/models/labels/labels.constant";
import {Route} from "../../../shared/models/enums/route.enum";
import {FormGroup} from "@angular/forms";
import {UserAuthFormService} from "../services/user-auth-form.service";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-confirm-token',
  templateUrl: './confirm-token.component.html',
  styleUrls: ['./confirm-token.component.scss']
})
export class ConfirmTokenComponent implements OnInit, OnDestroy {

  token: string
  currentRoute: Route
  form: FormGroup
  isLoading: boolean

  passwordErrorMessage = ValidationMessages.password
  passwordDontMatchMessage = ValidationMessages.passwordDontMatch

  subscription: Subscription;

  constructor(
    private userAuthFormService: UserAuthFormService,
    private activatedRoute: ActivatedRoute,
    private authApiService: AuthApiService,
    private toaster: ToasterCustomService,
    private router: Router,
    private titleService: Title
  ) {
    this.setCurrentRoute()
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.token = params.token
    })
    if (this.isFormNeeded) {
      this.titleService.setTitle("Set password")
      this.form = this.userAuthFormService.newPasswordForm()
    }
  }

  ngOnInit(): void {
    if (!this.isFormNeeded) {
      const func = this.authApiService.confirmSignUp(this.token)
      const text = Labels.register.success
      this.execApiFunc(func, text)
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  get isFormNeeded(): boolean {
    return this.currentRoute !== Route.CONFIRM_TOKEN
  }

  submit() {
    this.isLoading = true
    const {password} = this.form.value
    let func: Observable<any>;
    let text: string;
    if (this.currentRoute === Route.FIRST_PASSWORD) {
      func = this.authApiService.confirmFirstPassword(this.token, password)
      text = Labels.password.successFirstPassword
    } else {
      // this.currentRoute === Route.NEW_PASSWORD
      func = this.authApiService.resetPassword(this.token, password)
      text = Labels.password.successfulRequestResetPassword
    }
    this.execApiFunc(func, text);
  }

  private execApiFunc(apiFunction: Observable<any>, successText: string) {
    const sub = apiFunction
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(_ => {
        this.toaster.successfulNotification(successText);

        this.router.navigate([Route.LOGIN])
      }, err => {
        const text = err.status === 417 ? Labels.register.tokenAlreadyUsed : err.error.message
        this.toaster.errorNotification(text);
      })

    this.subscription.add(sub)
  }

  private setCurrentRoute() {
    const route = this.router.url
    if (route.indexOf('confirm-token') !== -1) {
      this.currentRoute = Route.CONFIRM_TOKEN
    } else if (route.indexOf('new-password') !== -1) {
      this.currentRoute = Route.NEW_PASSWORD
    } else {
      this.currentRoute = Route.FIRST_PASSWORD
    }
  }
}
