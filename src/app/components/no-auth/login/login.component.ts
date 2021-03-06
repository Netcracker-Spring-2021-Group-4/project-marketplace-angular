import {Component, OnDestroy} from '@angular/core';
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup, Validators} from "@angular/forms";
import {JwtTokenService} from "../../../auth/jwt-token.service";
import {AuthApiService} from "../../../api-services/auth-http.service";
import Labels from "../../../shared/models/labels/labels.constant";
import {RoleService} from "../../../services/role.service";
import {Route} from "../../../shared/models/enums/route.enum";
import {environment} from "../../../../environments/environment";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {RedirectAuthService} from "../../../services/redirect-auth.service";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy{

  form: FormGroup
  siteKey = environment.captchaKey
  attemptsCounter = 0

  readonly resetPasswordRoute = '/' + Route.PASSWORD
  usernameErrorMessage = ValidationMessages.email
  passwordErrorMessage = ValidationMessages.password

  subscriptions: Subscription

  constructor(
    private userAuthFormService: UserAuthFormService,
    private roleService: RoleService,
    private authApiService: AuthApiService,
    private toaster: ToasterCustomService,
    private redirectAuthService: RedirectAuthService,
    private titleService: Title
  ) {
    this.subscriptions = new Subscription()
    this.titleService.setTitle("Login")
    this.form = this.userAuthFormService.loginForm()
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  get isCaptchaDisabled() {
    return this.attemptsCounter < 5
  }

  setRequiredCaptcha() {
    this.form.get('recaptcha')?.setValidators([Validators.required])
    this.form.get('recaptcha')?.updateValueAndValidity()
  }

  submit() {
    const {username, password} = this.form.value
    const cred = {username, password}
    const sub = this.authApiService.login(cred)
      .subscribe(
        (res: Response) => {
          const token = res.headers.get('Authorization')
          JwtTokenService.saveToken(token!)
          this.roleService.changeRole(JwtTokenService.role)

          this.toaster.successfulNotification(Labels.login.success);
          this.redirectAuthService.redirect()
        }, err => {
          this.attemptsCounter += 1
          if (!this.isCaptchaDisabled) this.setRequiredCaptcha()

          this.toaster.errorNotification(Labels.login.error);
        })

    this.subscriptions.add(sub)
  }

  handleError() {
    this.toaster.errorNotification(Labels.login.robot);
    this.form.disable()
    setTimeout(() => this.form.enable(), 5 * 60 * 1000)
  }
}
