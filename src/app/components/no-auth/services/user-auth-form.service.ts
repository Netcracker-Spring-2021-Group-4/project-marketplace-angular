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

}
const passwordRegExp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,20}$"
const username = () => ([null, [Validators.required, Validators.email]])
const password = () => ([null, [Validators.required, Validators.pattern(passwordRegExp)]])
const recaptcha = () => ([''])
