import { Component } from '@angular/core';
import {UserAuthFormService} from "../../../no-auth/services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {AuthStoreApiService} from "../../../../api-services/auth-store-http.service";
import {ValidationMessages} from "../../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import Labels from "../../../../shared/models/labels/labels.constant";
import {Router} from "@angular/router";
import {Route} from "../../../../shared/models/enums/route.enum";
import {ToasterCustomService} from "../../../../services/toaster-custom.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup
  isLoading: boolean


  passwordErrorMessage = ValidationMessages.password
  passwordDontMatchMessage = ValidationMessages.passwordDontMatch
  passwordsAreTheSameMessage = ValidationMessages.passwordsAreTheSame

  constructor(
    private userAuthFormService: UserAuthFormService,
    private authStoreApiService: AuthStoreApiService,
    private toaster: ToasterCustomService,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle("Change password")
    this.form = this.userAuthFormService.changePasswordForm();
  }

  back() {
    this.router.navigate([Route.PROFILE])
  }

  submit() {
    const obj = this.form.value;
    delete obj.newPasswordRepeat;
    this.isLoading = true;
    this.authStoreApiService.changePassword(obj)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( _ => {
        this.toaster.successfulNotification(Labels.password.successfulChangePassword);
        this.router.navigate([Route.PROFILE])
      }, err => {
        const text = err.error.message ?? Object.values(err.error.error).join('\n')
        this.toaster.errorNotification(text);
      })
  }
}
