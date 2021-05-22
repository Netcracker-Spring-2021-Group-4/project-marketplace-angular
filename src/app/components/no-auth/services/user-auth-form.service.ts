import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Injectable} from "@angular/core";

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
      plainPassword: password(),
      firstName: name(),
      lastName: name(),
      phoneNumber: phoneNumber()
    });
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

  public newPasswordForm()
    : FormGroup {
    return this.formBuilder.group({
      password: password(),
      passwordRepeat: password(),
    }, { validators: [samePasswordValidator]})
  }

  public resetPasswordForm()
    : FormGroup {
    return this.formBuilder.group({
      email: username()
    });
  }
}

const samePasswordValidator :ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value
  const passwordRepeat = control.get('passwordRepeat')?.value
  return password === passwordRepeat ? null : {passwordDontMatch: true}
}

const passwordRegExp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
const username = (value?: string) => ([value ?? null, [Validators.required, Validators.email]])
const password = () => ([null, [Validators.required, Validators.pattern(passwordRegExp)]])
const name = (value?: string) => ([value ?? null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]])
const phoneNumber = (value?: string) => ([value ?? null])
const title = () => ([null, [Validators.required]])
const recaptcha = () => ([''])
