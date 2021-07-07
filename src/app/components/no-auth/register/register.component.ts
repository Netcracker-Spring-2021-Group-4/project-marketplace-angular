import {Component, OnDestroy} from '@angular/core';
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {AuthApiService} from "../../../api-services/auth-http.service";
import Labels from "../../../shared/models/labels/labels.constant";
import {finalize} from "rxjs/operators";
import {ToasterCustomService} from "../../../services/toaster-custom.service";
import {Router} from "@angular/router";
import {Route} from "../../../shared/models/enums/route.enum";
import {Title} from "@angular/platform-browser";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy{

  form: FormGroup
  isLoading = false;

  emailErrorMessage = ValidationMessages.email
  passwordErrorMessage = ValidationMessages.password
  firstNameErrorMessage = ValidationMessages.firstName
  lastNameErrorMessage = ValidationMessages.lastName
  phoneNumberErrorMessage = ValidationMessages.phoneNumber
  passwordDontMatchMessage = ValidationMessages.passwordDontMatch

  subscriptions: Subscription

  constructor(
    private userAuthFormService: UserAuthFormService,
    private authApiService: AuthApiService,
    private toaster: ToasterCustomService,
    private router: Router,
    private titleService: Title
  ) {
    this.subscriptions = new Subscription()
    this.titleService.setTitle("Register")
    this.form = this.userAuthFormService.registerForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  submit() {
    this.isLoading = true;
    const result = this.form.value
    result.plainPassword = result.password
    if (!result.phoneNumber) delete result.phoneNumber
    const sub = this.authApiService.requestSignUp(result)
      .pipe(
        finalize(() => {
          this.isLoading = false
          this.router.navigate([Route.LOGIN])
        })
      )
      .subscribe(res => {
        this.toaster.successfulNotification(Labels.register.successRequest);
      }, err => {
        this.toaster.errorNotification(err.error.message);
      })

    this.subscriptions.add(sub)
  }
}
