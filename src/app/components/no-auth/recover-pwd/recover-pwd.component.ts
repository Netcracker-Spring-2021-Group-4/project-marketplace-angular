import {Component, OnDestroy} from '@angular/core';
import {AuthApiService} from "../../../api-services/auth-http.service";
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import Labels from "../../../shared/models/labels/labels.constant";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recover-pwd',
  templateUrl: './recover-pwd.component.html',
  styleUrls: ['./recover-pwd.component.scss']
})
export class RecoverPwdComponent implements OnDestroy{

  isLoading: boolean;
  form: FormGroup

  emailErrorMessage = ValidationMessages.email

  subscriptions: Subscription

  constructor(
    private authApiService: AuthApiService,
    private userAuthFormService: UserAuthFormService,
    private toaster: ToasterCustomService,
    private titleService: Title
  ) {
    this.subscriptions = new Subscription()
    this.titleService.setTitle("Recover password")
    this.form = this.userAuthFormService.resetPasswordForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  submit() {
    this.isLoading = true;
    const {email} = this.form.value;
    const sub = this.authApiService.requestResetPassword(email)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(_ => {
        this.toaster.successfulNotification(Labels.password.successfulRequestResetPassword);
      }, err => {
        this.toaster.errorNotification(err.error.message);
      })

    this.subscriptions.add(sub)
  }

}
