import { Component, OnInit } from '@angular/core';
import {AuthApiService} from "../../../api-services/auth-http.service";
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../services/toaster-custom.service";

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
    private toaster: ToasterCustomService,
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
        this.toaster.successfulNotification(Labels.password.successfulRequestResetPassword);
      }, err => {
        this.toaster.errorNotification(err.error.message);
      })
  }

}
