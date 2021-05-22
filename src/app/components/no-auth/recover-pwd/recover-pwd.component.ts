import { Component, OnInit } from '@angular/core';
import {AuthApiService} from "../../../api-services/auth-http.service";
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {Toaster} from "ngx-toast-notifications";

@Component({
  selector: 'app-recover-pwd',
  templateUrl: './recover-pwd.component.html',
  styleUrls: ['./recover-pwd.component.scss']
})
export class RecoverPwdComponent{

  isLoading: boolean;
  form: FormGroup

  emailErrorMessage = ValidationMessages.email

  constructor(
    private authApiService: AuthApiService,
    private userAuthFormService: UserAuthFormService,
    private toaster: Toaster,
  ) {
    this.form = this.userAuthFormService.resetPasswordForm();
  }

  submit() {
    this.isLoading = true;
    const {email} = this.form.value;
    this.authApiService.requestResetPassword(email)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(res =>{
        this.toaster.open({
          text: Labels.password.successfulRequestResetPassword,
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

}
