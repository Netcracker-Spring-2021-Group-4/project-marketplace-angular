import {Component, OnInit} from '@angular/core';
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {JwtTokenService} from "../../../auth/jwt-token.service";
import {AuthApiService} from "../../../api-services/auth-http.service";
import {Toaster} from "ngx-toast-notifications";
import Labels from "../../../shared/models/labels/labels.constant";
import {RoleService} from "../../../services/role.service";
import {Router} from "@angular/router";
import {UserRole} from "../../../shared/models/enums/role.enum";
import {Route} from "../../../shared/models/enums/route.enum";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(
    private userAuthFormService: UserAuthFormService,
    private jwtTokenService: JwtTokenService,
    private roleService: RoleService,
    private authApiService: AuthApiService,
    private toaster: Toaster,
    private router: Router
  ) {
    this.form = this.userAuthFormService.loginForm()
  }

  ngOnInit(): void {
  }

  get usernameErrorMessage() {
    return 'Incorrect email'
  }

  get passwordErrorMessage() {
    return 'Password must contain at least one capital letter, lower case letter and number'
  }

  private get defaultRoute() {
    return this.jwtTokenService.role === UserRole.ROLE_COURIER ? Route.DELIVERIES : Route.CATALOG;
  }

  submit() {
    const value = this.form.value
    this.authApiService.login(value).subscribe(
      (res:Response ) => {
      const token = res.headers.get('Authorization')
      this.jwtTokenService.saveToken(token!)
      this.roleService.changeRole(this.jwtTokenService.role)

      this.toaster.open({
        text: Labels.login.success,
        caption: Labels.caption.success,
        duration: 4000,
        type: 'success'
      });
      this.router.navigate([this.defaultRoute])
    }, err => {
        this.toaster.open({
          text: Labels.login.error,
          caption: Labels.caption.error,
          duration: 4000,
          type: 'danger'
        });
    })
  }
}
