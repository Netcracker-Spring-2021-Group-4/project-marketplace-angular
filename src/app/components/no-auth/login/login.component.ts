import { Component, OnInit } from '@angular/core';
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {JwtTokenService} from "../../../auth/jwt-token.service";
import {AuthApiService} from "../../../api-services/auth-http.service";
import {Toaster} from "ngx-toast-notifications";
import Labels from "../../../shared/models/labels/labels.constant";

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
    private authApiService: AuthApiService,
    private toaster: Toaster
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

  submit() {
    const value = this.form.value
    this.authApiService.login(value).subscribe(
      (res:Response ) => {
      const token = res.headers.get('Authorization')
      this.jwtTokenService.saveToken(token!)
        this.toaster.open({
          text: Labels.login.success,
          caption: Labels.caption.success,
          duration: 4000,
          type: 'success'
        });
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
