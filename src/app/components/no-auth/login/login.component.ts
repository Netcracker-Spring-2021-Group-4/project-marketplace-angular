import {Component, OnInit} from '@angular/core';
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup, Validators} from "@angular/forms";
import {JwtTokenService} from "../../../auth/jwt-token.service";
import {AuthApiService} from "../../../api-services/auth-http.service";
import Labels from "../../../shared/models/labels/labels.constant";
import {RoleService} from "../../../services/role.service";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {Route} from "../../../shared/models/enums/route.enum";
import {environment} from "../../../../environments/environment";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {RedirectAuthService} from "../../../services/redirect-auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup
  siteKey = environment.captchaKey
  attemptsCounter = 0

  readonly resetPasswordRoute = '/' + Route.PASSWORD
  usernameErrorMessage = ValidationMessages.email
  passwordErrorMessage = ValidationMessages.password

  constructor(
    private userAuthFormService: UserAuthFormService,
    private roleService: RoleService,
    private authApiService: AuthApiService,
    private toaster: ToasterCustomService,
    private redirectAuthService: RedirectAuthService
  ) {
    this.form = this.userAuthFormService.loginForm()
  }

  ngOnInit(): void {
  }

  get isCaptchaDisabled() {
    return this.attemptsCounter < 5
  }

  setRequiredCaptcha() {
    this.form.get('recaptcha')?.setValidators([Validators.required])
    this.form.get('recaptcha')?.updateValueAndValidity()
  }

  private get defaultRoute() {
    return JwtTokenService.role === UserRole.ROLE_COURIER ? Route.DELIVERIES : Route.CATALOG;
  }

  submit() {
    const {username, password} = this.form.value
    const cred = {username, password}
    this.authApiService.login(cred).subscribe(
      (res:Response ) => {
      const token = res.headers.get('Authorization')
        JwtTokenService.saveToken(token!)
      this.roleService.changeRole(JwtTokenService.role)

      this.toaster.successfulNotification(Labels.login.success);
      this.redirectAuthService.redirect()
    }, err => {
        this.attemptsCounter += 1
        if(!this.isCaptchaDisabled) this.setRequiredCaptcha()

        this.toaster.errorNotification(Labels.login.error);
    })
  }

  handleError() {
    this.toaster.errorNotification(Labels.login.robot);
    this.form.disable()
    setTimeout(() => this.form.enable(), 5*60*1000)
  }
}
