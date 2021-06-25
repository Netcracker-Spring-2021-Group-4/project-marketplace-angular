import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Injectable} from "@angular/core";
import {ProfileModel} from "../../../shared/models/api/receive/profile.model";

@Injectable({
  providedIn: 'root'
})
export class UserAuthFormService {

  constructor(
    private formBuilder: FormBuilder
  ) {
  }

  public loginForm()
    : FormGroup {
    return this.formBuilder.group({
      username: username(),
      password: password(),
      recaptcha: recaptcha()
    });
  }

  public registerForm()
    : FormGroup {
    return this.formBuilder.group({
      email: username(),
      password: password(),
      passwordRepeat: password(),
      firstName: name(),
      lastName: name(),
      phoneNumber: phoneNumber()
    }, {validators: [samePasswordValidator]});
  }

  public createStaffForm()
    : FormGroup {
    return this.formBuilder.group({
      email: username(),
      plainPassword: password(),
      firstName: name(),
      lastName: name(),
      phoneNumber: phoneNumber(),
      title: title()
    });
  }

  public editForm(p: ProfileModel, isAdmin: boolean)
    : FormGroup {
    const form = this.formBuilder.group({
      email: username(p.email, true),
      firstName: name(p.firstName),
      lastName: name(p.lastName),
      phoneNumber: phoneNumber(p.phoneNumber),
    });
    if (isAdmin) form.addControl('status', this.formBuilder.control(p.status))
    return form
  }

  public newPasswordForm()
    : FormGroup {
    return this.formBuilder.group({
      password: password(),
      passwordRepeat: password(),
    }, {validators: [samePasswordValidator]})
  }

  public changePasswordForm()
    : FormGroup {
    return this.formBuilder.group({
      currentPassword: password(),
      newPassword: password(),
      newPasswordRepeat: password(),
    }, {validators: [changePasswordValidator]})
  }

  public resetPasswordForm()
    : FormGroup {
    return this.formBuilder.group({
      email: username()
    });
  }

  // public staffSearchForm(): FormGroup {
  //   return this.formBuilder.group({
  //     firstName: optionalName(),
  //     lastName: optionalName(),
  //     isRoleCourier: new FormControl(false),
  //     isRolePM: new FormControl(false),
  //     isStatusInactive: new FormControl(false),
  //     isStatusActive: new FormControl(false),
  //     isStatusTerminated: new FormControl(false),
  //     isStatusUnconfirmed: new FormControl(false)
  //   });
  // }

  // public orderFilterForm(): FormGroup {
  //   return this.formBuilder.group({
  //     placedDate: date(),
  //     deliveryDate : date(),
  //     isStatusSubmitted : new FormControl(false),
  //     isStatusInDelivery : new FormControl(false),
  //     isStatusInDelivered : new FormControl(false),
  //     isStatusInCancelled : new FormControl(false),
  //     isStatusInFailed : new FormControl(false),
  //   });
  // }

}

const samePasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value
  const passwordRepeat = control.get('passwordRepeat')?.value
  return passwordDontMatchCheck(password, passwordRepeat)
}

const changePasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const currentPassword = control.get('currentPassword')?.value
  const newPassword = control.get('newPassword')?.value
  const newPasswordRepeat = control.get('newPasswordRepeat')?.value
  return currentPassword === newPassword && control.get('currentPassword')?.touched ? {passwordsAreTheSame: true} :
    passwordDontMatchCheck(newPassword, newPasswordRepeat)
}

const passwordDontMatchCheck = (password: string, passwordRepeat: string): ValidationErrors | null =>
  password === passwordRepeat ? null : {passwordDontMatch: true}

const passwordRegExp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
const username = (value?: string, disabled = false) => ([{
  value: value ?? null,
  disabled
}, [Validators.required, Validators.email]])
const password = () => ([null, [Validators.required, Validators.pattern(passwordRegExp)]])
const name = (value?: string) => ([value ?? null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]])
const phoneNumber = (value?: string) => ([value ?? null])
const title = () => ([null, [Validators.required]])
const recaptcha = () => ([''])
