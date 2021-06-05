import { Component, OnInit } from '@angular/core';
import {UserAuthFormService} from "../services/user-auth-form.service";
import {FormGroup} from "@angular/forms";
import {ValidationMessages} from "../../../shared/models/labels/validation.message";
import {AuthApiService} from "../../../api-services/auth-http.service";
import Labels from "../../../shared/models/labels/labels.constant";
import {finalize} from "rxjs/operators";
import {ToasterCustomService} from "../../../services/toaster-custom.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup
  isLoading = false;

  emailErrorMessage = ValidationMessages.email
  passwordErrorMessage = ValidationMessages.password
  firstNameErrorMessage = ValidationMessages.firstName
  lastNameErrorMessage = ValidationMessages.lastName
  phoneNumberErrorMessage = ValidationMessages.phoneNumber

  constructor(
    private userAuthFormService: UserAuthFormService,
    private authApiService: AuthApiService,
    private toaster: ToasterCustomService,
  ) {
    this.form = this.userAuthFormService.registerForm();
  }

  ngOnInit(): void {
  }

  submit() {
    this.isLoading = true;
    const result = this.form.value
    if(!result.phoneNumber) delete result.phoneNumber
    this.authApiService.requestSignUp(result)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe( res => {
      this.toaster.successfulNotification(Labels.register.successRequest);
    }, err => {
      this.toaster.errorNotification(err.error.message);
    })
  }
}
