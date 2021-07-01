import {Component} from '@angular/core';
import {AuthApiService} from "../../../api-services/auth-http.service";
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize, first} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-recover-pwd',
  templateUrl: './recover-pwd.component.html',
  styleUrls: ['./recover-pwd.component.scss']
})
export class RecoverPwdComponent {

  isLoading: boolean;
  form: FormGroup

  emailErrorMessage = ValidationMessages.email

  constructor(
    private authApiService: AuthApiService,
    private userAuthFormService: UserAuthFormService,
    private toaster: ToasterCustomService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Recover password")
    this.form = this.userAuthFormService.resetPasswordForm();
  }

  submit() {
    this.isLoading = true;
    const {email} = this.form.value;
    this.authApiService.requestResetPassword(email)
      .pipe(
        finalize(() => this.isLoading = false),
        first()
      )
      .subscribe(_ => {
        this.toaster.successfulNotification(Labels.password.successfulRequestResetPassword);
      }, err => {
        this.toaster.errorNotification(err.error.message);
      })
  }

}
