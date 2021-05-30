import { Component } from '@angular/core';
import {UserAuthFormService} from "../../../no-auth/services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {AuthStoreApiService} from "../../../../api-services/auth-store-http.service";
import {ValidationMessages} from "../../../../shared/models/labels/validation.message";
import {finalize} from "rxjs/operators";
import Labels from "../../../../shared/models/labels/labels.constant";
import {Toaster} from "ngx-toast-notifications";
import {Router} from "@angular/router";
import {Route} from "../../../../shared/models/enums/route.enum";

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
    private toaster: Toaster,
    private router: Router
  ) {
    this.form = this.userAuthFormService.changePasswordForm();
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
        this.toaster.open({
          text: Labels.password.successfulChangePassword,
          caption: Labels.caption.success,
          duration: 4000,
          type: 'success'
        });
        this.router.navigate([Route.PROFILE])
      }, err => {
        const text = err.error.message ?? Object.values(err.error.error).join('\n')
        this.toaster.open({
          text: text,
          caption: Labels.caption.error,
          duration: 4000,
          type: 'danger'
        });
      })
  }

}
