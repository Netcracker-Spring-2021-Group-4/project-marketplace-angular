import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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

}
const passwordRegExp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
const phoneNumberRegExp = "^\\+?[0-9]{3}-?[0-9]{6,12}$"
const username = () => ([null, [Validators.required, Validators.email]])
const password = () => ([null, [Validators.required, Validators.pattern(passwordRegExp)]])
const name = () => ([null, [Validators.required, Validators.minLength(2), Validators.maxLength(30)]])
const phoneNumber = () => ([null, [Validators.pattern(phoneNumberRegExp)]])
const recaptcha = () => ([''])
